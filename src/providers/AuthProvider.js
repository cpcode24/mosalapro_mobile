/**
 * Auth Provider
 * Authentication context and state management
 */
import React, { createContext, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../services/api';
import {
  selectIsAuthenticated,
  selectCurrentUser,
  selectAuthLoading,
  selectIsInitialized,
  setAuthData,
  clearAuthData,
  setInitialized
} from '../store/slices/authSlice';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  const isLoading = useSelector(selectAuthLoading);
  const isInitialized = useSelector(selectIsInitialized);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Check for stored authentication data
      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem('auth_token'),
        AsyncStorage.getItem('user_data'),
      ]);

      if (storedToken && storedUser) {
        const userData = JSON.parse(storedUser);
        
        // Validate token with backend (optional)
        const isValid = await validateToken(storedToken);
        
        if (isValid) {
          dispatch(setAuthData({
            token: storedToken,
            user: userData,
          }));
        } else {
          // Token is invalid, clear stored data
          await clearStoredAuthData();
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      await clearStoredAuthData();
    } finally {
      dispatch(setInitialized(true));
    }
  };

  const validateToken = async (token) => {
    try {
      // Validate token by attempting to fetch current user
      // This will fail if token is invalid
      await apiService.getCurrentUser();
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  };

  const storeAuthData = async (token, userData, refreshToken = null) => {
    try {
      const items = [
        AsyncStorage.setItem('auth_token', token),
        AsyncStorage.setItem('user_data', JSON.stringify(userData)),
      ];

      if (refreshToken) {
        items.push(AsyncStorage.setItem('refresh_token', refreshToken));
      }

      await Promise.all(items);
    } catch (error) {
      console.error('Error storing auth data:', error);
    }
  };

  const clearStoredAuthData = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem('auth_token'),
        AsyncStorage.removeItem('user_data'),
        AsyncStorage.removeItem('refresh_token'),
      ]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  };

  const login = async (credentials) => {
    try {
      // API call to login
      const response = await apiService.login(credentials);

      // Store auth data including refresh token if provided
      await storeAuthData(response.token, response.user, response.refreshToken);

      // Update Redux state
      dispatch(setAuthData({
        token: response.token,
        user: response.user,
      }));

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      // API call to register - use registerProvider for service providers
      const response = userData.userType === 'provider' || userData.accountType === 'provider'
        ? await apiService.registerProvider(userData)
        : await apiService.register(userData);

      // Store auth data including refresh token if provided
      await storeAuthData(response.token, response.user, response.refreshToken);

      // Update Redux state
      dispatch(setAuthData({
        token: response.token,
        user: response.user,
      }));

      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // API call to logout - apiService handles clearing local data
      await apiService.logout();

      // Clear Redux state
      dispatch(clearAuthData());
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local data even if API call fails
      await clearStoredAuthData();
      dispatch(clearAuthData());
    }
  };

  const updateUser = async (updates) => {
    try {
      // API call to update user profile
      const response = await apiService.updateProfile(updates);

      // Get updated user data from response
      const updatedUser = response.user || response;

      // Update stored data
      await AsyncStorage.setItem('user_data', JSON.stringify(updatedUser));

      // Update Redux state
      dispatch(setAuthData({
        token: await AsyncStorage.getItem('auth_token'),
        user: updatedUser,
      }));

      return updatedUser;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      if (!refreshToken) return null;

      // API call to refresh token - apiService handles storing new tokens
      const newToken = await apiService.refreshToken(refreshToken);

      // Update Redux state with new token
      dispatch(setAuthData({
        token: newToken,
        user: currentUser,
      }));

      return newToken;
    } catch (error) {
      console.error('Refresh token error:', error);
      // If refresh fails, logout user
      await logout();
      throw error;
    }
  };

  const value = {
    // State
    isAuthenticated,
    currentUser,
    isLoading,
    isInitialized,
    
    // Methods
    login,
    register,
    logout,
    updateUser,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;