import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { fetchUser } from "@/api/User"; // Import your API functions
import { User } from "@/interfaces/interfaces";

interface UserContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  refreshUser: () => Promise<void>; // Function to refresh user manually
}

// Create context with initial value as undefined
const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to validate token
  const isTokenValid = (token: string): boolean => {
    try {
      const { exp } = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      return Date.now() < exp * 1000; // `exp` is in seconds, convert to ms
    } catch (error) {
      console.error("Invalid token format:", error);
      return false;
    }
  };

  // Function to fetch and set user data
  const fetchAndSetUser = async (token: string) => {
    try {
      const userData = await fetchUser(token);
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null); // Clear user in case of an error
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh user function (e.g., after login)
  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (token && isTokenValid(token)) {
      fetchAndSetUser(token);
    } else {
      console.warn("Token expired. Logging out.");
      localStorage.removeItem("token");
      setUser(null);
      setIsLoading(false);
    }
  };

  // Fetch user data on mount and on token change
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && isTokenValid(token)) {
      fetchAndSetUser(token); // Fetch user only if token is valid
    } else {
      console.warn("Token expired or not found. Logging out.");
      localStorage.removeItem("token");
      setIsLoading(false); // Stop loading if no valid token
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
