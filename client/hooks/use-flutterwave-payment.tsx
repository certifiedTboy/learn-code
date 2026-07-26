import { Colors } from "@/constants/Colors";
import { generatePaymentReference } from "@/helpers/payment";
import { PayWithFlutterwave } from "flutterwave-react-native";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface RedirectParams {
  status: "successful" | "cancelled" | "failed" | "completed";
  transaction_id?: string;
  tx_ref: string;
}

const useFlutterwavePayment = () => {
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>();
  /**
   * flutterwave payment custom component that can be used to initiate a payment process. It uses the PayWithFlutterwave component from the flutterwave-react-native library and handles the onRedirect event to log the payment status and transaction details.
   */
  const FlutterwavePayment = ({
    email,
    amount,
    userId,
    courseId,
    courseName,
  }: {
    email: string;
    amount: number;
    userId: string;
    courseId: string;
    courseName: string;
  }) => {
    const handleOnRedirect = (data: RedirectParams) => {
      console.log("flutter wave data:", data);
      // @ts-ignore
      if (
        (data && data?.status === "completed") ||
        data?.status === "successful"
      ) {
        setPaymentSuccess(true);
      } else {
        setPaymentSuccess(false);
      }
    };

    return (
      <PayWithFlutterwave
        onRedirect={handleOnRedirect}
        options={{
          tx_ref: generatePaymentReference(),
          authorization: process.env.EXPO_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || "",
          customer: {
            email,
          },
          amount,
          currency: "NGN",
          payment_options: "card, banktransfer, ussd",
          meta: {
            courseId,
            userId,
            email,
            courseName,
          },
        }}
        // style={styles.button}
        customButton={(props) => (
          <TouchableOpacity
            style={styles.button}
            onPress={props.onPress}
            //  isBusy={props.isInitializing}
            disabled={props.disabled}
          >
            <Text style={styles.buttonText}>Pay with Flutterwave</Text>
          </TouchableOpacity>
        )}
      />
    );
  };

  return { FlutterwavePayment, paymentSuccess };
};

export default useFlutterwavePayment;

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.light.flutterwaveBtnBg,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: Colors.light.white,
    fontWeight: "600",
    fontSize: 16,
  },
});
