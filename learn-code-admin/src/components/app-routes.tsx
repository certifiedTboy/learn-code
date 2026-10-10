import { Switch, Route } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import NotFound from "@/pages/others/not-found";

// Pages
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import VerifyAccount from "@/pages/auth/verifyAccount";
import ResetPassword from "@/pages/auth/reset-password";
import UpdatePassword from "@/pages/auth/update-password";
import Dashboard from "@/pages/dashboard/dashboard";
import CoursesList from "@/pages/courses/list";
import RegisteredCourses from "@/pages/courses/registered-courses";
import CourseForm from "@/pages/courses/form";
import AdminCourseDetails from "@/pages/courses/admin-course-details";
import UserCourseDetails from "@/pages/courses/user-course-details";
import UserProfile from "@/pages/dashboard/user-profile";
import AppRedirect from "@/pages/others/app-redirect";
import RegisteredUsers from "@/pages/dashboard/registered-users";
import LandingPage from "@/pages/others/landing-page";
import PrivacyPolicy from "@/pages/legal/privacy-policy";
import TermsAndConditions from "@/pages/legal/term-conditions";
import { AdminCourseContent } from "@/pages/courses/admin-course-content";
import { UserCourseContent } from "@/pages/courses/user-course-content";
import Contacts from "@/pages/others/contacts";
import PaymentOptions from "@/pages/payment/payment-options";

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
      <Route path="/dashboard/my-courses" component={RegisteredCourses} />
      <Route path="/dashboard/registered-users" component={RegisteredUsers} />
      <Route path="/dashboard/profile" component={UserProfile} />
      <Route path="/dashboard/courses/new" component={CourseForm} />
      <Route path="/dashboard/courses/:id/edit" component={CourseForm} />
      <Route path="/courses/:id" component={AdminCourseDetails} />
      <Route path="/dashboard/my-courses/:id" component={UserCourseDetails} />
      <Route
        path="/dashboard/my-courses/:id/content"
        component={UserCourseContent}
      />
      <Route
        path="/dashboard/my-courses/:id/payment"
        component={PaymentOptions}
      />
      <Route path="/courses/:id/content" component={AdminCourseContent} />
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
