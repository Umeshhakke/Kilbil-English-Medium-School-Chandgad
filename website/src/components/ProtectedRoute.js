// src/components/ProtectedRoute.js
import { Navigate } from "react-router-dom";
import React from "react";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  const isAuthenticated = localStorage.getItem("adminAuth") === "true" && token;

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default React.memo(ProtectedRoute);