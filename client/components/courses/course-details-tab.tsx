import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Text, View } from "react-native";
import CourseLessons from "./course-lessons";
import CourseOverview from "./course-overview";

const Tab = createMaterialTopTabNavigator();
const CourseDetailsTab = () => {
  const Details = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Details</Text>
      </View>
    );
  };

  return (
    <Tab.Navigator>
      <Tab.Screen name="Overview" component={CourseOverview} />
      <Tab.Screen name="Lessons" component={CourseLessons} />
      <Tab.Screen name="Reviews" component={Details} />
    </Tab.Navigator>
  );
};

export default CourseDetailsTab;
