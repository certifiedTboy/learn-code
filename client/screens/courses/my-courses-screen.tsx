import { useRegisteredCourseContext } from "@/lib/context/registered-course-context";
import CourseCard from "@/screens/courses/course-card";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { ScrollView, StyleSheet } from "react-native";

const MyCoursesScreen = () => {
  const { registeredCourses, onGetAllRegisteredCourses } =
    useRegisteredCourseContext();

  useFocusEffect(
    useCallback(() => {
      onGetAllRegisteredCourses();
    }, []),
  );

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
