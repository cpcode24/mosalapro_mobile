/**
 * Email Verification Screen
 * Displayed after registration to verify email address
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { colors, typography, spacing, shadows } from '../../theme/theme';
import { 
  resendVerificationEmail,
  checkVerificationStatus,
  selectAuthLoading, 
  selectUser 
} from '../../store/slices/authSlice';

const EmailVerificationScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectAuthLoading);
  const user = useSelector(selectUser);
  
  const email = route.params?.email || user?.email || '';
  
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);

  useEffect(() => {
    // Start countdown timer
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  useEffect(() => {
    // Check verification status periodically
    const statusInterval = setInterval(async () => {
      try {
        setCheckingStatus(true);
        const result = await dispatch(checkVerificationStatus()).unwrap();
        if (result.isVerified) {
          clearInterval(statusInterval);
          // User is verified, navigation will be handled by auth state change
        }
      } catch (error) {
        // Ignore errors during status check
      } finally {
        setCheckingStatus(false);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(statusInterval);
  }, [dispatch]);

  const handleResendEmail = async () => {
    if (!canResend) return;

    try {
      await dispatch(resendVerificationEmail({ email })).unwrap();
      
      // Reset timer
      setTimer(60);
      setCanResend(false);
      
      Alert.alert(
        'Email Resent',
        'A new verification email has been sent to your inbox.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Failed to Resend',
        error.message || 'Unable to resend verification email. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleChangeEmail = () => {
    navigation.goBack();
  };

  const handleCheckStatus = async () => {
    try {
      setCheckingStatus(true);
      const result = await dispatch(checkVerificationStatus()).unwrap();
      
      if (result.isVerified) {
        Alert.alert(
          'Email Verified!',
          'Your email has been successfully verified.',
          [{ text: 'Continue', onPress: () => {
            // Navigation will be handled by auth state change
          }}]
        );
      } else {
        Alert.alert(
          'Not Verified Yet',
          'Your email hasn\'t been verified yet. Please check your inbox and click the verification link.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Check Failed',
        error.message || 'Unable to check verification status. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleSkipForNow = () => {
    Alert.alert(
      'Skip Verification?',
      'You can verify your email later, but some features may be limited until you do.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Skip', 
          style: 'destructive',
          onPress: () => {
            // Continue to main app without verification
            // This should be handled by your auth flow
            navigation.navigate('MainApp');
          }
        }
      ]
    );
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>📧</Text>
          </View>
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>
            We've sent a verification email to:
          </Text>
          <Text style={styles.emailAddress}>{email}</Text>
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionTitle}>To complete your registration:</Text>
          <View style={styles.instructionList}>
            <Text style={styles.instructionItem}>
              1. Check your email inbox (and spam folder)
            </Text>
            <Text style={styles.instructionItem}>
              2. Click the verification link in the email
            </Text>
            <Text style={styles.instructionItem}>
              3. Return to this app to continue
            </Text>
          </View>
        </View>

        {/* Status Check */}
        <TouchableOpacity
          style={[styles.checkButton, checkingStatus && styles.buttonDisabled]}
          onPress={handleCheckStatus}
          disabled={checkingStatus}
        >
          <Text style={styles.checkButtonText}>
            {checkingStatus ? 'Checking...' : 'I\'ve Verified My Email'}
          </Text>
        </TouchableOpacity>

        {/* Resend Section */}
        <View style={styles.resendSection}>
          <Text style={styles.resendText}>Didn't receive the email?</Text>
          {canResend ? (
            <TouchableOpacity 
              onPress={handleResendEmail} 
              disabled={isLoading}
              style={styles.resendButton}
            >
              <Text style={styles.resendLink}>
                {isLoading ? 'Sending...' : 'Resend Email'}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.timerText}>
              Resend available in {formatTimer(timer)}
            </Text>
          )}
        </View>

        {/* Change Email */}
        <TouchableOpacity 
          style={styles.changeEmailButton}
          onPress={handleChangeEmail}
        >
          <Text style={styles.changeEmailText}>Use a different email address</Text>
        </TouchableOpacity>

        {/* Skip Option */}
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={handleSkipForNow}
        >
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>

        {/* Help Section */}
        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Having trouble?</Text>
          <Text style={styles.helpText}>
            • Check your spam/junk folder{'\n'}
            • Make sure the email address is correct{'\n'}
            • Contact support if you continue having issues
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing['4xl'],
    paddingBottom: spacing['2xl'],
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: colors.primaryTransparent || colors.primary + '20',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconText: {
    fontSize: 32,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.onBackground,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
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
  checkButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.base,
    marginBottom: spacing.xl,
    ...shadows.base,
  },
  buttonDisabled: {
    backgroundColor: colors.gray400,
  },
  checkButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },
  resendSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  resendText: {
    color: colors.gray600,
    fontSize: typography.fontSize.base,
    marginBottom: spacing.sm,
  },
  resendButton: {
    paddingVertical: spacing.xs,
  },
  resendLink: {
    color: colors.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  timerText: {
    color: colors.gray500,
    fontSize: typography.fontSize.base,
  },
  changeEmailButton: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  changeEmailText: {
    color: colors.gray600,
    fontSize: typography.fontSize.sm,
    textDecorationLine: 'underline',
  },
  skipButton: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  skipText: {
    color: colors.gray500,
    fontSize: typography.fontSize.sm,
  },
  helpSection: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    marginBottom: spacing.xl,
  },
  helpTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.onSurface,
    marginBottom: spacing.sm,
  },
  helpText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    lineHeight: 18,
  },
});

export default EmailVerificationScreen;