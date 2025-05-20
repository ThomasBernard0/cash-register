import { Navigate } from "react-router-dom";
import type { JSX } from "react";
import { useAuth } from "../context/AuthContext";

const AdminPrivateRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
  const { token, account } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!account?.isSuperAdmin) {
    return <Navigate to="/account" replace />;
  }

  return element;
};

export default AdminPrivateRoute;
