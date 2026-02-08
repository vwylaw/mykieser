
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { apiClient } from './api';
import type { User, AuthResponse } from './types';

interface AuthContextType {
    user: User | null;
    login: (authData: AuthResponse) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Here we could try to restore session or fetch user profile if token exists
        const token = localStorage.getItem('token');
        if (token) {
            // In a real app we might validate token or fetch /me
            // For now, let's assume if token exists we are logged in, but we don't have user details
            // persisted, so we might need to store them or re-fetch.
            // Let's just create a dummy user or clear if invalid. 
            // Better: Store user info in localStorage too for simple persistance
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
        }
        setIsLoading(false);
    }, []);

    const login = (authData: AuthResponse) => {
        const { token, refreshtoken, identity } = authData.data;
        apiClient.setToken(token, refreshtoken);

        const userData: User = {
            id: identity.user.id,
            username: identity.user.username,
            name: identity.record.name
        };

        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        apiClient.clearToken();
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
