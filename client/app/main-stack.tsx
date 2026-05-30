import { useThemeColor } from "@/hooks/use-theme-color";
import { useGetCurrentUserMutation } from "@/lib/apis/user-apis";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
import "react-native-reanimated";
import AIChatScreen from "../screens/ai-chat-screen";
import CourseContentScreen from "../screens/course-content-screen";
import CourseDetailsScreen from "../screens/course-details-screen";
import MainCourseScreen from "../screens/main-course-screen";
import PaymentOptionsScreen from "../screens/payment-options-screen";
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

  const [getCurrentUser] = useGetCurrentUserMutation();

  useEffect(() => {
    getCurrentUser(null);
  }, []);

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
          // headerShown: false,
        })}
        component={CourseDetailsScreen}
      />

      <Stack.Screen
        name="ai-chat-screen"
        options={() => ({
          animation: "slide_from_right",
        })}
        component={AIChatScreen}
      />

      <Stack.Screen
        name="main-course-screen"
        component={MainCourseScreen}
        options={() => ({
          animation: "slide_from_right",
        })}
      />

      <Stack.Screen
        name="course-content"
        component={CourseContentScreen}
        options={() => ({
          animation: "slide_from_right",
        })}
      />

      <Stack.Screen
        name="payment-options"
        component={PaymentOptionsScreen}
        options={() => ({
          animation: "slide_from_right",
        })}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
