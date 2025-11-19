import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireAdmin = ({ children }) => {
  const role = localStorage.getItem('role');

  if (role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireAdmin;
