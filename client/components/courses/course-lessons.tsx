import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/use-theme-color";
import { CourseDetailsContext } from "@/lib/context/course-details-context";
import React, { useContext } from "react";
import { Dimensions, ScrollView, StyleSheet, Text } from "react-native";
import CourseItem from "./course-item";

const { width } = Dimensions.get("window");

const CourseLessons = () => {
  const { course } = useContext(CourseDetailsContext);

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
      {course?.contents?.map((chapter: any, index: number) => (
        <CourseItem
          key={index}
          title={chapter?.mainTopic}
          isCheckedList={chapter.isCheckedList}
        >
          <Text style={styles.contentText}>{chapter?.description}</Text>
        </CourseItem>
      ))}
    </ScrollView>
  );
};

export default CourseLessons;

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
