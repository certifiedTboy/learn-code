import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Icon from "@/components/ui/Icon";
import { Colors } from "@/constants/Colors";
import { showNotification } from "@/helpers/notification";
import useGoogleAuth from "@/hooks/use-google-auth";
import { useThemeColor } from "@/hooks/use-theme-color";
import {
  useLoginUserMutation,
  useLoginWithGoogleMutation,
} from "@/lib/apis/auth-apis";
import { AuthContext } from "@/lib/context/auth-context";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

const { width, height } = Dimensions.get("window");

const SignInScreen = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);

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
    { light: "#555", dark: "#555" },
    "text",
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
      style={styles.container}
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
            <ThemedText style={styles.title}>Sign in</ThemedText>
            <ThemedText style={styles.subtitle}>
              Please sign in with your account
            </ThemedText>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Email Here</ThemedText>
              <TextInput
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                style={[styles.input, { color: inputTextColor }]}
                placeholderTextColor={placeHolderColor}
                onChangeText={(value) => handleLoginInputchange("email", value)}
              />
            </View>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Password</ThemedText>
              <View style={styles.passwordWrapper}>
                <TextInput
                  placeholder="Enter your password"
                  secureTextEntry={!passwordVisible}
                  style={[styles.passwordInput, { color: inputTextColor }]}
                  placeholderTextColor={placeHolderColor}
                  onChangeText={(value) =>
                    handleLoginInputchange("password", value)
                  }
                />
                <TouchableOpacity
                  onPress={() => setPasswordVisible(!passwordVisible)}
                >
                  <Text style={styles.eyeIcon}>
                    {passwordVisible ? "🙈" : "👁️"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={styles.forgotContainer}
              onPress={() => navigation.navigate("RequestPasswordResetScreen")}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.signInButton}
              onPress={handleSubmit}
            >
              <Text style={styles.signInText}>SIGN IN</Text>
              {isLoading && <ActivityIndicator size="small" color="#FFF" />}
            </TouchableOpacity>
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Or Sign in with</Text>
              <View style={styles.divider} />
            </View>
            <TouchableOpacity
              onPress={handleGoogleSignIn}
              style={styles.googleBtn}
            >
              <Icon
                name="logo-google"
                size={24}
                color={Colors.dark.generalBg}
              />
              <Text style={styles.googleText}>Sign in with Google</Text>
              {isGoogleLoading && (
                <ActivityIndicator size="small" color="#FFF" />
              )}
            </TouchableOpacity>

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
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.06,
  },

  title: {
    fontSize: width * 0.075,
    fontWeight: "700",
    marginBottom: 5,
    lineHeight: width * 0.09,
  },
  subtitle: {
    fontSize: width * 0.038,
    color: "#666",
    marginBottom: height * 0.05,
  },

  inputGroup: {
    marginBottom: height * 0.025,
  },
  label: {
    fontSize: width * 0.035,
    color: Colors.dark.textSecondary,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingVertical: height * 0.018,
    paddingHorizontal: 14,
    fontSize: 15,
  },

  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 14,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: height * 0.018,
    fontSize: 15,
  },
  eyeIcon: {
    fontSize: 18,
  },

  forgotContainer: {
    alignItems: "flex-end",
    marginBottom: height * 0.04,
  },
  forgotText: {
    color: Colors.dark.generalBg,
    fontSize: 14,
    fontWeight: "500",
  },

  signInButton: {
    backgroundColor: Colors.dark.generalBg,
    paddingVertical: height * 0.02,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: height * 0.04,
    flexDirection: "row",
    justifyContent: "center",
    gap: 3,
  },
  signInText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.03,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#DDD",
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 13,
    color: "#777",
  },

  googleBtn: {
    borderWidth: 1,
    borderColor: Colors.dark.generalBg,
    paddingVertical: height * 0.018,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: height * 0.03,
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
    color: "#666",
  },
  signupText: {
    color: Colors.dark.generalBg,
    fontWeight: "600",
  },
});
