// screens/CoursesScreen.js
import CourseCard from "@/components/courses/course-card";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";

const MyCoursesScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CourseCard
        title="Wireframing Fundamentals"
        author="By Shaunta Williams"
        progress={90}
        image={require("@/assets/images/Isolation_Mode.png")}
      />
    </ScrollView>
  );
};

export default MyCoursesScreen;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
});
