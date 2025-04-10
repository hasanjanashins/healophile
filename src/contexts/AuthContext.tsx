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

// Pre-defined test accounts
const TEST_ACCOUNTS = {
  doctor: {
    id: "doc123",
    name: "Dr. Arjun Singh",
    email: "doctor@healophile.com",
    password: "doctor123",
    role: "doctor" as const
  },
  patient: {
    id: "pat456",
    name: "Priya Sharma",
    email: "patient@healophile.com",
    password: "patient123",
    role: "patient" as const
  }
};

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

  // Enhanced login function with test account support
  const login = (email: string, password: string, role: "patient" | "doctor") => {
    // Check for test accounts first
    const isTestDoctor = email === TEST_ACCOUNTS.doctor.email && 
                         password === TEST_ACCOUNTS.doctor.password && 
                         role === "doctor";
                         
    const isTestPatient = email === TEST_ACCOUNTS.patient.email && 
                          password === TEST_ACCOUNTS.patient.password && 
                          role === "patient";
    
    let user: User | null = null;
    
    if (isTestDoctor) {
      user = {
        id: TEST_ACCOUNTS.doctor.id,
        name: TEST_ACCOUNTS.doctor.name,
        email: TEST_ACCOUNTS.doctor.email,
        role: "doctor"
      };
    } else if (isTestPatient) {
      user = {
        id: TEST_ACCOUNTS.patient.id,
        name: TEST_ACCOUNTS.patient.name,
        email: TEST_ACCOUNTS.patient.email,
        role: "patient"
      };
    } else {
      // Regular mock login for other accounts
      user = {
        id: Math.random().toString(36).substring(2, 9),
        name: email.split("@")[0], // Use part of email as name for demo
        email,
        role
      };
    }
    
    setCurrentUser(user);
    localStorage.setItem("healophileUser", JSON.stringify(user));
  };

  // Keep the existing signup function
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
