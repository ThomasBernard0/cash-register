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

interface AuthStateProps {
  token: string | null;
  account: { name: string; isSuperAdmin: boolean } | null;
  loading: boolean;
}

interface AuthContextType {
  authState: AuthStateProps;
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
  const [authState, setAuthState] = useState<AuthStateProps>({
    token: localStorage.getItem("token"),
    account: null,
    loading: true,
  });

  const login = (token: string) => {
    const decoded = jwtDecode<JwtPayload>(token);
    localStorage.setItem("token", token);
    setAuthState({
      token,
      account: { name: decoded.name, isSuperAdmin: decoded.isSuperAdmin },
      loading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthState({
      token: null,
      account: null,
      loading: false,
    });
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
      try {
        const decoded = jwtDecode<JwtPayload>(storedToken);
        setAuthState({
          token: storedToken,
          account: { name: decoded.name, isSuperAdmin: decoded.isSuperAdmin },
          loading: false,
        });
      } catch (e) {
        console.error("Token decoding failed", e);
        logout();
      }
    } else {
      logout();
    }
  }, []);
  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
