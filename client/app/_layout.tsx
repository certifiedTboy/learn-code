import Notification from "@/components/common/Notification";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import AuthContextProvider from "@/lib/context/auth-context";
import CourseDetailsContextProvider from "@/lib/context/course-details-context";
import RegisteredCourseContextProvider from "@/lib/context/registered-course-context";
import { store } from "@/lib/redux/store";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { PaystackProvider } from "react-native-paystack-webview";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
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
                  <SafeAreaView
                    style={[{ backgroundColor }, styles.container]}
                    edges={["bottom", "left", "right"]}
                  >
                    <Notification />

                    <AppNavigator />
                  </SafeAreaView>
                </CourseDetailsContextProvider>
              </RegisteredCourseContextProvider>
            </PaystackProvider>
          </AuthContextProvider>
        </ThemeProvider>
      </KeyboardProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
