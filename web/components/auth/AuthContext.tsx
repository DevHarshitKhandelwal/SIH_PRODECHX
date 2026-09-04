"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (u: string, p: string) => boolean;
  logout: () => void;
  user: { name: string; role: string } | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
  user: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const session = localStorage.getItem("prodechx_auth_session");
    if (session === "active") {
      setIsAuthenticated(true);
      setUser({ name: "MoSPI Senior Auditor (Admin)", role: "SUPER_ADMIN" });
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated && pathname !== "/login") {
      router.push("/login");
    }
  }, [loading, isAuthenticated, pathname, router]);

  const login = (username: string, password: string): boolean => {
    if (username.trim().toLowerCase() === "admin" && password === "admin") {
      localStorage.setItem("prodechx_auth_session", "active");
      setIsAuthenticated(true);
      setUser({ name: "MoSPI Senior Auditor (Admin)", role: "SUPER_ADMIN" });
      router.push("/");
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("prodechx_auth_session");
    setIsAuthenticated(false);
    setUser(null);
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-slate-400">Authenticating PRODECHX Session...</span>
        </div>
      </div>
    );
  }

  // If on login page, don't render layout wrapper
  if (pathname === "/login") {
    return (
      <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {isAuthenticated ? children : null}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
