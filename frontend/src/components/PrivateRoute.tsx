import { Navigate } from "react-router-dom";
import type { JSX } from "react";
import { useAuth } from "../context/AuthContext";

const PrivateRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default PrivateRoute;
