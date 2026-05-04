import CourseItem from "@/components/courses/course-item";
import { Colors } from "@/constants/Colors";
import { getCourseById } from "@/helpers/db/course-db";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import CourseCheckedItem from "@/components/courses/CourseCheckedItem";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text } from "react-native";
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
const { width } = Dimensions.get("window");

const MainCourseScreen = ({ route }: { route: any }) => {
  const [contents, setContents] = useState<any[]>([]);

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
    }, []),
  );

  useEffect(() => {
    (async () => {
      if (id) {
        const course = await getCourseById(id);
        setContents(course?.contents);
      }
    })();
  }, [id, name]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {contents.map((chapter, index) => (
        <CourseItem
          key={index}
          title={chapter?.mainTopic}
          isCheckedList={chapter?.isCheckedList}
        >
          {chapter?.subTopics?.map((topic: any, index: number) => {
            return (
              <Text
                key={index}
                style={styles.contentText}
                onPress={() =>
                  // @ts-ignore
                  navigation.navigate("course-content", {
                    topic: topic?.title,
                    contentUri: topic?.contentURI,
                  })
                }
              >
                {topic?.title}
              </Text>
            );
          })}
          {/* {chapter.isCheckedList ? (
            chapter?.items?.map((item, itemIndex) => (
              <CourseCheckedItem key={itemIndex} checked={item.checked}>
                {item.text}
              </CourseCheckedItem>
            ))
          ) : ( */}
          {/* <Text style={styles.contentText}>{chapter.description}</Text> */}
          {/* )} */}
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
