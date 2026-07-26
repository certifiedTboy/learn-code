/**
 * Global Notification Component
 * Serves as the root container for `react-native-toast-message`.
 * Configures custom UI styling for success and error toasts,
 * adapting to the user's current light or dark theme.
 */
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet, View } from "react-native";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

const Notification = () => {
  // Dynamic colors derived from the active theme (light/dark)
  const errorBorderColor = useThemeColor(
    { light: Colors.light.errorText, dark: Colors.dark.errorText },
    "background",
  );

  const successBorderColor = useThemeColor(
    { light: "#5F6F8F", dark: "#5F6F8F" },
    "background",
  );

  const backgroundColor = useThemeColor(
    { light: "#fff", dark: "#333333" },
    "background",
  );

  const textColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text",
  );

  /**
   * Custom configurations for different toast types.
   * We override the default "success" and "error" layouts here.
   */
  const toastConfig = {
    /**
     * Success Toast Configuration
     * Overwrites 'success' type by modifying the existing `BaseToast` component.
     */
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: successBorderColor,
          width: 200,
          height: 35,
          backgroundColor,
        }}
        contentContainerStyle={{ paddingLeft: 15 }}
        text1Style={{
          fontSize: 15,
          fontWeight: "500",
          color: textColor,
        }}
        text2Style={{
          fontSize: 15,
          color: textColor,
        }}
      />
    ),
    /**
     * Error Toast Configuration
     * Overwrites 'error' type by modifying the existing `ErrorToast` component.
     */
    error: (props: any) => (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: errorBorderColor,
          width: 200,
          height: 35,
          backgroundColor,
        }}
        contentContainerStyle={{ paddingLeft: 15 }}
        text1Style={{
          fontSize: 17,
          // marginBottom: 5,
          color: textColor,
        }}
        text2Style={{
          fontSize: 15,
          color: textColor,
        }}
      />
    ),
  };

  return (
    <View style={styles.container}>
      <Toast config={toastConfig} />
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    zIndex: 2000,
  },
});
