import {
  deleteAllCourse,
  deleteAllRegisteredCourses,
} from "@/helpers/db/course-db";
import {
  deleteUserProfile,
  getCurrentUserFromDb,
  upsertUserProfile,
} from "@/helpers/db/user-db";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState } from "react";

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  isVerified: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  updateAuthenticatedState: (
    refereshToken: string,
    accessToken: string,
    user: User,
  ) => void;
  user: User | null;
  logout: () => void;
  checkUserIsAuthenticated: () => void;
  updateUserDataOnProfileUpdate: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  updateAuthenticatedState: (
    refreshToken,
    accessToken,
    user,
    // courseData: any[],
  ) => {},
  user: null,
  logout: () => {},
  checkUserIsAuthenticated: () => {},
  updateUserDataOnProfileUpdate: () => {},
});

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  /**
   * @function updateAuthenticatedState
   * @description Updates the authentication state by storing tokens and user info
   * @param {string} refreshToken - The refresh token
   * @param {string} accessToken - The access token
   * @param {User} user - The user information
   */
  const updateAuthenticatedState = async (
    refreshToken: string,
    accessToken: string,
    user: User,
    // courseData: any[],
  ) => {
    await AsyncStorage.setItem("access_token", accessToken);
    await AsyncStorage.setItem("refresh_token", refreshToken);
    setIsAuthenticated(true);
    setUser(user);

    await upsertUserProfile(user);
  };

  /**
   * @function checkUserIsAuthenticated
   * @description Checks if the user is authenticated by verifying the presence of an access token
   */
  const checkUserIsAuthenticated = async () => {
    const accessToken = await AsyncStorage.getItem("access_token");

    if (accessToken) {
      setIsAuthenticated(true);
      const result = await getCurrentUserFromDb();
      setUser(result);
    } else {
      setIsAuthenticated(false);
    }
  };

  /**
   * @function updateUserDataOnProfileUpdate
   */
  const updateUserDataOnProfileUpdate = async (user: User) => {
    setUser(user);
    await upsertUserProfile(user);
  };

  /**
   * @function logout
   * @description Logs out the user by clearing tokens and resetting auth state
   */
  const logout = async () => {
    await AsyncStorage.removeItem("access_token");
    await AsyncStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
    setUser(null);
    await deleteUserProfile(user?._id!);
    await deleteAllCourse();
    await deleteAllRegisteredCourses();
    checkUserIsAuthenticated();
  };

  /**
   * @description The context value containing authentication state and functions
   */
  const value = {
    isAuthenticated,
    updateAuthenticatedState,
    user,
    logout,
    checkUserIsAuthenticated,
    updateUserDataOnProfileUpdate,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
