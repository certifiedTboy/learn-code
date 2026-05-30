import CourseCard from "@/components/courses/course-card";
import { useRegisteredCourseContext } from "@/lib/context/registered-course-context";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";

const MyCoursesScreen = () => {
  const { registeredCourses } = useRegisteredCourseContext();

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {registeredCourses &&
          registeredCourses?.length > 0 &&
          registeredCourses.map((course: any) => (
            <CourseCard
              key={course?._id}
              id={course?._id}
              name={course?.name}
              author="By Emmanuel Tosin"
              progress={Number(course?.completion?.replace("%", "") || 0)}
              image={{ uri: course?.course_image || course?.image }}
            />
          ))}
      </ScrollView>
    </>
  );
};

export default MyCoursesScreen;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
});
