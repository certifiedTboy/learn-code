import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  Bot,
  ChevronDown,
  GraduationCap,
  Maximize2,
  MessageCircle,
  Minimize2,
  MoreHorizontal,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { useChat } from "@/hooks/use-chat";
import { useAuth } from "@/hooks/use-auth";
import { generateRandomRoomId } from "@/helpers/chat";
import { CHAT_STARTER } from "@/lib/mock-data";
import { motion, AnimatePresence } from "framer-motion";
import { MarkdownRender } from "./markdown-render";
import ChatLoader from "./chat-loader";
import "./ai-chat-widget.css";

interface ChatPosition {
  x: number;
  y: number;
}

interface DragOrigin extends ChatPosition {
  pointerX: number;
  pointerY: number;
}

export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [chatText, setChatText] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [position, setPosition] = useState<ChatPosition | null>(null);
  const [launcherPosition, setLauncherPosition] = useState<ChatPosition | null>(
    null,
  );
  const dragOrigin = useRef<DragOrigin | null>(null);
  const launcherDragOrigin = useRef<DragOrigin | null>(null);
  const launcherDidDrag = useRef(false);
  const suppressLauncherClick = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const roomIdRef = useRef(generateRandomRoomId());
  const bottomRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();

  const { joinRoom, socketMessages, sendMessage, isTyping } = useChat();

  useEffect(() => {
    if (user) {
      joinRoom(roomIdRef?.current, user?.email);
    }
  }, [user]);
  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (event.button !== 0) return;

    const bounds = panelRef.current?.getBoundingClientRect();
    if (!bounds) return;

    dragOrigin.current = {
      x: bounds.left,
      y: bounds.top,
      pointerX: event.clientX,
      pointerY: event.clientY,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setPosition({ x: bounds.left, y: bounds.top });
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!dragOrigin.current || !panelRef.current) return;

    const { x, y, pointerX, pointerY } = dragOrigin.current;
    const bounds = panelRef.current.getBoundingClientRect();
    setPosition({
      x: Math.max(
        12,
        Math.min(
          window.innerWidth - bounds.width - 12,
          x + event.clientX - pointerX,
        ),
      ),
      y: Math.max(
        12,
        Math.min(
          window.innerHeight - bounds.height - 12,
          y + event.clientY - pointerY,
        ),
      ),
    });
  };

  const handlePointerUp = () => {
    dragOrigin.current = null;
  };

  const handleLauncherPointerDown = (
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    if (event.button !== 0) return;

    const bounds = launcherRef.current?.getBoundingClientRect();
    if (!bounds) return;

    launcherDragOrigin.current = {
      x: bounds.left,
      y: bounds.top,
      pointerX: event.clientX,
      pointerY: event.clientY,
    };
    launcherDidDrag.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleLauncherPointerMove = (
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    const origin = launcherDragOrigin.current;
    if (!origin || !launcherRef.current) return;

    const deltaX = event.clientX - origin.pointerX;
    const deltaY = event.clientY - origin.pointerY;
    if (!launcherDidDrag.current && Math.hypot(deltaX, deltaY) < 5) return;

    launcherDidDrag.current = true;
    const bounds = launcherRef.current.getBoundingClientRect();
    setLauncherPosition({
      x: Math.max(
        12,
        Math.min(window.innerWidth - bounds.width - 12, origin.x + deltaX),
      ),
      y: Math.max(
        12,
        Math.min(window.innerHeight - bounds.height - 12, origin.y + deltaY),
      ),
    });
  };

  const handleLauncherPointerUp = () => {
    if (launcherDidDrag.current) suppressLauncherClick.current = true;
    launcherDragOrigin.current = null;
  };

  const handleLauncherClick = () => {
    if (suppressLauncherClick.current) {
      suppressLauncherClick.current = false;
      return;
    }

    const bounds = launcherRef.current?.getBoundingClientRect();
    if (bounds) {
      const isMobile = window.innerWidth <= 520;
      const panelWidth = Math.min(390, window.innerWidth - 32);
      const panelHeight = Math.min(
        620,
        Math.max(
          isMobile ? 360 : 420,
          window.innerHeight - (isMobile ? 42 : 88),
        ),
      );
      const maxX = Math.max(12, window.innerWidth - panelWidth - 12);
      const maxY = Math.max(12, window.innerHeight - panelHeight - 12);
      const x = Math.max(12, Math.min(maxX, bounds.right - panelWidth));
      const preferredY = bounds.top - panelHeight - 12;
      const y = Math.max(
        12,
        Math.min(maxY, preferredY >= 12 ? preferredY : bounds.bottom + 12),
      );

      setPosition({ x, y });
    }
    setIsOpen(true);
  };

  const handleSendMessage = () => {
    if (!chatText.trim()) return;

    sendMessage({
      chatId: generateRandomRoomId(),
      content: chatText,
      senderId: user?.email,
      roomId: roomIdRef?.current!,
    });

    setChatText("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [socketMessages]);

  return (
    <div className="ai-chat-widget">
      {isOpen ? (
        <section
          ref={panelRef}
          className={`ai-chat-panel${position && !isExpanded ? " ai-chat-panel-positioned" : ""}${isExpanded ? " ai-chat-panel-expanded" : ""}`}
          style={
            position && !isExpanded
              ? { left: position.x, top: position.y }
              : undefined
          }
          aria-label="LearnCode AI chat"
        >
          <header
            className="ai-chat-header"
            onPointerDown={isExpanded ? undefined : handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <div className="ai-chat-brand">
              <div className="ai-chat-brand-mark">
                <Sparkles size={19} strokeWidth={2.2} />
              </div>
              <div>
                <div className="ai-chat-title-row">
                  <h2>LearnCode AI</h2>
                  <span className="ai-chat-beta">BETA</span>
                </div>
                <p>
                  <span className="ai-chat-status-dot" />
                  Your learning copilot
                </p>
              </div>
            </div>
            <div className="ai-chat-header-actions">
              <button
                type="button"
                className="ai-chat-icon-button"
                aria-label={isExpanded ? "Restore chat size" : "Expand chat"}
                title={isExpanded ? "Restore chat size" : "Expand chat"}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => setIsExpanded((expanded) => !expanded)}
              >
                {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
              <button
                type="button"
                className="ai-chat-icon-button"
                aria-label="Minimize chat"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => setIsOpen(false)}
              >
                <ChevronDown size={19} />
              </button>
              <button
                type="button"
                className="ai-chat-icon-button"
                aria-label="More chat options"
                onPointerDown={(event) => event.stopPropagation()}
              >
                <MoreHorizontal size={20} />
              </button>
            </div>
          </header>

          <div className="ai-chat-context">
            <span className="ai-chat-context-icon">
              <GraduationCap size={14} />
            </span>
            <span>Here to help you learn</span>
            <span className="ai-chat-context-separator">·</span>
            <span>Ask me anything</span>
          </div>

          <div className="ai-chat-messages">
            {socketMessages?.length <= 0 && (
              <div className="ai-chat-suggestions">
                <span className="ai-chat-suggestions-label">
                  A FEW IDEAS TO GET STARTED
                </span>
                <div className="ai-chat-suggestion-list">
                  {CHAT_STARTER.map((start) => (
                    <div
                      className="ai-chat-suggestion cursor-pointer"
                      onClick={() => {
                        sendMessage({
                          chatId: generateRandomRoomId(),
                          content: start?.title,
                          senderId: user?.email,
                          roomId: roomIdRef?.current!,
                        });
                      }}
                    >
                      <span className="ai-chat-suggestion-icon ai-chat-suggestion-purple">
                        <start.icon size={15} />
                      </span>
                      <span>{start.title}</span>
                      <span className="ai-chat-suggestion-arrow">↗</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="max-w-3xl mx-auto space-y-8 pb-12">
              <AnimatePresence initial={false}>
                {socketMessages?.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2  ${message?.senderId === user?.email ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {message?.senderId !== user.email && (
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          message?.senderId === user?.email
                            ? "bg-primary/20 text-primary font-medium text-sm"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        <Bot size={18} />
                      </div>
                    )}

                    <div
                      className={`flex flex-col justify-center ${message?.senderId === user?.email ? "items-end" : "items-start"} max-w-[85%]`}
                    >
                      <div className="font-medium text-xs text-muted-foreground mb-1 px-1">
                        {message?.senderId !== user?.email
                          ? "Assistant"
                          : "You"}
                      </div>
                      {message?.senderId === user?.email ? (
                        <div className="flex flex-col items-end gap-2 rounded-2xl rounded-tr-sm bg-muted px-4 py-3 text-sm leading-relaxed shadow-sm">
                          {message?.content && (
                            <div className="whitespace-pre-wrap">
                              {message.content}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="ai-chat-assistant-response">
                          <MarkdownRender content={message?.content} />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div ref={bottomRef} />
          </div>

          <div className="ai-chat-composer-area">
            {isTyping && (
              <div className="max-w-3xl mx-auto mb-2">
                <ChatLoader />
              </div>
            )}
            <form
              className="ai-chat-composer"
              onSubmit={(event) => event.preventDefault()}
            >
              <textarea
                onChange={(event) => setChatText(event.target.value)}
                value={chatText}
                aria-label="Message LearnCode AI"
                placeholder="Ask anything about your learning..."
                rows={2}
              />
              <div className="ai-chat-composer-toolbar">
                <div className="ai-chat-composer-tools">
                  <span className="ai-chat-composer-hint">
                    <WandSparkles size={12} /> AI can make mistakes
                  </span>
                </div>
                <button
                  type="button"
                  className="ai-chat-send-button"
                  aria-label="Send message"
                  onClick={handleSendMessage}
                >
                  <ArrowUp size={17} strokeWidth={2.5} />
                </button>
              </div>
            </form>
            <p className="ai-chat-footer">
              Made for curious minds <Sparkles size={11} />
            </p>
          </div>
        </section>
      ) : (
        <button
          ref={launcherRef}
          type="button"
          className={`ai-chat-launcher${launcherPosition ? " ai-chat-launcher-positioned" : ""}`}
          style={
            launcherPosition
              ? { left: launcherPosition.x, top: launcherPosition.y }
              : undefined
          }
          onPointerDown={handleLauncherPointerDown}
          onPointerMove={handleLauncherPointerMove}
          onPointerUp={handleLauncherPointerUp}
          onPointerCancel={handleLauncherPointerUp}
          onClick={handleLauncherClick}
          aria-label="Open LearnCode AI chat"
        >
          <span className="ai-chat-launcher-icon">
            <MessageCircle size={21} />
          </span>
          <span className="ai-chat-launcher-label">Ask LearnCode AI</span>
          <span className="ai-chat-launcher-sparkle">
            <Sparkles size={13} />
          </span>
        </button>
      )}
    </div>
  );
}
