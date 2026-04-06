import { createContext, useContext, type ReactNode, useEffect } from "react";
// import { Redirect } from "wouter";
import { useGetNewTokenMutation } from "../lib/apis/auth-apis";
import { useGetAdminProfileMutation } from "../lib/apis/user-apis";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store/store";

interface User {
  name: string;
  role: string;
}

interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: { name: "", role: "" },
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [getAdminProfile, { isError, error }] = useGetAdminProfileMutation();

  const [getNewToken] = useGetNewTokenMutation();

  const { currentUser, isAuthenticated } = useSelector(
    (state: RootState) => state.authState,
  );

  useEffect(() => {
    getAdminProfile(null);
  }, []);

  useEffect(() => {
    if (
      isError &&
      "status" in error &&
      error.status === 401 &&
      "data" in error &&
      typeof error.data === "object" &&
      error.data !== null &&
      "message" in error.data &&
      error.data.message === "jwt expired"
    ) {
      getNewToken(null);
    }
  }, [isError]);

  return (
    <AuthContext.Provider
      value={{
        user: {
          name: `${currentUser?.firstName} ${currentUser?.lastName}`,
          role: currentUser?.role || "admin",
        },
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// export function RequireAuth({ children }: { children: ReactNode }) {
//   const { isAuthenticated } = useAuth();

//   if (!isAuthenticated) {
//     return <Redirect to="/login" />;
//   }

//   return <>{children}</>;
// }
