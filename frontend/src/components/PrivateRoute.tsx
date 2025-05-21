import { Navigate } from "react-router-dom";
import type { JSX } from "react";
import { useAuth } from "../context/AuthContext";

const PrivateRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
  const { authState } = useAuth();

  if (authState.loading) return;

  if (!authState.token) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default PrivateRoute;
