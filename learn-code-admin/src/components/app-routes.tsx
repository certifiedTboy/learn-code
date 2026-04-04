import { Switch, Route } from "wouter";
import { useAuth } from "../hooks/use-auth";
import NotFound from "../pages/not-found";

// Pages
import Login from "../pages/login";
import Register from "../pages/register";
import VerifyAccount from "../pages/verifyAccount";
import Dashboard from "../pages/dashboard";
import CoursesList from "../pages/courses/list";
import CourseForm from "../pages/courses/form";
import CourseView from "../pages/courses/view";

import Redirect from "./redirect";

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

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
      <Route
        path="/"
        component={() => (
          <Redirect to="/dashboard" isAuthenticated={isAuthenticated} />
        )}
      />
      <Route component={NotFound} />
    </Switch>
  );
};

export default AppRoutes;
