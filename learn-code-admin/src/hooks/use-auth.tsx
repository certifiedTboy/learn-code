import { createContext, useContext, type ReactNode } from "react";

interface User {
  name: string;
  role: string;
}

interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: { name: "Admin User", role: "admin" },
  isAuthenticated: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider
      value={{
        user: { name: "Admin User", role: "admin" },
        isAuthenticated: true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function RequireAuth({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
