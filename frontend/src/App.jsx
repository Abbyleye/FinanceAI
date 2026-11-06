
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./pages/DashboardLayout";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Demo from "./pages/Demo";
import PWAUpdatePrompt from "./PWAUpdatePrompt";
import PWAInstallPrompt from "./PWAInstallPrompt";

function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem("financeai_access_token");
  return token ? children : <Navigate to="/login" replace />;
}

function FinancePage({ view }) {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Dashboard view={view} />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <BrowserRouter>
      <PWAUpdatePrompt />
      <PWAInstallPrompt />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/dashboard" element={<FinancePage view="dashboard" />} />
        <Route path="/expenses" element={<FinancePage view="expenses" />} />
        <Route path="/budgets" element={<FinancePage view="budgets" />} />
        <Route path="/insights" element={<FinancePage view="insights" />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;