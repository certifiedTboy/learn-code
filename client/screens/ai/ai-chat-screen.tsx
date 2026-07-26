import { ThemedView } from "@/components/themed-view";
import Icon from "@/components/ui/Icon";
import { Colors } from "@/constants/Colors";
import { AuthContext } from "@/features/context/auth-context";
import { ChatContext } from "@/features/context/chat-context";
import { generateRandomRoomId } from "@/helpers/chat";
import { useThemeColor } from "@/hooks/use-theme-color";
import TypingIndicator from "@/screens/ai/TypingIndication";
import { useFocusEffect } from "@react-navigation/native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import Markdown from "react-native-markdown-display";

const AIChatScreen = () => {
  const [messages, setMessages] = useState<
    { id: string; sender: string; text: string }[]
  >([]);
  const [input, setInput] = useState("");

  const roomIdRef = useRef(generateRandomRoomId());

  const flatListRef = useRef<FlatList>(null);

  const { joinRoom, sendMessage, socketMessage, clearSocketMessage, isTyping } =
    useContext(ChatContext);

  const { user } = useContext(AuthContext);
  const chatBackgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background",
  );

  const inputTextColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text",
  );

  const { width } = useWindowDimensions();

  useFocusEffect(
    useCallback(() => {
      if (user) {
        joinRoom(roomIdRef?.current, user?.email);
      }

      return () => {
        clearSocketMessage();
      };
    }, [user]),
  );

  // Simulated ChatGPT streaming response
  const simulateAssistantReply = (fullText: string) => {
    const messageId = Date.now().toString();

    setMessages((prev) => [...prev, { id: messageId, sender: "ai", text: "" }]);

    let index = 0;
    const chunkSize = 3;

    const interval = setInterval(() => {
      index += chunkSize;
      if (index >= fullText.length) {
        index = fullText.length;
        clearInterval(interval);
      }

      setMessages((prev: any[]) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, text: fullText.slice(0, index) }
            : msg,
        ),
      );
    }, 15); // typing speed
  };

  useEffect(() => {
    if (
      socketMessage &&
      socketMessage?.content &&
      socketMessage?.senderId !== user?.email
    ) {
      simulateAssistantReply(socketMessage?.content);
    }
  }, [socketMessage]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      chatId: Date.now().toString(),
      senderId: user?.email!,
      content: input,
      roomId: roomIdRef?.current,
    };

    sendMessage(userMessage);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: userMessage.senderId,
        text: userMessage.content,
      },
    ]);
    setInput("");
  };

  const renderItem = ({ item }: { item: any }) => {
    const isUser = item?.sender === user?.email;

    return (
      <View
        style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.assistantBubble,
          {
            paddingVertical: width * 0.035,
            paddingHorizontal: width * 0.045,
            marginBottom: width * 0.03,
          },
        ]}
      >
        {isUser ? (
          <Text
            style={[
              styles.messageText,
              { color: Colors.dark.text },
              {
                fontSize: width * 0.042,
                lineHeight: width * 0.058,
              },
            ]}
          >
            {item.text}
          </Text>
        ) : (
          <Markdown
            style={{
              body: {
                color: Colors.light.text,
                fontSize: width * 0.025,
                lineHeight: width * 0.038,
              },
              fence: {
                backgroundColor: Colors.light.codeBlockBg,
                color: Colors.light.codeBlockText,
                padding: 10,
                borderRadius: 8,
                marginTop: 8,
                marginBottom: 8,
              },
              code_inline: {
                backgroundColor: Colors.light.codeInlineBg,
                color: Colors.light.codeInlineText,
                paddingHorizontal: 4,
                borderRadius: 4,
              },
            }}
          >
            {item.text}
          </Markdown>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={"padding"}
      keyboardVerticalOffset={100}
    >
      <ThemedView
        lightColor={Colors.light.background}
        darkColor={Colors.dark.background}
        style={[styles.container]}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
          contentContainerStyle={[
            styles.chatContainer,
            {
              paddingHorizontal: width * 0.05,
              paddingTop: width * 0.04,
              paddingBottom: width * 0.25,
            },
          ]}
          showsVerticalScrollIndicator={false}
        />

        {/* Input Bar */}
        <View
          style={[
            styles.inputWrapper,
            { backgroundColor: chatBackgroundColor },
          ]}
        >
          {isTyping && <TypingIndicator />}
          <View
            style={[
              styles.inputContainer,
              {
                paddingHorizontal: width * 0.04,
                paddingVertical: width * 0.02,
              },
            ]}
          >
            <TextInput
              placeholder="Ask AI..."
              placeholderTextColor={Colors.light.generalBg}
              value={input}
              onChangeText={setInput}
              style={[
                styles.input,
                {
                  color: inputTextColor,
                  fontSize: width * 0.042,
                  maxHeight: width * 0.3,
                },
              ]}
              multiline
            />

            <TouchableOpacity
              style={[
                styles.sendButton,
                { padding: width * 0.03, marginLeft: width * 0.02 },
              ]}
              onPress={handleSend}
            >
              <Icon
                name="send"
                size={width * 0.055}
                color={Colors.light.white}
                onPress={handleSend}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
};

export default AIChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  chatContainer: {},

  messageBubble: {
    maxWidth: "80%",
    borderRadius: 18,
  },

  userBubble: {
    backgroundColor: Colors.light.generalBg,
    alignSelf: "flex-end",
    borderBottomRightRadius: 6,
  },

  assistantBubble: {
    backgroundColor: Colors.light.assistantBubbleBg,
    alignSelf: "flex-start",
    borderBottomLeftRadius: 6,
  },

  messageText: {
    color: Colors.light.text,
  },

  inputWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderColor: Colors.dark.generalBg,
    borderRadius: 10,
  },

  input: {
    flex: 1,
    backgroundColor: "transparent",
  },

  sendButton: {
    backgroundColor: Colors.light.generalBg,
    borderRadius: 18,
  },
});
