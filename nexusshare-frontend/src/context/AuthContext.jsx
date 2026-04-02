import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, logoutUser, registerUser } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in (e.g., fetch profile)
  const checkAuth = async () => {
    // Since there is no 'me' endpoint, we will check if we have a persisted user in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const data = await loginUser(credentials);
      const userInfo = data.user; 
      setUser(userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.error || 'Login failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      await registerUser(userData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.error || 'Registration failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
