import { Navigate } from "react-router-dom";

const ClerkProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("clerkToken");
  if (!token) return <Navigate to="/clerk/login" replace />;
  return children;
};

export default ClerkProtectedRoute;