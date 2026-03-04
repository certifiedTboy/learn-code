import { AuthContext } from "@/lib/context/auth-context";
import ChatContextProvider from "@/lib/context/chat-context";
import { useContext, useEffect } from "react";
import MainStack from "./main-stack";

import OnboardingStack from "./onboarding-stack";
const AppNavigator = () => {
  const { checkUserIsAuthenticated, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    checkUserIsAuthenticated();
  }, []);

  return (
    <>
      {!isAuthenticated ? (
        <OnboardingStack />
      ) : (
        <ChatContextProvider>
          <MainStack />
        </ChatContextProvider>
      )}
    </>
  );
};

export default AppNavigator;
