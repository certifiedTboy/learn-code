import { motion } from "framer-motion";
import { Users, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function AdminCourseCard({ course }: { course: any }) {
  return (
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
              &#8358;{course?.price}
            </span>

            <span className="flex items-center text-xs gap-1">
              <Clock className="w-3 h-3" /> {course.requiredDuration}w
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
  );
}
