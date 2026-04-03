import { createContext, useContext, type ReactNode, useEffect } from "react";
// import { Redirect } from "wouter";
import { useGetAdminProfileMutation } from "../lib/apis/auth-apis";
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
  const [getAdminProfile] = useGetAdminProfileMutation();

  const { currentUser, isAuthenticated } = useSelector(
    (state: RootState) => state.authState,
  );

  useEffect(() => {
    getAdminProfile(null);
  }, []);

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
