import Icon from "@/components/ui/Icon";
import { Colors } from "@/constants/Colors";
import {
  getAllRegisteredCourse,
  markSubTopicAsCompleted,
} from "@/helpers/db/course-db";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

const CourseContentScreen = ({ route }: { route: any }) => {
  const [content, setContent] = useState<{
    contentURI: string;
    isCompleted: boolean;
    isVideo: boolean;
    title: string;
  }>();

  const [percentageCompletion, setPercentageCompletion] = useState<any>();

  const navigation = useNavigation();

  const { topic, contentUri, mainTopic, id, isCompleted, name } = route.params;

  const handleMarkAsCompleted = async () => {
    const completionPercentage = await markSubTopicAsCompleted(
      id,
      mainTopic,
      topic,
    );

    setPercentageCompletion(completionPercentage);
  };

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        title: topic,
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "600",
          marginLeft: -100,
        },
      });
    }, []),
  );

  useEffect(() => {
    (async () => {
      if (name) {
        const registeredCourses = (await getAllRegisteredCourse()) as any[];

        const mainCourse = registeredCourses?.find(
          (course: any) => course?.name === name,
        );

        const mainContent = JSON.parse(mainCourse?.contents)?.find(
          (content: any) => content?.mainTopic === mainTopic,
        );

        const subTopic = mainContent?.subTopics?.find(
          (subTopic: any) => subTopic?.title === topic,
        );

        setContent(subTopic);
      }
    })();
  }, [name, handleMarkAsCompleted, percentageCompletion]);

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{
          uri: contentUri,
          cache: true,
        }}
        startInLoadingState
        renderLoading={() => <ActivityIndicator size="large" color="red" />}
      />

      <View style={styles.bottomContainer}>
        {!content?.isCompleted ? (
          <TouchableOpacity
            style={[
              styles.button,
              { flexDirection: "row", justifyContent: "center" },
            ]}
            onPress={handleMarkAsCompleted}
          >
            <Icon
              name="checkmark-done-circle-outline"
              size={20}
              color="#ffffff"
            />
            <Text style={styles.buttonText}>Mark as Completed</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.button,
              { flexDirection: "row", justifyContent: "center", gap: 3 },
            ]}
          >
            <Icon name="checkmark-done-circle" size={20} color="#ffffff" />

            <Text style={styles.buttonText}>Completed</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CourseContentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -50,
  },
  webview: {
    flex: 1,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: Colors.dark.generalBg,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
