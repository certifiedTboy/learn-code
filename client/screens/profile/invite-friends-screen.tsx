import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Icon from "@/components/ui/Icon";
import { Colors } from "@/constants/Colors";
import { showNotification } from "@/helpers/notification";
import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import {
    ScrollView,
    Share,
    StyleSheet,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";

const InviteFriendsScreen = () => {
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

  const inviteLink = "https://learncode.app/invite/user123";

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this amazing platform for learning to code! Join using my invite link: ${inviteLink}`,
      });
    } catch (error: any) {
      showNotification({
        type: "error",
        title: "Error",
        message: error.message,
      });
    }
  };

  const inviteOptions = [
    {
      id: "share",
      title: "Share Link",
      description: "Share via WhatsApp, Twitter, etc.",
      icon: "share-social-outline",
      action: handleShare,
    },
    {
      id: "copy",
      title: "Copy Link",
      description: "Copy your invite link to clipboard",
      icon: "copy-outline",
      action: () => {
        // Note: For actual clipboard copying, you should install 'expo-clipboard'.
        // Showing a success notification as a fallback for the UI demo.
        showNotification({
          type: "success",
          title: "Link Copied!",
          message: "Invite link copied to clipboard.",
        });
      },
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
          Invite Friends
        </ThemedText>
        <ThemedText
          style={[
            styles.subtitle,
            { fontSize: width * 0.04, marginBottom: height * 0.04 },
          ]}
        >
          Share your love for coding! Invite your friends and help them start
          their learning journey.
        </ThemedText>

        <View style={styles.methodsContainer}>
          {inviteOptions.map((option) => (
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

export default InviteFriendsScreen;

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
