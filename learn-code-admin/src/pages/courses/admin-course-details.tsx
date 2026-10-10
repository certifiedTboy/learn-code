import { useRoute, Link, useLocation } from "wouter";
import {
  ArrowLeft,
  BadgeCheck,
  BookOpen,
  CalendarDays,
  Clock,
  CircleDollarSign,
  FileText,
  PlayCircle,
  Star,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DashboardLayout } from "@/components/layout";
import { useCourses } from "@/hooks/use-courses";
import { useAuth } from "@/hooks/use-auth";

export default function AdminCourseDetails() {
  const [, params] = useRoute("/courses/:id");
  const [, setLocation] = useLocation();

  const { user } = useAuth();
  const courseId = params?.id;
  const { getCourse, getRegisteredCourse } = useCourses();
  const course = courseId ? getCourse(courseId) : undefined;

  const registeredCourse = courseId ? getRegisteredCourse(courseId) : undefined;

  if (!course) {
    return (
      <DashboardLayout>
        <div className="py-20 text-center">
          <h2 className="text-2xl font-bold">Course not found</h2>
          <p className="mb-6 mt-2 text-muted-foreground">
            The course you're looking for doesn't exist.
          </p>
          <Link href="/dashboard/courses" className="cursor-pointer">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const contents = course.contents ?? [];
  const skills = Array.isArray(course.skills)
    ? course.skills
    : course.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
  const price = Number(course.price);
  const formattedPrice = Number.isFinite(price)
    ? price.toLocaleString("en-NG")
    : course.price;
  const updatedAt = course.updatedAt ? new Date(course.updatedAt) : null;
  const lessonCount = contents.reduce(
    (total, section) => total + (section.subTopics?.length ?? 0),
    0,
  );
  const canViewLessons = user?.role === "admin";

  const openLesson = (
    mainTopic: string,
    topic: (typeof contents)[number]["subTopics"][number],
  ) => {
    if (!canViewLessons || !courseId) return;

    setLocation(
      `/courses/${courseId}/content/?title=${encodeURIComponent(topic.title)}`,
      {
        state: {
          mainTopic,
          mainContent: {
            title: topic.title,
            contentURI: topic.contentURI,
            isVideo: topic.isVideo,
            isCompleted: topic.isCompleted ?? false,
          },
          courseName: course.name,
        },
      },
    );
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-8 pb-20">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <header className="glass-panel relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/50">
          <div className="relative h-64 sm:h-80">
            {course.image ? (
              <img
                src={course.image}
                alt={course.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-background">
                <BookOpen className="h-24 w-24 text-white/10" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>

          <div className="relative -mt-20 px-6 pb-8 sm:px-10 sm:pb-10">
            <div className="mb-6 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                <BookOpen className="h-4 w-4 text-primary" />
                {course.totalTopics} topics
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                <Users className="h-4 w-4 text-blue-400" />
                {course.subscribers} subscribers
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                <Clock className="h-4 w-4 text-purple-400" />
                {course.requiredDuration} weeks
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {course.rating} rating
              </div>
            </div>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                  Course overview
                </p>
                <h1 className="mb-4 font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
                  {course.name}
                </h1>
                <p className="max-w-3xl whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
                  {course.description}
                </p>
                <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  Last updated{" "}
                  {updatedAt && !Number.isNaN(updatedAt.getTime())
                    ? updatedAt.toLocaleDateString("en-NG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "date unavailable"}
                </p>
              </div>
              <div className="shrink-0 rounded-2xl border border-primary/20 bg-primary/10 px-5 py-4 sm:text-right">
                <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground sm:justify-end">
                  <CircleDollarSign className="h-4 w-4 text-primary" />
                  Course price
                </div>
                <p className="text-2xl font-bold text-foreground">
                  ₦{formattedPrice}
                </p>
              </div>
            </div>
          </div>
        </header>

        <section aria-label="Course statistics">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="glass-panel rounded-2xl border border-white/10 p-5">
              <p className="text-sm text-muted-foreground">
                Curriculum sections
              </p>
              <p className="mt-2 text-3xl font-bold">{contents.length}</p>
            </div>
            <div className="glass-panel rounded-2xl border border-white/10 p-5">
              <p className="text-sm text-muted-foreground">Lessons</p>
              <p className="mt-2 text-3xl font-bold">{lessonCount}</p>
            </div>
            <div className="glass-panel rounded-2xl border border-white/10 p-5">
              <p className="text-sm text-muted-foreground">Students enrolled</p>
              <p className="mt-2 text-3xl font-bold">{course.subscribers}</p>
            </div>
            <div className="glass-panel rounded-2xl border border-white/10 p-5">
              <p className="text-sm text-muted-foreground">Average rating</p>
              <p className="mt-2 flex items-center gap-2 text-3xl font-bold">
                <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                {course.rating}
              </p>
            </div>
          </div>
        </section>

        {skills.length > 0 && (
          <section className="glass-panel rounded-2xl border border-white/10 p-6 sm:p-8">
            <div className="mb-5 flex items-center gap-3">
              <BadgeCheck className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-bold">
                Skills you’ll gain
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mb-1 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                What you’ll learn
              </p>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">
                Course curriculum
              </h2>
            </div>
            <span className="rounded-full bg-primary/20 px-3 py-1 text-sm text-primary">
              {contents.length} sections · {lessonCount} lessons
            </span>
          </div>

          {contents.length > 0 ? (
            <div className="glass-panel overflow-hidden rounded-2xl border border-white/10">
              <Accordion type="single" collapsible className="w-full">
                {contents.map((section, sectionIndex) => (
                  <AccordionItem
                    value={`section-${sectionIndex}`}
                    key={`${section.mainTopic}-${sectionIndex}`}
                    className="border-border/50 px-5 sm:px-7"
                  >
                    <AccordionTrigger className="py-6 text-left hover:no-underline">
                      <div className="flex w-full flex-col gap-3 pr-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-primary">
                            Section {String(sectionIndex + 1).padStart(2, "0")}
                          </span>
                          <h3 className="text-lg font-bold text-foreground">
                            {section.mainTopic}
                          </h3>
                        </div>
                        <span className="text-sm font-normal text-muted-foreground">
                          {section.subTopics?.length ?? 0} lessons
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      {section.description && (
                        <p className="mb-5 whitespace-pre-line leading-relaxed text-muted-foreground">
                          {section.description}
                        </p>
                      )}

                      {section.subTopics?.length ? (
                        <ol className="space-y-3">
                          {section.subTopics.map((topic, topicIndex) => (
                            <li
                              key={`${topic.title}-${topicIndex}`}
                              className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-background/50 p-4 transition-colors hover:border-primary/30"
                            >
                              <div className="flex min-w-0 items-center gap-4">
                                <span className="w-6 shrink-0 text-sm tabular-nums text-muted-foreground">
                                  {String(topicIndex + 1).padStart(2, "0")}
                                </span>
                                <div
                                  className={`shrink-0 rounded-lg p-2 ${topic.isVideo ? "bg-blue-500/10 text-blue-400" : "bg-primary/10 text-primary"}`}
                                >
                                  {topic.isVideo ? (
                                    <PlayCircle className="h-5 w-5" />
                                  ) : (
                                    <FileText className="h-5 w-5" />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="truncate font-medium text-foreground">
                                    {topic.title}
                                  </p>
                                  <p className="mt-1 text-xs text-muted-foreground">
                                    {topic.isVideo
                                      ? "Video lesson"
                                      : "Reading material"}
                                  </p>
                                </div>
                              </div>
                              {user && user?.role === "admin" && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  disabled={!canViewLessons}
                                  onClick={() =>
                                    openLesson(section.mainTopic, topic)
                                  }
                                  className="shrink-0"
                                >
                                  View lesson
                                </Button>
                              )}
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <p className="rounded-xl bg-background/50 p-4 text-sm text-muted-foreground">
                          No lessons have been added to this section yet.
                        </p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl border border-white/10 p-12 text-center">
              <BookOpen className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
              <h3 className="font-semibold text-foreground">
                Curriculum coming soon
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No curriculum content has been added to this course yet.
              </p>
            </div>
          )}

          {user && user?.role === "user" && (
            <div className="sticky bottom-0 z-30 -mx-4 border-y border-white/10 bg-background/85 px-4 py-3 shadow-lg backdrop-blur-xl md:-mx-8 md:px-8">
              <div className="flex max-w-8 gap-3">
                {!registeredCourse ? (
                  <Button
                    onClick={() =>
                      setLocation(`/dashboard/my-courses/${courseId}/payment`)
                    }
                    type="button"
                    variant="outline"
                    className="h-12 flex-1 cursor-pointer rounded-xl border-primary/40 bg-primary/5 text-sm font-semibold text-primary hover:bg-primary/10 sm:text-base"
                  >
                    <CircleDollarSign className="h-4 w-4" />
                    Enroll to course
                  </Button>
                ) : registeredCourse && !registeredCourse?.isExpired ? (
                  <Button
                    onClick={() =>
                      setLocation(`/dashboard/my-courses/${courseId}`)
                    }
                    type="button"
                    className="h-12 cursor-pointer flex-1 rounded-xl text-sm font-semibold shadow-glow sm:text-base"
                  >
                    <BookOpen className="h-4 w-4" />
                    Continue Learning
                  </Button>
                ) : (
                  <Button
                    onClick={() =>
                      setLocation(`/dashboard/my-courses/${courseId}/payment`)
                    }
                    type="button"
                    variant="outline"
                    className="h-12 flex-1 cursor-pointer rounded-xl border-primary/40 bg-primary/5 text-sm font-semibold text-primary hover:bg-primary/10 sm:text-base"
                  >
                    <CircleDollarSign className="h-4 w-4" />
                    Renew subscription
                  </Button>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
