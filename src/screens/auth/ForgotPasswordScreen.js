/**
 * Forgot Password Screen
 * Allows users to reset their password via email
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { colors, typography, spacing, shadows } from '../../theme/theme';
import { resetPassword, selectAuthLoading, selectAuthError } from '../../store/slices/authSlice';

const ForgotPasswordScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);

  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async () => {
    if (!validateEmail()) return;

    try {
      await dispatch(resetPassword({ 
        email: email.trim().toLowerCase() 
      })).unwrap();
      
      setIsSubmitted(true);
    } catch (error) {
      Alert.alert(
        'Reset Failed',
        error.message || 'Unable to send reset email. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  const handleResendEmail = async () => {
    try {
      await dispatch(resetPassword({ 
        email: email.trim().toLowerCase() 
      })).unwrap();
      
      Alert.alert(
        'Email Resent',
        'We\'ve sent another reset link to your email address.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Failed to Resend',
        error.message || 'Unable to resend reset email. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const updateEmail = (value) => {
    setEmail(value);
    // Clear error when user starts typing
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  if (isSubmitted) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        
        <View style={styles.content}>
          {/* Success Header */}
          <View style={styles.successHeader}>
            <View style={styles.successIcon}>
              <Text style={styles.successIconText}>📧</Text>
            </View>
            <Text style={styles.successTitle}>Check Your Email</Text>
            <Text style={styles.successSubtitle}>
              We've sent a password reset link to:
            </Text>
            <Text style={styles.emailAddress}>{email}</Text>
          </View>

          {/* Instructions */}
          <View style={styles.instructions}>
            <Text style={styles.instructionTitle}>Next steps:</Text>
            <View style={styles.instructionList}>
              <Text style={styles.instructionItem}>
                1. Check your email inbox (and spam folder)
              </Text>
              <Text style={styles.instructionItem}>
                2. Click the reset link in the email
              </Text>
              <Text style={styles.instructionItem}>
                3. Create your new password
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResendEmail}
              disabled={isLoading}
            >
              <Text style={styles.resendButtonText}>
                {isLoading ? 'Sending...' : 'Resend Email'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackToLogin}
            >
              <Text style={styles.backButtonText}>Back to Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* Help Text */}
          <View style={styles.helpSection}>
            <Text style={styles.helpText}>
              Didn't receive the email? Check your spam folder or try a different email address.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.headerBackButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.headerBackButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter your email address and we'll send you a link to reset your password
            </Text>
          </View>

          {/* Reset Form */}
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Enter your email address"
                placeholderTextColor={colors.gray400}
                value={email}
                onChangeText={updateEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* Reset Button */}
            <TouchableOpacity
              style={[styles.resetButton, isLoading && styles.buttonDisabled]}
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              <Text style={styles.resetButtonText}>
                {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
              </Text>
            </TouchableOpacity>

            {/* Back to Login */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleBackToLogin}
            >
              <Text style={styles.loginButtonText}>
                ← Back to Sign In
              </Text>
            </TouchableOpacity>
          </View>

          {/* Security Notice */}
          <View style={styles.securityNotice}>
            <Text style={styles.securityTitle}>🔒 Security Notice</Text>
            <Text style={styles.securityText}>
              For your security, the reset link will expire in 24 hours. 
              If you don't receive the email within a few minutes, please check your spam folder.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  header: {
    paddingTop: spacing['2xl'],
    paddingBottom: spacing.xl,
  },
  headerBackButton: {
    marginBottom: spacing.lg,
  },
  headerBackButtonText: {
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
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray700,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    fontSize: typography.fontSize.base,
    color: colors.onSurface,
    borderWidth: 2,
    borderColor: colors.gray200,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.sm,
    marginTop: spacing.xs,
  },
  resetButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.base,
    marginBottom: spacing.lg,
    ...shadows.base,
  },
  buttonDisabled: {
    backgroundColor: colors.gray400,
  },
  resetButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },
  loginButton: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  loginButtonText: {
    color: colors.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  securityNotice: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    marginTop: spacing.xl,
    marginBottom: spacing['2xl'],
    borderLeftWidth: 4,
    borderLeftColor: colors.warning || colors.primary,
  },
  securityTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.onSurface,
    marginBottom: spacing.xs,
  },
  securityText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    lineHeight: 18,
  },
  // Success screen styles
  successHeader: {
    alignItems: 'center',
    paddingTop: spacing['4xl'],
    paddingBottom: spacing['2xl'],
  },
  successIcon: {
    width: 80,
    height: 80,
    backgroundColor: colors.primaryTransparent || colors.primary + '20',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  successIconText: {
    fontSize: 32,
  },
  successTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.onBackground,
    marginBottom: spacing.sm,
  },
  successSubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.gray600,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  emailAddress: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
    textAlign: 'center',
  },
  instructions: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    marginBottom: spacing.xl,
  },
  instructionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.onSurface,
    marginBottom: spacing.sm,
  },
  instructionList: {
    paddingLeft: spacing.sm,
  },
  instructionItem: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  actionButtons: {
    marginBottom: spacing.xl,
  },
  resendButton: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: spacing.base,
    borderWidth: 2,
    borderColor: colors.primary,
    marginBottom: spacing.base,
  },
  resendButtonText: {
    color: colors.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },
  backButton: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  backButtonText: {
    color: colors.gray600,
    fontSize: typography.fontSize.base,
  },
  helpSection: {
    paddingHorizontal: spacing.base,
  },
  helpText: {
    color: colors.gray500,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default ForgotPasswordScreen;