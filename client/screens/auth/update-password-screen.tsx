import SuccessModal from "@/components/common/success-modal";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Icon from "@/components/ui/Icon";
import SubmitButton from "@/components/ui/submit-button";
import { Colors } from "@/constants/Colors";
import { useUpdatePasscodeMutation } from "@/features/apis/auth-apis";
import { validateUpdatePasswordForm } from "@/helpers/form-validators";
import { showNotification } from "@/helpers/notification";
import { useThemeColor } from "@/hooks/use-theme-color";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

const UpdatePasswordSchema = validateUpdatePasswordForm();

const UpdatePasswordScreen = ({
  route,
}: {
  route: { params: { verificationCode: string } };
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { width, height } = useWindowDimensions();

  const [updatePasscode, { isLoading, isError, error, isSuccess }] =
    useUpdatePasscodeMutation();

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

    console.log("values:", values);

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
      style={[
        styles.container,
        { paddingHorizontal: width * 0.1, paddingTop: height * 0.16 },
      ]}
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
                  Update Password
                </ThemedText>
                <ThemedText
                  style={[
                    styles.subtitle,
                    { fontSize: width * 0.038, marginBottom: height * 0.05 },
                  ]}
                >
                  Please update your password here
                </ThemedText>

                <View style={{ marginBottom: height * 0.025 }}>
                  <ThemedText
                    style={[styles.label, { fontSize: width * 0.035 }]}
                  >
                    New Password
                  </ThemedText>
                  <View style={[styles.passwordWrapper, { borderColor }]}>
                    <TextInput
                      placeholder="Enter your password"
                      secureTextEntry={!passwordVisible}
                      style={[
                        styles.passwordInput,
                        {
                          color: inputTextColor,
                          paddingVertical: height * 0.018,
                        },
                      ]}
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

                <View style={{ marginBottom: height * 0.025 }}>
                  <ThemedText
                    style={[styles.label, { fontSize: width * 0.035 }]}
                  >
                    Confirm Password
                  </ThemedText>
                  <View style={[styles.passwordWrapper, { borderColor }]}>
                    <TextInput
                      placeholder="Confirm your password"
                      secureTextEntry={!confirmPasswordVisible}
                      style={[
                        styles.passwordInput,
                        {
                          color: inputTextColor,
                          paddingVertical: height * 0.018,
                        },
                      ]}
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

                <SubmitButton
                  buttonText="UPDATE PASSWORD"
                  buttonStyles={[
                    styles.signInButton,
                    {
                      paddingVertical: height * 0.02,
                      marginBottom: height * 0.04,
                    },
                  ]}
                  onButtonPress={() =>
                    updatePasswordSubmitHandler({ isValid, ...values })
                  }
                  isLoading={isLoading}
                  buttonTextStyles={styles.signInText}
                  buttonDisabled={isLoading}
                />

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
    borderColor: "#E0E0E0",
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
    backgroundColor: Colors.light.divider,
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 13,
    color: Colors.light.dividerText,
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

  errorTextContainer: { flexDirection: "row", alignItems: "center" },
  errorText: {
    color: Colors.light.errorText,
    fontSize: 12,
    fontFamily: "robotoMedium",
  },
});
