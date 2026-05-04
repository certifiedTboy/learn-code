import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/Colors";
import useFlutterwavePayment from "@/hooks/use-flutterwave-payment";
import usePaystackPayment from "@/hooks/use-paystack-payment";
import { useThemeColor } from "@/hooks/use-theme-color";
import { CourseDetailsContext } from "@/lib/context/course-details-context";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

const PaymentOptionsScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  const { course } = useContext(CourseDetailsContext);

  const { currentUser } = useSelector((state: any) => state.authState);

  const { payNow, paymentSucess, paymentError, resetPaymentStatus } =
    usePaystackPayment();

  const { FlutterwavePayment } = useFlutterwavePayment();

  const backgroundColor = useThemeColor(
    {
      light: Colors.light.background,
      dark: Colors.dark.background,
    },
    "background",
  );

  const cardBackgroundColor = useThemeColor(
    { light: Colors.dark.text, dark: Colors.dark.textDark },
    "background",
  );

  const courseText = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text",
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
        {/* Course Info */}
        <Text style={[styles.title, { color: courseText }]}>
          Graphic Design Course
        </Text>
        <Text style={styles.author}>By Syd Hassan</Text>

        <View style={styles.priceRow}>
          <Text style={{ color: courseText }}>Price</Text>
          <Text style={styles.price}>$72</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Choose Payment Method</Text>

        {/* Payment Buttons */}

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            resetPaymentStatus();
            payNow(course?._id, +course?.price);
          }}
        >
          <Text style={styles.buttonText}>Pay with Paystack</Text>
        </TouchableOpacity>

        <FlutterwavePayment
          courseId={course?._id}
          amount={+course?.price}
          email={currentUser?.email}
          userId={currentUser?._id}
        />

        <Text style={styles.securityText}>
          All payments are secure and encrypted.
        </Text>
      </View>
    </ThemedView>
  );
};

export default PaymentOptionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0b0d",
    justifyContent: "center",
    padding: 20,
  },

  card: {
    borderRadius: 20,
    padding: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
  },

  author: {
    color: "#9ca3af",
    marginTop: 4,
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0A58ED",
  },

  divider: {
    height: 1,
    backgroundColor: "#2a2a2a",
    marginVertical: 20,
  },

  sectionTitle: {
    color: "#9ca3af",
    marginBottom: 15,
  },

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

  securityText: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 12,
    marginTop: 15,
  },
});
