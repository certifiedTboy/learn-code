import {
  getAllRegisteredCourse,
  upsertRegisteredCourse,
} from "@/helpers/db/course-db";
import { showNotification } from "@/helpers/notification";
import { useRegisteredCourseContext } from "@/lib/context/registered-course-context";
import {
  CloudStorage,
  CloudStorageProvider,
  CloudStorageScope,
} from "react-native-cloud-storage";
import useGoogleAuth from "./use-google-auth";

const useBackup = () => {
  const { handleGoogleSignIn } = useGoogleAuth();
  const { setRegisteredCourses } = useRegisteredCourseContext();

  const path = "file.json";

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

          showNotification({
            type: "success",
            message: "Backup Successful!",
            title: "Backup Successfuly!",
          });
        }
      }
    } catch (error) {
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

          showNotification({
            type: "success",
            message: "Restore Successful!",
            title: "Restore Successfuly!",
          });
        }
      }
    } catch (error) {
      console.log("Error reading file from cloud:", error);
    }
  };

  return { writeToCloud, readFromCloud };
};

export default useBackup;
