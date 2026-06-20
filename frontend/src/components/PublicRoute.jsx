import { Navigate } from "react-router";
import { useAuthStore } from "../store/authStore";

const PublicRoute = ({ children }) => {
  const isAuthenticated =
    useAuthStore((state) => state.isAuthenticated);

  return isAuthenticated
    
    ? <Navigate to="/dashboard" replace/>
    : children;
};

export default PublicRoute;