import React from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenValid } from '../utils/jwtUtils';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  
  // Check if token exists and is not expired
  if (!isTokenValid(token)) {
    // Remove invalid/expired token
    if (token) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('Token expired or invalid, redirecting to login');
    }
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

export default ProtectedRoute;
