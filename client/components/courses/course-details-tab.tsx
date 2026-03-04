import { Colors } from "@/constants/Colors";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import CourseLessons from "./course-lessons";
import CourseOverview from "./course-overview";
import CourseReview from "./course-review";

const Tab = createMaterialTopTabNavigator();
const CourseDetailsTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.light.generalBg,
        tabBarIndicatorStyle: { backgroundColor: Colors.light.generalBg },
      }}
    >
      <Tab.Screen name="Overview" component={CourseOverview} />
      <Tab.Screen name="Lessons" component={CourseLessons} />
      <Tab.Screen name="Reviews" component={CourseReview} />
    </Tab.Navigator>
  );
};

export default CourseDetailsTab;
