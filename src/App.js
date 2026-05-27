import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import EmployeesPage from "./pages/EmployeesPage";

function AppRoutes() {
    const { logout } = useAuth();

    useEffect(() => {
        const handler = () => logout();
        window.addEventListener("auth:unauthorized", handler);
        return () => window.removeEventListener("auth:unauthorized", handler);
    }, [logout]);

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
                path="/employees"
                element={
                    <ProtectedRoute>
                        <EmployeesPage />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Navigate to="/employees" replace />} />
        </Routes>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: "#faf7f2",
                            color: "#1e1b2e",
                            border: "1px solid #d6cfc4",
                            fontSize: "13px",
                        },
                        success: { iconTheme: { primary: "#34d399", secondary: "#faf7f2" } },
                        error:   { iconTheme: { primary: "#dc2626", secondary: "#faf7f2" } },
                    }}
                />
            </AuthProvider>
        </BrowserRouter>
    );
}