/**
 * Authentication Redux Slice
 * Manages user authentication state
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../../services/api';
import socketService from '../../services/socketService';
import { STORAGE_KEYS } from '../../constants/config';

// Async thunks for authentication actions
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiService.login(credentials);
      
      if (response.success) {
        // Store token and session info
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
        if (response.sessionId) {
          await AsyncStorage.setItem(STORAGE_KEYS.SESSION_ID, response.sessionId);
        }
        if (response.refreshToken) {
          await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
        }
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
        
        // Initialize socket connection after successful login
        try {
          await socketService.initialize();
        } catch (socketError) {
          console.warn('Failed to initialize socket after login:', socketError);
        }
        
        return {
          user: response.user,
          token: response.token,
          sessionId: response.sessionId,
          refreshToken: response.refreshToken,
        };
      } else {
        return rejectWithValue(response.message || 'Login failed');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiService.register(userData);
      
      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response.message || 'Registration failed');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const registerProvider = createAsyncThunk(
  'auth/registerProvider',
  async (providerData, { rejectWithValue }) => {
    try {
      const response = await apiService.registerProvider(providerData);
      
      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response.message || 'Provider registration failed');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Provider registration failed');
    }
  }
);

export const phoneLogin = createAsyncThunk(
  'auth/phoneLogin',
  async ({ phoneNumber, otp }, { rejectWithValue }) => {
    try {
      const response = await apiService.verifyPhoneOTP(phoneNumber, otp);
      
      if (response.success) {
        // Store token and user data
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token || 'authenticated');
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
        
        return {
          user: response.user,
          token: response.token || 'authenticated',
        };
      } else {
        return rejectWithValue(response.message || 'Phone verification failed');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Phone verification failed');
    }
  }
);

export const sendPhoneOTP = createAsyncThunk(
  'auth/sendPhoneOTP',
  async (phoneNumber, { rejectWithValue }) => {
    try {
      const response = await apiService.sendPhoneOTP(phoneNumber);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to send OTP');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await apiService.logout();
      
      // Clear all stored data
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.SESSION_ID,
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.REFRESH_TOKEN,
      ]);
      
      // Cleanup socket connection
      socketService.cleanup();
      
      return true;
    } catch (error) {
      // Even if API call fails, we should clear local storage and socket
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.SESSION_ID,
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.REFRESH_TOKEN,
      ]);
      
      socketService.cleanup();
      return true;
    }
  }
);

// Check if user is already authenticated (on app startup)
export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      const sessionId = await AsyncStorage.getItem(STORAGE_KEYS.SESSION_ID);
      
      if (token && userData) {
        return {
          user: JSON.parse(userData),
          token,
          sessionId,
        };
      } else {
        return rejectWithValue('No stored authentication');
      }
    } catch (error) {
      return rejectWithValue('Failed to check auth status');
    }
  }
);

const initialState = {
  user: null,
  token: null,
  sessionId: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,
  
  // Phone authentication specific state
  phoneAuthStep: 'phone', // 'phone' | 'otp' | 'complete'
  phoneNumber: '',
  otpSent: false,
  
  // Registration state
  registrationStep: 'type', // 'type' | 'form' | 'verification' | 'complete'
  registrationType: null, // 'user' | 'provider'
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Regular reducers for synchronous actions
    clearError: (state) => {
      state.error = null;
    },
    
    setPhoneAuthStep: (state, action) => {
      state.phoneAuthStep = action.payload;
    },
    
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
    },
    
    setRegistrationStep: (state, action) => {
      state.registrationStep = action.payload;
    },
    
    setRegistrationType: (state, action) => {
      state.registrationType = action.payload;
    },
    
    resetAuthState: (state) => {
      return { ...initialState, isInitialized: true };
    },
  },
  
  extraReducers: (builder) => {
    // Login cases
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.sessionId = action.payload.sessionId;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
      // Registration cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        // Don't set as authenticated yet, might need email verification
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Provider registration cases
      .addCase(registerProvider.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerProvider.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerProvider.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Phone authentication cases
      .addCase(sendPhoneOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendPhoneOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.otpSent = true;
        state.phoneAuthStep = 'otp';
        state.error = null;
      })
      .addCase(sendPhoneOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.otpSent = false;
      })
      
      .addCase(phoneLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(phoneLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.phoneAuthStep = 'complete';
        state.error = null;
      })
      .addCase(phoneLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        return { ...initialState, isInitialized: true };
      })
      .addCase(logoutUser.rejected, (state) => {
        // Even if logout fails, reset the state
        return { ...initialState, isInitialized: true };
      })
      
      // Check auth status cases
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.sessionId = action.payload.sessionId;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.isAuthenticated = false;
      });
  },
});

// Export actions
export const {
  clearError,
  setPhoneAuthStep,
  setPhoneNumber,
  setRegistrationStep,
  setRegistrationType,
  resetAuthState,
} = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectIsInitialized = (state) => state.auth.isInitialized;

export default authSlice.reducer;