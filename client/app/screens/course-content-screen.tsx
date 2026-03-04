import { Dimensions, StyleSheet, View } from "react-native";
import Pdf from "react-native-pdf";

const CourseContentScreen = () => {
  // const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* <WebView
        originWhitelist={["*"]}
        source={{
          uri: "https://learning-code-app.s3.eu-west-2.amazonaws.com/module 1/Module 1_ Core Foundation - Week 1 - 7.pdf",
        }}
      /> */}

      <Pdf
        source={{
          uri: "",
        }}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
        }}
        onError={(error) => {
          console.log(error);
        }}
        onPressLink={(uri) => {
          console.log(`Link pressed: ${uri}`);
        }}
        style={styles.pdf}
      />
    </View>
  );
};

export default CourseContentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 25,
  },

  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
