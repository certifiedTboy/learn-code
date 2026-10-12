import { Router as WouterRouter } from "wouter";
import { useSelector } from "react-redux";
import AppRoutes from "@/components/app-routes";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AiChatWidget } from "@/components/ai-chat-widget";
import { CoursesProvider } from "@/hooks/use-courses";
import ChatContextProvider from "@/hooks/use-chat";
import type { RootState } from "@/redux/store/store";

function App() {
  const { currentUser } = useSelector((state: RootState) => state.authState);

  return (
    <CoursesProvider>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AppRoutes />
        </WouterRouter>
        {currentUser && currentUser?.role === "user" && (
          <ChatContextProvider>
            <AiChatWidget />
          </ChatContextProvider>
        )}
        <Toaster />
      </TooltipProvider>
    </CoursesProvider>
  );
}

export default App;
