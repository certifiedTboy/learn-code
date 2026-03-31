import { useRoute, Link } from "wouter";
import {
  ArrowLeft,
  Clock,
  Users,
  BookOpen,
  Star,
  PlayCircle,
  FileText,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { DashboardLayout } from "../../components/layout";
import { useCourses } from "../../hooks/use-courses";

export default function CourseView() {
  const [, params] = useRoute("/courses/:id");
  const courseId = params?.id;
  const { getCourse } = useCourses();
  const course = courseId ? getCourse(courseId) : undefined;

  if (!course) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold">Course not found</h2>
          <p className="text-muted-foreground mt-2 mb-6">
            The course you're looking for doesn't exist.
          </p>
          <Link href="/dashboard/courses">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8 pb-20">
        <Link
          href="/dashboard/courses"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>

        {/* Hero Section */}
        <div className="glass-panel rounded-3xl overflow-hidden relative border border-white/10 shadow-2xl shadow-black/50">
          <div className="h-64 sm:h-80 relative">
            {course.image ? (
              <img
                src={course.image}
                alt={course.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-secondary to-background flex items-center justify-center">
                <BookOpen className="w-24 h-24 text-white/5" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>

          <div className="px-6 sm:px-10 pb-10 relative -mt-20">
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-sm text-white font-medium">
                <BookOpen className="w-4 h-4 text-primary" />{" "}
                {course.totalTopics}+ Topics
              </div>
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-sm text-white font-medium">
                <Users className="w-4 h-4 text-blue-400" /> {course.subscribers}{" "}
                Subscribers
              </div>
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-sm text-white font-medium">
                <Clock className="w-4 h-4 text-purple-400" />{" "}
                {course.requiredDuration}+ Weeks
              </div>
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-sm text-white font-medium">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />{" "}
                {course.rating}
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-4 leading-tight">
              {course.name}
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
              {course.description}
            </p>
          </div>
        </div>

        {/* Course Content Accordion */}
        <div className="mt-12">
          <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3">
            Course Curriculum
            <span className="text-sm font-normal px-3 py-1 bg-primary/20 text-primary rounded-full">
              {course.contents?.length || 0} Sections
            </span>
          </h2>

          {course.contents && course.contents.length > 0 ? (
            <div className="glass-panel rounded-2xl overflow-hidden">
              <Accordion type="single" collapsible className="w-full">
                {course.contents.map((section, idx) => (
                  <AccordionItem
                    value={`item-${idx}`}
                    key={idx}
                    className="border-border/50 px-6"
                  >
                    <AccordionTrigger className="hover:no-underline py-6 text-left">
                      <div className="flex flex-col md:flex-row md:items-center justify-between w-full pr-4 gap-2">
                        <div>
                          <span className="text-sm font-semibold text-primary uppercase tracking-wider mb-1 block">
                            Section {idx + 1}
                          </span>
                          <h3 className="text-lg font-bold">
                            {section.mainTopic}
                          </h3>
                        </div>
                        <span className="text-sm text-muted-foreground font-normal">
                          {section.subTopics?.length || 0} lessons
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <p className="text-muted-foreground mb-6">
                        {section.description}
                      </p>

                      <div className="space-y-3">
                        {section.subTopics?.map((topic, topicIdx) => (
                          <div
                            key={topicIdx}
                            className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-white/5 hover:border-primary/30 transition-colors group cursor-pointer"
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`p-2 rounded-lg ${topic.isVideo ? "bg-blue-500/10 text-blue-400" : "bg-primary/10 text-primary"}`}
                              >
                                {topic.isVideo ? (
                                  <PlayCircle className="w-5 h-5" />
                                ) : (
                                  <FileText className="w-5 h-5" />
                                )}
                              </div>
                              <span className="font-medium group-hover:text-primary transition-colors">
                                {topic.title}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-12 text-center text-muted-foreground">
              No curriculum content has been added to this course yet.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
