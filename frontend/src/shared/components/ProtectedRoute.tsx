import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return null;
  return user ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

export default ProtectedRoute;
