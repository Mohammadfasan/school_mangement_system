import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  // Normalize user data
  const normalizeUser = (userData) => {
    console.log('🔍 [AuthContext] Raw user data for normalization:', userData);
    
    // Handle different response structures
    const user = userData.user || userData.data?.user || userData.data || userData;
    
    // Create a normalized user object with proper fallbacks
    const normalizedUser = {
      id: user._id || user.id,
      name: user.name || user.username || user.fullName || 'Admin User',
      email: user.email,
      role: user.role || user.userType || 'administrator',
      // Include all original fields
      ...user
    };

    console.log('✅ [AuthContext] Normalized user:', normalizedUser);
    return normalizedUser;
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    console.log('🔍 [AuthContext] Checking auth, token exists:', !!token);
    if (token) {
      try {
        const response = await authService.getMe();
        const normalizedUser = normalizeUser(response.data);
        setUser(normalizedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('❌ [AuthContext] Failed to fetch user data:', error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const signin = async (credentials) => {
    setAuthLoading(true);
    try {
      console.log('🔍 [AuthContext] Signin started with:', credentials.email);
      const response = await authService.signin(credentials);
      
      // Extract token and user data from response
      const { token, user: userData } = response.data.data; 
      
      // Pass the user object directly for normalization
      const normalizedUser = normalizeUser(userData); 
      
      localStorage.setItem('token', token);
      setUser(normalizedUser);
      setIsAuthenticated(true);
      
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Signin failed';
      throw new Error(message);
    } finally {
      setAuthLoading(false);
    }
  };

  const signup = async (userData) => {
    setAuthLoading(true);
    try {
      const response = await authService.signup(userData);
      
      // Check for nested token/data
      if (response.data.data?.token) {
        // Pull 'token' and 'user' from response.data.data
        const { token, user: userData } = response.data.data; 
        
        // Pass the user object directly for normalization
        const normalizedUser = normalizeUser(userData); 
        
        localStorage.setItem('token', token);
        setUser(normalizedUser);
        setIsAuthenticated(true);
      }
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed';
      console.error('❌ [AuthContext] Signup error:', error);
      throw new Error(message);
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    loading,
    authLoading,
    isAuthenticated,
    signin,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};