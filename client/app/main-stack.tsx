import { Colors } from "@/constants/Colors";
import { useGetCurrentUserMutation } from "@/features/apis/user-apis";
import { useThemeColor } from "@/hooks/use-theme-color";
import AIChatScreen from "@/screens/ai/ai-chat-screen";
import CourseContentScreen from "@/screens/courses/course-content-screen";
import CourseDetailsScreen from "@/screens/courses/course-details-screen";
import MainCourseScreen from "@/screens/courses/main-course-screen";
import PaymentOptionsScreen from "@/screens/payment/payment-options-screen";
import AvailablePaymentOptionsScreen from "@/screens/profile/available-payment-options-screen";
import HelpCenterScreen from "@/screens/profile/help-center-screen";
import InviteFriendsScreen from "@/screens/profile/invite-friends-screen";
import UpdateProfileScreen from "@/screens/profile/update-profile-screen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
import "react-native-reanimated";
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
    { light: Colors.light.background, dark: Colors.dark.background },
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
          title: "Ask AI",
        })}
        component={AIChatScreen}
      />

      <Stack.Screen
        name="main-course-screen"
        component={MainCourseScreen}
        options={() => ({
          animation: "slide_from_right",

          headerTitleAlign: "left",
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
          title: "Payment Options",
        })}
      />

      <Stack.Screen
        name="profile-update"
        component={UpdateProfileScreen}
        options={() => ({
          animation: "slide_from_right",
          title: "Update Profile",
        })}
      />

      <Stack.Screen
        name="available-payment-options"
        component={AvailablePaymentOptionsScreen}
        options={() => ({
          animation: "slide_from_right",
          title: "Available Payment Options",
        })}
      />

      <Stack.Screen
        name="help-center"
        component={HelpCenterScreen}
        options={() => ({
          animation: "slide_from_right",
          title: "Help Center",
        })}
      />

      <Stack.Screen
        name="invite-friends"
        component={InviteFriendsScreen}
        options={() => ({
          animation: "slide_from_right",
          title: "Invite Friends",
        })}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
