import { useAuth } from "./use-auth";
import { useGoogleAuth } from "./use-google-auth";
import { useToast } from "./use-toast";
import {
  upsertRegisteredCourse,
  getAllRegisteredCourse,
} from "@/helpers/course-database";

const DRIVE_API = "https://www.googleapis.com/drive/v3";
const UPLOAD_API = "https://www.googleapis.com/upload/drive/v3";

async function driveRequest(
  url: string,
  accessToken: string,
  options: any = {},
) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google Drive API error: ${error}`);
  }

  return response;
}

export async function listAppData() {
  const accessToken = localStorage.getItem("gtkn");

  if (!accessToken) {
    return console.log("token is not provided");
  }

  const params = new URLSearchParams({
    spaces: "appDataFolder",
    fields: "files(id,name,mimeType,modifiedTime)",
    pageSize: "100",
  });

  const response = await driveRequest(
    `${DRIVE_API}/files?${params}`,
    accessToken,
  );

  const files = (await response.json())?.files ?? [];

  return files;
}

export async function updateJsonFile(
  accessToken: string,
  fileId: string,
  data: any,
) {
  const response = await driveRequest(
    `${UPLOAD_API}/files/${fileId}?uploadType=media`,
    accessToken,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  return response.json();
}

export function useBackup() {
  // Custom hook to trigger Google OAuth sign-in flow for Drive access
  const { handleGoogleSignIn } = useGoogleAuth();
  // Context updater to re-hydrate the UI once a backup is successfully restored
  //   const { setRegisteredCourses } = useRegisteredCourseContext();
  // const [updateRegisteredCoursesProgress] =
  //   useUpdateRegisteredCoursesProgressMutation();

  // Immediate notification trigger to inform the user of backup success/failure

  const { toast } = useToast();
  const { user } = useAuth();

  // Generates a unique backup filename based on the user's email prefix
  const path = `${user?.email?.split("@")[0]}.json`;

  // const path = "file.json";

  /**
   * Fetches local registered courses and uploads them to the user's Google Drive.
   * Requests an OAuth token before attempting the Cloud Storage operation.
   */
  const writeToCloud = async () => {
    try {
      let token = localStorage.getItem("gtkn");

      if (!token) {
        token = await handleGoogleSignIn();
      }

      const files = await listAppData();

      let file = files.find((file: any) => file.name === path);

      if (!file) {
        const metadataResponse = await driveRequest(
          `${DRIVE_API}/files`,
          token,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: path,
              mimeType: "application/json",
              parents: ["appDataFolder"],
            }),
          },
        );

        file = await metadataResponse.json();
      }

      const registeredCourses = await getAllRegisteredCourse();

      let updatedCourse;

      if (registeredCourses && registeredCourses.length > 0) {
        updatedCourse = registeredCourses.map((course) => ({
          ...course,
          contents: course?.contents?.map((cont) => ({
            ...cont,
            subTopics: cont?.subTopics?.map((sub) => ({
              ...sub,
              isCompleted: sub?.isCompleted ?? false,
            })),
          })),
        }));
      }

      await updateJsonFile(token, file.id, updatedCourse);
      toast({
        variant: "default",
        title: "Backup Completed!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title:
          (error instanceof Error ? error.message : undefined) ||
          "something went wrong with data backup",
      });
    }
  };

  /**
   * Reads the saved backup file from Google Drive and re-hydrates both the
   * local SQLite/AsyncStorage database and the application's Context.
   */
  const readFromCloud = async () => {
    try {
      // Get a fresh or existing Google OAuth access token
      let token = localStorage.getItem("gtkn");

      if (!token) {
        token = await handleGoogleSignIn();
      }

      const files = await listAppData();

      const fileId = files.find((file: any) => file.name === path)?.id;

      const response = await driveRequest(
        `${DRIVE_API}/files/${fileId}?alt=media`,
        token,
      );

      const data = await response.json();

      for (let course of data) {
        await upsertRegisteredCourse({
          _id: course?._id,
          name: course?.name,
          description: course?.description,
          price: course?.price,
          rating: course?.rating,
          completed: course?.completed,
          subscribers: course?.subscribers,
          totalTopics: course?.totalTopics,
          requiredDuration: course?.requiredDuration,
          contents: course?.contents,
          createdAt: course?.createdAt,
          updatedAt: course?.updatedAt,
          skills: course?.skills,
          image: course?.course_image || course?.image,
          dateRegistered: course?.dateRegistered,
          completion: course?.completion,
        });
      }

      toast({
        variant: "default",
        title: "Backup Restored!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title:
          (error instanceof Error ? error.message : undefined) ||
          "something went wrong with data backup",
      });
    }
  };

  return { writeToCloud, readFromCloud };
}
