/**
 * Loading Provider
 * Global loading state management
 */
import React, { createContext, useContext, useState } from 'react';
import {
  View,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native';
import { colors, typography, spacing } from '../theme/theme';

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');

  const showLoading = (message = 'Loading...') => {
    setLoadingMessage(message);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
    setLoadingMessage('Loading...');
  };

  const value = {
    isLoading,
    showLoading,
    hideLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      
      {/* Global Loading Modal */}
      <Modal
        visible={isLoading}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.overlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator 
              size="large" 
              color={colors.primary} 
              style={styles.loader}
            />
            <Text style={styles.loadingText}>{loadingMessage}</Text>
          </View>
        </View>
      </Modal>
    </LoadingContext.Provider>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.xl,
    alignItems: 'center',
    minWidth: 150,
    ...{
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
  },
  loader: {
    marginBottom: spacing.base,
  },
  loadingText: {
    fontSize: typography.fontSize.base,
    color: colors.onSurface,
    textAlign: 'center',
  },
});

export default LoadingProvider;