import CourseCheckedItem from "@/components/courses/CourseCheckedItem";
import CourseItem from "@/components/courses/course-item";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/use-theme-color";
import { courses } from "@/lib/apis/course-apis";

import { Dimensions, ScrollView, StyleSheet, Text } from "react-native";
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
const { width } = Dimensions.get("window");

const MainCourseScreen = () => {
  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background",
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {courses.map((chapter, index) => (
        <CourseItem
          key={index}
          title={chapter.title}
          isCheckedList={chapter.isCheckedList}
        >
          {chapter.isCheckedList ? (
            chapter?.items?.map((item, itemIndex) => (
              <CourseCheckedItem key={itemIndex} checked={item.checked}>
                {item.text}
              </CourseCheckedItem>
            ))
          ) : (
            <Text style={styles.contentText}>{chapter.content}</Text>
          )}
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
