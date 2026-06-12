import { Switch, Route } from "wouter";
import { useAuth } from "../hooks/use-auth";
import NotFound from "../pages/not-found";

// Pages
import Login from "../pages/login";
import Register from "../pages/register";
import VerifyAccount from "../pages/verifyAccount";
import ResetPassword from "../pages/reset-password";
import UpdatePassword from "../pages/update-password";
import Dashboard from "../pages/dashboard";
import CoursesList from "../pages/courses/list";
import CourseForm from "../pages/courses/form";
import CourseView from "../pages/courses/view";
import UserProfile from "../pages/user-profile";
import AppRedirect from "../pages/app-redirect";
import RegisteredUsers from "../pages/registered-users";
import LandingPage from "../pages/landing-page";
import PrivacyPolicy from "../pages/privacy-policy";
import TermsAndConditions from "../pages/term-conditions";
import Contacts from "../pages/contacts";

import Redirect from "./redirect";

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/contacts" component={Contacts} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-and-conditions" component={TermsAndConditions} />
      <Route path="/login" component={Login} />
      <Route path="/payment-success" component={AppRedirect} />
      <Route path="/register" component={Register} />
      <Route path="/verify-acount" component={VerifyAccount} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/reset-password/update" component={UpdatePassword} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/courses" component={CoursesList} />
      <Route path="/dashboard/registered-users" component={RegisteredUsers} />
      <Route path="/dashboard/profile" component={UserProfile} />
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
