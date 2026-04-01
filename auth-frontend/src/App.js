import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./pages/Dashboard";
import OAuth2Success from "./pages/OAuth2Success";
import BulkEmail from "./pages/BulkEmail";
import { EmailHistoryProvider } from "./context/EmailHistoryContext";
import EmailHistoryPage from "./pages/EmailHistoryPage";
import TemplateBulkEmailPage from "./pages/TemplateBulkEmailPage";
import AITemplatePage from "./pages/AITemplatePage";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
        }
      />
      <Route path="/oauth2/success" element={<OAuth2Success />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/bulk-email"
        element={
          <ProtectedRoute>
            <MainLayout>
              <BulkEmail />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/email-history"
        element={
          <ProtectedRoute>
            <MainLayout>
              <EmailHistoryPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/template-bulk-email"
        element={
          <ProtectedRoute>
            <MainLayout>
              <TemplateBulkEmailPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-templates"
        element={
          <ProtectedRoute>
            <MainLayout>
              <AITemplatePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <EmailHistoryProvider>
          <Router>
            <AppContent />
          </Router>
        </EmailHistoryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
