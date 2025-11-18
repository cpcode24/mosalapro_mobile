/**
 * Payment Screen
 * Handles payment processing for bookings
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { theme } from '../../theme/theme';

const PaymentScreen = ({ route, navigation }) => {
  const { bookingId, amount } = route.params || {};
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    loadBookingDetails();
  }, [bookingId]);

  const loadBookingDetails = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await bookingApi.getBookingDetails(bookingId);
      
      // Mock booking data
      const mockBooking = {
        id: bookingId || '1',
        serviceName: 'Professional House Cleaning',
        provider: {
          name: 'CleanPro Services',
        },
        date: '2024-01-20',
        time: '10:00 AM',
        subtotal: amount || 75.00,
        serviceFee: 3.75,
        tax: 6.23,
        total: (amount || 75.00) + 3.75 + 6.23,
      };

      setBooking(mockBooking);
    } catch (error) {
      console.error('Error loading booking details:', error);
      Alert.alert('Error', 'Failed to load booking details');
    }
  };

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: 'credit-card',
      description: 'Visa, Mastercard, American Express'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: 'paypal',
      description: 'Pay with your PayPal account'
    },
    {
      id: 'apple_pay',
      name: 'Apple Pay',
      icon: 'apple',
      description: 'Touch ID or Face ID'
    },
    {
      id: 'google_pay',
      name: 'Google Pay',
      icon: 'google-pay',
      description: 'Quick and secure payment'
    }
  ];

  const formatCardNumber = (text) => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, '');
    // Add spaces every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.slice(0, 19); // Limit to 16 digits + 3 spaces
  };

  const formatExpiryDate = (text) => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, '');
    // Add slash after 2 digits
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const validateCard = () => {
    if (paymentMethod === 'card') {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
        Alert.alert('Invalid Card', 'Please enter a valid card number');
        return false;
      }
      if (!expiryDate || expiryDate.length < 5) {
        Alert.alert('Invalid Expiry', 'Please enter a valid expiry date');
        return false;
      }
      if (!cvv || cvv.length < 3) {
        Alert.alert('Invalid CVV', 'Please enter a valid CVV');
        return false;
      }
      if (!cardholderName.trim()) {
        Alert.alert('Invalid Name', 'Please enter the cardholder name');
        return false;
      }
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validateCard()) {
      return;
    }

    setProcessing(true);

    try {
      // TODO: Replace with actual payment processing
      // const paymentData = {
      //   bookingId,
      //   amount: booking.total,
      //   paymentMethod,
      //   cardDetails: paymentMethod === 'card' ? {
      //     number: cardNumber.replace(/\s/g, ''),
      //     expiryDate,
      //     cvv,
      //     cardholderName
      //   } : null
      // };
      // const response = await paymentService.processPayment(paymentData);

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      Alert.alert(
        'Payment Successful!',
        `Your payment of $${booking.total.toFixed(2)} has been processed successfully.`,
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('BookingDetail', { bookingId });
            }
          }
        ]
      );
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Payment Failed', 'There was an error processing your payment. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (!booking) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading payment details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Booking Summary */}
        <View style={styles.bookingSummary}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          <Text style={styles.serviceName}>{booking.serviceName}</Text>
          <Text style={styles.providerName}>by {booking.provider.name}</Text>
          <Text style={styles.dateTime}>
            {new Date(booking.date).toLocaleDateString()} at {booking.time}
          </Text>
        </View>

        {/* Payment Method Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethodOption,
                paymentMethod === method.id && styles.selectedPaymentMethod
              ]}
              onPress={() => setPaymentMethod(method.id)}
            >
              <View style={styles.paymentMethodInfo}>
                <Icon 
                  name={method.icon} 
                  size={24} 
                  color={paymentMethod === method.id ? theme.colors.primary : theme.colors.onSurface} 
                />
                <View style={styles.paymentMethodText}>
                  <Text style={[
                    styles.paymentMethodName,
                    paymentMethod === method.id && styles.selectedText
                  ]}>
                    {method.name}
                  </Text>
                  <Text style={styles.paymentMethodDescription}>
                    {method.description}
                  </Text>
                </View>
              </View>
              <View style={[
                styles.radioButton,
                paymentMethod === method.id && styles.selectedRadioButton
              ]}>
                {paymentMethod === method.id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Card Details Form */}
        {paymentMethod === 'card' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Card Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <TextInput
                style={styles.textInput}
                value={cardNumber}
                onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                placeholder="1234 5678 9012 3456"
                keyboardType="numeric"
                maxLength={19}
              />
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Expiry Date</Text>
                <TextInput
                  style={[styles.textInput, styles.halfInput]}
                  value={expiryDate}
                  onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                  placeholder="MM/YY"
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={[styles.textInput, styles.halfInput]}
                  value={cvv}
                  onChangeText={setCvv}
                  placeholder="123"
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Cardholder Name</Text>
              <TextInput
                style={styles.textInput}
                value={cardholderName}
                onChangeText={setCardholderName}
                placeholder="John Doe"
                autoCapitalize="words"
              />
            </View>
          </View>
        )}

        {/* Price Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Breakdown</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service</Text>
            <Text style={styles.priceValue}>${booking.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service Fee</Text>
            <Text style={styles.priceValue}>${booking.serviceFee.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tax</Text>
            <Text style={styles.priceValue}>${booking.tax.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${booking.total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Security Info */}
        <View style={styles.securityInfo}>
          <Icon name="shield-check" size={20} color={theme.colors.primary} />
          <Text style={styles.securityText}>
            Your payment information is encrypted and secure
          </Text>
        </View>
      </ScrollView>

      {/* Pay Button */}
      <View style={styles.payButtonContainer}>
        <TouchableOpacity
          style={[styles.payButton, processing && styles.processingButton]}
          onPress={handlePayment}
          disabled={processing}
        >
          {processing ? (
            <Text style={styles.payButtonText}>Processing...</Text>
          ) : (
            <>
              <Icon name="lock" size={20} color={theme.colors.onPrimary} />
              <Text style={styles.payButtonText}>
                Pay ${booking.total.toFixed(2)}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.onSurface,
  },
  bookingSummary: {
    backgroundColor: theme.colors.surface,
    padding: 20,
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  providerName: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 4,
  },
  dateTime: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
  section: {
    backgroundColor: theme.colors.surface,
    padding: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 16,
  },
  paymentMethodOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    marginBottom: 12,
  },
  selectedPaymentMethod: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryContainer,
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodText: {
    marginLeft: 12,
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 2,
  },
  selectedText: {
    color: theme.colors.primary,
  },
  paymentMethodDescription: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.outline,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadioButton: {
    borderColor: theme.colors.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.colors.onSurface,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
  priceValue: {
    fontSize: 14,
    color: theme.colors.onSurface,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.outline,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: theme.colors.primaryContainer,
    marginHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  securityText: {
    fontSize: 14,
    color: theme.colors.onPrimaryContainer,
    marginLeft: 8,
  },
  payButtonContainer: {
    padding: 20,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
  },
  payButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  processingButton: {
    backgroundColor: theme.colors.outline,
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onPrimary,
    marginLeft: 8,
  },
});

export default PaymentScreen;