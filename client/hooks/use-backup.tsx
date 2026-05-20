import {
  CloudStorage,
  CloudStorageScope,
  useIsCloudAvailable,
} from "react-native-cloud-storage";
import useGoogleAuth from "./use-google-auth";

const useBackup = () => {
  const { handleGoogleSignIn, userData } = useGoogleAuth();

  const cloudAvailable = useIsCloudAvailable();
  // useEffect(() => {
  //   if (
  //     userData &&
  //     userData?.token &&
  //     CloudStorage.getProvider() === CloudStorageProvider.GoogleDrive
  //   ) {
  //     // get access token via @react-native-google-signin/google-signin or similar

  //   }
  // }, [userData]);

  const path = "file.txt";

  const writeToCloud = async () => {
    try {
      //   const exists = await CloudStorage.exists(path, CloudStorageScope.AppData);

      //   if (exists) {
      //     await CloudStorage.writeFile(
      //       path,
      //       "Hello, world!",
      //       CloudStorageScope.AppData,
      //     );
      //   } else {
      //     await CloudStorage.createFile(
      //       path,
      //       "Hello world",
      //       CloudStorageScope.AppData,
      //     );
      //   }

      CloudStorage.setProviderOptions({
        accessToken: userData?.token,
      });

      await CloudStorage.writeFile(
        path,
        "Hello, world!",
        CloudStorageScope.AppData,
      );

      console.log("Successfully wrote file to cloud");
    } catch (error) {
      console.log("Error writing file to cloud:", error);
    }
  };

  const readFromCloud = async () => {
    try {
      await handleGoogleSignIn();

      if (userData && userData?.token) {
        CloudStorage.setProviderOptions({
          accessToken: userData?.token,
        });

        const value = await CloudStorage.readFile(
          path,
          CloudStorageScope.AppData,
        );
        console.log("Successfully read file from cloud:", value);
      }
    } catch (error) {
      console.log("Error reading file from cloud:", error);
    }
  };

  return { writeToCloud, readFromCloud, cloudAvailable };
};

export default useBackup;
