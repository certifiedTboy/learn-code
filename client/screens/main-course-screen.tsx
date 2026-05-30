import CourseItem from "@/components/courses/course-item";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import CourseCheckedItem from "@/components/courses/CourseCheckedItem";
import { useRegisteredCourseContext } from "@/lib/context/registered-course-context";
import { useCallback, useEffect } from "react";
import { Dimensions, ScrollView, StyleSheet, Text } from "react-native";
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
const { width } = Dimensions.get("window");

const MainCourseScreen = ({ route }: { route: any }) => {
  const { onGetRegisteredCourseById, registeredCourse } =
    useRegisteredCourseContext();

  const navigation = useNavigation();

  const { id, name } = route.params;

  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background",
  );
  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        title: name,
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "600",
          marginLeft: -100,
        },
      });
    }, [name]),
  );

  useEffect(() => {
    (async () => {
      if (id) {
        await onGetRegisteredCourseById(id);
      }
    })();
  }, [id, name]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {registeredCourse &&
        !Array.isArray(registeredCourse?.contents) &&
        JSON.parse(registeredCourse?.contents)?.length > 0 &&
        JSON.parse(registeredCourse?.contents)?.map(
          (chapter: any, index: any) => (
            <CourseItem
              key={index}
              title={chapter?.mainTopic}
              isCheckedList={chapter?.isCheckedList}
            >
              {chapter?.subTopics &&
                chapter?.subTopics?.length > 0 &&
                chapter?.subTopics?.map((topic: any, index: number) => {
                  return (
                    <Text
                      key={index}
                      style={[
                        styles.contentText,
                        !topic?.isVideo && { color: "#ff0000" },
                      ]}
                      onPress={() =>
                        // @ts-ignore
                        navigation.navigate("course-content", {
                          topic: topic?.title,
                          contentUri: topic?.contentURI,
                          mainTopic: chapter?.mainTopic,
                          id: registeredCourse?._id,
                          isCompleted: topic?.isCompleted,
                          name,
                        })
                      }
                    >
                      {topic?.title}
                    </Text>
                  );
                })}
            </CourseItem>
          ),
        )}

      {registeredCourse &&
        Array.isArray(registeredCourse?.contents) &&
        registeredCourse?.contents?.length > 0 &&
        registeredCourse?.contents?.map((chapter: any, index: any) => (
          <CourseItem
            key={index}
            title={chapter?.mainTopic}
            isCheckedList={chapter?.isCheckedList}
          >
            {chapter?.subTopics &&
              chapter?.subTopics?.length > 0 &&
              chapter?.subTopics?.map((topic: any, index: number) => {
                return (
                  <Text
                    key={index}
                    style={[
                      styles.contentText,
                      !topic?.isVideo && { color: "#ff0000" },
                    ]}
                    onPress={() =>
                      // @ts-ignore
                      navigation.navigate("course-content", {
                        topic: topic?.title,
                        contentUri: topic?.contentURI,
                        mainTopic: chapter?.mainTopic,
                        id: registeredCourse?._id,
                        isCompleted: topic?.isCompleted,
                        name,
                      })
                    }
                  >
                    {topic?.title}
                  </Text>
                );
              })}
          </CourseItem>
        ))}
    </ScrollView>
  );
};

export default MainCourseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: width > 768 ? 40 : 20,
    paddingVertical: 20,
  },
  mainTitle: {
    fontSize: width > 768 ? 32 : 24,
    fontWeight: "700",
    color: "#2d3436",
    marginBottom: 25,
    textAlign: "center",
  },

  contentText: {
    fontSize: width > 768 ? 16 : 14,
    color: "#636e72",
    lineHeight: 22,
  },
});
