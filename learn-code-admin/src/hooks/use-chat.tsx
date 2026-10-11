import { generateRandomRoomId } from "@/helpers/chat";
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_APP_SOCKET_URL;

type SocketMessage = {
  senderId: string;
  content: string;
  roomId?: string;
  chatId?: string;
};

export type ChatContextType = {
  joinRoom: (roomId: string, email: string) => void;
  sendMessage: (messageData: {
    chatId: string;
    content: string;
    senderId: string;
    roomId?: string;
  }) => void;
  socketMessages: SocketMessage[];
  isTyping: boolean;
};

const EMPTY_SOCKET_MESSAGE: SocketMessage = {
  senderId: "",
  content: "",
  roomId: "",
  chatId: "",
};

export const ChatContext = createContext<ChatContextType>({
  joinRoom: () => {},
  sendMessage: () => {},
  socketMessages: [EMPTY_SOCKET_MESSAGE],
  isTyping: false,
});

const ChatContextProvider = ({ children }: { children: ReactNode }) => {
  const socket = useRef(io(API_URL));
  const streamIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [socketMessages, setSocketMessages] = useState<SocketMessage[]>([]);

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
    roomId?: string;
  }) => {
    setSocketMessages((prev) => [
      ...prev,
      {
        chatId: messageData.chatId,
        senderId: messageData.senderId,
        content: messageData.content,
        roomId: messageData.roomId ?? "",
      },
    ]);

    socket.current.emit("message", messageData);
  };

  useEffect(() => {
    const handleMessage = (msg: SocketMessage) => {
      // Stop previous stream
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;
      }

      const messageId = generateRandomRoomId();

      // Insert an empty AI message
      setSocketMessages((prev) => [
        ...prev,
        {
          ...msg,
          chatId: messageId,
          content: "",
          isStreaming: true,
          roomId: msg.roomId,
        },
      ]);

      let charIndex = 0;

      streamIntervalRef.current = window.setInterval(() => {
        charIndex += 3;

        const revealed = msg?.content.slice(0, charIndex);
        const done = charIndex >= msg?.content.length;

        setSocketMessages((prev) =>
          prev.map((m) =>
            m.chatId === messageId
              ? {
                  ...m,
                  content: revealed,
                  isStreaming: !done,
                }
              : m,
          ),
        );

        if (done && streamIntervalRef.current) {
          clearInterval(streamIntervalRef.current);
          streamIntervalRef.current = null;
        }
      }, 1);
    };

    socket.current?.on("message", handleMessage);

    return () => {
      socket.current?.off("message", handleMessage);

      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    };
  }, []);

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
    socketMessages,
    joinRoom,
    sendMessage,
    isTyping,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export function useChat() {
  return useContext(ChatContext);
}

export default ChatContextProvider;
