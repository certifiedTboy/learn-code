import { removeAsteriks } from "@/helpers/chat";
import { ReactNode, createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const API_URL = process.env.EXPO_PUBLIC_SOCKET_URL;

export type ChatContextType = {
  joinRoom: (roomId: string, email: string) => void;
  sendMessage: (messageData: {
    chatId: string;
    content: string;
    senderId: string;
    roomId?: string;
  }) => void;
  socketMessage: {
    senderId: string;
    content: string;
  };
  clearSocketMessage: () => void;
  isTyping: boolean;
};

export const ChatContext = createContext<ChatContextType>({
  joinRoom: (roomId: string, email: string) => {},
  sendMessage: (messageData: {
    chatId: string;
    content: string;
    senderId: string;
    roomId?: string;
  }) => {},
  socketMessage: { senderId: "", content: "" },
  clearSocketMessage: () => {},
  isTyping: false,
});

const ChatContextProvider = ({ children }: { children: ReactNode }) => {
  const socket = useRef(io(API_URL));

  const [socketMessage, setSocketMessage] = useState<{
    senderId: string;
    content: string;
  }>({ senderId: "", content: "" });

  const [isTyping, setIsTyping] = useState(false);
  /**
   * join room function
   */
  const joinRoom = (roomId: string, email: string) => {
    socket?.current.emit("joinRoom", {
      roomId: roomId,
      email,
    });
  };

  /**
   * send message function
   */
  const sendMessage = async (messageData: {
    chatId: string;
    content: string;
    senderId: string;
  }) => {
    socket.current.emit("message", messageData);
  };

  /**
   * clear old socket message
   */
  const clearSocketMessage = () => {
    setSocketMessage({ senderId: "", content: "" });
  };

  /**
   * listens to incoming messages from the socket server
   */
  useEffect(() => {
    const currentSocket = socket.current;

    currentSocket.on(
      "message",
      (message: { senderId: string; content: string }) => {
        setSocketMessage({
          ...message,
          content: removeAsteriks(message.content),
        });
      },
    );

    return () => {
      currentSocket.off("message");
    };
  }, [socket]);

  useEffect(() => {
    const currentSocket = socket.current;

    currentSocket.on("ai-loading", (data) => {
      if (data.isLoading) {
        setIsTyping(true);
      } else {
        setIsTyping(false);
      }
    });

    return () => {
      currentSocket.off("ai-loading");
    };
  }, [socket]);

  const value = {
    socketMessage,
    joinRoom,
    sendMessage,
    clearSocketMessage,
    isTyping,
  };

  // @ts-ignore
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContextProvider;
