import { useThemeColor } from "@/hooks/use-theme-color";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import "react-native-reanimated";
import CourseDetailsScreen from "./screens/course-details-screen";
import MainTabs from "./tabs/main-tab";

const Stack = createNativeStackNavigator();

/**
 * MainStack is the stack navigator for the main flow
 * It contains the main tabs screen
 * user need to be authentacated to access this stack and its screens
 * it is the main stack tab navigator for the app which contains screens such as chat, status AI and calls screens
 */
const MainStack = () => {
  const backgroundColor = useThemeColor(
    { light: "#fff", dark: "#000" },
    "background",
  );

  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor } }}>
      <Stack.Screen
        name="main-tabs"
        options={() => ({
          headerShown: false,
        })}
        component={MainTabs}
      />

      <Stack.Screen
        name="course-details"
        options={() => ({
          animation: "slide_from_right",
        })}
        component={CourseDetailsScreen}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
