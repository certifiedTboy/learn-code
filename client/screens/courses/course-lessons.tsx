import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/use-theme-color";
import { CourseDetailsContext } from "@/lib/context/course-details-context";
import React, { useContext } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
} from "react-native";
import CourseItem2 from "./course-item2";

const CourseLessons = () => {
  const { course } = useContext(CourseDetailsContext);

  const { width } = useWindowDimensions();

  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background",
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor }]}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingHorizontal: width > 768 ? 40 : 20 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {course?.contents?.map((chapter: any, index: number) => (
        <CourseItem2 key={index} title={chapter?.mainTopic}>
          <Text
            style={[styles.contentText, { fontSize: width > 768 ? 16 : 14 }]}
          >
            {chapter?.description}
          </Text>
        </CourseItem2>
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
    paddingVertical: 20,
  },
  mainTitle: {
    fontWeight: "700",
    color: "#2d3436",
    marginBottom: 25,
    textAlign: "center",
  },

  contentText: {
    color: "#636e72",
    lineHeight: 22,
  },
});
