import { createContext, useState, useEffect, useCallback, useContext } from "react";
import { myApi } from "../api/AuthApi";
import { useUserStore } from "../store/userStore";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  refetchUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);

  const fetchMe = useCallback(async () => {
    try {
      const response = await myApi.get("/auth/me");
      setUser(response.data);
    } catch (err) {
      clearUser();
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
    const handleForceLogout = () => clearUser();
    window.addEventListener("auth:logout", handleForceLogout);
    return () => window.removeEventListener("auth:logout", handleForceLogout);
  }, []);

  const login = useCallback((userData: User) => {
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    await myApi.post("/auth/signout");
    clearUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, refetchUser: fetchMe }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};