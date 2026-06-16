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
  const { handleGoogleSignIn } = useGoogleAuth();
  const { setRegisteredCourses } = useRegisteredCourseContext();
  // const [updateRegisteredCoursesProgress] =
  //   useUpdateRegisteredCoursesProgressMutation();

  const { triggerImmediateNotification } = useScheduleNotification();

  const { user } = useContext(AuthContext);

  const path = `${user?.email.split("@")[0]}.json`;

  // const path = "file.json";

  const writeToCloud = async () => {
    try {
      const token = await handleGoogleSignIn();

      if (
        token &&
        CloudStorage.getProvider() === CloudStorageProvider.GoogleDrive
      ) {
        // get access token via @react-native-google-signin/google-signin or similar

        CloudStorage.setProviderOptions({
          accessToken: token,
        });

        const registeredCourses = await getAllRegisteredCourse();

        if (registeredCourses) {
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
      showNotification({
        type: "error",
        message: "Backup to the cloud failed!",
        title: "Backup to the cloud failed!",
      });
      console.log("Error writing file to cloud:", error);
    }
  };

  const readFromCloud = async () => {
    try {
      const token = await handleGoogleSignIn();

      if (
        token &&
        CloudStorage.getProvider() === CloudStorageProvider.GoogleDrive
      ) {
        CloudStorage.setProviderOptions({
          accessToken: token,
        });

        const result = await CloudStorage.readFile(
          path,
          CloudStorageScope.AppData,
        );

        if (result) {
          const registeredCourses = JSON.parse(result);
          setRegisteredCourses(registeredCourses);

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
              image: course?.image,
              dateRegistered: course?.dateRegistered,
              completion: course?.completion,
            });
          }

          triggerImmediateNotification(
            "Backup restore completed",
            "Backup restore from cloud completed",
          );
        }
      }
    } catch (error) {
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
