/**
 * CourseDetailsScreen Component
 * Displays comprehensive information about a specific course.
 * Handles subscription checks, determines if the user is registered, and manages expired
 * payment notifications via the notification hook.
 */
import { ThemedView } from "@/components/themed-view";
import Icon from "@/components/ui/Icon";
import { Colors } from "@/constants/Colors";
import { CourseDetailsContext } from "@/features/context/course-details-context";
import { getAllRegisteredCourse, getCourseById } from "@/helpers/db/course-db";
import { isAtLeast31DaysAgo } from "@/helpers/payment";
import { useScheduleNotification } from "@/hooks/use-schedule-notification";
import { useThemeColor } from "@/hooks/use-theme-color";
import CourseDetailsTab from "@/screens/courses/course-details-tab";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { useCallback, useContext, useEffect } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

const CourseDetailsScreen = ({ route }: { route: any }) => {
  // Context used to store and share the loaded course data across child tabs
  const { setCourse, course } = useContext(CourseDetailsContext);

  // Hook to schedule subscription renewal reminders
  const { scheduleDailyNotification } = useScheduleNotification();

  const navigation = useNavigation<NavigationProp<any>>();

  // Extract course parameters passed down from the previous screen or a notification intent
  const { id, name, fromNotification } = route.params;

  const { width } = useWindowDimensions();
  const HERO_HEIGHT = width * 0.5;

  // Theme-aware color configurations
  const headerTitleTextColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text",
  );

  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background",
  );

  // Dynamically update the header title to match the selected course's name
  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        title: name,
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "600",
          marginLeft: -100,
          color: headerTitleTextColor,
        },
      });
    }, []),
  );

  // Duplicate useFocusEffect (could be safely removed/refactored out as it's identical to the one above)
  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        title: name,
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "600",
          marginLeft: -100,
          color: headerTitleTextColor,
        },
      });
    }, []),
  );

  // Fetch the full course details and cross-reference with the user's registered courses
  useEffect(() => {
    if (id) {
      (async () => {
        // Fetch local offline database cache of courses
        const courses = await getAllRegisteredCourse();
        const course = await getCourseById(id);

        if (course) {
          // Check if this specific course exists within the user's registered courses array
          const courseIsRegistered = courses?.find(
            (myCourse: any) => myCourse._id === course?._id,
          );

          if (courseIsRegistered) {
            /**
             * Course is registered:
             * Merge it with a flag indicating the user's registration status.
             * Also determine if the subscription has expired (e.g. registered over 31 days ago).
             */
            setCourse({
              ...course,
              isRegistered: true,
              paymentIsExpired: isAtLeast31DaysAgo(
                (courseIsRegistered as any)?.dateRegistered,
              ),
            });

            // If the user arrived here via a payment reminder notification, reschedule it
            // to persist until they successfully process their payment.
            if (fromNotification) {
              (async () => {
                await scheduleDailyNotification(
                  "Expired Subscription",
                  `Pay Your subscription for ${course?.name} to continue learning.`,
                  {
                    courseId: (courseIsRegistered as any)?._id,
                    courseName: course?.name,
                    hour: 10,
                    minute: 0,
                    scheduleType: "monthly-payment",
                    route: "course-details",
                  },
                );
              })();
            }
          } else {
            // Course is not registered: simply store the course details in context
            setCourse(course);
          }
        }
      })();
    }
  }, [id, fromNotification]);

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        nestedScrollEnabled={true}
      >
        {/* Hero Section: Course banner image and generic play overlay */}
        <View style={styles.heroWrapper}>
          <Image
            source={{ uri: course?.image }}
            style={[styles.hero, { height: HERO_HEIGHT }]}
          />
          <View style={styles.playButton}>
            <Icon name="play" size={22} color={Colors.light.white} />
          </View>
        </View>

        {/* Tabbed interface (Overview, Lessons, Reviews) driven by global context */}
        <CourseDetailsTab />

        {/* Conditional Footer Actions (Enroll / Continue Learning / Update Payment) */}
        <View style={styles.footer}>
          {/* Unregistered User: Show initial enrollment button */}
          {!course?.isRegistered && (
            <TouchableOpacity
              style={styles.enrollBtn}
              onPress={() => navigation.navigate("payment-options")}
            >
              <Text style={styles.enrollText}>GET ENROLLED</Text>
            </TouchableOpacity>
          )}

          {/* Registered User (Active): Allow them to proceed to main course content */}
          {course?.isRegistered && !course.paymentIsExpired && (
            <TouchableOpacity
              style={styles.enrollBtn}
              onPress={() =>
                navigation.navigate("main-course-screen", {
                  id: course?._id,
                  name: course?.name,
                })
              }
            >
              <Text style={styles.enrollText}>Continue Learning</Text>
            </TouchableOpacity>
          )}

          {/* Registered User (Expired): Prompt them to renew their subscription */}
          {course?.isRegistered && course.paymentIsExpired && (
            <TouchableOpacity
              style={styles.enrollBtn}
              onPress={() => navigation.navigate("payment-options")}
            >
              <Text style={styles.enrollText}>Update Payment</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
};

export default CourseDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroWrapper: {
    position: "relative",
  },
  hero: {
    width: "100%",
  },
  playButton: {
    position: "absolute",
    top: "45%",
    left: "45%",
    backgroundColor: Colors.light.overlay,
    borderRadius: 40,
    padding: 18,
  },

  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Colors.light.white,
    paddingVertical: 12,
  },
  tab: {
    fontSize: 14,
    color: Colors.light.tabText,
  },
  activeTab: {
    color: Colors.light.primaryBlue,
    fontWeight: "600",
  },
  footer: {
    padding: 16,
  },
  enrollBtn: {
    backgroundColor: Colors.light.generalBg,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  enrollText: {
    color: Colors.light.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
