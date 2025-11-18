/**
 * Booking Status Screen
 * Handles booking status updates and rescheduling
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { theme } from '../../theme/theme';

const BookingStatusScreen = ({ route, navigation }) => {
  const { bookingId, action } = route.params || {};
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);

  useEffect(() => {
    loadBookingDetails();
    if (action === 'reschedule') {
      setShowRescheduleModal(true);
      loadAvailableDates();
    }
  }, [bookingId, action]);

  useEffect(() => {
    if (selectedDate) {
      loadAvailableTimes(selectedDate);
    }
  }, [selectedDate]);

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
          image: 'https://via.placeholder.com/60x60/FF9800/FFFFFF?text=CP',
        },
        currentDate: '2024-01-20',
        currentTime: '10:00 AM',
        status: 'confirmed',
        price: 75.00,
      };

      setBooking(mockBooking);
    } catch (error) {
      console.error('Error loading booking details:', error);
      Alert.alert('Error', 'Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

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

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Missing Selection', 'Please select both date and time.');
      return;
    }

    try {
      // TODO: Replace with actual API call
      // await bookingApi.rescheduleBooking(bookingId, {
      //   date: selectedDate.dateString,
      //   time: selectedTime
      // });

      Alert.alert(
        'Booking Rescheduled',
        `Your booking has been rescheduled to ${selectedDate.displayDate} at ${selectedTime}`,
        [
          {
            text: 'OK',
            onPress: () => {
              setShowRescheduleModal(false);
              navigation.goBack();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error rescheduling booking:', error);
      Alert.alert('Error', 'Failed to reschedule booking. Please try again.');
    }
  };

  const getStatusInfo = (status) => {
    const statusInfo = {
      pending: {
        color: '#FF9800',
        icon: 'clock-outline',
        title: 'Booking Pending',
        description: 'Waiting for provider confirmation',
        actions: ['cancel']
      },
      confirmed: {
        color: '#4CAF50',
        icon: 'check-circle',
        title: 'Booking Confirmed',
        description: 'Provider has accepted your booking',
        actions: ['reschedule', 'cancel']
      },
      in_progress: {
        color: '#2196F3',
        icon: 'play-circle',
        title: 'Service In Progress',
        description: 'Provider is currently providing the service',
        actions: ['contact']
      },
      completed: {
        color: '#8BC34A',
        icon: 'check-circle',
        title: 'Service Completed',
        description: 'Service has been completed successfully',
        actions: ['rate', 'book_again']
      },
      cancelled: {
        color: '#F44336',
        icon: 'cancel',
        title: 'Booking Cancelled',
        description: 'This booking has been cancelled',
        actions: ['book_again']
      },
    };
    return statusInfo[status] || statusInfo.pending;
  };

  const renderRescheduleModal = () => (
    <Modal
      visible={showRescheduleModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowRescheduleModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Reschedule Booking</Text>
            <TouchableOpacity onPress={() => setShowRescheduleModal(false)}>
              <Icon name="close" size={24} color={theme.colors.onSurface} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {/* Current booking info */}
            <View style={styles.currentBooking}>
              <Text style={styles.currentBookingLabel}>Current Booking:</Text>
              <Text style={styles.currentBookingText}>
                {new Date(booking?.currentDate).toLocaleDateString()} at {booking?.currentTime}
              </Text>
            </View>

            {/* Date selection */}
            <Text style={styles.selectionLabel}>Select New Date:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
              {availableDates.map((dateOption, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateOption,
                    selectedDate?.dateString === dateOption.dateString && styles.selectedOption
                  ]}
                  onPress={() => setSelectedDate(dateOption)}
                >
                  <Text style={[
                    styles.dateOptionText,
                    selectedDate?.dateString === dateOption.dateString && styles.selectedOptionText
                  ]}>
                    {dateOption.displayDate}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Time selection */}
            {selectedDate && (
              <>
                <Text style={styles.selectionLabel}>Select New Time:</Text>
                <View style={styles.timeGrid}>
                  {availableTimes.map((timeOption, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.timeOption,
                        selectedTime === timeOption && styles.selectedOption
                      ]}
                      onPress={() => setSelectedTime(timeOption)}
                    >
                      <Text style={[
                        styles.timeOptionText,
                        selectedTime === timeOption && styles.selectedOptionText
                      ]}>
                        {timeOption}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowRescheduleModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalConfirmButton,
                (!selectedDate || !selectedTime) && styles.disabledButton
              ]}
              onPress={handleReschedule}
              disabled={!selectedDate || !selectedTime}
            >
              <Text style={styles.modalConfirmText}>Reschedule</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading booking status...</Text>
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle" size={64} color={theme.colors.error} />
        <Text style={styles.errorText}>Booking not found</Text>
      </View>
    );
  }

  const statusInfo = getStatusInfo(booking.status);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Status Header */}
        <View style={styles.statusHeader}>
          <View style={[styles.statusIcon, { backgroundColor: statusInfo.color }]}>
            <Icon name={statusInfo.icon} size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.statusTitle}>{statusInfo.title}</Text>
          <Text style={styles.statusDescription}>{statusInfo.description}</Text>
        </View>

        {/* Booking Info */}
        <View style={styles.bookingInfo}>
          <Text style={styles.serviceName}>{booking.serviceName}</Text>
          <Text style={styles.providerName}>by {booking.provider.name}</Text>
          
          <View style={styles.bookingDetails}>
            <View style={styles.detailRow}>
              <Icon name="calendar" size={20} color={theme.colors.primary} />
              <Text style={styles.detailText}>
                {new Date(booking.currentDate).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Icon name="clock" size={20} color={theme.colors.primary} />
              <Text style={styles.detailText}>{booking.currentTime}</Text>
            </View>
            <View style={styles.detailRow}>
              <Icon name="currency-usd" size={20} color={theme.colors.primary} />
              <Text style={styles.detailText}>${booking.price.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <Text style={styles.sectionTitle}>Booking Progress</Text>
          <View style={styles.progressBar}>
            <View style={[
              styles.progressFill,
              { 
                width: booking.status === 'completed' ? '100%' : 
                       booking.status === 'in_progress' ? '75%' :
                       booking.status === 'confirmed' ? '50%' : '25%'
              }
            ]} />
          </View>
          <View style={styles.progressSteps}>
            <Text style={styles.progressStep}>Pending</Text>
            <Text style={styles.progressStep}>Confirmed</Text>
            <Text style={styles.progressStep}>In Progress</Text>
            <Text style={styles.progressStep}>Completed</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {statusInfo.actions.includes('reschedule') && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowRescheduleModal(true)}
            >
              <Icon name="calendar-edit" size={20} color={theme.colors.primary} />
              <Text style={styles.actionButtonText}>Reschedule</Text>
            </TouchableOpacity>
          )}
          
          {statusInfo.actions.includes('cancel') && (
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelActionButton]}
              onPress={() => {
                Alert.alert(
                  'Cancel Booking',
                  'Are you sure you want to cancel this booking?',
                  [
                    { text: 'No', style: 'cancel' },
                    { text: 'Yes', onPress: () => navigation.goBack() }
                  ]
                );
              }}
            >
              <Icon name="cancel" size={20} color={theme.colors.error} />
              <Text style={[styles.actionButtonText, { color: theme.colors.error }]}>Cancel Booking</Text>
            </TouchableOpacity>
          )}
          
          {statusInfo.actions.includes('contact') && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Messages')}
            >
              <Icon name="message" size={20} color={theme.colors.primary} />
              <Text style={styles.actionButtonText}>Contact Provider</Text>
            </TouchableOpacity>
          )}
          
          {statusInfo.actions.includes('rate') && (
            <TouchableOpacity
              style={styles.primaryActionButton}
              onPress={() => navigation.navigate('Rating', { bookingId: booking.id })}
            >
              <Icon name="star" size={20} color={theme.colors.onPrimary} />
              <Text style={styles.primaryActionButtonText}>Rate Service</Text>
            </TouchableOpacity>
          )}
          
          {statusInfo.actions.includes('book_again') && (
            <TouchableOpacity
              style={styles.primaryActionButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Icon name="plus" size={20} color={theme.colors.onPrimary} />
              <Text style={styles.primaryActionButtonText}>Book Again</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {renderRescheduleModal()}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: theme.colors.error,
    marginTop: 16,
  },
  statusHeader: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: theme.colors.surface,
  },
  statusIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    marginBottom: 8,
    textAlign: 'center',
  },
  statusDescription: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
  bookingInfo: {
    padding: 20,
    backgroundColor: theme.colors.surface,
    marginTop: 8,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  providerName: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 16,
  },
  bookingDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 16,
    color: theme.colors.onSurface,
    marginLeft: 12,
  },
  progressContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.outline,
    borderRadius: 4,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  progressSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressStep: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
  },
  actionsContainer: {
    padding: 20,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  cancelActionButton: {
    borderColor: theme.colors.error,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
    marginLeft: 8,
  },
  primaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
  },
  primaryActionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onPrimary,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    maxHeight: '80%',
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
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  modalBody: {
    padding: 20,
  },
  currentBooking: {
    backgroundColor: theme.colors.surfaceVariant,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  currentBookingLabel: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 4,
  },
  currentBookingText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  selectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 12,
  },
  dateScroll: {
    marginBottom: 20,
  },
  dateOption: {
    backgroundColor: theme.colors.surfaceVariant,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 12,
  },
  selectedOption: {
    backgroundColor: theme.colors.primary,
  },
  dateOptionText: {
    fontSize: 14,
    color: theme.colors.onSurface,
  },
  selectedOptionText: {
    color: theme.colors.onPrimary,
    fontWeight: '600',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  timeOption: {
    backgroundColor: theme.colors.surfaceVariant,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  timeOptionText: {
    fontSize: 14,
    color: theme.colors.onSurface,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
  },
  modalCancelButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceVariant,
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  modalConfirmButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
  },
  disabledButton: {
    backgroundColor: theme.colors.outline,
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onPrimary,
  },
});

export default BookingStatusScreen;