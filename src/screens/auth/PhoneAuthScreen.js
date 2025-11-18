/**
 * Phone Auth Screen
 * Allows users to authenticate using phone number
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
import { sendPhoneOTP, selectAuthLoading, selectAuthError } from '../../store/slices/authSlice';

const PhoneAuthScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [errors, setErrors] = useState({});

  const validatePhoneNumber = () => {
    const newErrors = {};
    
    if (!phoneNumber.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      // Remove all non-digits to check length
      const digitsOnly = phoneNumber.replace(/\D/g, '');
      if (digitsOnly.length < 10) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async () => {
    if (!validatePhoneNumber()) return;

    const fullPhoneNumber = `${countryCode}${phoneNumber.replace(/\D/g, '')}`;

    try {
      await dispatch(sendPhoneOTP({ phoneNumber: fullPhoneNumber })).unwrap();
      
      // Navigate to OTP verification
      navigation.navigate('OTPVerification', {
        phoneNumber: fullPhoneNumber,
        formattedNumber: `${countryCode} ${formatPhoneNumber(phoneNumber)}`,
      });
    } catch (error) {
      Alert.alert(
        'Failed to Send OTP',
        error.message || 'Unable to send verification code. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const formatPhoneNumber = (number) => {
    // Simple US phone number formatting
    const cleaned = number.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return number;
  };

  const handlePhoneChange = (text) => {
    // Allow only digits, spaces, dashes, and parentheses
    const formatted = text.replace(/[^\d\s()-]/g, '');
    setPhoneNumber(formatted);
    
    // Clear error when user starts typing
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const handleEmailLogin = () => {
    navigation.navigate('Login');
  };

  const countries = [
    { code: '+1', name: 'US/Canada', flag: '🇺🇸' },
    { code: '+44', name: 'UK', flag: '🇬🇧' },
    { code: '+33', name: 'France', flag: '🇫🇷' },
    { code: '+49', name: 'Germany', flag: '🇩🇪' },
    { code: '+91', name: 'India', flag: '🇮🇳' },
    // Add more countries as needed
  ];

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
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Phone Verification</Text>
            <Text style={styles.subtitle}>
              We'll send you a verification code to confirm your phone number
            </Text>
          </View>

          {/* Phone Input Form */}
          <View style={styles.form}>
            {/* Country Code Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Country</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.countrySelector}
                contentContainerStyle={styles.countrySelectorContent}
              >
                {countries.map((country) => (
                  <TouchableOpacity
                    key={country.code}
                    style={[
                      styles.countryOption,
                      countryCode === country.code && styles.countryOptionSelected
                    ]}
                    onPress={() => setCountryCode(country.code)}
                  >
                    <Text style={styles.countryFlag}>{country.flag}</Text>
                    <Text style={styles.countryCode}>{country.code}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Phone Number Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.phoneInputContainer}>
                <View style={styles.countryCodeDisplay}>
                  <Text style={styles.countryCodeText}>{countryCode}</Text>
                </View>
                <TextInput
                  style={[styles.phoneInput, errors.phone && styles.inputError]}
                  placeholder="Enter your phone number"
                  placeholderTextColor={colors.gray400}
                  value={phoneNumber}
                  onChangeText={handlePhoneChange}
                  keyboardType="phone-pad"
                  maxLength={14} // Limit length for formatting
                  editable={!isLoading}
                />
              </View>
              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone}</Text>
              )}
              <Text style={styles.helperText}>
                We'll send a 6-digit verification code to this number
              </Text>
            </View>

            {/* Send OTP Button */}
            <TouchableOpacity
              style={[styles.sendButton, isLoading && styles.buttonDisabled]}
              onPress={handleSendOTP}
              disabled={isLoading}
            >
              <Text style={styles.sendButtonText}>
                {isLoading ? 'Sending...' : 'Send Verification Code'}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Email Login Button */}
            <TouchableOpacity
              style={styles.emailButton}
              onPress={handleEmailLogin}
              disabled={isLoading}
            >
              <Text style={styles.emailButtonText}>📧 Continue with Email</Text>
            </TouchableOpacity>
          </View>

          {/* Privacy Notice */}
          <View style={styles.privacyNotice}>
            <Text style={styles.privacyText}>
              By continuing, you agree to receive SMS messages from MosalaPro. 
              Message and data rates may apply.
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
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray700,
    marginBottom: spacing.xs,
  },
  countrySelector: {
    maxHeight: 60,
  },
  countrySelectorContent: {
    paddingVertical: spacing.xs,
  },
  countryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.gray200,
  },
  countryOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryTransparent || colors.primary + '20',
  },
  countryFlag: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  countryCode: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.onSurface,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCodeDisplay: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.gray200,
    borderRightWidth: 0,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    justifyContent: 'center',
  },
  countryCodeText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.onSurface,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.gray200,
    borderLeftWidth: 0,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    fontSize: typography.fontSize.base,
    color: colors.onSurface,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.sm,
    marginTop: spacing.xs,
  },
  helperText: {
    color: colors.gray500,
    fontSize: typography.fontSize.sm,
    marginTop: spacing.xs,
    lineHeight: 18,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.base,
    marginBottom: spacing.lg,
    ...shadows.base,
  },
  buttonDisabled: {
    backgroundColor: colors.gray400,
  },
  sendButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray200,
  },
  dividerText: {
    color: colors.gray600,
    fontSize: typography.fontSize.sm,
    paddingHorizontal: spacing.base,
  },
  emailButton: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: spacing.base,
    borderWidth: 2,
    borderColor: colors.gray200,
    marginBottom: spacing.xl,
  },
  emailButtonText: {
    color: colors.gray700,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
  },
  privacyNotice: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.base,
  },
  privacyText: {
    color: colors.gray500,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default PhoneAuthScreen;