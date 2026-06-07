import Icon from "@/components/ui/Icon";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useRegisteredCourseContext } from "@/lib/context/registered-course-context";
import CourseCard from "@/screens/courses/course-card";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const MyCoursesScreen = () => {
  const { registeredCourses, onGetAllRegisteredCourses } =
    useRegisteredCourseContext();

  const textColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text",
  );

  useFocusEffect(
    useCallback(() => {
      onGetAllRegisteredCourses();
    }, []),
  );

  return (
    <>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          (!registeredCourses || registeredCourses.length === 0) &&
            styles.emptyContainer,
        ]}
      >
        {registeredCourses && registeredCourses?.length > 0 ? (
          registeredCourses.map((course: any, index: number) => (
            <CourseCard
              key={index}
              id={course?._id}
              name={course?.name}
              author="By Emmanuel Tosin"
              progress={Number(course?.completion?.replace("%", "") || 0)}
              image={{ uri: course?.course_image || course?.image }}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.instructionItem}>
              <Icon
                name="library-outline"
                size={60}
                color={Colors.dark.generalBg}
              />
              <Text style={[styles.instructionTitle, { color: textColor }]}>
                Enroll for a Course
              </Text>
              <Text style={[styles.instructionText, { color: textColor }]}>
                You haven't enrolled in any courses yet. Browse our catalog and
                enroll to start learning.
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.instructionItem}>
              <Icon
                name="cloud-download-outline"
                size={60}
                color={Colors.dark.generalBg}
              />
              <Text style={[styles.instructionTitle, { color: textColor }]}>
                Retrieve from Cloud
              </Text>
              <Text style={[styles.instructionText, { color: textColor }]}>
                If you already have courses saved, you can retrieve them from
                the cloud to continue your learning journey.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </>
  );
};

export default MyCoursesScreen;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  emptyState: {
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  instructionItem: {
    alignItems: "center",
    marginVertical: 20,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    opacity: 0.8,
  },
  divider: {
    height: 1,
    width: "80%",
    backgroundColor: "#ccc",
    opacity: 0.5,
    marginVertical: 10,
  },
});
