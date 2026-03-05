import { Colors } from "@/constants/Colors";
import { validateVerificationform } from "@/helpers/form-validators";
import { showNotification } from "@/helpers/notification";
import { useGetScreenOrientation } from "@/hooks/use-get-screen-orientation";
import { useTimeCountdown } from "@/hooks/use-time-countdown";
import {
  useRequestPasscodeResetMutation,
  useVerifyUserAccountMutation,
} from "@/lib/apis/user-apis";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Formik } from "formik";
import { useCallback, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { OtpInput } from "react-native-otp-entry";
import { ThemedText } from "../themed-text";
import Icon from "../ui/Icon";

const { width, height } = Dimensions.get("window");

/**
 * yup validation schema for the registration form
 */
const VerificationSchema = validateVerificationform();

const PasswordResetBottomSheetModal = ({
  isVisible,
  setIsVisibile,
  email,
  onUserVerificationSuccess,
  setValidPasswordResetCode,
}: {
  isVisible: boolean;
  setIsVisibile: () => void;
  email: string;
  onUserVerificationSuccess: () => void;
  setValidPasswordResetCode: (verificationCode: string) => void;
}) => {
  const [verifyAccount, { isLoading, isError, error, isSuccess }] =
    useVerifyUserAccountMutation();

  const [
    requestPasscodeReset,
    { isSuccess: newPasswordResetSuccess, isLoading: newPasswordResetLoading },
  ] = useRequestPasscodeResetMutation();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const { width } = useWindowDimensions();

  const { countdownTimeLeft, startCountdown, isCountingDown } =
    useTimeCountdown();

  const { isPortrait, getScreenOrientation } = useGetScreenOrientation();

  useEffect(() => {
    if (newPasswordResetSuccess) {
      showNotification({
        type: "success",
        title: "Success",
        message: "A new code is sent",
      });
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

    if (isSuccess) {
      onUserVerificationSuccess();
    }

    getScreenOrientation(width);
  }, [isError, isSuccess, newPasswordResetSuccess, width]);

  useEffect(() => {
    if (isVisible) {
      handlePresentModalPress();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isVisible]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheetModalProvider>
        <Formik
          initialValues={{ passwordResetCode: "" }}
          onSubmit={(values) => console.log(values)}
          validationSchema={VerificationSchema}
        >
          {({ handleChange, values, errors, handleBlur, isValid }) => (
            <BottomSheetModal
              ref={bottomSheetModalRef}
              onChange={handleSheetChanges}
              enablePanDownToClose={true}
              keyboardBehavior="interactive"
            >
              <BottomSheetView
                style={[styles.container, styles.sheetBackground]}
              >
                {/* Header */}
                <Text style={styles.title}>Password Reset Verification</Text>
                <Text style={styles.subtitle}>
                  Enter the password reset code sent to your email
                </Text>

                {/* OTP Inputs */}

                <View style={styles.otpContainer}>
                  <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                  >
                    <OtpInput
                      numberOfDigits={6}
                      onTextChange={handleChange("passwordResetCode")}
                      onBlur={() => handleBlur("passwordResetCode")}
                      onFilled={() => {
                        verifyAccount({
                          verificationCode: values.passwordResetCode,
                          action: "PASSWORD_RESET",
                        });
                        setValidPasswordResetCode(values.passwordResetCode);
                      }}
                      blurOnFilled={true}
                      disabled={newPasswordResetLoading || isLoading}
                      theme={{
                        pinCodeTextStyle: styles.pinCodeText,
                        // filledPinCodeContainerStyle: styles.input,
                        containerStyle: {
                          ...styles.inputContainer,
                          width: isPortrait ? width * 0.8 : width * 0.6,
                        },
                      }}
                      textInputProps={{
                        accessibilityLabel: "One-Time Password",
                      }}
                    />
                  </KeyboardAvoidingView>
                </View>

                {newPasswordResetLoading && (
                  <ActivityIndicator
                    size="small"
                    color={Colors.light.generalBg}
                  />
                )}

                {isLoading && (
                  <ActivityIndicator
                    size="small"
                    color={Colors.light.generalBg}
                  />
                )}

                <View style={styles.errorTextContainer}>
                  {errors?.passwordResetCode && (
                    <>
                      <Icon
                        name="alert-circle"
                        size={16}
                        color={Colors.light.errorText}
                      />
                      <ThemedText style={styles.errorText}>
                        {errors.passwordResetCode}
                      </ThemedText>
                    </>
                  )}
                </View>

                <View style={styles.resendBtnContainer}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {!isCountingDown ? (
                      <View style={styles.resendContainer}>
                        <Text style={styles.resendText}>
                          Didn&apos;t receive code?
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            if (!isCountingDown) {
                              requestPasscodeReset({
                                email,
                              });
                              startCountdown();
                            }
                          }}
                        >
                          <Text style={styles.resendLink}> Resend</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.timerContainer}>
                        <ThemedText style={styles.timerText}>
                          {countdownTimeLeft > 0 &&
                            `Resend code in ${
                              countdownTimeLeft === 60 ? 0 : countdownTimeLeft
                            } seconds`}
                        </ThemedText>
                      </View>
                    )}
                  </View>
                </View>
              </BottomSheetView>
            </BottomSheetModal>
          )}
        </Formik>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default PasswordResetBottomSheetModal;

const styles = StyleSheet.create({
  button: {
    margin: 10,
  },

  sheetBackground: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  container: {
    flex: 1,
    paddingHorizontal: width * 0.08,
    paddingTop: height * 0.02,
    paddingBottom: height * 0.04,
    alignItems: "center",
  },

  errorTextContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  errorText: {
    color: Colors.light.errorText,
    fontSize: 12,
    fontFamily: "robotoMedium",
  },

  title: {
    fontSize: width * 0.07,
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: width * 0.038,
    color: "#666",
    marginBottom: height * 0.04,
  },

  resendBtnContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: -15,
  },

  resendBtnText: {
    fontSize: 15,
    fontFamily: "robotoMedium",
    alignSelf: "flex-end",
    marginLeft: -10,
    marginRight: -13,
  },

  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: height * 0.02,
    gap: 3,
  },

  inputContainer: {
    marginHorizontal: "auto",
    marginTop: 30,
  },
  pinCodeText: { color: "#0263FFFF" },
  otpInput: {
    width: width * 0.15,
    height: width * 0.15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
  },

  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    // marginBottom: height * 0.05,
  },
  resendText: {
    color: "#666",
  },
  resendLink: {
    color: "#0A3D91",
    fontWeight: "600",
  },

  verifyButton: {
    backgroundColor: "#0A3D91",
    paddingVertical: height * 0.02,
    borderRadius: 10,
    alignItems: "center",
  },
  verifyText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },

  timerContainer: { flexDirection: "row", alignItems: "center" },

  timerText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginLeft: 5,
    fontFamily: "robotoMedium",
  },
});
