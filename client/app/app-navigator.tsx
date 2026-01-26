import { AuthContext } from "@/lib/context/auth-context";
import { useContext, useEffect } from "react";
import MainStack from "./main-stack";

import OnboardingStack from "./onboarding-stack";
const AppNavigator = () => {
  const { checkUserIsAuthenticated, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    checkUserIsAuthenticated();
  }, []);

  return <>{!isAuthenticated ? <OnboardingStack /> : <MainStack />}</>;
};

export default AppNavigator;
