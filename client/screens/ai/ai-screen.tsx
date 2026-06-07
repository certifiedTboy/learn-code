import { ThemedView } from "@/components/themed-view";
import Icon from "@/components/ui/Icon";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/use-theme-color";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

const AIScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background",
  );

  const cardColor = useThemeColor(
    { light: Colors.light.card, dark: Colors.dark.courseCardBg },
    "background",
  );

  const textColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text",
  );

  const subtitleColor = useThemeColor(
    { light: Colors.light.generalBg, dark: Colors.dark.authorText },
    "text",
  );

  const promptBoxColor = useThemeColor(
    { light: Colors.light.promptBoxBg, dark: Colors.dark.promptBoxBg },
    "background",
  );

  const { width, height } = useWindowDimensions();

  return (
    <ThemedView
      style={[
        styles.container,
        {
          backgroundColor,
          paddingHorizontal: width * 0.06,
          marginTop: height * 0.01,
        },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Illustration */}
        <Image
          source={require("@/assets/images/Isolation_Mode_1.png")}
          style={[
            styles.image,
            {
              width: width * 0.75,
              height: height * 0.3,
              marginBottom: width * 0.06,
            },
          ]}
          resizeMode="contain"
        />

        {/* Card */}
        <View
          style={[
            styles.card,
            { padding: width * 0.06, backgroundColor: cardColor },
          ]}
        >
          <Text
            style={[
              styles.title,
              {
                color: textColor,
                fontSize: width * 0.06,
                marginBottom: width * 0.03,
              },
            ]}
          >
            Ask AI Anything 🤖
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: subtitleColor,
                fontSize: width * 0.042,
                lineHeight: width * 0.06,
                marginBottom: width * 0.05,
              },
            ]}
          >
            Need help with ideas, explanations, coding, or everyday questions?
            I’m here to help — just start typing.
          </Text>

          {/* Prompt Suggestions */}
          <View
            style={[
              styles.promptBox,
              {
                backgroundColor: promptBoxColor,
                padding: width * 0.04,
                marginBottom: width * 0.06,
              },
            ]}
          >
            <Text
              style={[
                styles.prompt,
                {
                  color: textColor,
                  fontSize: width * 0.04,
                  marginBottom: width * 0.025,
                },
              ]}
            >
              “Explain this topic simply”
            </Text>
            <Text
              style={[
                styles.prompt,
                {
                  color: textColor,
                  fontSize: width * 0.04,
                  marginBottom: width * 0.025,
                },
              ]}
            >
              “Debug my code”
            </Text>
          </View>

          {/* Start Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.button,
              {
                paddingVertical: width * 0.04,
                paddingHorizontal: width * 0.08,
              },
            ]}
            onPress={() => navigation.navigate("ai-chat-screen")}
          >
            <Text style={[styles.buttonText, { fontSize: width * 0.045 }]}>
              Start Chat
            </Text>
            <Icon name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
};

export default AIScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {},
  card: {
    width: "100%",
    backgroundColor: Colors.light.card,
    borderRadius: 24,
    alignItems: "center",
  },

  title: {
    fontWeight: "700",
  },

  subtitle: {
    color: Colors.light.generalBg,
    textAlign: "center",
  },

  promptBox: {
    width: "100%",
    backgroundColor: Colors.light.white,
    borderRadius: 16,
  },

  prompt: {
    color: Colors.light.textDark,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.generalBg,
    borderRadius: 18,
    width: "100%",
  },

  buttonText: {
    color: Colors.light.white,
    fontWeight: "600",
    marginRight: 10,
  },
});
