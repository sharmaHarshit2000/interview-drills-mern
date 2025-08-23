import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getCurrentUser, logoutUser } from "../services/api";
import toast from "react-hot-toast";

export interface User {
  _id: string;
  email: string;
  name: string;
  picture?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
  logout: async () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.data);
        toast.success(`Welcome back, ${response.data.name}!`);
      } catch (error) {
        console.error("Auth initialization failed:", error);
        setUser(null);
        toast.error("Please sign in to continue");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      toast.success("Signed out successfully");
    } catch (err) {
      console.error("Logout failed:", err);
      setUser(null);
      toast.error("Logout failed. Please try again.");
    }
  };

  const value: AuthContextType = {
    user,
    setUser,
    loading,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
