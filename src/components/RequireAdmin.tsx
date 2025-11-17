import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

const RequireAdmin = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/administrationneln/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default RequireAdmin;


