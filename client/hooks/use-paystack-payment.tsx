import { generatePaymentReference } from "@/helpers/payment";
import { AuthContext } from "@/lib/context/auth-context";
import { useContext, useState } from "react";
import { usePaystack } from "react-native-paystack-webview";

const usePaystackPayment = () => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState(false);

  const { user } = useContext(AuthContext);

  const resetPaymentStatus = () => {
    setPaymentSuccess(false);
    setPaymentError(false);
  };

  const { popup } = usePaystack();

  const payNow = (courseId: string, amount: number) => {
    popup.checkout({
      email: user?.email!,
      amount: amount,
      reference: generatePaymentReference(),

      metadata: {
        userId: user?._id,
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
