/**
 * Booking Screen
 * Handles service booking process
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
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { theme } from '../../theme/theme';

const BookingScreen = ({ route, navigation }) => {
  const { service } = route.params || {};
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAvailableDates();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      loadAvailableTimes(selectedDate);
    }
  }, [selectedDate]);

  const loadAvailableDates = () => {
    // Generate next 14 days as available dates
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date,
        dateString: date.toISOString().split('T')[0],
        displayDate: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        }),
      });
    }
    
    setAvailableDates(dates);
  };

  const loadAvailableTimes = (date) => {
    // Generate available time slots for the selected date
    const times = [
      '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
      '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
      '05:00 PM', '06:00 PM'
    ];
    
    // Randomly exclude some times to simulate real availability
    const availableTimes = times.filter(() => Math.random() > 0.3);
    
    setAvailableTimes(availableTimes);
    setSelectedTime(null); // Reset selected time when date changes
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setShowTimePicker(false);
  };

  const handleBookService = async () => {
    if (!selectedDate || !selectedTime || !address.trim()) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      
      // TODO: Replace with actual API call
      // const bookingData = {
      //   serviceId: service.id,
      //   providerId: service.provider.id,
      //   date: selectedDate.dateString,
      //   time: selectedTime,
      //   address: address.trim(),
      //   notes: notes.trim(),
      //   price: service.price
      // };
      // const response = await bookingService.createBooking(bookingData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        'Booking Confirmed!',
        `Your booking has been confirmed for ${selectedDate.displayDate} at ${selectedTime}. You will receive a confirmation email shortly.`,
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('Bookings');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error creating booking:', error);
      Alert.alert('Booking Failed', 'There was an error processing your booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderDatePicker = () => (
    <Modal
      visible={showDatePicker}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowDatePicker(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Date</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(false)}>
              <Icon name="close" size={24} color={theme.colors.onSurface} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.optionsList}>
            {availableDates.map((dateOption, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionItem,
                  selectedDate?.dateString === dateOption.dateString && styles.selectedOption
                ]}
                onPress={() => handleDateSelect(dateOption)}
              >
                <Text style={[
                  styles.optionText,
                  selectedDate?.dateString === dateOption.dateString && styles.selectedOptionText
                ]}>
                  {dateOption.displayDate}
                </Text>
                {selectedDate?.dateString === dateOption.dateString && (
                  <Icon name="check" size={20} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderTimePicker = () => (
    <Modal
      visible={showTimePicker}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowTimePicker(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Time</Text>
            <TouchableOpacity onPress={() => setShowTimePicker(false)}>
              <Icon name="close" size={24} color={theme.colors.onSurface} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.optionsList}>
            {availableTimes.map((timeOption, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionItem,
                  selectedTime === timeOption && styles.selectedOption
                ]}
                onPress={() => handleTimeSelect(timeOption)}
              >
                <Text style={[
                  styles.optionText,
                  selectedTime === timeOption && styles.selectedOptionText
                ]}>
                  {timeOption}
                </Text>
                {selectedTime === timeOption && (
                  <Icon name="check" size={20} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  if (!service) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle" size={64} color={theme.colors.error} />
        <Text style={styles.errorText}>Service information not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Service Summary */}
        <View style={styles.serviceHeader}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.providerName}>by {service.provider?.name || 'Service Provider'}</Text>
          <Text style={styles.servicePrice}>${service.price?.toFixed(2) || '0.00'}</Text>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date *</Text>
          <TouchableOpacity
            style={styles.selectionButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Icon name="calendar" size={20} color={theme.colors.primary} />
            <Text style={[
              styles.selectionText,
              selectedDate && styles.selectedText
            ]}>
              {selectedDate ? selectedDate.displayDate : 'Choose a date'}
            </Text>
            <Icon name="chevron-down" size={20} color={theme.colors.outline} />
          </TouchableOpacity>
        </View>

        {/* Time Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time *</Text>
          <TouchableOpacity
            style={[
              styles.selectionButton,
              !selectedDate && styles.disabledButton
            ]}
            onPress={() => selectedDate && setShowTimePicker(true)}
            disabled={!selectedDate}
          >
            <Icon 
              name="clock" 
              size={20} 
              color={selectedDate ? theme.colors.primary : theme.colors.outline} 
            />
            <Text style={[
              styles.selectionText,
              selectedTime && styles.selectedText,
              !selectedDate && styles.disabledText
            ]}>
              {selectedTime || 'Choose a time'}
            </Text>
            <Icon 
              name="chevron-down" 
              size={20} 
              color={selectedDate ? theme.colors.outline : theme.colors.outline} 
            />
          </TouchableOpacity>
          {!selectedDate && (
            <Text style={styles.helperText}>Please select a date first</Text>
          )}
        </View>

        {/* Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Address *</Text>
          <TextInput
            style={styles.textInput}
            value={address}
            onChangeText={setAddress}
            placeholder="Enter your full address"
            placeholderTextColor={theme.colors.outline}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Additional Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Notes</Text>
          <TextInput
            style={styles.textInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Any special instructions or requests..."
            placeholderTextColor={theme.colors.outline}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Booking Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service:</Text>
            <Text style={styles.summaryValue}>{service.name}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Provider:</Text>
            <Text style={styles.summaryValue}>{service.provider?.name || 'N/A'}</Text>
          </View>
          {selectedDate && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Date:</Text>
              <Text style={styles.summaryValue}>{selectedDate.displayDate}</Text>
            </View>
          )}
          {selectedTime && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Time:</Text>
              <Text style={styles.summaryValue}>{selectedTime}</Text>
            </View>
          )}
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotal}>Total:</Text>
            <Text style={styles.summaryTotalAmount}>${service.price?.toFixed(2) || '0.00'}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Book Button */}
      <View style={styles.bookingContainer}>
        <TouchableOpacity
          style={[
            styles.bookButton,
            (!selectedDate || !selectedTime || !address.trim()) && styles.disabledBookButton
          ]}
          onPress={handleBookService}
          disabled={loading || !selectedDate || !selectedTime || !address.trim()}
        >
          {loading ? (
            <Text style={styles.bookButtonText}>Processing...</Text>
          ) : (
            <Text style={styles.bookButtonText}>
              Confirm Booking - ${service.price?.toFixed(2) || '0.00'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {renderDatePicker()}
      {renderTimePicker()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  errorText: {
    fontSize: 18,
    color: theme.colors.error,
    marginTop: 16,
  },
  serviceHeader: {
    backgroundColor: theme.colors.surface,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  providerName: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 8,
  },
  servicePrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 12,
  },
  selectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  disabledButton: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  selectionText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.outline,
    marginLeft: 12,
  },
  selectedText: {
    color: theme.colors.onSurface,
  },
  disabledText: {
    color: theme.colors.outline,
  },
  helperText: {
    fontSize: 12,
    color: theme.colors.outline,
    marginTop: 4,
    marginLeft: 4,
  },
  textInput: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    fontSize: 16,
    color: theme.colors.onSurface,
    textAlignVertical: 'top',
  },
  summaryContainer: {
    backgroundColor: theme.colors.surface,
    margin: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
  summaryValue: {
    fontSize: 14,
    color: theme.colors.onSurface,
    fontWeight: '500',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: theme.colors.outline,
    marginVertical: 12,
  },
  summaryTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  summaryTotalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  bookingContainer: {
    padding: 20,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
  },
  bookButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledBookButton: {
    backgroundColor: theme.colors.outline,
  },
  bookButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onPrimary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  selectedOption: {
    backgroundColor: theme.colors.primaryContainer,
  },
  optionText: {
    fontSize: 16,
    color: theme.colors.onSurface,
  },
  selectedOptionText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
});

export default BookingScreen;