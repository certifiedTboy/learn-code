import { DashboardLayout } from "../components/layout";
import { motion } from "framer-motion";
import { Users, BookOpen, Clock, TrendingUp, Plus, Search } from "lucide-react";
import { Link } from "wouter";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useCourses } from "../hooks/use-courses";
import { useAuth } from "../hooks/use-auth";
import { AdminCourseCard } from "./courses/admin-course-card";
import { UserCourseCard } from "./courses/user-coruse-card";

export default function Dashboard() {
  const { courses } = useCourses();
  const { user } = useAuth();

  const totalCourses = courses?.length;
  const totalSubscribers = courses?.reduce(
    (acc, c) => acc + (c.subscribers || 0),
    0,
  );
  const avgRating = courses?.length
    ? (
        courses?.reduce((acc, c) => acc + (c.rating || 0), 0) / courses.length
      ).toFixed(1)
    : "0.0";
  const totalRevenue = courses?.reduce(
    (acc, c) => acc + (c.price || 0) * (c.subscribers || 0),
    0,
  );

  const stats = [
    {
      label: "Total Courses",
      value: totalCourses,
      icon: BookOpen,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Active Subscribers",
      value: totalSubscribers?.toLocaleString(),
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Average Rating",
      value: `${avgRating}/5.0`,
      icon: TrendingUp,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      label: "Est. Revenue",
      value: `₦ ${totalRevenue?.toLocaleString()}`,
      icon: Clock,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">
              Dashboard Overview
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your platform today.
            </p>
          </div>
          <Link href="/dashboard/courses/new" className="cursor-pointer">
            <Button className="shadow-glow cursor-pointer">
              <Plus className="w-4 h-4 mr-2" /> Create Course
            </Button>
          </Link>
        </div>

        <div className="glass-panel p-4 rounded-xl flex items-center gap-3">
          <Search className="w-5 h-5 text-muted-foreground ml-2" />
          <Input
            placeholder="Search courses..."
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 shadow-none text-base"
            // value={searchTerm}
            // onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Stats Grid */}
        {user && user?.role === "admin" && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                // @ts-ignore
                variants={item}
                className="glass-panel p-6 rounded-2xl flex items-start gap-4"
              >
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <h3 className="text-2xl font-display font-bold text-foreground mt-1">
                    {stat.value}
                  </h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Recent Courses Section */}
        <div className="mt-12">
          {user && user?.role === "admin" && (
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-display font-bold">Recent Courses</h2>
              <Link
                href="/dashboard/courses"
                className="text-primary text-sm hover:underline"
              >
                View all
              </Link>
            </div>
          )}

          {courses?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {user &&
                user?.role === "admin" &&
                courses &&
                courses?.length > 0 &&
                courses
                  ?.slice(0, 3)
                  ?.map((course) => (
                    <AdminCourseCard key={course.id} course={course} />
                  ))}

              {user &&
                user?.role === "user" &&
                courses &&
                courses?.length > 0 &&
                courses?.map((course) => (
                  <UserCourseCard key={course.id} course={course} />
                ))}
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-12 text-center flex flex-col items-center justify-center">
              <h3 className="text-xl font-display font-bold mb-2">
                No courses yet
              </h3>
              {user && user?.role === "admin" && (
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  You haven't created any educational content yet. Start
                  building your platform by creating your first course.
                </p>
              )}
              {user && user?.role === "admin" && (
                <Link href="/dashboard/courses/new">
                  <Button className="shadow-glow cursor-pointer">
                    Create First Course
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
