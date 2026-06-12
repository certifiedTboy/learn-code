import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/Colors";
import { AuthContext } from "@/features/context/auth-context";
import { CourseDetailsContext } from "@/features/context/course-details-context";
import { upsertRegisteredCourse } from "@/helpers/db/course-db";
import { showNotification } from "@/helpers/notification";
import useFlutterwavePayment from "@/hooks/use-flutterwave-payment";
import usePaystackPayment from "@/hooks/use-paystack-payment";
import { useThemeColor } from "@/hooks/use-theme-color";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useContext, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PaymentOptionsScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  const { course } = useContext(CourseDetailsContext);
  const { user } = useContext(AuthContext);

  const {
    payNow,
    paymentSuccess: paystackPaymentSuccess,
    paymentError,
    resetPaymentStatus,
  } = usePaystackPayment();

  const { FlutterwavePayment, paymentSuccess: flutterPaymentSuccess } =
    useFlutterwavePayment();

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

  useEffect(() => {
    if (paystackPaymentSuccess) {
      (async () => {
        await upsertRegisteredCourse({
          _id: course?._id,
          name: course?.name,
          description: course?.description,
          price: course?.price,
          rating: course?.rating,
          completed: course?.completed,
          subscribers: course?.subscribers,
          totalTopics: course?.totalTopics,
          requiredDuration: course?.requiredDuration,
          contents: course?.contents,
          createdAt: course?.createdAt,
          updatedAt: course?.updatedAt,
          skills: course?.skills,
          image: course?.image,
          dateRegistered: new Date().toDateString(),
          completion: "0%",
        });

        navigation.navigate("main-tabs");
      })();
    }

    if (paymentError) {
      showNotification({
        title: "Payment Failed",
        message: "Payment Failed",
        type: "error",
      });
    }
  }, [paystackPaymentSuccess, paymentError]);

  useEffect(() => {
    if (flutterPaymentSuccess === true) {
      (async () => {
        await upsertRegisteredCourse({
          _id: course?._id,
          name: course?.name,
          description: course?.description,
          price: course?.price,
          rating: course?.rating,
          completed: course?.completed,
          subscribers: course?.subscribers,
          totalTopics: course?.totalTopics,
          requiredDuration: course?.requiredDuration,
          contents: course?.contents,
          createdAt: course?.createdAt,
          updatedAt: course?.updatedAt,
          skills: course?.skills,
          image: course?.image,
          dateRegistered: new Date().toDateString(),
          completion: "0",
        });

        navigation.navigate("main-tabs");
      })();
    }

    if (flutterPaymentSuccess === false) {
      showNotification({
        title: "Payment Failed",
        message: "Payment Failed",
        type: "error",
      });
    }
  }, [flutterPaymentSuccess]);

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
        {/* Course Info */}
        <Text style={[styles.title, { color: courseText }]}>
          {course?.name}
        </Text>
        <Text style={styles.author}>Adebisi Tosin</Text>

        <View style={styles.priceRow}>
          <Text style={{ color: courseText }}>Price</Text>
          <Text style={styles.price}>
            {"\u20A6"}
            {course?.price}
          </Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Choose Payment Method</Text>

        {/* Payment Buttons */}

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            resetPaymentStatus();
            payNow(course?._id, +course?.price, course?.name);
          }}
        >
          <Text style={styles.buttonText}>Pay with Paystack</Text>
        </TouchableOpacity>

        <FlutterwavePayment
          courseId={course?._id}
          amount={+course?.price}
          email={user?.email!}
          userId={user?._id!}
          courseName={course?.name}
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
