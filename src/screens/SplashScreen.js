/**
 * Splash Screen
 * Shown while the app is initializing and checking authentication status
 */
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { theme, colors, typography, spacing } from '../theme/theme';

const SplashScreen = () => {
  useEffect(() => {
    // Set status bar style for splash screen
    StatusBar.setBarStyle('light-content', true);
    StatusBar.setBackgroundColor(colors.primary, true);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={colors.primary} 
        translucent={false}
      />
      
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <View style={styles.logoPlaceholder}>
          {/* Replace with actual logo image */}
          <Text style={styles.logoText}>MosalaPro</Text>
        </View>
        
        <Text style={styles.tagline}>
          Professional Service Finder
        </Text>
      </View>
      
      {/* Loading Section */}
      <View style={styles.loadingContainer}>
        <ActivityIndicator 
          size="large" 
          color={colors.white}
          style={styles.loader}
        />
        <Text style={styles.loadingText}>
          Loading...
        </Text>
      </View>
      
      {/* Version Info */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>
          Version 1.0.0
        </Text>
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
    width: 120,
    height: 120,
    backgroundColor: colors.white,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoText: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  tagline: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    color: colors.white,
    textAlign: 'center',
    opacity: 0.9,
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
    opacity: 0.8,
  },
  versionContainer: {
    position: 'absolute',
    bottom: spacing.xl,
  },
  versionText: {
    fontSize: typography.fontSize.sm,
    color: colors.white,
    opacity: 0.7,
  },
});

export default SplashScreen;