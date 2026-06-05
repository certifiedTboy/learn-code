import { Colors } from "@/constants/Colors";
import { validateVerificationform } from "@/helpers/form-validators";
import { showNotification } from "@/helpers/notification";
import { useGetScreenOrientation } from "@/hooks/use-get-screen-orientation";
import { useTimeCountdown } from "@/hooks/use-time-countdown";
import {
    useGetNewVerificationCodeMutation,
    useVerifyUserAccountMutation,
} from "@/lib/apis/auth-apis";
import {
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { Formik } from "formik";
import { useCallback, useEffect, useRef } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { OtpInput } from "react-native-otp-entry";
import { ThemedText } from "../../components/themed-text";
import Icon from "../../components/ui/Icon";

/**
 * yup validation schema for the registration form
 */
const VerificationSchema = validateVerificationform();

const OTPBottomSheetModal = ({
  isVisible,
  setIsVisibile,
  email,
  onUserVerificationSuccess,
}: {
  isVisible: boolean;
  setIsVisibile: () => void;
  email: string;
  onUserVerificationSuccess: () => void;
}) => {
  const [verifyAccount, { isLoading, isError, error, isSuccess }] =
    useVerifyUserAccountMutation();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [
    getNewVerificationCode,
    {
      isLoading: newVerificationCodeLoading,
      isSuccess: newVerificationTokenSuccess,
    },
  ] = useGetNewVerificationCodeMutation();

  const { width, height } = useWindowDimensions();

  const { countdownTimeLeft, startCountdown, isCountingDown } =
    useTimeCountdown();

  const { isPortrait, getScreenOrientation } = useGetScreenOrientation();

  useEffect(() => {
    if (newVerificationTokenSuccess) {
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
            : "Account verification failed!",
      });
    }

    if (isSuccess) {
      onUserVerificationSuccess();
    }

    getScreenOrientation(width);
  }, [isError, newVerificationTokenSuccess, width, isSuccess]);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  useEffect(() => {
    handlePresentModalPress();
  }, []);

  return (
    <GestureHandlerRootView
      style={[
        styles.container,
        {
          paddingHorizontal: width * 0.08,
          paddingTop: height * 0.05,
          paddingBottom: height * 0.04,
        },
      ]}
    >
      <BottomSheetModalProvider>
        <Formik
          initialValues={{ verificationCode: "" }}
          onSubmit={(values) => console.log(values)}
          validationSchema={VerificationSchema}
        >
          {({ handleChange, values, errors, handleBlur, isValid }) => (
            <BottomSheetModal
              ref={bottomSheetModalRef}
              onChange={handleSheetChanges}
              enableDynamicSizing={true}
              maxDynamicContentSize={height * 0.85}
            >
              <BottomSheetScrollView
                style={[
                  styles.container,
                  styles.sheetBackground,
                  {
                    paddingHorizontal: width * 0.08,
                    paddingTop: height * 0.02,
                    paddingBottom: height * 0.04,
                    maxHeight: height * 0.85,
                  },
                ]}
              >
                {/* Header */}
                <Text style={[styles.title, { fontSize: width * 0.07 }]}>
                  Account Verification
                </Text>
                <Text
                  style={[
                    styles.subtitle,
                    { fontSize: width * 0.038, marginBottom: height * 0.04 },
                  ]}
                >
                  Enter the verification code sent to your email
                </Text>

                <View
                  style={[styles.otpContainer, { marginBottom: height * 0.02 }]}
                >
                  <OtpInput
                    numberOfDigits={6}
                    onTextChange={handleChange("verificationCode")}
                    onBlur={() => handleBlur("verificationCode")}
                    onFilled={() =>
                      verifyAccount({
                        verificationCode: values.verificationCode,
                        action: "ACCOUNT_VERIFICATION",
                      })
                    }
                    blurOnFilled={true}
                    disabled={newVerificationCodeLoading || isLoading}
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
                </View>

                {newVerificationCodeLoading && (
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
                  {errors?.verificationCode && (
                    <>
                      <Icon
                        name="alert-circle"
                        size={16}
                        color={Colors.light.errorText}
                      />
                      <ThemedText style={styles.errorText}>
                        {errors.verificationCode}
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
                              getNewVerificationCode({
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
              </BottomSheetScrollView>
            </BottomSheetModal>
          )}
        </Formik>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default OTPBottomSheetModal;

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
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    color: "#666",
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
    gap: 3,
  },

  inputContainer: {
    marginHorizontal: "auto",
    marginTop: 30,
  },
  pinCodeText: { color: "#0263FFFF" },
  otpInput: {
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
