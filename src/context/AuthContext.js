import { createContext, useContext, useState, useCallback, useEffect } from "react";
import api from "../services/api";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser]       = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const saved  = localStorage.getItem("user");
        if (token && saved) {
            setUser(JSON.parse(saved));
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        setLoading(false);
    }, []);

    const login = useCallback(async (username, password, _turnstileToken) => {
        const data = await authService.login(username, password);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        setUser(data.user);
        return data;
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete api.defaults.headers.common["Authorization"];
        setUser(null);
    }, []);

    const isAdmin = useCallback(() => {
        return user?.role === "ADMIN";
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
    return ctx;
};
