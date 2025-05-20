import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

interface JwtPayload {
  name: string;
  isSuperAdmin: boolean;
  sub: string;
  iat?: number;
  exp?: number;
}

interface AuthContextType {
  token: string | null;
  account: { name: string; isSuperAdmin: boolean } | null;
  login: (token: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [account, setAccount] = useState<{
    name: string;
    isSuperAdmin: boolean;
  } | null>(null);

  const login = (token: string) => {
    setToken(token);
    localStorage.setItem("token", token);
    const decoded = jwtDecode<JwtPayload>(token);
    setAccount({ name: decoded.name, isSuperAdmin: decoded.isSuperAdmin });
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    setAccount(null);
  };

  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (!decoded.exp) return true;
      const now = Date.now() / 1000;
      return decoded.exp < now;
    } catch (error) {
      console.error("Token decoding failed", error);
      return true;
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && !isTokenExpired(storedToken)) {
      setToken(storedToken);
      try {
        const decoded = jwtDecode<JwtPayload>(storedToken);
        setAccount({ name: decoded.name, isSuperAdmin: decoded.isSuperAdmin });
      } catch (e) {
        console.error("Token decoding failed", e);
        logout();
      }
    } else {
      logout();
    }
  }, []);
  return (
    <AuthContext.Provider value={{ token, account, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
