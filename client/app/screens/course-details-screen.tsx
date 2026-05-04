import CourseDetailsTab from "@/components/courses/course-details-tab";
import { ThemedView } from "@/components/themed-view";
import Icon from "@/components/ui/Icon";
import { Colors } from "@/constants/Colors";
import { getAllRegisteredCourse, getCourseById } from "@/helpers/db/course-db";
import { isAtLeast31DaysAgo } from "@/helpers/payment";
import { useThemeColor } from "@/hooks/use-theme-color";
import { CourseDetailsContext } from "@/lib/context/course-details-context";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { useCallback, useContext, useEffect } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const HERO_HEIGHT = width * 0.5;

const CourseDetailsScreen = ({ route }: { route: any }) => {
  const { setCourse, course } = useContext(CourseDetailsContext);

  const navigation = useNavigation<NavigationProp<any>>();

  const { id, name } = route.params;

  const headerTitleTextColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text",
  );

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
          color: headerTitleTextColor,
        },
      });
    }, []),
  );

  useEffect(() => {
    if (id) {
      (async () => {
        const courses = await getAllRegisteredCourse();

        const course = await getCourseById(id);
        if (course) {
          const courseIsRegistered = courses?.find(
            (myCourse: any) => myCourse._id === course?._id,
          );

          if (courseIsRegistered) {
            setCourse({
              ...course,
              isRegistered: true,
              paymentIsExpired: isAtLeast31DaysAgo(
                (courseIsRegistered as any)?.dateRegistered,
              ),
            });
          } else {
            setCourse(course);
          }
        }
      })();
    }
  }, [id]);

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      {/* <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        nestedScrollEnabled={true}
      > */}
      <View style={styles.heroWrapper}>
        <Image source={{ uri: course?.image }} style={styles.hero} />
        <View style={styles.playButton}>
          <Icon name="play" size={22} color="#ffffff" />
        </View>
      </View>
      <CourseDetailsTab />

      {/* Enroll Button */}
      <View style={styles.footer}>
        {!course?.isRegistered && (
          <TouchableOpacity
            style={styles.enrollBtn}
            onPress={() => navigation.navigate("payment-options")}
          >
            <Text style={styles.enrollText}>GET ENROLLED</Text>
          </TouchableOpacity>
        )}

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

        {course?.isRegistered && course.paymentIsExpired && (
          <TouchableOpacity
            style={styles.enrollBtn}
            onPress={() => navigation.navigate("payment-options")}
          >
            <Text style={styles.enrollText}>Update Payment</Text>
          </TouchableOpacity>
        )}
      </View>
      {/* </ScrollView> */}
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
    height: HERO_HEIGHT,
  },
  playButton: {
    position: "absolute",
    top: "45%",
    left: "45%",
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 40,
    padding: 18,
  },

  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 12,
  },
  tab: {
    fontSize: 14,
    color: "#888",
  },
  activeTab: {
    color: "#0A58ED",
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
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
