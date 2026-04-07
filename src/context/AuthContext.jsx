import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/auth.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const data = await authService.login({ email, password });
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
    };

    const register = async (userData) => {
        const data = await authService.register(userData);
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const updateProfile = async (userData) => {
        const data = await authService.updateProfile(userData);
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
    };

    const uploadLogo = async (formData) => {
        const data = await authService.uploadLogo(formData);
        const updatedUser = { ...user, logoURL: data.logoURL };
        setUser(updatedUser);
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
        return data;
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateProfile, uploadLogo, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

