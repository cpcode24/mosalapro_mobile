/**
 * Register Type Screen
 * Allows users to choose between Customer and Service Provider registration
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { colors, typography, spacing, shadows } from '../../theme/theme';

const RegisterTypeScreen = ({ navigation }) => {
  const handleCustomerRegister = () => {
    navigation.navigate('Register', { userType: 'customer' });
  };

  const handleProviderRegister = () => {
    navigation.navigate('Register', { userType: 'provider' });
  };

  const handleSignIn = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Join MosalaPro</Text>
          <Text style={styles.subtitle}>Choose how you'd like to get started</Text>
        </View>

        {/* Registration Options */}
        <View style={styles.optionsContainer}>
          {/* Customer Option */}
          <TouchableOpacity 
            style={styles.optionCard}
            onPress={handleCustomerRegister}
            activeOpacity={0.7}
          >
            <View style={styles.optionIconContainer}>
              <Text style={styles.optionIcon}>🏠</Text>
            </View>
            <Text style={styles.optionTitle}>I need services</Text>
            <Text style={styles.optionDescription}>
              Find and book trusted professionals for your home and business needs
            </Text>
            <View style={styles.optionFeatures}>
              <Text style={styles.featureItem}>• Browse services near you</Text>
              <Text style={styles.featureItem}>• Read reviews and ratings</Text>
              <Text style={styles.featureItem}>• Book appointments easily</Text>
              <Text style={styles.featureItem}>• Secure payment options</Text>
            </View>
            <View style={styles.optionButton}>
              <Text style={styles.optionButtonText}>Sign up as Customer</Text>
            </View>
          </TouchableOpacity>

          {/* Service Provider Option */}
          <TouchableOpacity 
            style={styles.optionCard}
            onPress={handleProviderRegister}
            activeOpacity={0.7}
          >
            <View style={styles.optionIconContainer}>
              <Text style={styles.optionIcon}>🔧</Text>
            </View>
            <Text style={styles.optionTitle}>I provide services</Text>
            <Text style={styles.optionDescription}>
              Grow your business by connecting with customers who need your expertise
            </Text>
            <View style={styles.optionFeatures}>
              <Text style={styles.featureItem}>• Create your professional profile</Text>
              <Text style={styles.featureItem}>• Showcase your work and skills</Text>
              <Text style={styles.featureItem}>• Receive booking requests</Text>
              <Text style={styles.featureItem}>• Manage your schedule</Text>
            </View>
            <View style={[styles.optionButton, styles.providerButton]}>
              <Text style={[styles.optionButtonText, styles.providerButtonText]}>
                Sign up as Service Provider
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Sign In Link */}
        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Already have an account? </Text>
          <TouchableOpacity onPress={handleSignIn}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
  },
  header: {
    paddingTop: spacing['2xl'],
    paddingBottom: spacing.xl,
  },
  backButton: {
    marginBottom: spacing.lg,
  },
  backButtonText: {
    fontSize: 24,
    color: colors.gray600,
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.onBackground,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.gray600,
  },
  optionsContainer: {
    flex: 1,
    paddingVertical: spacing.lg,
  },
  optionCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.gray200,
    ...shadows.base,
  },
  optionIconContainer: {
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  optionIcon: {
    fontSize: 48,
  },
  optionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  optionDescription: {
    fontSize: typography.fontSize.base,
    color: colors.gray600,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  optionFeatures: {
    marginBottom: spacing.lg,
  },
  featureItem: {
    fontSize: typography.fontSize.sm,
    color: colors.gray700,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  optionButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.base,
    alignItems: 'center',
  },
  providerButton: {
    backgroundColor: colors.secondary || colors.accent,
  },
  optionButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  providerButtonText: {
    color: colors.white,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  signInText: {
    color: colors.gray600,
    fontSize: typography.fontSize.base,
  },
  signInLink: {
    color: colors.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
});

export default RegisterTypeScreen;