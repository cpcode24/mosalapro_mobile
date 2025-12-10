/**
 * Redux Store Configuration
 * Central state management for the MosalaPro mobile app
 */
import { configureStore } from '@reduxjs/toolkit';
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import reducers
import authSlice from './slices/authSlice';
import userSlice from './slices/userSlice';
import providersSlice from './slices/providersSlice';
import bookingsSlice from './slices/bookingsSlice';
import notificationsSlice from './slices/notificationsSlice';
import appSlice from './slices/appSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'user', 'app'], // Only persist these reducers
  blacklist: ['providers', 'bookings', 'notifications'], // Don't persist these (they should be fresh)
};

// Root reducer
const rootReducer = {
  auth: authSlice,
  user: userSlice,
  providers: providersSlice,
  bookings: bookingsSlice,
  notifications: notificationsSlice,
  app: appSlice,
};

// Create persisted reducer
const persistedAuthReducer = persistReducer(
  {
    key: 'auth',
    storage: AsyncStorage,
  },
  authSlice
);

const persistedUserReducer = persistReducer(
  {
    key: 'user',
    storage: AsyncStorage,
  },
  userSlice
);

const persistedAppReducer = persistReducer(
  {
    key: 'app',
    storage: AsyncStorage,
  },
  appSlice
);

// Configure store
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    user: persistedUserReducer,
    app: persistedAppReducer,
    providers: providersSlice,
    bookings: bookingsSlice,
    notifications: notificationsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: __DEV__, // Enable Redux DevTools in development
});

// Create persistor
export const persistor = persistStore(store);

// Types for TypeScript (if you decide to use TypeScript later)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default { store, persistor };