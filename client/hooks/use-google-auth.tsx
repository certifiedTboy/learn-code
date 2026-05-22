import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useEffect, useState } from "react";

const useGoogleAuth = () => {
  const [userData, setUserData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    token: string;
    profilePicture: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID, // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID, // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)

      scopes: [
        "https://www.googleapis.com/auth/drive.appdata",
        // "https://www.googleapis.com/auth/drive.file",
        // "https://www.googleapis.com/auth/userinfo.profile",
        // "openid",
        // "profile",
        // "email",
      ],
      offlineAccess: true,
      profileImageSize: 150, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo: any = await GoogleSignin.signIn();

      const tokens = await GoogleSignin.getTokens();

      setUserData({
        firstName: userInfo?.data?.user?.givenName,
        lastName: userInfo?.data?.user?.familyName,
        email: userInfo?.data?.user?.email,
        token: userInfo?.data?.idToken,
        profilePicture: userInfo?.data?.user?.photo,
      });

      return tokens?.accessToken;
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("User cancelled sign in");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        setIsLoading(true);
      } else {
        console.log("Google sign in error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const revokeAccess = async () => {
    try {
      // await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setUserData(null);
    } catch (error) {
      console.log("error:", error);
    }
  };

  return { handleGoogleSignIn, userData, isLoading, revokeAccess };
};

export default useGoogleAuth;
