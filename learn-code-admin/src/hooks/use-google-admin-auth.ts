import { useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useLocation } from "wouter";
import { storeToken } from "../helpers/user-session";
import { useToast } from "./use-toast";
import { useLoginAdminWithGoogleMutation } from "../lib/apis/auth-apis";

export function useGoogleAdminAuth() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loginAdminWithGoogle, { isLoading, data, isSuccess, error, isError }] =
    useLoginAdminWithGoogleMutation();

  const continueWithGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) =>
      loginAdminWithGoogle({ idToken: tokenResponse.access_token }),
    flow: "implicit",
  });

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

  return { continueWithGoogle, isLoading };
}
