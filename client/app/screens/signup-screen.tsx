import SuccessModal from "@/components/common/success-modal";
import OTPBottomSheetModal from "@/components/onboarding/otp-bottom-sheet-modal";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Icon from "@/components/ui/Icon";
import { Colors } from "@/constant/Colors";
import { validateRegform } from "@/helpers/form-validators";
import { showNotification } from "@/helpers/notification";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useCreateNewUserMutation } from "@/lib/apis/user-apis";
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

/**
 * yup validation schema for the registration form
 */
const SignupSchema = validateRegform();

const SignUpScreen = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showBottomSheetModal, setShowBottomSheetModal] = useState(false);

  const [createNewUser, { isLoading, error, isError, isSuccess, data }] =
    useCreateNewUserMutation();

  const navigation = useNavigation<NavigationProp<any>>();

  const inputTextColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text",
  );

  const placeHolderColor = useThemeColor(
    { light: "#555", dark: "#555" },
    "text",
  );

  const createNewUserHandler = async (values: {
    isValid: boolean;
    values: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    };
  }) => {
    const { firstName, lastName, email, password } = values.values;

    if (!values.isValid)
      return showNotification({
        type: "error",
        title: "Invalid Input",
        message: "Invalid input values.",
      });

    await createNewUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password: password.trim(),
      confirmPassword: password.trim(),
      role: "user",
    });
  };

  useEffect(() => {
    if (isError) {
      showNotification({
        type: "error",
        title: "Signup Failed",
        message: error?.data?.message || "Something went wrong!",
      });
    }

    if (isSuccess) {
      setShowBottomSheetModal(true);
    }
  }, [isError, isSuccess]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          password: "",
        }}
        onSubmit={(values) => console.log(values)}
        validationSchema={SignupSchema}
      >
        {({ handleChange, values, errors, handleBlur, isValid }) => (
          <ThemedView
            style={styles.container}
            darkColor={Colors.dark.background}
            lightColor={Colors.light.background}
          >
            {showBottomSheetModal && (
              <OTPBottomSheetModal
                isVisible={true}
                setIsVisibile={() => setShowBottomSheetModal(false)}
                email={data?.data.email}
                onUserVerificationSuccess={() => {
                  setShowBottomSheetModal(false);
                  setShowModal(true);
                }}
              />
            )}
            <SuccessModal
              visible={showModal}
              onClose={() => {
                setShowModal(false);
                navigation.navigate("SignInScreen");
              }}
              message="Your account has been created successfully!"
            />
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.container}>
                <ThemedText style={styles.title}>Sign up</ThemedText>
                <ThemedText style={styles.subtitle}>
                  Please sign up here
                </ThemedText>

                <View style={styles.inputGroup}>
                  <ThemedText style={styles.label}>First Name</ThemedText>
                  <TextInput
                    placeholder="Enter your first name"
                    keyboardType="default"
                    autoCapitalize="none"
                    style={[styles.input, { color: inputTextColor }]}
                    placeholderTextColor={placeHolderColor}
                    onChangeText={handleChange("firstName")}
                    onBlur={handleBlur("firstName")}
                    value={values.firstName}
                  />

                  {errors?.firstName && (
                    <View style={styles.errorTextContainer}>
                      <Icon
                        name="alert-circle"
                        size={16}
                        color={Colors.light.errorText}
                      />
                      <ThemedText style={styles.errorText}>
                        {errors.firstName}
                      </ThemedText>
                    </View>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <ThemedText style={styles.label}>Last Name</ThemedText>
                  <TextInput
                    placeholder="Enter your last name"
                    keyboardType="default"
                    autoCapitalize="none"
                    style={[styles.input, { color: inputTextColor }]}
                    placeholderTextColor={placeHolderColor}
                    onChangeText={handleChange("lastName")}
                    onBlur={handleBlur("lastName")}
                    value={values.lastName}
                  />

                  {errors?.lastName && (
                    <View style={styles.errorTextContainer}>
                      <Icon
                        name="alert-circle"
                        size={16}
                        color={Colors.light.errorText}
                      />
                      <ThemedText style={styles.errorText}>
                        {errors?.lastName}
                      </ThemedText>
                    </View>
                  )}
                </View>
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

                  {errors?.email && (
                    <View style={styles.errorTextContainer}>
                      <Icon
                        name="alert-circle"
                        size={16}
                        color={Colors.light.errorText}
                      />
                      <ThemedText style={styles.errorText}>
                        {errors?.email}
                      </ThemedText>
                    </View>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <ThemedText style={styles.label}>Password</ThemedText>
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

                <TouchableOpacity
                  style={styles.signInButton}
                  onPress={() => createNewUserHandler({ isValid, values })}
                >
                  <Text style={styles.signInText}>SIGN UP</Text>
                  {isLoading && <ActivityIndicator size="small" color="#fff" />}
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                  <View style={styles.divider} />
                  <Text style={styles.dividerText}>Or Sign up with</Text>
                  <View style={styles.divider} />
                </View>

                <TouchableOpacity style={styles.googleBtn}>
                  <Text style={styles.googleText}>Sign up with Google</Text>
                </TouchableOpacity>

                {/* <GoogleSigninButton
              style={{ width: 192, height: 48 }}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              //   onPress={signInWithGoogle}
            /> */}

                <View style={styles.footer}>
                  <Text style={styles.footerText}>
                    Already have an account?
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("SignInScreen")}
                  >
                    <Text style={styles.signupText}> Sign in Here</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </ThemedView>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
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
    flexDirection: "row",
    justifyContent: "center",
    gap: 3,
    marginBottom: height * 0.04,
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
  errorTextContainer: { flexDirection: "row", alignItems: "center" },
  errorText: {
    color: Colors.light.errorText,
    fontSize: 12,
    fontFamily: "robotoMedium",
  },
});
