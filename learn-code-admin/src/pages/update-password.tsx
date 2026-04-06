import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { GraduationCap, ArrowRight, Lock } from "lucide-react";
import { Button } from "../components/ui/button";
import Loader from "../components/ui/loader";
import { useToast } from "../hooks/use-toast";
import useForm from "../hooks/useForm";
import { Input } from "../components/ui/input";
import { updatePasswordResetSchema } from "../helpers/data-validator-schema";
import { useUpdatePasscodeMutation } from "../lib/apis/auth-apis";

export default function UpdatePassword() {
  const {
    formData,
    error,
    handleInputChange,
    handlePasswordTypeChange,
    inputType,
  } = useForm(updatePasswordResetSchema);
  const [, setLocation] = useLocation();

  const { toast } = useToast();

  const [
    updatePasscode,
    { isLoading, error: errorResponse, isSuccess, isError },
  ] = useUpdatePasscodeMutation();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (Object.values(error)[0]) return;
    updatePasscode({
      ...formData,
      passwordResetCode: formData.passwordResetCode.slice(0, 5),
    });
  };

  useEffect(() => {
    if (isSuccess) {
      setLocation("/login");
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
  }, [isSuccess, isError]);

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left side - Branding */}
      <div className="hidden lg:flex w-1/2 relative bg-card overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background/90 z-10" />
        <div className="absolute inset-0 z-20 flex flex-col justify-center p-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 text-primary mb-8">
              <GraduationCap className="h-12 w-12" />
              <span className="font-display font-bold text-3xl text-foreground">
                LearnOS
              </span>
            </div>
            <h1 className="text-5xl font-display font-bold text-white mb-6 leading-tight">
              Manage your <br />
              <span className="text-gradient">educational content</span> <br />
              with precision.
            </h1>
            <p className="text-xl text-muted-foreground max-w-md">
              The professional platform for creators to build, scale, and
              analyze their online courses.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
        <div className="absolute top-8 right-8">
          <Link
            href="/register"
            className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
          >
            Don't have an account? <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <motion.div
          className="w-full max-w-md space-y-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-display font-bold tracking-tight mb-2">
              Reset Password
            </h2>
            <p className="text-muted-foreground">
              Provide your email to reset your password
            </p>
          </div>

          <div className="glass-panel p-8 rounded-2xl">
            {isLoading && <Loader />}

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Password Reset Code
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      onChange={handleInputChange}
                      name="passwordResetCode"
                      placeholder="123456"
                      className="pl-10 bg-background/50 border-white/10 focus:border-primary/50 focus:ring-primary/20"
                    />
                  </div>
                  {error.field === "passwordResetCode" && (
                    <p className="text-xs text-destructive">{error.message}</p>
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
                      type={inputType.passwordType}
                      name="password"
                      placeholder="••••••••"
                      className="pl-10 bg-background/50 border-white/10 focus:border-primary/50 focus:ring-primary/20"
                    />

                    <span
                      onClick={() => handlePasswordTypeChange("passwordType")}
                      className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                    >
                      {inputType.passwordType === "password" ? "👁️" : "🙈"}
                    </span>
                  </div>
                  {error.field === "password" && (
                    <p className="text-xs text-destructive">{error.message}</p>
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
                      name="confirmPassword"
                      placeholder="••••••••"
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
                  {error.field === "confirmPassword" && (
                    <p className="text-xs text-destructive">{error.message}</p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full cursor-pointer h-12 text-base font-semibold shadow-glow hover:shadow-primary/40 transition-all duration-300"
              >
                Update Password
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
