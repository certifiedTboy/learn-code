import { Router as WouterRouter } from "wouter";
import AppRoutes from "./components/app-routes";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { AuthProvider } from "./hooks/use-auth";
import { CoursesProvider } from "./hooks/use-courses";

function App() {
  return (
    <AuthProvider>
      <CoursesProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <AppRoutes />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </CoursesProvider>
    </AuthProvider>
  );
}

export default App;
