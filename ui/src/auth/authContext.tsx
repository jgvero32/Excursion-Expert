import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthContextValue {
  currentUser: User | null;
  isAuthenticating: boolean;
  authenticated: boolean;
  authError: string | React.ReactNode;
  logOut: () => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface AuthState {
  isAuthenticating: boolean;
  currentUser: User | null;
  authenticated: boolean;
  authError: string | React.ReactNode;
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';

const unauthorizedState: AuthState = {
  isAuthenticating: false,
  currentUser: null,
  authenticated: false,
  authError: '',
};

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authData, setAuthData] = useState<AuthState>(unauthorizedState);

  const checkAuthStatus = useCallback(async () => {
    try {
      setAuthData(prev => ({ ...prev, isAuthenticating: true }));
      
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: 'include', // Necessary for cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Not authenticated');
      }

      const userData = await response.json();
      
      setAuthData({
        isAuthenticating: false,
        authenticated: true,
        currentUser: userData,
        authError: '',
      });
    } catch (error) {
      setAuthData(unauthorizedState);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const logIn = async (email: string, password: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setAuthData({
        isAuthenticating: false,
        authenticated: true,
        currentUser: data.user,
        authError: '',
      });
    } catch (err: any) {
      let message: React.ReactNode;

      switch (err.message) {
        case 'Invalid username or password':
          message = 'Invalid email or password';
          break;
        case 'Account locked':
          message = (
            <span>
              Your account is locked. Please reset your password by clicking "Forgot Password" below.
            </span>
          );
          break;
        case 'Too many failed login attempts':
          message = (
            <span>
              Your account has been locked due to too many unsuccessful login attempts. 
              We've sent you an email to help reset your password.
            </span>
          );
          break;
        default:
          message = (
            <span>
              A System Error has occurred. Please try again later or contact us at{' '}
              <a href="mailto:support@yourdomain.com">support@yourdomain.com</a>
            </span>
          );
      }

      setAuthData({
        ...unauthorizedState,
        authError: message,
      });
    }
  };

  const logOut = async (): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } finally {
      setAuthData(unauthorizedState);
    }
  };

  const refreshUser = async (): Promise<void> => {
    await checkAuthStatus();
  };

  const contextValue = useMemo(
    () => ({
      logIn,
      logOut,
      refreshUser,
      ...authData,
    }),
    [authData]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Optional: Create a protected route wrapper component
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { authenticated, isAuthenticating } = useAuth();
  
  if (isAuthenticating) {
    return <div>Loading...</div>; // Or your loading component
  }
  
  if (!authenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};