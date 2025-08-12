import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  console.log("ProtectedRoute isLoggedIn:", isLoggedIn, "loading:", loading);
  if (loading) {
    return <div>Loading...</div>;
  }
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" />;
};
export default ProtectedRoute;