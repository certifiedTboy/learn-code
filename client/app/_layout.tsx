import Notification from "@/components/common/Notification";
import { Colors } from "@/constants/Colors";
import AuthContextProvider from "@/features/context/auth-context";
import CourseDetailsContextProvider from "@/features/context/course-details-context";
import RegisteredCourseContextProvider from "@/features/context/registered-course-context";
import { store } from "@/features/redux/store";
import { setNavigationRef } from "@/helpers/global-navigation";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useNavigationContainerRef } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { PaystackProvider } from "react-native-paystack-webview";
import "react-native-reanimated";
import {
  SafeAreaProvider,
  SafeAreaView,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { Provider } from "react-redux";
import AppNavigator from "./app-navigator";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background",
  );

  const rootNavigationRef = useNavigationContainerRef();

  useEffect(() => {
    setNavigationRef(rootNavigationRef);
  }, [rootNavigationRef]);

  return (
    <Provider store={store}>
      <KeyboardProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <StatusBar style="auto" translucent={true} />

          <AuthContextProvider>
            <PaystackProvider
              // debug={true}
              publicKey={process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY || ""}
            >
              <RegisteredCourseContextProvider>
                <CourseDetailsContextProvider>
                  <SafeAreaProvider initialMetrics={initialWindowMetrics}>
                    <SafeAreaView
                      style={{ backgroundColor }}
                      edges={["bottom", "left", "right"]}
                    >
                      <Notification />
                    </SafeAreaView>
                    <AppNavigator />
                  </SafeAreaProvider>
                </CourseDetailsContextProvider>
              </RegisteredCourseContextProvider>
            </PaystackProvider>
          </AuthContextProvider>
        </ThemeProvider>
      </KeyboardProvider>
    </Provider>
  );
}
