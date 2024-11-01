import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './authContext';

export interface RequireAuthProps {
  children: React.ReactElement;
  redirectTo?: string;
  allowedRoles?: string[];
}

export const RequireAuth = ({ 
  children, 
  redirectTo = '/login',
  allowedRoles
}: RequireAuthProps) => {
  const { authenticated, isAuthenticating, currentUser } = useAuth();
  const { pathname, search } = useLocation();

  // Show loading state while checking authentication
  if (isAuthenticating) {
    return <div>Loading...</div>; // You can replace this with a loading component
  }

  // Check if user is not authenticated
  if (!authenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ redirectedFrom: [pathname, search].join('') }} 
        replace 
      />
    );
  }

  // Check role-based access if roles are specified
  if (allowedRoles && currentUser) {
    const hasRequiredRole = allowedRoles.includes(currentUser.role);
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};