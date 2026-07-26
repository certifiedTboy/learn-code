/**
 * Hook for managing cloud backups of user's registered courses.
 * Integrates with Google Drive (via `react-native-cloud-storage`) to save and restore
 * the user's local offline database (SQLite/AsyncStorage) and context states.
 */

// import { useUpdateRegisteredCoursesProgressMutation } from "@/features/apis/course-apis";
import { AuthContext } from "@/features/context/auth-context";
import { useRegisteredCourseContext } from "@/features/context/registered-course-context";
import {
  getAllRegisteredCourse,
  upsertRegisteredCourse,
} from "@/helpers/db/course-db";
import { showNotification } from "@/helpers/notification";
import { useContext } from "react";
import {
  CloudStorage,
  CloudStorageProvider,
  CloudStorageScope,
} from "react-native-cloud-storage";
import useGoogleAuth from "./use-google-auth";
import { useScheduleNotification } from "./use-schedule-notification";

const useBackup = () => {
  // Custom hook to trigger Google OAuth sign-in flow for Drive access
  const { handleGoogleSignIn } = useGoogleAuth();
  // Context updater to re-hydrate the UI once a backup is successfully restored
  const { setRegisteredCourses } = useRegisteredCourseContext();
  // const [updateRegisteredCoursesProgress] =
  //   useUpdateRegisteredCoursesProgressMutation();

  // Immediate notification trigger to inform the user of backup success/failure
  const { triggerImmediateNotification } = useScheduleNotification();

  const { user } = useContext(AuthContext);

  // Generates a unique backup filename based on the user's email prefix
  const path = `${user?.email.split("@")[0]}.json`;

  // const path = "file.json";

  /**
   * Fetches local registered courses and uploads them to the user's Google Drive.
   * Requests an OAuth token before attempting the Cloud Storage operation.
   */
  const writeToCloud = async () => {
    try {
      // Get a fresh or existing Google OAuth access token
      const token = await handleGoogleSignIn();

      if (
        token &&
        CloudStorage.getProvider() === CloudStorageProvider.GoogleDrive
      ) {
        // Set the active provider to Google Drive with the user's token
        CloudStorage.setProviderOptions({
          accessToken: token,
        });

        // Fetch the list of registered courses from the local SQLite/AsyncStorage database
        const registeredCourses = await getAllRegisteredCourse();

        if (registeredCourses) {
          // Write the stringified database records to the user's hidden app data space in Drive
          await CloudStorage.writeFile(
            path,
            JSON.stringify(registeredCourses),
            CloudStorageScope.AppData,
          );

          // updateRegisteredCoursesProgress({
          //   courses: registeredCourses,
          // });

          triggerImmediateNotification(
            "Backup Completed",
            "Backup to the cloud completed",
          );
        }
      }
    } catch (error) {
      // Alert the user via an in-app banner if the backup process fails
      showNotification({
        type: "error",
        message: "Backup to the cloud failed!",
        title: "Backup to the cloud failed!",
      });
      console.log("Error writing file to cloud:", error);
    }
  };

  /**
   * Reads the saved backup file from Google Drive and re-hydrates both the
   * local SQLite/AsyncStorage database and the application's Context.
   */
  const readFromCloud = async () => {
    try {
      // Get a fresh or existing Google OAuth access token
      const token = await handleGoogleSignIn();

      if (
        token &&
        CloudStorage.getProvider() === CloudStorageProvider.GoogleDrive
      ) {
        // Set the active provider to Google Drive with the user's token
        CloudStorage.setProviderOptions({
          accessToken: token,
        });

        // Read the backup JSON file from the user's hidden AppData folder
        const result = await CloudStorage.readFile(
          path,
          CloudStorageScope.AppData,
        );

        if (result) {
          // Parse the retrieved JSON string into an array of course objects
          const registeredCourses = await JSON.parse(result);

          setRegisteredCourses(registeredCourses);

          // Loop through and upsert (insert or update) each restored course back into the local database
          for (let course of registeredCourses) {
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

          // Trigger a local notification to inform the user the restore succeeded
          triggerImmediateNotification(
            "Backup restore completed",
            "Backup restore from cloud completed",
          );
        }
      }
    } catch (error) {
      // Alert the user via an in-app banner if no backup file is found or if parsing fails
      showNotification({
        type: "error",
        message: "No Data Found in Cloud!",
        title: "No Data Found in Cloud!",
      });
      console.log("Error reading file from cloud:", error);
    }
  };

  return { writeToCloud, readFromCloud };
};

export default useBackup;
