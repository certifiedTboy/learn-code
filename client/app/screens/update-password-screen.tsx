import SuccessModal from "@/components/common/success-modal";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Icon from "@/components/ui/Icon";
import { Colors } from "@/constant/Colors";
import { validateUpdatePasswordForm } from "@/helpers/form-validators";
import { showNotification } from "@/helpers/notification";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useUpdatePasscodeMutation } from "@/lib/apis/user-apis";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
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

const { width, height } = Dimensions.get("window");

const UpdatePasswordSchema = validateUpdatePasswordForm();

const UpdatePasswordScreen = ({
  route,
}: {
  route: { params: { verificationCode: string } };
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [updatePasscode, { isLoading, isError, error, isSuccess }] =
    useUpdatePasscodeMutation();

  const navigation = useNavigation<NavigationProp<any>>();

  const inputTextColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text",
  );

  const placeHolderColor = useThemeColor(
    { light: "#555", dark: "#555" },
    "text",
  );

  useEffect(() => {
    if (isError) {
      showNotification({
        type: "error",
        title: "Error",
        message:
          error && "data" in error && (error as any).data?.message
            ? (error as any).data.message
            : "Something went wrong",
      });
    }

    if (isSuccess) {
      setShowSuccessModal(true);
    }
  }, [isSuccess, isError]);

  const updatePasswordSubmitHandler = (values: {
    isValid: boolean;
    password: string;
    confirmPassword: string;
  }) => {
    const { isValid, password, confirmPassword } = values;

    console.log("i am clicked");

    if (!isValid) {
      return showNotification({
        type: "error",
        title: "Invalid Input",
        message: "Invalid input values.",
      });
    }

    updatePasscode({
      passwordResetCode: route.params.verificationCode,
      password,
      confirmPassword,
    });
  };

  return (
    <ThemedView
      style={styles.container}
      darkColor={Colors.dark.background}
      lightColor={Colors.light.background}
    >
      {isSuccess && (
        <SuccessModal
          visible={showSuccessModal}
          message="Password updated successfully!"
          onClose={() => {
            setShowSuccessModal(false);
            navigation.navigate("SignInScreen");
          }}
        />
      )}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Formik
          initialValues={{
            password: "",
            confirmPassword: "",
          }}
          onSubmit={(values) => console.log(values)}
          validationSchema={UpdatePasswordSchema}
        >
          {({ handleChange, values, errors, handleBlur, isValid }) => (
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              <View style={styles.container}>
                <ThemedText style={styles.title}>Update Password</ThemedText>
                <ThemedText style={styles.subtitle}>
                  Please update your password here
                </ThemedText>

                <View style={styles.inputGroup}>
                  <ThemedText style={styles.label}>New Password</ThemedText>
                  <View style={styles.passwordWrapper}>
                    <TextInput
                      placeholder="Enter your password"
                      secureTextEntry={!passwordVisible}
                      style={[styles.passwordInput, { color: inputTextColor }]}
                      placeholderTextColor={placeHolderColor}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      value={values.password}
                    />
                    <TouchableOpacity
                      onPress={() => setPasswordVisible(!passwordVisible)}
                    >
                      <Text style={styles.eyeIcon}>
                        {passwordVisible ? "🙈" : "👁️"}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {errors?.password && (
                    <View style={styles.errorTextContainer}>
                      <Icon
                        name="alert-circle"
                        size={16}
                        color={Colors.light.errorText}
                      />
                      <ThemedText style={styles.errorText}>
                        {errors.password}
                      </ThemedText>
                    </View>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <ThemedText style={styles.label}>Confirm Password</ThemedText>
                  <View style={styles.passwordWrapper}>
                    <TextInput
                      placeholder="Confirm your password"
                      secureTextEntry={!confirmPasswordVisible}
                      style={[styles.passwordInput, { color: inputTextColor }]}
                      placeholderTextColor={placeHolderColor}
                      onChangeText={handleChange("confirmPassword")}
                      onBlur={handleBlur("confirmPassword")}
                      value={values.confirmPassword}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        setConfirmPasswordVisible(!confirmPasswordVisible)
                      }
                    >
                      <Text style={styles.eyeIcon}>
                        {confirmPasswordVisible ? "🙈" : "👁️"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {errors?.confirmPassword && (
                    <View style={styles.errorTextContainer}>
                      <Icon
                        name="alert-circle"
                        size={16}
                        color={Colors.light.errorText}
                      />
                      <ThemedText style={styles.errorText}>
                        {errors.confirmPassword}
                      </ThemedText>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.signInButton}
                  onPress={() =>
                    updatePasswordSubmitHandler({ isValid, ...values })
                  }
                >
                  <Text style={styles.signInText}>UPDATE PASSWORD</Text>
                  {isLoading && <ActivityIndicator size="small" color="#fff" />}
                </TouchableOpacity>

                <View style={styles.footer}>
                  <Text style={styles.footerText}>
                    Don&apos;t have an account?
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("SignupScreen")}
                  >
                    <Text style={styles.signupText}> Sign up Here</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          )}
        </Formik>
      </ScrollView>
    </ThemedView>
  );
};

export default UpdatePasswordScreen;

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

  errorTextContainer: { flexDirection: "row", alignItems: "center" },
  errorText: {
    color: Colors.light.errorText,
    fontSize: 12,
    fontFamily: "robotoMedium",
  },
});
