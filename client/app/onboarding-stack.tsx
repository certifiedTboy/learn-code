import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CoursesScreen from "./screens/courses-screen";
import HomeScreen from "./screens/onboarding-screen";
import RequestPasswordResetScreen from "./screens/request-password-reset-screen";
import SignInScreen from "./screens/signin-screen";
import SignUpScreen from "./screens/signup-screen";
import UpdatePasswordScreen from "./screens/update-password-screen";
const Stack = createNativeStackNavigator();

const OnboardingStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        options={{ headerShown: false }}
        component={HomeScreen}
      />
      <Stack.Screen
        name="SignInScreen"
        options={{ headerShown: false }}
        component={SignInScreen}
      />

      <Stack.Screen
        name="SignupScreen"
        options={{ headerShown: false }}
        component={SignUpScreen}
      />

      <Stack.Screen
        name="RequestPasswordResetScreen"
        options={{ headerShown: false }}
        component={RequestPasswordResetScreen}
      />
      <Stack.Screen
        name="UpdatePasswordScreen"
        options={{ headerShown: false }}
        component={UpdatePasswordScreen}
      />
      <Stack.Screen
        name="CoursesScreen"
        options={{ headerShown: false }}
        component={CoursesScreen}
      />
    </Stack.Navigator>
  );
};

export default OnboardingStack;
