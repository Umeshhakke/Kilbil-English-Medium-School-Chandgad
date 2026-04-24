// src/components/TeacherProtectedRoute.js
import { Navigate } from 'react-router-dom';

const TeacherProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('teacherToken');
  
  if (!token) {
    return <Navigate to="/teacher/login" replace />;
  }
  
  return children;
};

export default TeacherProtectedRoute;