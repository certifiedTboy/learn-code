import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  FileText,
  PlayCircle,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useHistoryState } from "wouter/use-browser-location";
import { DashboardLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { useCourses } from "@/hooks/use-courses";
import type { RootState } from "@/redux/store/store";
import {
  getLessonState,
  parseHttpUrl,
  getYoutubeEmbedUrl,
  getGoogleDocsEmbedUrl,
} from "@/helpers/course";

export function UserCourseContent() {
  const [tempCourseCompleted, setTempCourseCompleted] = useState(false);
  const { currentUser } = useSelector((state: RootState) => state.authState);
  const { getRegisteredCourse, markTopicAsCompleted } = useCourses();
  const historyState = useHistoryState<unknown>();
  const lesson = getLessonState(historyState);

  const [location, setLocation] = useLocation();

  const courseId = location && location?.split("/")[3];
  const course = courseId ? getRegisteredCourse(courseId) : undefined;
  const lessons =
    course?.contents.flatMap((section) =>
      section.subTopics.map((topic) => ({
        mainTopic: section.mainTopic,
        topic,
      })),
    ) ?? [];
  const currentLessonIndex = lesson
    ? lessons.findIndex(
        ({ mainTopic, topic }) =>
          mainTopic === lesson.mainTopic &&
          topic.title === lesson.mainContent.title &&
          topic.contentURI === lesson.mainContent.contentURI,
      )
    : -1;

  const originalUrl = lesson
    ? parseHttpUrl(lesson.mainContent.contentURI)
    : null;
  const embedUrl = lesson
    ? lesson.mainContent.isVideo
      ? getYoutubeEmbedUrl(lesson.mainContent.contentURI)
      : getGoogleDocsEmbedUrl(lesson.mainContent.contentURI)
    : null;

  useEffect(() => {
    setTempCourseCompleted(lesson?.mainContent.isCompleted ?? false);
  }, [
    lesson?.courseId,
    lesson?.mainTopic,
    lesson?.mainContent.contentURI,
    lesson?.mainContent.isCompleted,
    lesson?.mainContent.title,
  ]);

  function navigateToLesson(index: number) {
    const nextLesson = lessons[index];
    if (!nextLesson || !lesson) return;

    const nextCourseId = course?.id ?? course?._id ?? lesson.courseId;
    setLocation(
      `/dashboard/my-courses/${nextCourseId}/content/?title=${encodeURIComponent(nextLesson.topic.title)}`,
      {
        state: {
          mainTopic: nextLesson.mainTopic,
          courseId: nextCourseId,
          mainContent: {
            title: nextLesson.topic.title,
            contentURI: nextLesson.topic.contentURI,
            isVideo: nextLesson.topic.isVideo,
            isCompleted: nextLesson.topic.isCompleted,
          },
          courseName: course?.name ?? lesson.courseName,
        },
      },
    );
  }

  async function handleMarkTopicAsComplted(
    courseId: string,
    mainTopic: string,
    title: string,
  ) {
    const result = await markTopicAsCompleted(courseId, mainTopic, title);
    //  @ts-ignore
    if (result?.success) {
      setTempCourseCompleted(true);
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-6 pb-12">
        {currentUser && currentUser?.role === "admin" && (
          <Link
            href={courseId ? `/courses/${courseId}` : "/dashboard/courses"}
            className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {lesson?.courseName || "Courses"}
          </Link>
        )}

        {currentUser && currentUser?.role === "user" && (
          <Link
            href={
              courseId
                ? `/dashboard/my-courses/${courseId}`
                : "/dashboard/my-courses"
            }
            className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {lesson?.courseName || "Courses"}
          </Link>
        )}

        {lesson ? (
          <>
            <header className="glass-panel rounded-2xl border border-white/10 p-6 sm:p-8">
              <p className="mb-2 text-sm font-medium text-primary">
                {lesson.courseName}
              </p>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Course module
              </p>
              <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                {lesson.mainTopic}
              </h1>
              <p className="mt-3 flex items-center gap-2 text-muted-foreground">
                {lesson.mainContent.isVideo ? (
                  <PlayCircle className="h-4 w-4 shrink-0 text-blue-400" />
                ) : (
                  <FileText className="h-4 w-4 shrink-0 text-primary" />
                )}
                {lesson.mainContent.title}
              </p>
            </header>

            <section className="glass-panel overflow-hidden rounded-2xl border border-white/10">
              {embedUrl ? (
                lesson.mainContent.isVideo ? (
                  <div className="aspect-video w-full bg-black">
                    <iframe
                      src={embedUrl}
                      title={lesson.mainContent.title}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  </div>
                ) : (
                  <div className="h-[70vh] min-h-[480px] w-full bg-background">
                    <iframe
                      src={embedUrl}
                      title={lesson.mainContent.title}
                      className="h-full w-full border-0"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                )
              ) : (
                <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-8 text-center">
                  <p className="font-semibold text-foreground">
                    {originalUrl
                      ? "This link can't be embedded as the selected content type."
                      : "This lesson doesn't have a valid content link."}
                  </p>
                  <p className="max-w-xl text-sm text-muted-foreground">
                    {lesson.mainContent.isVideo
                      ? "Use a valid YouTube video link for video lessons."
                      : "Use a Google Docs document link for document lessons."}
                  </p>
                  {originalUrl && <>{lesson?.mainContent?.isCompleted}</>}
                </div>
              )}

              {currentUser &&
                currentUser?.role === "user" &&
                embedUrl &&
                originalUrl && (
                  <div className="flex flex-wrap items-center justify-end gap-3 border-t border-white/10 px-4 py-3 sm:px-6">
                    {!tempCourseCompleted ? (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setTempCourseCompleted(true);
                          handleMarkTopicAsComplted(
                            lesson?.courseId,
                            lesson?.mainTopic,
                            lesson?.mainContent?.title,
                          );
                        }}
                      >
                        <a href="#">Mark as completed</a>
                      </Button>
                    ) : (
                      <Button asChild variant="outline" size="sm">
                        <a href="#">Completed</a>
                      </Button>
                    )}
                  </div>
                )}
            </section>

            {currentLessonIndex >= 0 && (
              <nav
                aria-label="Lesson navigation"
                className="flex flex-wrap items-center justify-between gap-3"
              >
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer"
                  disabled={currentLessonIndex === 0}
                  onClick={() => navigateToLesson(currentLessonIndex - 1)}
                >
                  <ChevronLeft aria-hidden="true" />
                  Previous lesson
                </Button>
                <p className="text-sm text-muted-foreground" aria-live="polite">
                  Lesson {currentLessonIndex + 1} of {lessons.length}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer"
                  disabled={currentLessonIndex === lessons.length - 1}
                  onClick={() => navigateToLesson(currentLessonIndex + 1)}
                >
                  Next lesson
                  <ChevronRight aria-hidden="true" />
                </Button>
              </nav>
            )}
          </>
        ) : (
          <section className="glass-panel rounded-2xl border border-white/10 p-8 text-center">
            <h1 className="font-display text-2xl font-bold text-foreground">
              Lesson unavailable
            </h1>
            <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
              Lesson details weren't provided. Return to the course and select a
              lesson to view its content.
            </p>
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}
