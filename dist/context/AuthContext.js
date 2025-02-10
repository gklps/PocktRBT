import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../api';
const AuthContext = createContext({
    token: null,
    user: null,
    login: () => { },
    logout: () => { },
});
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    useEffect(() => {
        const fetchUserData = async () => {
            if (token) {
                try {
                    const userData = await getProfile(token);
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                }
                catch (error) {
                    console.error('Failed to fetch user data:', error);
                    logout();
                }
            }
        };
        if (token) {
            fetchUserData();
        }
        if (token) {
            // TODO: handle origin
            if (window.opener) {
                window.opener.postMessage(token, '*');
            }
        }
    }, [token]);
    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        // TODO: handle origin
        if (window.opener) {
            window.opener.postMessage(newToken, '*');
        }
        setToken(newToken);
        navigate('/');
    };
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        navigate('/auth');
    };
    return (<AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>);
};
