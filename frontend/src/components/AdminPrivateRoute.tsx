import { Navigate } from "react-router-dom";
import type { JSX } from "react";
import { useAuth } from "../context/AuthContext";

const AdminPrivateRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
  const { authState } = useAuth();

  if (authState.loading) return;

  if (!authState.token) {
    return <Navigate to="/" replace />;
  }

  if (!authState.account?.isSuperAdmin) {
    return <Navigate to="/account" replace />;
  }

  return element;
};

export default AdminPrivateRoute;
