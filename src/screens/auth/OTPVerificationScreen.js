/**
 * OTP Verification Screen
 * Handles verification of phone number with OTP code
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Keyboard,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { colors, typography, spacing, shadows } from '../../theme/theme';
import { 
  verifyPhoneOTP, 
  resendPhoneOTP,
  selectAuthLoading, 
  selectAuthError 
} from '../../store/slices/authSlice';

const OTPVerificationScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);
  
  const { phoneNumber, formattedNumber } = route.params;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [errors, setErrors] = useState({});

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  useEffect(() => {
    // Focus first input on mount
    inputRefs[0]?.current?.focus();
  }, []);

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

  const handleOtpChange = (index, value) => {
    // Only allow single digit
    if (value.length > 1) return;
    
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Clear errors
    if (errors.otp) {
      setErrors(prev => ({ ...prev, otp: '' }));
    }

    // Auto focus next input
    if (value && index < 5) {
      inputRefs[index + 1]?.current?.focus();
    }

    // Auto verify when all digits are entered
    if (value && index === 5) {
      const completeOtp = newOtp.join('');
      if (completeOtp.length === 6) {
        Keyboard.dismiss();
        handleVerifyOTP(completeOtp);
      }
    }
  };

  const handleKeyPress = (index, key) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      // Focus previous input on backspace
      inputRefs[index - 1]?.current?.focus();
    }
  };

  const handleVerifyOTP = async (otpCode = null) => {
    const codeToVerify = otpCode || otp.join('');
    
    if (codeToVerify.length !== 6) {
      setErrors({ otp: 'Please enter the complete 6-digit code' });
      return;
    }

    try {
      await dispatch(verifyPhoneOTP({
        phoneNumber,
        otp: codeToVerify
      })).unwrap();
      
      // OTP verified successfully - user will be redirected by auth state change
    } catch (error) {
      Alert.alert(
        'Verification Failed',
        error.message || 'Invalid verification code. Please try again.',
        [{ text: 'OK' }]
      );
      
      // Clear OTP inputs for retry
      setOtp(['', '', '', '', '', '']);
      inputRefs[0]?.current?.focus();
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    try {
      await dispatch(resendPhoneOTP({ phoneNumber })).unwrap();
      
      // Reset timer
      setTimer(60);
      setCanResend(false);
      
      Alert.alert(
        'Code Resent',
        'A new verification code has been sent to your phone.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Failed to Resend',
        error.message || 'Unable to resend verification code. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleChangePhoneNumber = () => {
    navigation.goBack();
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
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Verify Your Phone</Text>
          <Text style={styles.subtitle}>
            We've sent a 6-digit verification code to
          </Text>
          <Text style={styles.phoneNumber}>{formattedNumber}</Text>
        </View>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          <Text style={styles.otpLabel}>Enter verification code</Text>
          <View style={styles.otpInputContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={inputRefs[index]}
                style={[
                  styles.otpInput,
                  digit && styles.otpInputFilled,
                  errors.otp && styles.otpInputError
                ]}
                value={digit}
                onChangeText={(value) => handleOtpChange(index, value)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                keyboardType="numeric"
                maxLength={1}
                selectTextOnFocus
                editable={!isLoading}
              />
            ))}
          </View>
          {errors.otp && (
            <Text style={styles.errorText}>{errors.otp}</Text>
          )}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[
            styles.verifyButton,
            (isLoading || otp.join('').length < 6) && styles.buttonDisabled
          ]}
          onPress={() => handleVerifyOTP()}
          disabled={isLoading || otp.join('').length < 6}
        >
          <Text style={styles.verifyButtonText}>
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </Text>
        </TouchableOpacity>

        {/* Resend Section */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code?</Text>
          {canResend ? (
            <TouchableOpacity onPress={handleResendOTP} disabled={isLoading}>
              <Text style={styles.resendLink}>Resend Code</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.timerText}>
              Resend in {formatTimer(timer)}
            </Text>
          )}
        </View>

        {/* Change Phone Number */}
        <TouchableOpacity 
          style={styles.changePhoneButton}
          onPress={handleChangePhoneNumber}
        >
          <Text style={styles.changePhoneText}>Change phone number</Text>
        </TouchableOpacity>

        {/* Help Text */}
        <View style={styles.helpContainer}>
          <Text style={styles.helpText}>
            If you're having trouble receiving the code, make sure your phone 
            has good signal and isn't in airplane mode.
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
    paddingTop: spacing['2xl'],
    paddingBottom: spacing['2xl'],
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
    marginBottom: spacing.xs,
  },
  phoneNumber: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
  },
  otpContainer: {
    marginBottom: spacing['2xl'],
  },
  otpLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray700,
    marginBottom: spacing.base,
    textAlign: 'center',
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  otpInput: {
    width: 45,
    height: 50,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.gray200,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
    color: colors.onSurface,
  },
  otpInputFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryTransparent || colors.primary + '10',
  },
  otpInputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  verifyButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.base,
    marginBottom: spacing['2xl'],
    ...shadows.base,
  },
  buttonDisabled: {
    backgroundColor: colors.gray400,
  },
  verifyButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  resendText: {
    color: colors.gray600,
    fontSize: typography.fontSize.base,
    marginBottom: spacing.sm,
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
  changePhoneButton: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  changePhoneText: {
    color: colors.gray600,
    fontSize: typography.fontSize.sm,
    textDecorationLine: 'underline',
  },
  helpContainer: {
    paddingHorizontal: spacing.base,
  },
  helpText: {
    color: colors.gray500,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default OTPVerificationScreen;