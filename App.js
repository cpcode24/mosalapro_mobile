/**
 * MosalaPro Mobile App
 * Professional Service Finder
 * 
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';

// Import components
import AppNavigator from './src/navigation/AppNavigator';
import { store } from './src/store/store';
import { theme } from './src/theme/theme';
import ErrorBoundary from './src/components/ErrorBoundary';
import LoadingProvider from './src/providers/LoadingProvider';
import AuthProvider from './src/providers/AuthProvider';

// Development utilities
// if (__DEV__) {
//   import ResetOnboarding from './src/utils/resetOnboarding';
// }

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
    },
  },
});

const App = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <PaperProvider theme={theme}>
            <LoadingProvider>
              <AuthProvider>
                <SafeAreaView style={styles.container}>
                  <StatusBar
                    barStyle="dark-content"
                    backgroundColor={theme.colors.primary}
                  />
                  <NavigationContainer>
                    <AppNavigator />
                  </NavigationContainer>
                </SafeAreaView>
              </AuthProvider>
            </LoadingProvider>
          </PaperProvider>
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;