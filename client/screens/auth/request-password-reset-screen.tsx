import SuccessModal from "@/components/common/success-modal";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import SubmitButton from "@/components/ui/submit-button";
import { Colors } from "@/constants/Colors";
import { useRequestPasscodeResetMutation } from "@/features/apis/auth-apis";
import { validatePasswordResetRequestForm } from "@/helpers/form-validators";
import { showNotification } from "@/helpers/notification";
import { useThemeColor } from "@/hooks/use-theme-color";
import PasswordResetBottomSheetModal from "@/screens/onboarding/password-reset-bottom-sheet-modal";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import { useEffect, useState } from "react";
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

const PasswordResetRequestSchema = validatePasswordResetRequestForm();

const RequestPasswordResetScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [validPasswordResetCode, setValidPasswordResetCode] =
    useState<string>("");
  const [showModal, setShowModal] = useState(false);

  const { width, height } = useWindowDimensions();

  const [requestPasswordReset, { isLoading, isError, error, isSuccess, data }] =
    useRequestPasscodeResetMutation();

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
    if (isSuccess) {
      setIsModalVisible(true);
    }

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
  }, [isError, isSuccess]);

  const passwordResetRequestSubmitHandler = async (values: {
    isValid: boolean;
    values: {
      email: string;
    };
  }) => {
    const { email } = values.values;

    if (!values.isValid)
      return showNotification({
        type: "error",
        title: "Invalid Input",
        message: "Invalid input values.",
      });

    await requestPasswordReset({
      email: email.trim(),
    });
  };

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={"padding"}
        // keyboardVerticalOffset={100}
      >
        <ThemedView
          style={[
            styles.container,
            { paddingHorizontal: width * 0.1, paddingTop: height * 0.16 },
          ]}
          darkColor={Colors.dark.background}
          lightColor={Colors.light.background}
        >
          <SuccessModal
            visible={showModal}
            onClose={() => {
              setShowModal(false);
              navigation.navigate("UpdatePasswordScreen", {
                verificationCode: validPasswordResetCode,
              });
            }}
            message="Password reset request is verified!"
          />
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <Formik
              initialValues={{
                email: "",
              }}
              onSubmit={(values) => console.log(values)}
              validationSchema={PasswordResetRequestSchema}
            >
              {({ handleChange, values, errors, handleBlur, isValid }) => (
                <View style={styles.container}>
                  <ThemedText
                    style={[
                      styles.title,
                      { fontSize: width * 0.075, lineHeight: width * 0.09 },
                    ]}
                  >
                    Reset Password
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.subtitle,
                      { fontSize: width * 0.038, marginBottom: height * 0.05 },
                    ]}
                  >
                    Enter your email to reset your password
                  </ThemedText>

                  <View style={{ marginBottom: height * 0.025 }}>
                    <ThemedText
                      style={[styles.label, { fontSize: width * 0.035 }]}
                    >
                      Email Here
                    </ThemedText>
                    <TextInput
                      placeholder="Enter your email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={[
                        styles.input,
                        {
                          color: inputTextColor,
                          paddingVertical: height * 0.018,
                          borderColor,
                        },
                      ]}
                      placeholderTextColor={placeHolderColor}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      value={values.email}
                    />
                  </View>

                  <SubmitButton
                    buttonText="RESET PASSWORD"
                    buttonStyles={[
                      styles.signInButton,
                      {
                        paddingVertical: height * 0.02,
                        marginBottom: height * 0.04,
                      },
                    ]}
                    onButtonPress={() =>
                      passwordResetRequestSubmitHandler({ isValid, values })
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
                      <Text style={styles.signupText}>Sign up Here</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Formik>
          </ScrollView>
        </ThemedView>

        {isModalVisible && (
          <PasswordResetBottomSheetModal
            isVisible={isModalVisible}
            setIsVisibile={() => setIsModalVisible(false)}
            email={data?.data?.email}
            onUserVerificationSuccess={() => {
              setIsModalVisible(false);
              setShowModal(true);
            }}
            setValidPasswordResetCode={setValidPasswordResetCode}
          />
        )}
      </KeyboardAvoidingView>
    </>
  );
};

export default RequestPasswordResetScreen;

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

  signInButton: {
    backgroundColor: Colors.dark.generalBg,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  signInText: {
    color: Colors.light.white,
    fontWeight: "700",
    fontSize: 16,
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
