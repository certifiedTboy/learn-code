// screens/CoursesScreen.js
import CourseCard from "@/components/courses/course-card";
import { getAllRegisteredCourse } from "@/helpers/db/course-db";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

const MyCoursesScreen = () => {
  const [courses, setCourses] = useState<any[] | null>(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const result = await getAllRegisteredCourse();

        setCourses(result || []);
      })();
    }, []),
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {courses &&
        courses?.length > 0 &&
        courses?.map((course: any) => (
          <CourseCard
            key={course?._id}
            id={course?._id}
            name={course?.name}
            author="By Emmanuel Tosin"
            progress={Number(
              course?.completion
                .split("")
                .filter((char: string) => char !== "%")
                .join(""),
            )}
            image={{ uri: course?.course_image }}
          />
        ))}
    </ScrollView>
  );
};

export default MyCoursesScreen;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
});
