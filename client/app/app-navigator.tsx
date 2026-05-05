import FloatingBtn from "@/components/ui/float-btn";
import { AuthContext } from "@/lib/context/auth-context";
import ChatContextProvider from "@/lib/context/chat-context";
import { useContext, useEffect } from "react";
import { StyleSheet } from "react-native";
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
          <FloatingBtn
            iconName="sync-circle"
            onNavigate={() => {}}
            style={styles.floatingBtn}
          />
        </ChatContextProvider>
      )}
    </>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({
  floatingBtn: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 80,
    zIndex: 100,
  },
});
