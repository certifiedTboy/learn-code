import { upsertUserProfile } from "@/helpers/db";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState } from "react";

export const AuthContext = createContext({
  isAuthenticated: false,
  updateAuthenticatedState: (
    refreshToken: string,
    accessToken: string,
    user: any,
  ) => {},
  user: null,
  logout: () => {},
  checkUserIsAuthenticated: () => {},
});

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  /**
   * @function updateAuthenticatedState
   * @description Updates the authentication state by storing tokens and user info
   * @param {string} refreshToken - The refresh token
   * @param {string} accessToken - The access token
   * @param {any} user - The user information
   */
  const updateAuthenticatedState = async (
    refreshToken: string,
    accessToken: string,
    user: any,
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
   * @returns {Promise<void>}
   */
  const checkUserIsAuthenticated = async (): Promise<void> => {
    const accessToken = await AsyncStorage.getItem("access_token");

    if (accessToken) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
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
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
