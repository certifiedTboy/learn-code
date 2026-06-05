import { ThemedView } from "@/components/themed-view";
import Icon from "@/components/ui/Icon";
import { Colors } from "@/constants/Colors";
import { generateRandomRoomId } from "@/helpers/chat";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ChatContext } from "@/lib/context/chat-context";
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
import { useSelector } from "react-redux";

const AIChatScreen = () => {
  const [messages, setMessages] = useState<
    { id: string; sender: string; text: string }[]
  >([]);
  const [input, setInput] = useState("");

  const roomIdRef = useRef(generateRandomRoomId());

  const flatListRef = useRef<FlatList>(null);

  const { joinRoom, sendMessage, socketMessage, clearSocketMessage, isTyping } =
    useContext(ChatContext);

  const { currentUser } = useSelector((state: any) => state.authState);

  const chatBackgroundColor = useThemeColor(
    { light: "#ffffff", dark: "#000000" },
    "background",
  );

  const inputTextColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text",
  );

  const { width } = useWindowDimensions();

  useFocusEffect(
    useCallback(() => {
      if (currentUser) {
        joinRoom(roomIdRef?.current, currentUser?.email);
      }

      return () => {
        clearSocketMessage();
      };
    }, [currentUser]),
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
      socketMessage?.senderId !== currentUser?.email
    ) {
      simulateAssistantReply(socketMessage?.content);
    }
  }, [socketMessage]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      chatId: Date.now().toString(),
      senderId: currentUser?.email,
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
    const isUser = item?.sender === currentUser?.email;

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
        <Text
          style={[
            styles.messageText,
            isUser && { color: Colors.dark.text },
            {
              fontSize: width * 0.042,
              lineHeight: width * 0.058,
            },
          ]}
        >
          {item.text}
        </Text>
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
        lightColor="#ffffff"
        darkColor="#000000"
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
                color="#fff"
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
    backgroundColor: "#E7ECF6",
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
