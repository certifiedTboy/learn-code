import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Icon from "@/components/ui/Icon";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import {
    Linking,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";

const HelpCenterScreen = () => {
  const { width, height } = useWindowDimensions();

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

  const supportOptions = [
    {
      id: "email",
      title: "Email Support",
      description: "admin.learncode@gmail.com",
      icon: "mail-outline",
      action: () => Linking.openURL("mailto:admin.learncode@gmail.com"),
    },
    {
      id: "phone",
      title: "Call Us",
      description: "+234 (813) 535-9082",
      icon: "call-outline",
      action: () => Linking.openURL("tel:+2348135359082"),
    },
    {
      id: "faq",
      title: "FAQ & Resources",
      description: "Visit our online help center",
      icon: "globe-outline",
      action: () => Linking.openURL("https://cybexitgroup.com/faq"),
    },
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
        <ThemedText style={[styles.title, { fontSize: width * 0.075 }]}>
          Help Center
        </ThemedText>
        <ThemedText
          style={[
            styles.subtitle,
            { fontSize: width * 0.04, marginBottom: height * 0.04 },
          ]}
        >
          Need help? Reach out to our support team through any of the channels
          below.
        </ThemedText>

        <View style={styles.methodsContainer}>
          {supportOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                {
                  backgroundColor: cardColor,
                  borderColor: borderColor,
                  paddingVertical: height * 0.025,
                  paddingHorizontal: width * 0.05,
                  marginBottom: height * 0.02,
                },
              ]}
              onPress={option.action}
              activeOpacity={0.8}
            >
              <View style={styles.optionLeft}>
                <Icon
                  // @ts-ignore
                  name={option.icon}
                  size={width * 0.07}
                  color={Colors.light.generalBg}
                />
                <View style={styles.textContainer}>
                  <ThemedText
                    style={[
                      styles.optionTitle,
                      { color: textColor, fontSize: width * 0.045 },
                    ]}
                  >
                    {option.title}
                  </ThemedText>
                  <ThemedText
                    style={[styles.optionDesc, { fontSize: width * 0.035 }]}
                  >
                    {option.description}
                  </ThemedText>
                </View>
              </View>
              <Icon
                name="chevron-forward"
                size={width * 0.06}
                color={borderColor}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
};

export default HelpCenterScreen;

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
    borderWidth: 1,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 16,
  },
  optionTitle: {
    fontWeight: "600",
    marginBottom: 4,
  },
  optionDesc: {
    color: "#888",
  },
});
