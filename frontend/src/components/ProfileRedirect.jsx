import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProfileRedirect = () => {
  const { user } = useAuth();
  
  if (user?.role === 'STUDENT') {
    return <Navigate to="/student-profile" replace />;
  } else if (user?.role === 'FACULTY') {
    return <Navigate to="/faculty-profile" replace />;
  }
  
  return <Navigate to="/dashboard" replace />;
};

export default ProfileRedirect;