import { motion, type Variants } from "framer-motion";
import { Link } from "wouter";
import {
  GraduationCap,
  Code,
  Cloud,
  Database,
  Smartphone,
  ChevronRight,
  Play,
  Apple,
  Star,
  Users,
  Award,
} from "lucide-react";
import { Button } from "../components/ui/button";

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <GraduationCap className="h-8 w-8" />
            <span className="font-display font-bold text-xl text-foreground">
              Learn Code
            </span>
          </div>
          {/* <div className="flex gap-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-white"
              >
                Log In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="shadow-glow">Get Started</Button>
            </Link>
          </div> */}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background z-0" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight leading-tight">
              Master Technical Skills <br />
              <span className="text-gradient">Accelerate Your Career</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              The ultimate learning platform for software development, cloud
              engineering, data science, and more. Learn from industry experts
              and build real-world projects.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#download">
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg shadow-glow rounded-full cursor-pointer"
                >
                  Start Learning Today <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
              <a href="#download">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-lg rounded-full border-white/10 hover:bg-white/5 cursor-pointer"
                >
                  Download App
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Active Learners", value: "50K+", icon: Users },
              { label: "Expert Courses", value: "200+", icon: GraduationCap },
              { label: "Success Rate", value: "95%", icon: Award },
              { label: "Average Rating", value: "4.9/5", icon: Star },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <stat.icon className="h-8 w-8 text-primary mb-3 opacity-80" />
                <h3 className="text-3xl font-display font-bold text-foreground mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Explore Top Categories
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from our comprehensive library of cutting-edge technical
              courses designed to take you from beginner to professional.
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                title: "Software Development",
                desc: "Master full-stack web and mobile app development.",
                icon: Code,
                color: "text-blue-400",
                bg: "bg-blue-400/10",
              },
              {
                title: "Cloud Engineering",
                desc: "Learn AWS, Azure, GCP, and cloud architecture.",
                icon: Cloud,
                color: "text-sky-400",
                bg: "bg-sky-400/10",
              },
              {
                title: "Data Science",
                desc: "Dive into machine learning, AI, and big data.",
                icon: Database,
                color: "text-purple-400",
                bg: "bg-purple-400/10",
              },
              {
                title: "Mobile Development",
                desc: "Build native and cross-platform mobile apps.",
                icon: Smartphone,
                color: "text-pink-400",
                bg: "bg-pink-400/10",
              },
            ].map((category, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="glass-panel p-8 rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-300 group cursor-pointer"
              >
                <div
                  className={`p-4 rounded-xl ${category.bg} ${category.color} w-fit mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <category.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">{category.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {category.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Download App Section */}
      <section
        id="download"
        className="py-24 px-6 relative bg-gradient-to-t from-primary/5 to-background"
      >
        <div className="max-w-5xl mx-auto glass-panel rounded-3xl overflow-hidden border border-white/10 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 z-0" />
          <div className="relative z-10 p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="md:w-1/2 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Learn Anywhere, Anytime
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Download the Learn Code app to access courses offline, track
                your progress, and continue your learning journey on the go.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                <a
                  href="https://apps.apple.com/app/id123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-black/50 hover:bg-black border border-white/10 px-6 py-3 rounded-xl transition-all duration-300 w-full sm:w-auto justify-center"
                >
                  <Apple className="h-8 w-8" />
                  <div className="text-left">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider leading-none">
                      Download on the
                    </p>
                    <p className="font-semibold leading-tight">App Store</p>
                  </div>
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.yourcompany.learncode"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-black/50 hover:bg-black border border-white/10 px-6 py-3 rounded-xl transition-all duration-300 w-full sm:w-auto justify-center"
                >
                  <Play className="h-8 w-8" />
                  <div className="text-left">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider leading-none">
                      GET IT ON
                    </p>
                    <p className="font-semibold leading-tight">Google Play</p>
                  </div>
                </a>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="w-64 h-80 bg-gradient-to-tr from-primary to-purple-600 rounded-3xl shadow-2xl flex items-center justify-center p-1 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="w-full h-full bg-black rounded-[22px] overflow-hidden flex flex-col relative">
                  <div className="absolute top-0 left-0 right-0 h-6 bg-black z-20 flex justify-center">
                    <div className="w-20 h-4 bg-zinc-900 rounded-b-xl"></div>
                  </div>
                  <div className="flex-1 bg-[#0B1120] mt-2 rounded-t-xl p-4 flex flex-col gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-2">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div className="h-4 w-3/4 bg-white/10 rounded-full"></div>
                    <div className="h-4 w-1/2 bg-white/10 rounded-full"></div>
                    <div className="mt-4 space-y-3">
                      <div className="h-20 w-full bg-blue-500/20 rounded-xl border border-blue-500/30"></div>
                      <div className="h-20 w-full bg-purple-500/20 rounded-xl border border-purple-500/30"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-primary">
            <GraduationCap className="h-6 w-6" />
            <span className="font-display font-bold text-lg text-foreground">
              Learn Code
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Learn Code. All rights reserved.
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link
              href="/privacy-policy"
              className="hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms-and-conditions"
              className="hover:text-white transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/contacts"
              className="hover:text-white transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
