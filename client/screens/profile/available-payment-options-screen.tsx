import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Icon from "@/components/ui/Icon";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/use-theme-color";
import { type NavigationProp, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

const AvailablePaymentOptionsScreen = () => {
  const { width, height } = useWindowDimensions();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp<any>>();

  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background",
  );

  const cardColor = useThemeColor(
    { light: "#F8F9FA", dark: "#1E1E1E" },
    "background",
  );

  const textColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text",
  );

  const borderColor = useThemeColor(
    { light: "#E0E0E0", dark: "#333333" },
    "background",
  );

  const paymentMethods = [
    { id: "flutterwave", name: "Pay with Flutterwave", icon: "card-outline" },
    { id: "paystack", name: "Pay with Paystack", icon: "cash-outline" },
  ];

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: width * 0.06, paddingTop: height * 0.05 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText
          style={[
            styles.title,
            { fontSize: width * 0.075, marginBottom: height * 0.04 },
          ]}
        >
          Payment Options
        </ThemedText>
        <ThemedText
          style={[
            styles.subtitle,
            { fontSize: width * 0.04, marginBottom: height * 0.02 },
          ]}
        >
          All payment operations are processed by the available payment
          providers.
        </ThemedText>

        <ThemedText
          style={[
            styles.subtitle,
            { fontSize: width * 0.04, marginBottom: height * 0.04 },
          ]}
        >
          All available options are secure and easy to use, and non of your
          payment details are stored on our servers.
        </ThemedText>

        <View style={styles.methodsContainer}>
          {paymentMethods.map((method) => {
            const isSelected = selectedMethod === method.id;

            return (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: cardColor,
                    borderColor: isSelected
                      ? Colors.light.generalBg
                      : borderColor,
                    borderWidth: isSelected ? 2 : 1,
                    paddingVertical: height * 0.025,
                    paddingHorizontal: width * 0.05,
                    marginBottom: height * 0.02,
                  },
                ]}
                onPress={() => setSelectedMethod(method.id)}
                activeOpacity={0.8}
              >
                <View style={styles.optionLeft}>
                  <Icon
                    // @ts-ignore
                    name={method.icon}
                    size={width * 0.07}
                    color={isSelected ? Colors.light.generalBg : textColor}
                  />
                  <ThemedText
                    style={[
                      styles.optionText,
                      { color: textColor, fontSize: width * 0.045 },
                    ]}
                  >
                    {method.name}
                  </ThemedText>
                </View>
                <View
                  style={[
                    styles.radioCircle,
                    {
                      borderColor: isSelected
                        ? Colors.light.generalBg
                        : borderColor,
                    },
                  ]}
                >
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[
            styles.payButton,
            {
              opacity: selectedMethod ? 1 : 0.6,
              paddingVertical: height * 0.02,
              marginTop: height * 0.04,
            },
          ]}
          disabled={!selectedMethod}
          onPress={() => navigation.navigate("main-tabs")}
        >
          <ThemedText
            style={[styles.payButtonText, { fontSize: width * 0.045 }]}
          >
            Select Payment Option
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
};

export default AvailablePaymentOptionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  title: {
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    color: "#666",
  },
  methodsContainer: {
    width: "100%",
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontWeight: "600",
    marginLeft: 12,
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: Colors.light.generalBg,
  },
  payButton: {
    backgroundColor: Colors.light.generalBg,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  payButtonText: {
    color: "#FFF",
    fontWeight: "700",
  },
});
