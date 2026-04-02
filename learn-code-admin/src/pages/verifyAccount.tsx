import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { GraduationCap, ArrowLeft, Lock } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { accountVerificationSchema } from "../helpers/data-validator-schema";
import useForm from "../hooks/useForm";
import { useVerifyAdminAccountMutation } from "../lib/apis/auth-apis";
import { useEffect } from "react";

export default function VerifyAccount() {
  const [, setLocation] = useLocation();
  const [
    verifyAdminAccount,
    { isLoading, error: errorResponse, isSuccess, isError, data: responseData },
  ] = useVerifyAdminAccountMutation();

  const { toast } = useToast();

  const {
    error,
    handleInputChange,
    handlePasswordTypeChange,
    inputType,
    formData,
  } = useForm(accountVerificationSchema);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (Object.values(error)[0]) return;

    verifyAdminAccount({
      ...formData,
      action: "ACCOUNT_VERIFICATION",
      verificationCode: formData.verificationCode.slice(0, 5),
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
              Verify Acount
            </h2>
            <p className="text-muted-foreground">Verify your account</p>
          </div>

          <div className="glass-panel p-8 rounded-2xl">
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Verification Code
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      onChange={handleInputChange}
                      type={inputType.confirmPasswordType}
                      placeholder="••••••"
                      name="verificationCode"
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
                  {error?.field === "verificationCode" && (
                    <p className="text-xs text-destructive">{error?.message}</p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full cursor-pointer h-12 text-base font-semibold shadow-glow hover:shadow-primary/40 transition-all duration-300"
              >
                Verify Account
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
                LearnOS
              </span>
              <GraduationCap className="h-12 w-12" />
            </div>
            <h1 className="text-5xl font-display font-bold text-white mb-6 leading-tight">
              Empower your <br />
              <span className="text-gradient">students</span> globally.
            </h1>
            <p className="text-xl text-muted-foreground max-w-md ml-auto">
              Join thousands of creators using LearnOS to deliver premium
              educational experiences.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
