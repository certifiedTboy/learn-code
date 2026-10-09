import { useState } from "react";
import { DashboardLayout } from "../../components/layout";
import { Link } from "wouter";
import { AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useCourses } from "../../hooks/use-courses";
import { RegistereCourseCard } from "./registered-course-card";

export default function RegisteredCourses() {
  const { registeredCourses } = useCourses();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCourses = registeredCourses?.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">My Courses</h1>
            <p className="text-muted-foreground mt-1">
              View and manage your registered courses.
            </p>
          </div>
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
                <RegistereCourseCard {...course} key={course?._id} />
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
    </DashboardLayout>
  );
}
