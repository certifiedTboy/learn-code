import { getAllRegisteredCourse } from "@/helpers/db/course-db";
import {
  CloudStorage,
  CloudStorageProvider,
  CloudStorageScope,
} from "react-native-cloud-storage";
import useGoogleAuth from "./use-google-auth";

const useBackup = () => {
  const { handleGoogleSignIn } = useGoogleAuth();

  const path = "file.txt";

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

        await CloudStorage.writeFile(
          path,
          "Hello, world!",
          CloudStorageScope.AppData,
        );

        console.log("Successfully wrote file to cloud");
      }
    } catch (error) {
      console.log("Error writing file to cloud:", error);
    }
  };

  const readFromCloud = async () => {
    try {
      await handleGoogleSignIn();

      const value = await CloudStorage.readFile(
        path,
        CloudStorageScope.AppData,
      );
      console.log("Successfully read file from cloud:", value);
    } catch (error) {
      console.log("Error reading file from cloud:", error);
    }
  };

  return { writeToCloud, readFromCloud };
};

export default useBackup;
