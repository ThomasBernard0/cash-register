import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import PrivateRoute from "./components/PrivateRoute";
import AdminPrivateRoute from "./components/AdminPrivateRoute";
import AccountHubPage from "./pages/account/AccountHubPage";
import AdminDashboardPage from "./pages/superadmin/AdminDashboardPage";
import AccountEditPage from "./pages/account/AccountEditPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route
            path="/account"
            element={<PrivateRoute element={<AccountHubPage />} />}
          />
          <Route
            path="/account/edit"
            element={<PrivateRoute element={<AccountEditPage />} />}
          />
          <Route
            path="/admin"
            element={<AdminPrivateRoute element={<AdminDashboardPage />} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
