import React, {
  createContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { Navigate } from "react-router-dom";
import { Itinerary } from "../pages/Itineraries/Itineraries";

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
}

interface AuthContextValue {
  currentUser: User | null;
  isAuthenticating: boolean;
  authenticated: boolean;
  authError: string | React.ReactNode;
  logOut: () => Promise<void>;
  logIn: (username: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
  saveItinerary: (itinerary: any) => Promise<void>;
  getItineraries: (username: string) => Promise<Itinerary[]>;
  deleteItinerary: (itineraryId: string) => Promise<void>;
}

interface AuthState {
  isAuthenticating: boolean;
  currentUser: User | null;
  authenticated: boolean;
  authError: string | React.ReactNode;
}

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";

const unauthorizedState: AuthState = {
  isAuthenticating: false,
  currentUser: null,
  authenticated: false,
  authError: "",
};

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authData, setAuthData] = useState<AuthState>(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    console.log("token", token);
    console.log("user", user);

    if (token && user) {
      console.log("token and user found");
      return {
        isAuthenticating: false,
        currentUser: JSON.parse(user),
        authenticated: true,
        authError: "",
      };
    }

    return unauthorizedState;
  });

  const clearError = () => {
    setAuthData((prev) => ({ ...prev, authError: "" }));
  };

  const handleAuthError = (error: any): React.ReactNode => {
    const errorMessage = error.message || "An error occurred";

    switch (errorMessage) {
      case "Invalid username or password":
        return "Invalid email or password";
      case "Account locked":
        return (
          <span>
            Your account is locked. Please reset your password by clicking
            "Forgot Password" below.
          </span>
        );
      case "Too many failed login attempts":
        return (
          <span>
            Your account has been locked due to too many unsuccessful login
            attempts. We've sent you an email to help reset your password.
          </span>
        );
      case "Email already exists":
        return "An account with this email already exists";
      default:
        return (
          <span>
            A System Error has occurred. Please try again later or contact us at{" "}
            <a href="mailto:support@excursionexpert.com">
              support@excursionexpert.com
            </a>
          </span>
        );
    }
  };

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      setAuthData((prev) => ({ ...prev, isAuthenticating: true }));

      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Not authenticated");
      }

      const userData = await response.json();

      setAuthData({
        isAuthenticating: false,
        authenticated: true,
        currentUser: userData,
        authError: "",
      });

      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setAuthData(unauthorizedState);
    }
  }, []);

  const register = async (data: RegisterData): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }

      // Store auth data after successful registration
      if (responseData.token) {
        localStorage.setItem("token", responseData.token);
        localStorage.setItem("user", JSON.stringify(responseData.user));
      }

      setAuthData({
        isAuthenticating: false,
        authenticated: true,
        currentUser: responseData.user,
        authError: "",
      });
    } catch (error: any) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setAuthData((prev) => ({
        ...prev,
        authError: handleAuthError(error),
      }));
      throw error;
    }
  };

  const logIn = async (username: string, password: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store auth data
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      setAuthData({
        isAuthenticating: false,
        authenticated: true,
        currentUser: data.user,
        authError: "",
      });
    } catch (err: any) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setAuthData((prev) => ({
        ...prev,
        authError: handleAuthError(err),
      }));
      throw err;
    }
  };

  const logOut = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setAuthData(unauthorizedState);
    }
  };

  const saveItinerary = async (itinerary: any): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/api/itineraries/save-itinerary`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(itinerary),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Itinerary saved:", data);
    } else {
      console.error("Error saving itinerary:", response.statusText);
    }
  };

  // Check auth status when component mounts
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const getItineraries = async (username: string): Promise<Itinerary[]> => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${API_BASE_URL}/api/itineraries/get-itineraries?username=${username}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();

      // Transform the data
      const transformedData = data.map((itinerary: any) => {
        const { name, places, ...rest } = itinerary;
        const transformedPlaces = places.map((place: any) => {
          const { name, ...placeRest } = place;
          return {
            ...placeRest,
            displayName: {
              text: name,
              languageCode: "en",
            },
          };
        });
        return {
          ...rest,
          displayName: {
            text: `Itinerary for ${name}`,
            languageCode: "en",
          },
          places: transformedPlaces,
        };
      });
      console.log("Itineraries fetched:", transformedData);

      return transformedData;
    } else {
      console.error("Error fetching itineraries:", response.statusText);
      return [];
    }
  };

  const deleteItinerary = async (itineraryId: string): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/api/itineraries/delete-itinerary/${itineraryId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (response.ok) {
      console.log("Itinerary deleted:", itineraryId);
    } else {
      console.error("Error deleting itinerary:", response.statusText);
    }
  
    // const token = localStorage.getItem("token");
    // const response = await fetch(
    //   `${API_BASE_URL}/api/itineraries/get-itineraries?username=${username}`,
    //   {
    //     method: "GET",
    //     credentials: "include",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: token ? `Bearer ${token}` : "",
    //     },
    //   }
    // );

    // if (response.ok) {
    //   const data = await response.json();

    //   // Transform the data
    //   const transformedData = data.map((itinerary: any) => {
    //     const { name, places, ...rest } = itinerary;
    //     const transformedPlaces = places.map((place: any) => {
    //       const { name, ...placeRest } = place;
    //       return {
    //         ...placeRest,
    //         displayName: {
    //           text: name,
    //           languageCode: "en",
    //         },
    //       };
    //     });
    //     return {
    //       ...rest,
    //       displayName: {
    //         text: `Itinerary for ${name}`,
    //         languageCode: "en",
    //       },
    //       places: transformedPlaces,
    //     };
    //   });
    //   console.log("Itineraries fetched:", transformedData);

    //   return transformedData;
    // } else {
    //   console.error("Error fetching itineraries:", response.statusText);
    //   return [];
    // }
  };

  // Check auth status when component mounts
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Periodic token validation
  useEffect(() => {
    const interval = setInterval(() => {
      if (authData.authenticated) {
        checkAuthStatus();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [checkAuthStatus, authData.authenticated]);

  const contextValue = useMemo(
    () => ({
      logIn,
      logOut,
      register,
      refreshUser: checkAuthStatus,
      clearError,
      saveItinerary,
      getItineraries,
      deleteItinerary,
      ...authData,
    }),
    [authData, checkAuthStatus]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute = ({
  children,
  redirectTo = "/login",
}: ProtectedRouteProps) => {
  const { authenticated, isAuthenticating } = useAuth();

  if (isAuthenticating) {
    return <div>Loading...</div>; // Or your loading component
  }

  if (!authenticated) {
    return <Navigate to={redirectTo} />;
  }

  return <>{children}</>;
};
