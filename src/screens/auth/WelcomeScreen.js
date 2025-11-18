/**
 * Welcome Screen
 * First screen users see when opening the app
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { colors, typography, spacing, shadows } from '../../theme/theme';

const WelcomeScreen = ({ navigation }) => {
  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleRegister = () => {
    navigation.navigate('RegisterType');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Logo Section */}
      <View style={styles.logoSection}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>MosalaPro</Text>
        </View>
        <Text style={styles.tagline}>
          Find Professional Services Near You
        </Text>
        <Text style={styles.subtitle}>
          Connect with trusted professionals for all your service needs
        </Text>
      </View>

      {/* Illustration/Features Section */}
      <View style={styles.featuresSection}>
        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <Text style={styles.featureIconText}>🔍</Text>
          </View>
          <Text style={styles.featureText}>Find Services</Text>
        </View>
        
        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <Text style={styles.featureIconText}>⭐</Text>
          </View>
          <Text style={styles.featureText}>Trusted Reviews</Text>
        </View>
        
        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <Text style={styles.featureIconText}>📅</Text>
          </View>
          <Text style={styles.featureText}>Easy Booking</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonSection}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
          <Text style={styles.primaryButtonText}>Sign In</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton} onPress={handleRegister}>
          <Text style={styles.secondaryButtonText}>Create Account</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.textButton}>
          <Text style={styles.textButtonText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
  },
  logoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing['2xl'],
  },
  logoContainer: {
    width: 100,
    height: 100,
    backgroundColor: colors.primary,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.lg,
  },
  logoText: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  tagline: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.onBackground,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.gray600,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.lg,
  },
  featuresSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
  },
  featureItem: {
    alignItems: 'center',
  },
  featureIcon: {
    width: 60,
    height: 60,
    backgroundColor: colors.primaryTransparent,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  featureIconText: {
    fontSize: 24,
  },
  featureText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray700,
    textAlign: 'center',
  },
  buttonSection: {
    paddingBottom: spacing['2xl'],
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.base,
    marginBottom: spacing.md,
    ...shadows.base,
  },
  primaryButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.white,
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: spacing.base,
    borderWidth: 2,
    borderColor: colors.primary,
    marginBottom: spacing.lg,
  },
  secondaryButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
    textAlign: 'center',
  },
  textButton: {
    paddingVertical: spacing.sm,
  },
  textButtonText: {
    fontSize: typography.fontSize.base,
    color: colors.gray600,
    textAlign: 'center',
  },
});

export default WelcomeScreen;