import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Spinner } from "../ui";

export function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">
                <Spinner size={32} />
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;
    return children;
}