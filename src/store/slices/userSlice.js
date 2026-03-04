/**
 * User Redux Slice
 * Manages user profile and preferences
 * Author: Constant Pagoui
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api';

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getCurrentUser();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user profile');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiService.updateProfile(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

export const uploadUserAvatar = createAsyncThunk(
  'user/uploadUserAvatar',
  async (avatarData, { rejectWithValue }) => {
    try {
      const response = await apiService.uploadProfilePhoto(avatarData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to upload avatar');
    }
  }
);

const initialState = {
  profile: null,
  preferences: {
    notifications: {
      pushEnabled: true,
      emailEnabled: true,
      smsEnabled: false,
      bookingReminders: true,
      marketingEmails: false,
    },
    location: {
      enabled: true,
      shareLocation: true,
    },
    appearance: {
      theme: 'light', // 'light' | 'dark' | 'system'
    },
    language: 'en',
  },
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    
    updateNotificationPreferences: (state, action) => {
      state.preferences.notifications = {
        ...state.preferences.notifications,
        ...action.payload,
      };
    },
    
    updateLocationPreferences: (state, action) => {
      state.preferences.location = {
        ...state.preferences.location,
        ...action.payload,
      };
    },
    
    updateAppearancePreferences: (state, action) => {
      state.preferences.appearance = {
        ...state.preferences.appearance,
        ...action.payload,
      };
    },
    
    setLanguage: (state, action) => {
      state.preferences.language = action.payload;
    },
    
    clearUserData: (state) => {
      return initialState;
    },
  },
  
  extraReducers: (builder) => {
    builder
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = { ...state.profile, ...action.payload };
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Upload avatar
      .addCase(uploadUserAvatar.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadUserAvatar.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.profile) {
          state.profile.avatar = action.payload.avatarUrl;
        }
        state.error = null;
      })
      .addCase(uploadUserAvatar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  clearUserError,
  updatePreferences,
  updateNotificationPreferences,
  updateLocationPreferences,
  updateAppearancePreferences,
  setLanguage,
  clearUserData,
} = userSlice.actions;

// Selectors
export const selectUserProfile = (state) => state.user.profile;
export const selectUserPreferences = (state) => state.user.preferences;
export const selectNotificationPreferences = (state) => state.user.preferences.notifications;
export const selectLocationPreferences = (state) => state.user.preferences.location;
export const selectAppearancePreferences = (state) => state.user.preferences.appearance;
export const selectUserLanguage = (state) => state.user.preferences.language;
export const selectUserLoading = (state) => state.user.isLoading;
export const selectUserError = (state) => state.user.error;

export default userSlice.reducer;