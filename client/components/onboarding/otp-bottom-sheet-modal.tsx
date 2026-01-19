import { BottomSheet } from "@rneui/themed";
import { useRef, useState } from "react";

import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaProvider } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const OTPBottomSheetModal = ({
  isVisible,
  setIsVisibile,
}: {
  isVisible: boolean;
  setIsVisibile: () => void;
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    if (isNaN(Number(text))) return;
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < otp.length - 1) {
      inputs.current[index + 1]?.focus();
    } else if (!text && index > 0) {
      inputs.current[index - 1]?.focus();
    } else if (index === otp.length - 1) {
      inputs.current[index]?.blur();
    } else {
      inputs.current[0]?.focus();
    }
  };

  return (
    <SafeAreaProvider>
      <BottomSheet
        modalProps={{}}
        isVisible={isVisible}
        onBackdropPress={setIsVisibile}
      >
        <View style={[styles.container, styles.sheetBackground]}>
          {/* Header */}
          <Text style={styles.title}>OTP Verification</Text>
          <Text style={styles.subtitle}>
            Enter the verification code sent to your email
          </Text>

          {/* OTP Inputs */}
          <View style={styles.otpContainer}>
            {otp.map((value, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputs.current[index] = ref;
                }}
                value={value}
                onChangeText={(text) => handleChange(text, index)}
                keyboardType="number-pad"
                maxLength={1}
                style={styles.otpInput}
              />
            ))}
          </View>

          {/* Resend */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn&apos;t receive code?</Text>
            <TouchableOpacity>
              <Text style={styles.resendLink}> Resend</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    </SafeAreaProvider>
  );
};

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

  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: height * 0.04,
    gap: 3,
  },
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
    marginBottom: height * 0.05,
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
});

export default OTPBottomSheetModal;
