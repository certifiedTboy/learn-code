import { generatePaymentReference } from "@/helpers/payment";
import { useState } from "react";
import { usePaystack } from "react-native-paystack-webview";
import { useSelector } from "react-redux";

const usePaystackPayment = () => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState(false);

  const { currentUser } = useSelector((state: any) => state.authState);

  const resetPaymentStatus = () => {
    setPaymentSuccess(false);
    setPaymentError(false);
  };

  const { popup } = usePaystack();

  const payNow = (courseId: string, amount: number) => {
    popup.checkout({
      email: currentUser?.email,
      amount: amount,
      reference: generatePaymentReference(),

      metadata: {
        userId: currentUser?._id,
        courseId,
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

  return { payNow, paymentSuccess, paymentError, resetPaymentStatus };
};

export default usePaystackPayment;
