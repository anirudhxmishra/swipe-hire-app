import { createContext, useContext, useState, ReactNode } from "react";

type User = {
    id: string;
    name: string;
    email: string;
    avatar: string;
};

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User) => void;
    logout: () => void;
};


const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const storedUser = localStorage.getItem("auth_user");

    const [user, setUser] = useState<User | null>(
        storedUser ? JSON.parse(storedUser) : null
    );

    const isAuthenticated = !!user;

    const login = (user: User) => {
        localStorage.setItem("auth_user", JSON.stringify(user));
        localStorage.setItem("is_authenticated", "true");
        setUser(user);
    };

    const logout = () => {
        console.log("Logout: clearing device session");

        // Clear storage
        localStorage.removeItem("auth_user");
        localStorage.removeItem("is_authenticated");
        localStorage.removeItem("user_settings");
        localStorage.removeItem("token");

        sessionStorage.clear();

        // Clear memory
        setUser(null);

        // Prevent back button restoring session
        window.history.replaceState(null, "", "/login");
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, logout, login }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};
