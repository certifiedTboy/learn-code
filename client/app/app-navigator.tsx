import FloatingBtn from "@/components/ui/float-btn";
import FloatingBtn2 from "@/components/ui/float-btn2";
import Icon from "@/components/ui/Icon";
import { AuthContext } from "@/features/context/auth-context";
import ChatContextProvider from "@/features/context/chat-context";
import useBackup from "@/hooks/use-backup";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigationState } from "@react-navigation/native";
import Tooltip from "@/components/ui/tooltip";
import { Colors } from "@/constants/Colors";
import { useContext, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import MainStack from "./main-stack";

import OnboardingStack from "./onboarding-stack";

const AppNavigator = () => {
  const { checkUserIsAuthenticated, isAuthenticated } = useContext(AuthContext);
  const [showTooltip, setShowTooltip] = useState(false);

  const { writeToCloud, readFromCloud } = useBackup();

  useEffect(() => {
    checkUserIsAuthenticated();
  }, []);

  useEffect(() => {
    const checkFirstTimeTooltip = async () => {
      try {
        const hasSeenTooltip = await AsyncStorage.getItem(
          "hasSeenBackupTooltip",
        );
        if (!hasSeenTooltip) {
          setShowTooltip(true);
          await AsyncStorage.setItem("hasSeenBackupTooltip", "true");
        }
      } catch (error) {
        console.log("Error checking tooltip status:", error);
      }
    };

    if (isAuthenticated) {
      checkFirstTimeTooltip();
    }
  }, [isAuthenticated, showTooltip]);

  // const CurrentScreenLogger = () => {
  //   const currentRouteName = useNavigationState((state) => {
  //     const route = state.routes[state.index];
  //     return route.name;
  //   });

  //   console.log("Current screen:", currentRouteName);

  //   return null;
  // };

  // export default CurrentScreenLogger;

  return (
    <>
      {!isAuthenticated ? (
        <OnboardingStack />
      ) : (
        <ChatContextProvider>
          <MainStack />
          {/* <CurrentScreenLogger /> */}

          <FloatingBtn
            iconName="sync-circle"
            onNavigate={writeToCloud}
            style={styles.floatingBtn}
          />

          <FloatingBtn2
            iconName="cloud-download"
            onNavigate={readFromCloud}
            style={styles.floatingBtn2}
          />

          <TouchableOpacity
            style={styles.helpBtn}
            onPress={() => setShowTooltip(!showTooltip)}
          >
            <Icon
              name="help-circle-outline"
              size={28}
              color={Colors.light.white}
              onPress={() => setShowTooltip(!showTooltip)}
            />
          </TouchableOpacity>

          {showTooltip && <Tooltip setShowTooltip={setShowTooltip} />}
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
  floatingBtn2: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 150,
    zIndex: 100,
  },
  helpBtn: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 220,
    zIndex: 100,
    backgroundColor: Colors.light.primaryBlue,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.light.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});
