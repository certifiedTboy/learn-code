import { ActivityIndicator, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

const CourseContentScreen = () => {
  const docUrl =
    "https://docs.google.com/document/d/1rAvbQ7G9h8-LHorbSthKrnrV8UefKTlHTp5esZOV7y0/edit?usp=sharing";

  // const docUrl =
  //   "https://learning-code-app.s3.eu-west-2.amazonaws.com/module+1/Module+1_+Core+Foundation+-+Week+1+-+7.docx";

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{
          uri: docUrl,
          cache: true,
        }}
        startInLoadingState
        renderLoading={() => <ActivityIndicator size="large" color="red" />}
      />
    </View>
  );
};

export default CourseContentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -50,
  },
});
