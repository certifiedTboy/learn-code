import { Colors } from "@/constant/Colors";
import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet, View } from "react-native";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

const Notification = () => {
  const errorBorderColor = useThemeColor(
    { light: Colors.light.errorText, dark: Colors.dark.errorText },
    "background",
  );

  const successBorderColor = useThemeColor(
    { light: "#4BB543", dark: "#4BB543" },
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

  /*
  1. Create the config
*/
  const toastConfig = {
    /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
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
    /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
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
    /*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.

    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */
    //   tomatoToast: ({ text1, props }: any) => (
    //     <View style={{ height: 10, width: 200, backgroundColor: "#333" }}>
    //       <Text>{text1}</Text>
    //       <Text>{props.uuid}</Text>
    //     </View>
    //   ),
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
