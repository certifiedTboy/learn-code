import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import FormTextInput from "@/components/ui/form-text-input";
import GoogleBtn from "@/components/ui/google-btn";
import SubmitButton from "@/components/ui/submit-button";
import { Colors } from "@/constants/Colors";
import { showNotification } from "@/helpers/notification";
import useGoogleAuth from "@/hooks/use-google-auth";
import { useThemeColor } from "@/hooks/use-theme-color";
import {
  useLoginUserMutation,
  useLoginWithGoogleMutation,
} from "@/lib/apis/auth-apis";
import { AuthContext } from "@/lib/context/auth-context";
import { type NavigationProp, useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

const SignInScreen = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { width, height } = useWindowDimensions();

  const [loginUser, { isLoading, isError, error, isSuccess, data }] =
    useLoginUserMutation();

  const [
    loginWithGoogle,
    {
      isLoading: isGoogleLoading,
      isError: isGoogleError,
      error: googleError,
      isSuccess: isGoogleSuccess,
      data: googleData,
    },
  ] = useLoginWithGoogleMutation();

  const { updateAuthenticatedState } = useContext(AuthContext);

  const { handleGoogleSignIn, userData } = useGoogleAuth();

  const navigation = useNavigation<NavigationProp<any>>();

  const inputTextColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text",
  );

  const placeHolderColor = useThemeColor(
    { light: Colors.light.placeholder, dark: Colors.dark.placeholder },
    "text",
  );

  const borderColor = useThemeColor(
    { light: Colors.light.border, dark: Colors.dark.border },
    "background",
  );

  const handleLoginInputchange = (field: string, value: string) => {
    setLoginData({ ...loginData, [field]: value });
  };

  const handleSubmit = () => {
    if (!loginData.email || !loginData.password) return;

    loginUser(loginData);
  };

  useEffect(() => {
    if (isError) {
      showNotification({
        type: "error",
        title: "Login Failed",
        message:
          error && "data" in error && (error as any).data?.message
            ? (error as any).data.message
            : "Something went wrong",
      });
    }
  }, [isError]);

  useEffect(() => {
    if (isGoogleError) {
      showNotification({
        type: "error",
        title: "Login Failed",
        message:
          googleError &&
          "data" in googleError &&
          (googleError as any).data?.message
            ? (googleError as any).data.message
            : "Something went wrong",
      });
    }
  }, [isGoogleError]);

  useEffect(() => {
    if (userData) {
      loginWithGoogle({
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profilePicture: userData.profilePicture,
      });
    }
  }, [userData]);

  useEffect(() => {
    if (isSuccess) {
      const userData = {
        _id: data?.data?.user?._id,
        email: data?.data?.user?.email,
        firstName: data?.data?.user?.firstName,
        lastName: data?.data?.user?.lastName,
        profilePicture: data?.data?.user?.profilePicture,
        isVerified: data?.data?.user?.isVerified,
      };

      updateAuthenticatedState(
        data?.data?.refreshToken,
        data?.data?.accessToken,
        userData,
        // data?.data?.user?.registeredCourses,
      );
      navigation.navigate("CoursesScreen");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isGoogleSuccess) {
      const userData = {
        _id: googleData?.data?.user?._id,
        email: googleData?.data?.user?.email,
        firstName: googleData?.data?.user?.firstName,
        lastName: googleData?.data?.user?.lastName,
        profilePicture: googleData?.data?.user?.profilePicture,
        isVerified: googleData?.data?.user?.isVerified,
      };

      updateAuthenticatedState(
        googleData?.data?.refreshToken,
        googleData?.data?.accessToken,
        userData,
        // googleData?.data?.user?.registeredCourses,
      );
      navigation.navigate("CoursesScreen");
    }
  }, [isGoogleSuccess]);

  return (
    <ThemedView
      style={[
        styles.container,
        { paddingHorizontal: width * 0.1, paddingTop: height * 0.16 },
      ]}
      darkColor={Colors.dark.background}
      lightColor={Colors.light.background}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={"padding"}
          keyboardVerticalOffset={100}
        >
          <View style={styles.container}>
            <ThemedText
              style={[
                styles.title,
                { fontSize: width * 0.075, lineHeight: width * 0.09 },
              ]}
            >
              Sign in
            </ThemedText>
            <ThemedText
              style={[
                styles.subtitle,
                { fontSize: width * 0.038, marginBottom: height * 0.05 },
              ]}
            >
              Please sign in with your account
            </ThemedText>

            <FormTextInput
              placeholderText="Enter your email"
              labelText="Email"
              keyboardType="email-address"
              inputContainerStyle={{ marginBottom: height * 0.025 }}
              labelStyle={[styles.label, { fontSize: width * 0.035 }]}
              formInputStyle={[
                styles.input,
                {
                  color: inputTextColor,
                  paddingVertical: height * 0.018,
                  borderColor,
                },
              ]}
              placeholderTextColor={placeHolderColor}
              handleTextChange={handleLoginInputchange}
              value={loginData.email}
              textInputField="email"
            />

            <FormTextInput
              placeholderText="Enter your password"
              labelText="Password"
              inputContainerStyle={{ marginBottom: height * 0.025 }}
              labelStyle={[styles.label, { fontSize: width * 0.035 }]}
              formInputStyle={[
                styles.passwordInput,
                {
                  color: inputTextColor,
                  paddingVertical: height * 0.018,
                  borderColor,
                },
              ]}
              placeholderTextColor={placeHolderColor}
              handleTextChange={handleLoginInputchange}
              passwordVisible={passwordVisible}
              value={loginData.password}
              textInputField="password"
              onShowPassword={() => setPasswordVisible(!passwordVisible)}
              passwordWrapperStyle={[styles.passwordWrapper, { borderColor }]}
            />

            <TouchableOpacity
              style={[styles.forgotContainer, { marginBottom: height * 0.04 }]}
              onPress={() => navigation.navigate("RequestPasswordResetScreen")}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <SubmitButton
              buttonText="SIGN IN"
              buttonStyles={[
                styles.signInButton,
                { paddingVertical: height * 0.02, marginBottom: height * 0.04 },
              ]}
              onButtonPress={handleSubmit}
              isLoading={isLoading}
              buttonTextStyles={styles.signInText}
              buttonDisabled={isLoading}
            />

            <View
              style={[styles.dividerContainer, { marginBottom: height * 0.03 }]}
            >
              <View
                style={[styles.divider, { backgroundColor: borderColor }]}
              />
              <Text style={styles.dividerText}>Or Sign in with</Text>
              <View
                style={[styles.divider, { backgroundColor: borderColor }]}
              />
            </View>

            <GoogleBtn
              styles={[
                styles.googleBtn,
                {
                  paddingVertical: height * 0.018,
                  marginBottom: height * 0.03,
                },
              ]}
              onPress={handleGoogleSignIn}
              iconColor={Colors.dark.generalBg}
              isLoading={isGoogleLoading}
              buttonText="Google"
              buttonTextStyle={styles.googleText}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don&apos;t have an account?</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("SignupScreen")}
              >
                <Text style={styles.signupText}> Sign up Here</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </ThemedView>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    fontWeight: "700",
    marginBottom: 5,
  },
  subtitle: {
    color: Colors.light.subtitle,
  },

  label: {
    color: Colors.dark.textSecondary,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    // borderColor: "#E0E0E0",
    borderRadius: 10,

    paddingHorizontal: 14,
    fontSize: 15,
  },

  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    // borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 14,
  },
  passwordInput: {
    flex: 1,
    fontSize: 15,
  },
  eyeIcon: {
    fontSize: 18,
  },

  forgotContainer: {
    alignItems: "flex-end",
  },
  forgotText: {
    color: Colors.dark.generalBg,
    fontSize: 14,
    fontWeight: "500",
  },

  signInButton: {
    backgroundColor: Colors.dark.generalBg,

    borderRadius: 10,
    alignItems: "center",

    flexDirection: "row",
    justifyContent: "center",
    gap: 3,
  },
  signInText: {
    color: Colors.light.white,
    fontWeight: "700",
    fontSize: 16,
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  divider: {
    flex: 1,
    height: 1,
    // backgroundColor: "#DDD",
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 13,
    color: Colors.light.dividerText,
  },

  googleBtn: {
    borderWidth: 1,
    borderColor: Colors.dark.generalBg,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
  },
  googleText: {
    color: Colors.dark.generalBg,
    fontWeight: "600",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  footerText: {
    color: Colors.light.subtitle,
  },
  signupText: {
    color: Colors.dark.generalBg,
    fontWeight: "600",
  },
});
