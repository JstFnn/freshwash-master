import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import userService from '../services/userService';

// Create context
const AuthContext = createContext();

/**
 * Authentication Provider Component
 * Manages authentication state globally
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        
        // If token exists, try to fetch user profile
        if (authService.isAuthenticated()) {
          const { data } = await userService.getProfile();
          setUser(data);
        }
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setError('Authentication failed. Please login again.');
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  /**
   * Login a user
   * @param {Object} credentials - User credentials
   * @returns {Promise} Login result
   */
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      // Login user
      const response = await authService.login(credentials);
      
      // Fetch user profile
      const { data } = await userService.getProfile();
      setUser(data);
      
      return response;
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} Registration result
   */
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Register user
      const response = await authService.register(userData);
      
      // Fetch user profile if registration includes authentication
      if (authService.isAuthenticated()) {
        const { data } = await userService.getProfile();
        setUser(data);
      }
      
      return response;
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout the current user
   */
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  /**
   * Update user data after profile changes
   */
  const updateUserData = async () => {
    try {
      const { data } = await userService.getProfile();
      setUser(data);
    } catch (err) {
      console.error('Failed to update user data:', err);
    }
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUserData,
    isAuthenticated: authService.isAuthenticated()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use auth context
 * @returns {Object} Auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};