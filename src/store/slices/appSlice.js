/**
 * App Redux Slice
 * Manages global app state and settings
 */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // App initialization
  isAppReady: false,
  hasSeenOnboarding: false,
  
  // Network state
  isConnected: true,
  connectionType: 'wifi', // 'wifi' | 'cellular' | 'none'
  
  // Location
  currentLocation: null,
  locationPermission: 'undetermined', // 'granted' | 'denied' | 'undetermined'
  
  // App state
  activeTab: 'HomeTab',
  isVisible: true, // App is in foreground
  
  // Error handling
  globalError: null,
  
  // Feature flags
  features: {
    phoneAuth: true,
    pushNotifications: true,
    locationServices: true,
    darkMode: true,
  },
  
  // Cache settings
  lastDataSync: null,
  cacheExpiry: 30 * 60 * 1000, // 30 minutes in milliseconds
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppReady: (state, action) => {
      state.isAppReady = action.payload;
    },
    
    setHasSeenOnboarding: (state, action) => {
      state.hasSeenOnboarding = action.payload;
    },
    
    setNetworkState: (state, action) => {
      state.isConnected = action.payload.isConnected;
      state.connectionType = action.payload.connectionType;
    },
    
    setCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
    },
    
    setLocationPermission: (state, action) => {
      state.locationPermission = action.payload;
    },
    
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    
    setAppVisibility: (state, action) => {
      state.isVisible = action.payload;
    },
    
    setGlobalError: (state, action) => {
      state.globalError = action.payload;
    },
    
    clearGlobalError: (state) => {
      state.globalError = null;
    },
    
    updateFeatures: (state, action) => {
      state.features = { ...state.features, ...action.payload };
    },
    
    setLastDataSync: (state, action) => {
      state.lastDataSync = action.payload || Date.now();
    },
    
    resetAppState: (state) => {
      return { 
        ...initialState, 
        hasSeenOnboarding: state.hasSeenOnboarding,
        features: state.features,
      };
    },
  },
});

// Export actions
export const {
  setAppReady,
  setHasSeenOnboarding,
  setNetworkState,
  setCurrentLocation,
  setLocationPermission,
  setActiveTab,
  setAppVisibility,
  setGlobalError,
  clearGlobalError,
  updateFeatures,
  setLastDataSync,
  resetAppState,
} = appSlice.actions;

// Selectors
export const selectIsAppReady = (state) => state.app.isAppReady;
export const selectHasSeenOnboarding = (state) => state.app.hasSeenOnboarding;
export const selectNetworkState = (state) => ({ 
  isConnected: state.app.isConnected, 
  connectionType: state.app.connectionType 
});
export const selectCurrentLocation = (state) => state.app.currentLocation;
export const selectLocationPermission = (state) => state.app.locationPermission;
export const selectActiveTab = (state) => state.app.activeTab;
export const selectAppVisibility = (state) => state.app.isVisible;
export const selectGlobalError = (state) => state.app.globalError;
export const selectFeatures = (state) => state.app.features;
export const selectLastDataSync = (state) => state.app.lastDataSync;

// Computed selectors
export const selectIsDataStale = (state) => {
  if (!state.app.lastDataSync) return true;
  return Date.now() - state.app.lastDataSync > state.app.cacheExpiry;
};

export default appSlice.reducer;