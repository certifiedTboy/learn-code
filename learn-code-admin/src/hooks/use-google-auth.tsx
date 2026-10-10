import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { useLoginAdminWithGoogleMutation } from "../lib/apis/auth-apis";
import { useToast } from "./use-toast";
import { storeToken } from "../helpers/user-session";

const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.appdata";

const SCOPES = `openid email profile ${DRIVE_SCOPE}`;

interface GoogleUserData {
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  profilePicture: string;
}

interface TokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

interface GoogleTokenClient {
  requestAccessToken: (options?: { prompt?: string }) => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: TokenResponse) => void;
            error_callback?: (error: {
              type?: string;
              message?: string;
            }) => void;
          }) => GoogleTokenClient;
          revoke: (
            token: string,
            callback: (response: {
              successful?: boolean;
              error?: string;
            }) => void,
          ) => void;
        };
      };
    };
  }
}

export function useGoogleAuth() {
  const [userData, setUserData] = useState<GoogleUserData | null>(null);
  const tokenClientRef = useRef<GoogleTokenClient | null>(null);
  const accessTokenRef = useRef<string | null>(null);

  const [loginAdminWithGoogle, { isLoading, data, error, isError, isSuccess }] =
    useLoginAdminWithGoogleMutation();
  const { toast } = useToast();

  const [, setLocation] = useLocation();

  const pendingSignInRef = useRef<{
    resolve: (token: string) => void;
    reject: (error: Error) => void;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    let intervalId: number | undefined;

    const initialize = () => {
      if (cancelled || !window.google?.accounts?.oauth2) {
        return false;
      }

      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

      if (!clientId) {
        toast({
          variant: "destructive",
          title: "Google OAuth client ID is missing.",
        });

        return false;
      }

      tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: SCOPES,

        callback: async (response) => {
          const pending = pendingSignInRef.current;
          pendingSignInRef.current = null;

          if (!pending) return;

          if (response.error || !response.access_token) {
            const message =
              response.error_description ||
              response.error ||
              "Google authorization failed.";

            toast({
              variant: "destructive",
              title: message,
            });
            pending.reject(new Error(message));
            return;
          }

          try {
            const accessToken = response.access_token;

            // Retrieve the authenticated user's profile.
            const profileResponse = await fetch(
              "https://openidconnect.googleapis.com/v1/userinfo",
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              },
            );

            if (!profileResponse.ok) {
              throw new Error("Unable to retrieve Google profile.");
            }

            const profile = await profileResponse.json();

            const user: GoogleUserData = {
              firstName: profile.given_name ?? "",
              lastName: profile.family_name ?? "",
              email: profile.email ?? "",
              token: accessToken,
              profilePicture: profile.picture ?? "",
            };
            localStorage.setItem("gtkn", accessToken);
            accessTokenRef.current = accessToken;
            setUserData(user);
            loginAdminWithGoogle({ idToken: user?.token });

            pending.resolve(accessToken);
          } catch (err) {
            const message =
              err instanceof Error ? err.message : "Google sign-in failed.";

            toast({
              variant: "destructive",
              title: message,
            });
            pending.reject(new Error(message));
          }
        },

        error_callback: (response) => {
          const pending = pendingSignInRef.current;
          pendingSignInRef.current = null;

          const message = response.message || "Google sign-in popup failed.";

          toast({
            variant: "destructive",
            title: message,
          });

          pending?.reject(new Error(message));
        },
      });

      return true;
    };

    if (!initialize()) {
      intervalId = window.setInterval(() => {
        if (initialize() && intervalId !== undefined) {
          window.clearInterval(intervalId);
        }
      }, 100);
    }

    return () => {
      cancelled = true;

      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, []);

  const handleGoogleSignIn = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!tokenClientRef.current) {
        const message =
          "Google Identity Services is not ready. Please try again.";

        toast({
          variant: "destructive",
          title: message,
        });
        reject(new Error(message));
        return;
      }

      pendingSignInRef.current = { resolve, reject };

      try {
        // Must be triggered by a user action, such as a button click.
        tokenClientRef.current.requestAccessToken({
          prompt: "",
        });
      } catch (err) {
        pendingSignInRef.current = null;

        reject(
          err instanceof Error ? err : new Error("Google sign-in failed."),
        );
      }
    });
  }, []);

  // Local sign-out: clears app state without revoking Google consent.
  const signOut = useCallback(() => {
    accessTokenRef.current = null;
    localStorage.removeItem("gtkn");
    setUserData(null);
  }, []);

  // Revoke Google OAuth consent, then clear local state.
  const revokeAccess = useCallback(async (): Promise<void> => {
    const accessToken = accessTokenRef.current;

    if (!accessToken || !window.google?.accounts?.oauth2) {
      signOut();
      return;
    }

    await new Promise<void>((resolve, reject) => {
      window.google!.accounts.oauth2.revoke(accessToken, (response) => {
        if (response.successful === false) {
          const message = response.error || "Failed to revoke Google access.";
          toast({
            variant: "destructive",
            title: message,
          });
          reject(new Error(message));
          return;
        }

        signOut();
        resolve();
      });
    });
  }, [signOut]);

  useEffect(() => {
    (async () => {
      if (isSuccess && data) {
        const { accessToken, refreshToken } = data.data;

        await storeToken(accessToken);
        localStorage.setItem("token", refreshToken);
        setLocation("/dashboard");
      }

      if (isError) {
        const message =
          error &&
          "data" in error &&
          error.data &&
          typeof error.data === "object" &&
          "message" in error.data &&
          typeof error.data.message === "string"
            ? error.data.message
            : "An error occurred.";
        toast({
          variant: "destructive",
          title: message,
        });
      }
    })();
  }, [isSuccess, data, error, isError]);

  return {
    handleGoogleSignIn,
    userData,
    isLoading,
    revokeAccess,
  };
}
