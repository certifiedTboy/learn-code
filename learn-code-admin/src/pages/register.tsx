import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { GraduationCap, ArrowLeft, Mail, Lock } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { registerSchema } from "../helpers/data-validator-schema";
import useForm from "../hooks/useForm";
import { useCreateAdminAccountMutation } from "../lib/apis/auth-apis";
import { useAuth } from "../hooks/use-auth";
import Loader from "../components/ui/loader";

export default function Register() {
  const [, setLocation] = useLocation();

  const { isAuthenticated } = useAuth();
  const [
    createAdminAccount,
    { isLoading, error: errorResponse, isSuccess, isError },
  ] = useCreateAdminAccountMutation();

  const { toast } = useToast();

  const {
    error,
    handleInputChange,
    handlePasswordTypeChange,
    inputType,
    formData,
  } = useForm(registerSchema);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (Object.values(error)[0]) return;

    delete formData.confirmPassword;

    createAdminAccount({
      ...formData,
      role: "admin",
    });
  };

  useEffect(() => {
    if (isSuccess) {
      setLocation("/verify-acount");
    }

    if (isError) {
      const message =
        errorResponse && "data" in errorResponse
          ? (errorResponse.data as any)?.message || "Something went wrong"
          : "Something went wrong";
      toast({
        variant: "destructive",
        title: message,
      });
    }

    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isSuccess, isError, isAuthenticated]);

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative order-2 lg:order-1">
        <div className="absolute top-8 left-8">
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
        </div>

        <motion.div
          className="w-full max-w-md space-y-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-display font-bold tracking-tight mb-2">
              Create an account
            </h2>
            <p className="text-muted-foreground">
              Start managing your courses today
            </p>
          </div>

          <div className="glass-panel p-8 rounded-2xl">
            {isLoading && <Loader />}
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      onChange={handleInputChange}
                      placeholder="admin@example.com"
                      name="email"
                      className="pl-10 bg-background/50 border-white/10 focus:border-primary/50 focus:ring-primary/20"
                    />
                  </div>
                  {error?.field === "email" && (
                    <p className="text-xs text-destructive">{error?.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      onChange={handleInputChange}
                      type={inputType?.passwordType}
                      placeholder="••••••••"
                      name="password"
                      className="pl-10 bg-background/50 border-white/10 focus:border-primary/50 focus:ring-primary/20"
                    />
                    <span
                      onClick={() => handlePasswordTypeChange("passwordType")}
                      className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                    >
                      {inputType.passwordType === "password" ? "👁️" : "🙈"}
                    </span>
                  </div>
                  {error?.field === "password" && (
                    <p className="text-xs text-destructive">{error?.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      onChange={handleInputChange}
                      type={inputType.confirmPasswordType}
                      placeholder="••••••••"
                      name="confirmPassword"
                      className="pl-10 bg-background/50 border-white/10 focus:border-primary/50 focus:ring-primary/20"
                    />

                    <span
                      onClick={() =>
                        handlePasswordTypeChange("confirmPasswordType")
                      }
                      className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                    >
                      {inputType.confirmPasswordType === "password"
                        ? "👁️"
                        : "🙈"}
                    </span>
                  </div>
                  {error?.field === "confirmPassword" && (
                    <p className="text-xs text-destructive">{error?.message}</p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full cursor-pointer h-12 text-base font-semibold shadow-glow hover:shadow-primary/40 transition-all duration-300"
              >
                Create Account
              </Button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Right side - Branding */}
      <div className="hidden lg:flex w-1/2 relative bg-card overflow-hidden order-1 lg:order-2">
        <div className="absolute inset-0 bg-gradient-to-bl from-primary/20 to-background/90 z-10" />
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-end text-right p-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-end items-center gap-3 text-primary mb-8">
              <span className="font-display font-bold text-3xl text-foreground">
                Learn Code
              </span>
              <GraduationCap className="h-12 w-12" />
            </div>
            <h1 className="text-5xl font-display font-bold text-white mb-6 leading-tight">
              Empowering
              <br />
              <span className="text-gradient">students</span> globally.
            </h1>
            <p className="text-xl text-muted-foreground max-w-md ml-auto">
              Join thousands of creators using Learn Code to deliver premium
              educational experiences.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
