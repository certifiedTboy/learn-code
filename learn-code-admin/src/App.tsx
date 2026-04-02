import { Switch, Route, Router as WouterRouter } from "wouter";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { AuthProvider } from "./hooks/use-auth";
import { CoursesProvider } from "./hooks/use-courses";
import NotFound from "./pages/not-found";

// Pages
import Login from "./pages/login";
import Register from "./pages/register";
import VerifyAccount from "./pages/verifyAccount";
import Dashboard from "./pages/dashboard";
import CoursesList from "./pages/courses/list";
import CourseForm from "./pages/courses/form";
import CourseView from "./pages/courses/view";

const Redirect = ({ to }: { to: string }) => {
  if (typeof window !== "undefined") {
    window.location.href = to;
  }
  return null;
};

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/verify-acount" component={VerifyAccount} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/courses" component={CoursesList} />
      <Route path="/dashboard/courses/new" component={CourseForm} />
      <Route path="/dashboard/courses/:id/edit" component={CourseForm} />
      <Route path="/courses/:id" component={CourseView} />
      <Route path="/" component={() => <Redirect to="/dashboard" />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <CoursesProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </CoursesProvider>
    </AuthProvider>
  );
}

export default App;
