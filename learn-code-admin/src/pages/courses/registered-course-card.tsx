import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { BookOpen, Star, Clock, Users } from "lucide-react";
import type { Course } from "@/lib/mock-data";
import { Progress } from "@/components/ui/progress";

export function RegistereCourseCard({
  id,
  image,
  name,
  rating,
  requiredDuration,
  subscribers,
  description,
  totalTopics,
  completion,
}: Course) {
  const [, setLocation] = useLocation();
  const completionValue = Number.parseFloat(completion ?? "0");
  const progressValue = Number.isFinite(completionValue)
    ? Math.min(100, Math.max(0, completionValue))
    : 0;

  return (
    <motion.div
      onClick={() => setLocation(`/dashboard/my-courses/${id}`)}
      key={id}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="glass-panel cursor-pointer rounded-2xl overflow-hidden group border border-white/5 hover:border-primary/30 transition-all duration-300 flex flex-col"
    >
      <div className="h-48 relative overflow-hidden bg-secondary">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-background">
            <BookOpen className="w-12 h-12 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent" />

        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="font-display font-bold text-xl text-white mb-1 line-clamp-1 shadow-black drop-shadow-md">
            {name}
          </h3>
          <div className="flex items-center gap-3 text-xs font-medium text-white/80">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />{" "}
              {rating || "0.0"}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {requiredDuration}w
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" /> {subscribers}
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 bg-card/40">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
          {description}
        </p>

        <div className="mb-4 rounded-xl border border-primary/15 bg-primary/5 p-3.5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Course progress
            </span>
            <span className="font-display text-sm font-bold text-primary">
              {completion || "0%"}
            </span>
          </div>
          <Progress
            value={progressValue}
            aria-label={`${name} completion`}
            className="h-2 bg-primary/10"
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="text-xs bg-secondary px-2.5 py-1 rounded-md text-secondary-foreground border border-white/5">
            {totalTopics} Topics
          </div>
        </div>
      </div>
    </motion.div>
  );
}
