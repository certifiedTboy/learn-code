import SuccessModal from "@/components/common/success-modal";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import GoogleBtn from "@/components/ui/google-btn";
import Icon from "@/components/ui/Icon";
import SubmitButton from "@/components/ui/submit-button";
import { Colors } from "@/constants/Colors";
import {
  useCreateNewUserMutation,
  useLoginWithGoogleMutation,
} from "@/features/apis/auth-apis";
import { AuthContext } from "@/features/context/auth-context";
import { validateRegform } from "@/helpers/form-validators";
import { showNotification } from "@/helpers/notification";
import useGoogleAuth from "@/hooks/use-google-auth";
import { useThemeColor } from "@/hooks/use-theme-color";
import OTPBottomSheetModal from "@/screens/onboarding/otp-bottom-sheet-modal";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import { useContext, useEffect, useState } from "react";
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

/**
 * yup validation schema for the registration form
 */
const SignupSchema = validateRegform();

const SignUpScreen = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showBottomSheetModal, setShowBottomSheetModal] = useState(false);

  const { width, height } = useWindowDimensions();

  const [createNewUser, { isLoading, error, isError, isSuccess, data }] =
    useCreateNewUserMutation();

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

  const navigation = useNavigation<NavigationProp<any>>();

  const { handleGoogleSignIn, userData } = useGoogleAuth();

  const { updateAuthenticatedState } = useContext(AuthContext);

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

  const createNewUserHandler = async (values: {
    isValid: boolean;
    values: {
      email: string;
      password: string;
    };
  }) => {
    const { email, password } = values.values;

    if (!values.isValid)
      return showNotification({
        type: "error",
        title: "Invalid Input",
        message: "Invalid input values.",
      });

    await createNewUser({
      email: email.trim(),
      password: password.trim(),
      role: "user",
    });
  };

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
    if (isError) {
      showNotification({
        type: "error",
        title: "Signup Failed",
        message:
          error && "data" in error && (error as any).data?.message
            ? (error as any).data.message
            : "Something went wrong",
      });
    }

    if (isSuccess) {
      setShowBottomSheetModal(true);
    }
  }, [isError, isSuccess]);

  useEffect(() => {
    if (isGoogleError) {
      showNotification({
        type: "error",
        title: "Signup Failed",
        message:
          googleError &&
          "data" in googleError &&
          (googleError as any).data?.message
            ? (googleError as any).data.message
            : "Something went wrong",
      });
    }

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
  }, [isGoogleError, isGoogleSuccess]);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={"padding"}
        // keyboardVerticalOffset={100}
      >
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          onSubmit={(values) => console.log(values)}
          validationSchema={SignupSchema}
        >
          {({ handleChange, values, errors, handleBlur, isValid }) => (
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
                  navigation.navigate("SignInScreen");
                }}
                message="Your account has been created successfully!"
              />
              <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.container}>
                  <ThemedText
                    style={[
                      styles.title,
                      { fontSize: width * 0.075, lineHeight: width * 0.09 },
                    ]}
                  >
                    Sign up
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.subtitle,
                      { fontSize: width * 0.038, marginBottom: height * 0.05 },
                    ]}
                  >
                    Please sign up here
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

                  <View style={{ marginBottom: height * 0.025 }}>
                    <ThemedText
                      style={[styles.label, { fontSize: width * 0.035 }]}
                    >
                      Password
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

                  <SubmitButton
                    buttonText="SIGN UP"
                    buttonStyles={[
                      styles.signInButton,
                      {
                        paddingVertical: height * 0.02,
                        marginBottom: height * 0.04,
                      },
                    ]}
                    onButtonPress={() =>
                      createNewUserHandler({ isValid, values })
                    }
                    isLoading={isLoading}
                    buttonTextStyles={styles.signInText}
                    buttonDisabled={isLoading}
                  />

                  <View
                    style={[
                      styles.dividerContainer,
                      { marginBottom: height * 0.03 },
                    ]}
                  >
                    <View
                      style={[styles.divider, { backgroundColor: borderColor }]}
                    />
                    <Text style={styles.dividerText}>Or Sign up with</Text>
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
        {showBottomSheetModal && (
          <OTPBottomSheetModal
            isVisible={showBottomSheetModal}
            setIsVisibile={() => setShowBottomSheetModal(false)}
            email={data?.data?.email || googleData?.data?.email}
            onUserVerificationSuccess={() => {
              setShowBottomSheetModal(false);
              setShowModal(true);
            }}
          />
        )}
      </KeyboardAvoidingView>
    </>
  );
};

export default SignUpScreen;

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
    // backgroundColor: "#dddddd",
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
  errorTextContainer: { flexDirection: "row", alignItems: "center" },
  errorText: {
    color: Colors.light.errorText,
    fontSize: 12,
    fontFamily: "robotoMedium",
  },
});
