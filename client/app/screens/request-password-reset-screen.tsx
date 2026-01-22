import SuccessModal from "@/components/common/success-modal";
import PasswordResetBottomSheetModal from "@/components/onboarding/password-reset-bottom-sheet-modal";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constant/Colors";
import { validatePasswordResetRequestForm } from "@/helpers/form-validators";
import { showNotification } from "@/helpers/notification";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useRequestPasscodeResetMutation } from "@/lib/apis/user-apis";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
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

const { width, height } = Dimensions.get("window");

const PasswordResetRequestSchema = validatePasswordResetRequestForm();

const RequestPasswordResetScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [validPasswordResetCode, setValidPasswordResetCode] =
    useState<string>("");
  const [showModal, setShowModal] = useState(false);

  const [requestPasswordReset, { isLoading, isError, error, isSuccess, data }] =
    useRequestPasscodeResetMutation();

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
    <ThemedView
      style={styles.container}
      darkColor={Colors.dark.background}
      lightColor={Colors.light.background}
    >
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
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
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
                <ThemedText style={styles.title}>Reset Password</ThemedText>
                <ThemedText style={styles.subtitle}>
                  Enter your email to reset your password
                </ThemedText>

                <View style={styles.inputGroup}>
                  <ThemedText style={styles.label}>Email Here</ThemedText>
                  <TextInput
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={[styles.input, { color: inputTextColor }]}
                    placeholderTextColor={placeHolderColor}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                  />
                </View>

                <TouchableOpacity
                  style={styles.signInButton}
                  onPress={() =>
                    passwordResetRequestSubmitHandler({ isValid, values })
                  }
                >
                  <Text style={styles.signInText}>RESET PASSWORD</Text>
                  {isLoading && <ActivityIndicator size="small" color="#fff" />}
                </TouchableOpacity>

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
        </KeyboardAvoidingView>
      </ScrollView>
    </ThemedView>
  );
};

export default RequestPasswordResetScreen;

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

  signInButton: {
    backgroundColor: "#0A3D91",
    paddingVertical: height * 0.02,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: height * 0.04,
  },
  signInText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
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
