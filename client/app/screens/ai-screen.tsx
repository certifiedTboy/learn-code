import { ThemedView } from "@/components/themed-view";
import Icon from "@/components/ui/Icon";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const COLORS = {
  background: "#FFFFFF",
  card: "#EEF2F8",
  primary: "#0A3D91",
  textDark: "#111111",
  textMuted: "#5F6F8F",
  border: "#D6DEEB",
};

const AIScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <ThemedView lightColor="#fff" darkColor="#000" style={styles.container}>
      {/* Illustration */}
      <Image
        source={require("@/assets/images/Isolation_Mode_1.png")}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Ask AI Anything 🤖</Text>

        <Text style={styles.subtitle}>
          Need help with ideas, explanations, coding, or everyday questions? I’m
          here to help — just start typing.
        </Text>

        {/* Prompt Suggestions */}
        <View style={styles.promptBox}>
          <Text style={styles.prompt}>“Explain this topic simply”</Text>
          <Text style={styles.prompt}>“Debug my code”</Text>
        </View>

        {/* Start Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.button}
          onPress={() => navigation.navigate("ai-chat-screen")}
        >
          <Text style={styles.buttonText}>Start Chat</Text>
          <Icon name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
};

export default AIScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: width * 0.06,
  },

  image: {
    width: width * 0.75,
    height: height * 0.3,
    marginBottom: width * 0.06,
  },

  card: {
    width: "100%",
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: width * 0.06,
    alignItems: "center",
  },

  title: {
    fontSize: width * 0.06,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: width * 0.03,
  },

  subtitle: {
    fontSize: width * 0.042,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: width * 0.06,
    marginBottom: width * 0.05,
  },

  promptBox: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: width * 0.04,
    marginBottom: width * 0.06,
  },

  prompt: {
    fontSize: width * 0.04,
    color: COLORS.textDark,
    marginBottom: width * 0.025,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: width * 0.04,
    paddingHorizontal: width * 0.08,
    borderRadius: 18,
    width: "100%",
  },

  buttonText: {
    color: "#fff",
    fontSize: width * 0.045,
    fontWeight: "600",
    marginRight: 10,
  },
});
