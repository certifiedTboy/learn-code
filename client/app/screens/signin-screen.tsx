import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constant/Colors";
import { showNotification } from "@/helpers/notification";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useLoginUserMutation } from "@/lib/apis/user-apis";
import { NavigationProp, useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const SignInScreen = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [loginUser, { isLoading, isError, error }] = useLoginUserMutation();

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
        message: error?.data?.message || "Something went wrong!",
      });
    }
  }, [isError]);

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
          behavior={Platform.OS === "ios" ? "padding" : undefined}
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

            <TouchableOpacity style={styles.googleBtn}>
              <Text style={styles.googleText}>Sign in with Google</Text>
            </TouchableOpacity>

            {/* <GoogleSigninButton
              style={{ width: 192, height: 48 }}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              //   onPress={signInWithGoogle}
            /> */}

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
    color: "#0A3D91",
    fontSize: 14,
    fontWeight: "500",
  },

  signInButton: {
    backgroundColor: "#0A3D91",
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

  facebookBtn: {
    backgroundColor: "#1877F2",
    paddingVertical: height * 0.018,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  socialText: {
    color: "#FFF",
    fontWeight: "600",
  },

  googleBtn: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingVertical: height * 0.018,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: height * 0.04,
  },
  googleText: {
    color: "#333",
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
    color: "#0A3D91",
    fontWeight: "600",
  },
});
