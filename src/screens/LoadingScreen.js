/**
 * Loading Screen
 * Generic loading screen for various app states
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { colors, typography, spacing } from '../theme/theme';

const LoadingScreen = ({ message = 'Loading...', showLogo = true }) => {
  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={colors.primary} 
        translucent={false}
      />
      
      {showLogo && (
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>MosalaPro</Text>
          </View>
        </View>
      )}
      
      <View style={styles.loadingContainer}>
        <ActivityIndicator 
          size="large" 
          color={colors.white}
          style={styles.loader}
        />
        <Text style={styles.loadingText}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: colors.white,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: spacing['4xl'],
  },
  loader: {
    marginBottom: spacing.md,
  },
  loadingText: {
    fontSize: typography.fontSize.base,
    color: colors.white,
    opacity: 0.9,
  },
});

export default LoadingScreen;