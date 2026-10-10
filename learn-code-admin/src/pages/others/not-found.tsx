import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background px-6 py-16">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

      <motion.main
        className="relative z-10 w-full max-w-2xl text-center"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-glow">
          <BookOpen className="h-8 w-8" />
        </div>

        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
          Lost in the lesson?
        </p>
        <h1 className="mt-3 font-display text-8xl font-extrabold leading-none text-gradient sm:text-9xl">
          404
        </h1>
        <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
          This page isn&apos;t in the curriculum.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-muted-foreground">
          The page may have moved, or the link might be out of date. Let&apos;s
          get you back to learning and creating.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild className="h-12 gap-2 px-6 font-semibold shadow-glow">
            <Link href="/">
              <GraduationCap className="h-5 w-5" />
              Back to Learn Code
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 gap-2 border-white/10 px-6 font-semibold"
          >
            <Link href="/login">
              Sign in <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to the homepage
        </Link>
      </motion.main>
    </div>
  );
}
