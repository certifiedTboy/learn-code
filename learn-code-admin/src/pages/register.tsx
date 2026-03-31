import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import {
  GraduationCap,
  ArrowLeft,
  Mail,
  Lock,
  User as UserIcon,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const [, setLocation] = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (_data: RegisterFormValues) => {
    setLocation("/dashboard");
  };

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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      {...register("name")}
                      placeholder="John Doe"
                      className="pl-10 bg-background/50 border-white/10 focus:border-primary/50 focus:ring-primary/20"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      {...register("email")}
                      placeholder="admin@example.com"
                      className="pl-10 bg-background/50 border-white/10 focus:border-primary/50 focus:ring-primary/20"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      {...register("password")}
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 bg-background/50 border-white/10 focus:border-primary/50 focus:ring-primary/20"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold shadow-glow hover:shadow-primary/40 transition-all duration-300"
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
