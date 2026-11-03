import type { LessonState } from "../lib/mock-data";

export const convertSkillsToString = (skills: string[]) => {
  let concatenatedSkills = "";
  for (let skill of skills) {
    concatenatedSkills += `${skill} `;
  }
  return concatenatedSkills;
};

export const convertSkillsToArray = (skills: string) => {
  return skills.split(" ");
};

export const isAtLeast31DaysAgo = (dateInput: string) => {
  const inputDate: Date = new Date(dateInput);
  const now: Date = new Date();

  const diffInMs = now.getTime() - inputDate.getTime();
  const daysDiff = diffInMs / (1000 * 60 * 60 * 24);

  return daysDiff <= 31;
};

// export const syncRegisteredCourses = (
//   registeredCourses: any,
//   updatedAvailableCourses: any,
// ) => {
//   const updatedCoursesMap = new Map(
//     updatedAvailableCourses.map((course: any) => [
//       course._id.toString(),
//       course,
//     ]),
//   );

//   return registeredCourses.map((registeredCourse: any) => {
//     const updatedCourse = updatedCoursesMap.get(
//       registeredCourse._id.toString(),
//     );

//     // If an updated version exists, use it.
//     // Otherwise, retain the registered course.
//     return updatedCourse
//       ? { ...registeredCourse, ...updatedCourse }
//       : registeredCourse;
//   });
// };

export const syncRegisteredCourses = (
  registeredCourses: any,
  updatedAvailableCourses: any,
) => {
  const updatedCoursesMap = new Map(
    updatedAvailableCourses.map((course: any) => [
      course._id.toString(),
      course,
    ]),
  );

  return registeredCourses.map((registeredCourse: any) => {
    const updatedCourse = updatedCoursesMap.get(
      registeredCourse._id.toString(),
    );

    // Keep the registered course if no update is available
    if (!updatedCourse) {
      return registeredCourse;
    }

    // Capture completion status from registered subtopics
    const registeredTopicsMap = new Map();

    registeredCourse.contents?.forEach((topic: any) => {
      topic.subTopics?.forEach((subTopic: any) => {
        registeredTopicsMap.set(
          `${topic.mainTopic}::${subTopic.title}`,
          subTopic.isCompleted,
        );
      });
    });

    // Sync latest course data and restore completion status
    // @ts-ignore
    const syncedContents = updatedCourse.contents?.map((topic: any) => ({
      ...topic,
      subTopics: topic.subTopics?.map((subTopic: any) => {
        const key = `${topic.mainTopic}::${subTopic.title}`;

        return {
          ...subTopic,
          isCompleted: registeredTopicsMap.has(key)
            ? registeredTopicsMap.get(key)
            : false,
        };
      }),
    }));

    return {
      ...registeredCourse,
      ...updatedCourse,
      // @ts-ignore
      contents: syncedContents ?? updatedCourse.contents,
    };
  });
};

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function getLessonState(value: unknown): LessonState | null {
  if (!isRecord(value) || !isRecord(value.mainContent)) {
    return null;
  }

  const { courseName, mainTopic, mainContent, courseId } = value;
  const { title, contentURI, isVideo, isCompleted } = mainContent;

  if (
    typeof courseName !== "string" ||
    typeof mainTopic !== "string" ||
    typeof courseId !== "string" ||
    typeof title !== "string" ||
    typeof contentURI !== "string" ||
    typeof isVideo !== "boolean"
    // || typeof isCompleted !== "boolean"
  ) {
    return null;
  }

  return {
    courseName,
    mainTopic,
    courseId,
    mainContent: {
      title,
      contentURI,
      isVideo,
      isCompleted: typeof isCompleted === "boolean" ? isCompleted : false,
    },
  };
}

export function parseHttpUrl(value: string): URL | null {
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
}

export function getYoutubeEmbedUrl(value: string): string | null {
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

export function getGoogleDocsEmbedUrl(value: string): string | null {
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
