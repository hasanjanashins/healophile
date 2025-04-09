
import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "patient" | "doctor";
}

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role: "patient" | "doctor") => void;
  signup: (name: string, email: string, password: string, role: "patient" | "doctor") => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user in localStorage on init
    const storedUser = localStorage.getItem("healophileUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Mock auth functions (in production would connect to a backend)
  const login = (email: string, password: string, role: "patient" | "doctor") => {
    // Demo login - would connect to auth service in production
    const mockUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      name: email.split("@")[0], // Use part of email as name for demo
      email,
      role
    };
    
    setCurrentUser(mockUser);
    localStorage.setItem("healophileUser", JSON.stringify(mockUser));
  };

  const signup = (name: string, email: string, password: string, role: "patient" | "doctor") => {
    // Demo signup - would connect to auth service in production
    const mockUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email,
      role
    };
    
    setCurrentUser(mockUser);
    localStorage.setItem("healophileUser", JSON.stringify(mockUser));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("healophileUser");
  };

  const value = {
    currentUser,
    isLoading,
    login,
    signup,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
