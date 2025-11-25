/**
 * Auth Provider
 * Authentication context and state management
 */
import React, { createContext, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
      // Make API call to validate token
      // For now, return true (implement actual validation)
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  };

  const storeAuthData = async (token, userData) => {
    try {
      await Promise.all([
        AsyncStorage.setItem('auth_token', token),
        AsyncStorage.setItem('user_data', JSON.stringify(userData)),
      ]);
    } catch (error) {
      console.error('Error storing auth data:', error);
    }
  };

  const clearStoredAuthData = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem('auth_token'),
        AsyncStorage.removeItem('user_data'),
      ]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  };

  const login = async (credentials) => {
    try {
      // API call to login
      // const response = await authAPI.login(credentials);
      
      // Mock response for now
      const mockResponse = {
        token: 'mock_jwt_token',
        user: {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: credentials.email,
          accountType: 'customer',
          phone: '+1234567890',
          isVerified: true,
        }
      };

      // Store auth data
      await storeAuthData(mockResponse.token, mockResponse.user);
      
      // Update Redux state
      dispatch(setAuthData({
        token: mockResponse.token,
        user: mockResponse.user,
      }));

      return mockResponse;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      // API call to register
      // const response = await authAPI.register(userData);
      
      // Mock response for now
      const mockResponse = {
        token: 'mock_jwt_token',
        user: {
          id: '2',
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          accountType: userData.userType,
          phone: userData.phone,
          isVerified: false,
          businessName: userData.businessName,
          serviceCategory: userData.serviceCategory,
        }
      };

      // Store auth data
      await storeAuthData(mockResponse.token, mockResponse.user);
      
      // Update Redux state
      dispatch(setAuthData({
        token: mockResponse.token,
        user: mockResponse.user,
      }));

      return mockResponse;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // API call to logout (if needed)
      // await authAPI.logout();
      
      // Clear stored data
      await clearStoredAuthData();
      
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
      // API call to update user
      // const response = await authAPI.updateUser(updates);
      
      // Mock response for now
      const updatedUser = { ...currentUser, ...updates };
      
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
      const currentToken = await AsyncStorage.getItem('auth_token');
      if (!currentToken) return null;

      // API call to refresh token
      // const response = await authAPI.refreshToken(currentToken);
      
      // Mock response for now
      const newToken = 'new_mock_jwt_token';
      
      // Update stored token
      await AsyncStorage.setItem('auth_token', newToken);
      
      // Update Redux state
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