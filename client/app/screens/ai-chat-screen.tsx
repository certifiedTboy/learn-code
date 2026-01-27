import { ThemedView } from "@/components/themed-view";
import Icon from "@/components/ui/Icon";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const COLORS = {
  background: "#FFFFFF",
  card: "#EEF2F8",
  userBubble: "#0A3D91",
  assistantBubble: "#E7ECF6",
  textDark: "#111111",
  textLight: "#FFFFFF",
  border: "#D6DEEB",
};

const AIChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const flatListRef = useRef(null);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // Simulated ChatGPT streaming response
  const simulateAssistantReply = (fullText: string) => {
    const messageId = Date.now().toString();

    setMessages((prev) => [
      ...prev,
      { id: messageId, sender: "assistant", text: "" },
    ]);

    let index = 0;

    const interval = setInterval(() => {
      index++;

      setMessages((prev: any[]) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, text: fullText.slice(0, index) }
            : msg,
        ),
      );

      if (index === fullText.length) {
        clearInterval(interval);
      }
    }, 25); // typing speed
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI thinking delay
    setTimeout(() => {
      simulateAssistantReply(
        "This is how ChatGPT streams responses in real time, updating the same message bubble as tokens arrive.",
      );
    }, 600);
  };

  const renderItem = ({ item }: { item: any }) => {
    const isUser = item.sender === "user";

    return (
      <View
        style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.assistantBubble,
        ]}
      >
        <Text
          style={[styles.messageText, isUser && { color: COLORS.textLight }]}
        >
          {item.text}
        </Text>
      </View>
    );
  };

  return (
    <ThemedView lightColor="#fff" darkColor="#000" style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.chatContainer}
          showsVerticalScrollIndicator={false}
        />

        {/* Input Bar */}
        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Message ChatGPT"
              placeholderTextColor="#666"
              value={input}
              onChangeText={setInput}
              style={styles.input}
              multiline
            />

            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Icon name="send" size={width * 0.055} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

export default AIChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  chatContainer: {
    paddingHorizontal: width * 0.05,
    paddingTop: width * 0.04,
    paddingBottom: width * 0.25,
  },

  messageBubble: {
    maxWidth: "80%",
    paddingVertical: width * 0.035,
    paddingHorizontal: width * 0.045,
    borderRadius: 18,
    marginBottom: width * 0.03,
  },

  userBubble: {
    backgroundColor: COLORS.userBubble,
    alignSelf: "flex-end",
    borderBottomRightRadius: 6,
  },

  assistantBubble: {
    backgroundColor: COLORS.assistantBubble,
    alignSelf: "flex-start",
    borderBottomLeftRadius: 6,
  },

  messageText: {
    fontSize: width * 0.042,
    color: COLORS.textDark,
    lineHeight: width * 0.058,
  },

  inputWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: width * 0.04,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: COLORS.card,
    borderRadius: 22,
    paddingHorizontal: width * 0.04,
    paddingVertical: width * 0.02,
  },

  input: {
    flex: 1,
    fontSize: width * 0.042,
    maxHeight: width * 0.3,
    color: COLORS.textDark,
  },

  sendButton: {
    backgroundColor: COLORS.userBubble,
    borderRadius: 18,
    padding: width * 0.03,
    marginLeft: width * 0.02,
  },
});
