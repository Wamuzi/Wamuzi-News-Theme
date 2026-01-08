
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    // Not logged in, redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (currentUser.role !== 'admin') {
    // Logged in but not an admin, redirect to home page
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
