import { generatePaymentReference } from "@/helpers/payment";
import { PayWithFlutterwave } from "flutterwave-react-native";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface RedirectParams {
  status: "successful" | "cancelled";
  transaction_id?: string;
  tx_ref: string;
}

const useFlutterwavePayment = () => {
  /**
   * flutterwave payment custom component that can be used to initiate a payment process. It uses the PayWithFlutterwave component from the flutterwave-react-native library and handles the onRedirect event to log the payment status and transaction details.
   */
  const FlutterwavePayment = () => {
    const handleOnRedirect = (data: RedirectParams) => {
      console.log(data);
    };

    return (
      <PayWithFlutterwave
        onRedirect={handleOnRedirect}
        options={{
          tx_ref: generatePaymentReference(),
          authorization: process.env.EXPO_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || "",
          customer: {
            email: "etosin70@gmail.com",
          },
          amount: 2000,
          currency: "NGN",
          payment_options: "card",
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

  return { FlutterwavePayment };
};

export default useFlutterwavePayment;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#6f7f9c",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
