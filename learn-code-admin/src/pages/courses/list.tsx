import { useEffect, useState } from "react";
import { DashboardLayout } from "../../components/layout";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Search,
  Users,
  Clock,
  BookOpen,
  Star,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import Loader from "../../components/ui/loader";
import { useDeleteCourseMutation } from "../../lib/apis/course-apis";
import { useToast } from "../../hooks/use-toast";
import { useCourses } from "../../hooks/use-courses";

export default function CoursesList() {
  const [deleteCourse, { isLoading, isSuccess, error, isError }] =
    useDeleteCourseMutation();
  const { courses, deleteCourse: deleteLocalCourse } = useCourses();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredCourses = courses?.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDelete = () => {
    if (!deleteId) return;
    deleteCourse(deleteId);
  };

  useEffect(() => {
    if (isSuccess) {
      deleteLocalCourse(deleteId!);
      toast({ title: "Course deleted successfully" });
      setDeleteId(null);
    }

    if (isError) {
      const message =
        error && "data" in error
          ? (error.data as any)?.message
          : "Something went wrong";
      toast({
        variant: "destructive",
        title: message,
      });
    }
  }, [isSuccess, isError]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Manage Courses</h1>
            <p className="text-muted-foreground mt-1">
              Create, edit, and organize your educational content.
            </p>
          </div>
          <Link href="/dashboard/courses/new" className="cursor-pointer">
            <Button className="shadow-glow cursor-pointer">
              <Plus className="w-4 h-4 mr-2" /> New Course
            </Button>
          </Link>
        </div>

        <div className="glass-panel p-4 rounded-xl flex items-center gap-3">
          <Search className="w-5 h-5 text-muted-foreground ml-2" />
          <Input
            placeholder="Search courses..."
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 shadow-none text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredCourses?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredCourses?.map((course) => (
                <motion.div
                  key={course?.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="glass-panel rounded-2xl overflow-hidden group border border-white/5 hover:border-primary/30 transition-all duration-300 flex flex-col"
                >
                  <div className="h-48 relative overflow-hidden bg-secondary">
                    {course?.image ? (
                      <img
                        src={course.image}
                        alt={course.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-background">
                        <BookOpen className="w-12 h-12 text-muted-foreground/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent" />

                    <div className="absolute top-3 right-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 bg-black/40 backdrop-blur-md hover:bg-black/60 text-white rounded-full"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-40 border-white/10 bg-card/95 backdrop-blur-xl"
                        >
                          <Link href={`/courses/${course.id}`}>
                            <DropdownMenuItem className="cursor-pointer">
                              <BookOpen className="w-4 h-4 mr-2" /> View
                            </DropdownMenuItem>
                          </Link>
                          <Link href={`/dashboard/courses/${course.id}/edit`}>
                            <DropdownMenuItem className="cursor-pointer">
                              <Edit className="w-4 h-4 mr-2" /> Edit
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem
                            className="text-destructive focus:bg-destructive/10 cursor-pointer"
                            onClick={() => setDeleteId(course.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="font-display font-bold text-xl text-white mb-1 line-clamp-1 shadow-black drop-shadow-md">
                        {course.name}
                      </h3>
                      <div className="flex items-center gap-3 text-xs font-medium text-white/80">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />{" "}
                          {course.rating || "0.0"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />{" "}
                          {course.requiredDuration}w
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" /> {course.subscribers}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1 bg-card/40">
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="font-display font-bold text-lg text-primary">
                        &#8358;{course.price}
                      </div>
                      <div className="text-xs bg-secondary px-2.5 py-1 rounded-md text-secondary-foreground border border-white/5">
                        {course.totalTopics} Topics
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-16 text-center flex flex-col items-center justify-center border-dashed border-2 border-border">
            <Search className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-display font-bold mb-2">
              No courses found
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              {searchTerm
                ? "Try adjusting your search terms."
                : "You haven't created any courses yet."}
            </p>
            {!searchTerm && (
              <Link href="/dashboard/courses/new">
                <Button className="shadow-glow cursor-pointer">
                  Create Course
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        {isLoading && <Loader />}
        <AlertDialogContent className="glass-panel border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This action cannot be undone. This will permanently delete the
              course and all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-secondary/50 border-0 hover:bg-secondary">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Delete Course
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
