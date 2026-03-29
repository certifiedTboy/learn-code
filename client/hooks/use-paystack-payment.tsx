import { generatePaymentReference } from "@/helpers/payment";
import { useState } from "react";
import { usePaystack } from "react-native-paystack-webview";

const usePaystackPayment = () => {
  const [paymentSucess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState(false);

  const resetPaymentStatus = () => {
    setPaymentSuccess(false);
    setPaymentError(false);
  };

  const { popup } = usePaystack();

  const payNow = () => {
    popup.checkout({
      email: "jane.doe@example.com",
      amount: 5000,
      reference: generatePaymentReference(),
      metadata: {
        custom_fields: [
          {
            display_name: "Order ID",
            variable_name: "order_id",
            value: "OID1234",
          },
        ],
      },
      onSuccess: (res) => {
        setPaymentSuccess(true);
      },
      onCancel: () => {
        setPaymentError(true);
      },
      //   onLoad: (res) => console.log("WebView Loaded:", res),
      onError: (err) => setPaymentError(true),
    });
  };

  return { payNow, paymentSucess, paymentError, resetPaymentStatus };
};

export default usePaystackPayment;
