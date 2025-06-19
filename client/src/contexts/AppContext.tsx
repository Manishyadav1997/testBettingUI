import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@shared/schema";

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  balance: number;
  setBalance: (balance: number) => void;
  isAuthenticated: boolean;
  theme: "light" | "dark";
  toggleTheme: () => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  toastMessage: string | null;
  toastType: "success" | "error" | "info";
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState(12450);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");

  const isAuthenticated = !!user;

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      }
    } else {
      document.documentElement.classList.add("dark");
    }

    // Mock user for demonstration
    const mockUser: User = {
      id: 1,
      username: "BetMaster",
      email: "user@betpro.com",
      password: "",
      phone: "+91 98765 43210",
      balance: "12450.00",
      isVerified: true,
      createdAt: new Date(),
    };
    setUser(mockUser);
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        balance,
        setBalance,
        isAuthenticated,
        theme,
        toggleTheme,
        showToast,
        toastMessage,
        toastType,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
