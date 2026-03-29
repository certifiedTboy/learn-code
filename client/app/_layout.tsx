import Notification from "@/components/common/Notification";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/use-theme-color";
import AuthContextProvider from "@/lib/context/auth-context";
import { store } from "@/lib/redux/store";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { PaystackProvider } from "react-native-paystack-webview";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import AppNavigator from "./app-navigator";

import { useColorScheme } from "@/hooks/use-color-scheme";

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
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <StatusBar style="auto" translucent={true} />
        <AuthContextProvider>
          <PaystackProvider
            // debug={true}
            publicKey={process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY || ""}
          >
            <SafeAreaView
              style={[{ backgroundColor }, styles.container]}
              edges={["bottom", "left", "right"]}
            >
              <Notification />

              <AppNavigator />
            </SafeAreaView>
          </PaystackProvider>
        </AuthContextProvider>
      </ThemeProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
