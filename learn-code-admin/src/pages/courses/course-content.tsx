import { ArrowLeft, FileText, PlayCircle } from "lucide-react";
import { Link, useRoute } from "wouter";
import { DashboardLayout } from "../../components/layout";
import { Button } from "../../components/ui/button";

type MainContent = {
  title: string;
  contentURI: string;
  isVideo: boolean;
};

type LessonState = {
  courseName: string;
  mainTopic: string;
  mainContent: MainContent;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getLessonState(value: unknown): LessonState | null {
  if (!isRecord(value) || !isRecord(value.mainContent)) {
    return null;
  }

  const { courseName, mainTopic, mainContent } = value;
  const { title, contentURI, isVideo } = mainContent;

  if (
    typeof courseName !== "string" ||
    typeof mainTopic !== "string" ||
    typeof title !== "string" ||
    typeof contentURI !== "string" ||
    typeof isVideo !== "boolean"
  ) {
    return null;
  }

  return {
    courseName,
    mainTopic,
    mainContent: { title, contentURI, isVideo },
  };
}

function parseHttpUrl(value: string): URL | null {
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
}

function getYoutubeEmbedUrl(value: string): string | null {
  const url = parseHttpUrl(value);
  if (!url) return null;

  const host = url.hostname.toLowerCase();
  const isShortLink = host === "youtu.be";
  const isYoutube =
    host === "youtube.com" ||
    host === "www.youtube.com" ||
    host === "m.youtube.com" ||
    host === "music.youtube.com" ||
    host === "youtube-nocookie.com" ||
    host === "www.youtube-nocookie.com";

  if (!isShortLink && !isYoutube) return null;

  let videoId: string | null = null;
  if (isShortLink) {
    videoId = url.pathname.split("/").filter(Boolean)[0] ?? null;
  } else if (url.pathname === "/watch") {
    videoId = url.searchParams.get("v");
  } else {
    videoId =
      url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1] ?? null;
  }

  if (!videoId || !/^[\w-]{11}$/.test(videoId)) return null;
  return `https://www.youtube-nocookie.com/embed/${videoId}`;
}

function getGoogleDocsEmbedUrl(value: string): string | null {
  const url = parseHttpUrl(value);
  if (!url || url.hostname.toLowerCase() !== "docs.google.com") return null;

  const publishedDocument = url.pathname.match(
    /^\/document\/d\/e\/([^/]+)\/pub/,
  );
  if (publishedDocument) {
    return `https://docs.google.com/document/d/e/${encodeURIComponent(publishedDocument[1])}/pub?embedded=true`;
  }

  const document = url.pathname.match(/^\/document\/(?:u\/\d+\/)?d\/([^/]+)/);
  if (!document) return null;

  return `https://docs.google.com/document/d/${encodeURIComponent(document[1])}/preview`;
}

export function CourseContent() {
  const [, params] = useRoute("/courses/:id/content");
  const lesson = getLessonState(window.history.state);
  const courseId = params?.id;
  const originalUrl = lesson
    ? parseHttpUrl(lesson.mainContent.contentURI)
    : null;
  const embedUrl = lesson
    ? lesson.mainContent.isVideo
      ? getYoutubeEmbedUrl(lesson.mainContent.contentURI)
      : getGoogleDocsEmbedUrl(lesson.mainContent.contentURI)
    : null;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-6 pb-12">
        <Link
          href={courseId ? `/courses/${courseId}` : "/dashboard/courses"}
          className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {lesson?.courseName || "Courses"}
        </Link>

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
                  {originalUrl && (
                    <Button asChild variant="outline" className="mt-2">
                      <a
                        href={originalUrl.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Mark as completed
                      </a>
                    </Button>
                  )}
                </div>
              )}

              {embedUrl && originalUrl && (
                <div className="flex flex-wrap items-center justify-end gap-3 border-t border-white/10 px-4 py-3 sm:px-6">
                  <Button asChild variant="outline" size="sm">
                    <a
                      href={originalUrl.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Mark as completed
                    </a>
                  </Button>
                </div>
              )}
            </section>
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
