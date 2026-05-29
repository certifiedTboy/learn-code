import { DashboardLayout } from "../components/layout";
import { motion } from "framer-motion";
import { Users, BookOpen, Clock, TrendingUp, Plus } from "lucide-react";
import { Link } from "wouter";
import { Button } from "../components/ui/button";
import { useCourses } from "../hooks/use-courses";

export default function Dashboard() {
  const { courses } = useCourses();

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
      value: `$${totalRevenue?.toLocaleString()}`,
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

        {/* Stats Grid */}
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

        {/* Recent Courses Section */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-display font-bold">Recent Courses</h2>
            <Link
              href="/dashboard/courses"
              className="text-primary text-sm hover:underline"
            >
              View all
            </Link>
          </div>

          {courses?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses?.slice(0, 3)?.map((course) => (
                <motion.div
                  key={course.id}
                  whileHover={{ y: -5 }}
                  className="glass-panel rounded-2xl overflow-hidden group border border-white/5 hover:border-primary/30 transition-all duration-300 flex flex-col"
                >
                  <div className="h-40 bg-secondary/50 relative overflow-hidden">
                    {course?.image ? (
                      <img
                        src={course?.image}
                        alt={course?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-background">
                        <BookOpen className="w-12 h-12 text-muted-foreground/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                      <div className="flex gap-3">
                        <span className="px-2.5 py-1 bg-primary/90 text-primary-foreground text-xs font-semibold rounded-md backdrop-blur-md">
                          ${course?.price}
                        </span>

                        <span className="flex items-center text-xs gap-1">
                          <Clock className="w-3 h-3" />{" "}
                          {course.requiredDuration}w
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-xs text-white bg-black/50 px-2 py-1 rounded-md backdrop-blur-md">
                        <Users className="w-3 h-3" /> {course?.subscribers}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-display font-bold text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                      {course?.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                      {course?.description}
                    </p>
                    <div className="flex justify-between items-center pt-4 border-t border-border/50">
                      <span className="text-xs text-muted-foreground">
                        {course?.totalTopics} Topics
                      </span>
                      <Link href={`/dashboard/courses/${course.id}/edit`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs hover:bg-primary/20 hover:text-primary"
                        >
                          Edit Course
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-12 text-center flex flex-col items-center justify-center">
              <h3 className="text-xl font-display font-bold mb-2">
                No courses yet
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                You haven't created any educational content yet. Start building
                your platform by creating your first course.
              </p>
              <Link href="/dashboard/courses/new">
                <Button className="shadow-glow cursor-pointer">Create First Course</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
