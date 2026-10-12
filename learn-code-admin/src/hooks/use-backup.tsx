import { useSelector } from "react-redux";
import { useGoogleAuth } from "./use-google-auth";
import { useToast } from "./use-toast";
import { useCourses } from "./use-courses";
import {
  upsertRegisteredCourse,
  getAllRegisteredCourse,
  getAllCourse,
} from "@/helpers/course-database";
import { syncRegisteredCourses } from "@/helpers/course";
import type { RootState } from "@/redux/store/store";

const DRIVE_API = "https://www.googleapis.com/drive/v3";
const UPLOAD_API = "https://www.googleapis.com/upload/drive/v3";

class DriveRequestError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

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
    throw new DriveRequestError(
      `Google Drive API error: ${error}`,
      response.status,
    );
  }

  return response;
}

export async function listAppData(refreshAccessToken: () => Promise<string>) {
  let accessToken = localStorage.getItem("gtkn");

  if (!accessToken) {
    throw new Error("Google Drive access token is missing.");
  }

  const params = new URLSearchParams({
    spaces: "appDataFolder",
    fields: "files(id,name,mimeType,modifiedTime)",
    pageSize: "100",
  });

  let response: Response;

  try {
    response = await driveRequest(`${DRIVE_API}/files?${params}`, accessToken);
  } catch (error) {
    if (!(error instanceof DriveRequestError) || error.status !== 401) {
      throw error;
    }

    accessToken = await refreshAccessToken();
    response = await driveRequest(`${DRIVE_API}/files?${params}`, accessToken);
  }

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
  const { setReisgeredCourses } = useCourses();

  const { toast } = useToast();
  const { currentUser } = useSelector((state: RootState) => state.authState);

  // Generates a unique backup filename based on the user's email prefix
  const path = `${currentUser?.email?.split("@")[0]}.json`;

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

      const files = await listAppData(handleGoogleSignIn);
      token = localStorage.getItem("gtkn") ?? token;

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

      const updatedAvailableCourses = await getAllCourse();
      const registeredCourses = await getAllRegisteredCourse();

      const syncedCourses = syncRegisteredCourses(
        registeredCourses,
        updatedAvailableCourses,
      );

      let updatedCourse;

      if (syncedCourses && syncedCourses.length > 0) {
        updatedCourse = syncedCourses.map((course: any) => ({
          ...course,
          contents: course?.contents?.map((cont: any) => ({
            ...cont,
            subTopics: cont?.subTopics?.map((sub: any) => ({
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

      const files = await listAppData(handleGoogleSignIn);

      token = localStorage.getItem("gtkn") ?? token;

      const fileId = files.find((file: any) => file.name === path)?.id;

      if (!fileId) {
        throw new Error("No cloud backup was found for this account.");
      }

      const response = await driveRequest(
        `${DRIVE_API}/files/${fileId}?alt=media`,
        token,
      );

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("The cloud backup has an invalid format.");
      }

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

      setReisgeredCourses(data);

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
