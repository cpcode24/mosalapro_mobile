/**
 * Booking Detail Screen
 * Displays detailed information about a specific booking
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { theme } from '../../theme/theme';

const BookingDetailScreen = ({ route, navigation }) => {
  const { bookingId, booking } = route.params || {};
  const [bookingData, setBookingData] = useState(booking || null);
  const [loading, setLoading] = useState(!booking);

  useEffect(() => {
    if (!bookingData && bookingId) {
      loadBookingDetails();
    }
  }, [bookingId, bookingData]);

  const loadBookingDetails = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await bookingApi.getBookingDetails(bookingId);
      
      // Mock booking data
      const mockBooking = {
        id: bookingId || '1',
        serviceId: 'service-1',
        serviceName: 'Professional House Cleaning',
        serviceImage: 'https://via.placeholder.com/300x200/E3F2FD/1976D2?text=Cleaning+Service',
        status: 'confirmed', // pending, confirmed, in_progress, completed, cancelled
        date: '2024-01-20',
        time: '10:00 AM',
        duration: '2-3 hours',
        price: 75.00,
        address: '123 Main Street, Apartment 4B\nNew York, NY 10001',
        notes: 'Please focus on the kitchen and living room. Pet-friendly products preferred.',
        provider: {
          id: 'provider-1',
          name: 'CleanPro Services',
          image: 'https://via.placeholder.com/80x80/FF9800/FFFFFF?text=CP',
          phone: '+1 (555) 123-4567',
          rating: 4.9,
          verified: true,
        },
        customer: {
          id: 'customer-1',
          name: 'John Doe',
          phone: '+1 (555) 987-6543',
        },
        timeline: [
          {
            id: '1',
            status: 'booking_created',
            title: 'Booking Created',
            description: 'Your booking has been submitted',
            timestamp: '2024-01-18T10:30:00Z',
            completed: true,
          },
          {
            id: '2',
            status: 'booking_confirmed',
            title: 'Booking Confirmed',
            description: 'Provider has accepted your booking',
            timestamp: '2024-01-18T14:15:00Z',
            completed: true,
          },
          {
            id: '3',
            status: 'service_started',
            title: 'Service Started',
            description: 'Provider has arrived and started the service',
            timestamp: null,
            completed: false,
          },
          {
            id: '4',
            status: 'service_completed',
            title: 'Service Completed',
            description: 'Service has been completed successfully',
            timestamp: null,
            completed: false,
          },
        ],
        paymentStatus: 'pending', // pending, paid, refunded
        canCancel: true,
        canReschedule: true,
        canRate: false,
      };

      setBookingData(mockBooking);
    } catch (error) {
      console.error('Error loading booking details:', error);
      Alert.alert('Error', 'Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#FF9800',
      confirmed: '#4CAF50',
      in_progress: '#2196F3',
      completed: '#8BC34A',
      cancelled: '#F44336',
    };
    return colors[status] || theme.colors.outline;
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      in_progress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled',
    };
    return texts[status] || status;
  };

  const handleCallProvider = () => {
    if (bookingData?.provider?.phone) {
      Linking.openURL(`tel:${bookingData.provider.phone}`);
    }
  };

  const handleMessageProvider = () => {
    // Navigate to messages with provider
    navigation.navigate('Messages', { 
      providerId: bookingData?.provider?.id,
      providerName: bookingData?.provider?.name 
    });
  };

  const handleCancelBooking = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking? This action cannot be undone.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              // TODO: Implement cancel booking API call
              // await bookingApi.cancelBooking(bookingData.id);
              
              setBookingData(prev => ({ ...prev, status: 'cancelled', canCancel: false }));
              Alert.alert('Booking Cancelled', 'Your booking has been cancelled successfully.');
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel booking. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleRescheduleBooking = () => {
    navigation.navigate('BookingStatus', { 
      bookingId: bookingData.id,
      action: 'reschedule' 
    });
  };

  const handleRateService = () => {
    navigation.navigate('Rating', { 
      bookingId: bookingData.id,
      serviceId: bookingData.serviceId,
      providerId: bookingData.provider.id 
    });
  };

  const handlePayment = () => {
    navigation.navigate('Payment', { 
      bookingId: bookingData.id,
      amount: bookingData.price 
    });
  };

  const renderTimelineItem = (item, index) => (
    <View key={item.id} style={styles.timelineItem}>
      <View style={styles.timelineIconContainer}>
        <View style={[
          styles.timelineIcon,
          { backgroundColor: item.completed ? theme.colors.primary : theme.colors.outline }
        ]}>
          <Icon
            name={item.completed ? 'check' : 'clock-outline'}
            size={16}
            color={item.completed ? theme.colors.onPrimary : theme.colors.onSurface}
          />
        </View>
        {index < bookingData.timeline.length - 1 && (
          <View style={[
            styles.timelineLine,
            { backgroundColor: item.completed ? theme.colors.primary : theme.colors.outline }
          ]} />
        )}
      </View>
      <View style={styles.timelineContent}>
        <Text style={[
          styles.timelineTitle,
          { color: item.completed ? theme.colors.onSurface : theme.colors.outline }
        ]}>
          {item.title}
        </Text>
        <Text style={styles.timelineDescription}>{item.description}</Text>
        {item.timestamp && (
          <Text style={styles.timelineTimestamp}>
            {new Date(item.timestamp).toLocaleString()}
          </Text>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading booking details...</Text>
      </View>
    );
  }

  if (!bookingData) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle" size={64} color={theme.colors.error} />
        <Text style={styles.errorText}>Booking not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Booking Header */}
        <View style={styles.headerContainer}>
          <Image
            source={{ uri: bookingData.serviceImage }}
            style={styles.serviceImage}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.serviceName}>{bookingData.serviceName}</Text>
            <View style={styles.statusContainer}>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(bookingData.status) }
              ]}>
                <Text style={styles.statusText}>{getStatusText(bookingData.status)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Booking Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Details</Text>
          <View style={styles.detailRow}>
            <Icon name="calendar" size={20} color={theme.colors.primary} />
            <Text style={styles.detailLabel}>Date & Time</Text>
            <Text style={styles.detailValue}>
              {new Date(bookingData.date).toLocaleDateString()} at {bookingData.time}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="clock" size={20} color={theme.colors.primary} />
            <Text style={styles.detailLabel}>Duration</Text>
            <Text style={styles.detailValue}>{bookingData.duration}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="currency-usd" size={20} color={theme.colors.primary} />
            <Text style={styles.detailLabel}>Price</Text>
            <Text style={styles.detailValue}>${bookingData.price.toFixed(2)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="map-marker" size={20} color={theme.colors.primary} />
            <Text style={styles.detailLabel}>Address</Text>
            <Text style={styles.detailValue}>{bookingData.address}</Text>
          </View>
          {bookingData.notes && (
            <View style={styles.detailRow}>
              <Icon name="note-text" size={20} color={theme.colors.primary} />
              <Text style={styles.detailLabel}>Notes</Text>
              <Text style={styles.detailValue}>{bookingData.notes}</Text>
            </View>
          )}
        </View>

        {/* Provider Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Provider</Text>
          <TouchableOpacity 
            style={styles.providerContainer}
            onPress={() => navigation.navigate('ProviderDetail', { provider: bookingData.provider })}
          >
            <Image
              source={{ uri: bookingData.provider.image }}
              style={styles.providerImage}
            />
            <View style={styles.providerInfo}>
              <View style={styles.providerHeader}>
                <Text style={styles.providerName}>{bookingData.provider.name}</Text>
                {bookingData.provider.verified && (
                  <Icon name="check-decagram" size={16} color={theme.colors.primary} />
                )}
              </View>
              <View style={styles.providerRating}>
                <Icon name="star" size={14} color="#FFB400" />
                <Text style={styles.ratingText}>{bookingData.provider.rating}</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={24} color={theme.colors.outline} />
          </TouchableOpacity>

          {/* Contact Buttons */}
          <View style={styles.contactButtons}>
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={handleCallProvider}
            >
              <Icon name="phone" size={20} color={theme.colors.primary} />
              <Text style={styles.contactButtonText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={handleMessageProvider}
            >
              <Icon name="message" size={20} color={theme.colors.primary} />
              <Text style={styles.contactButtonText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress</Text>
          <View style={styles.timeline}>
            {bookingData.timeline.map((item, index) => renderTimelineItem(item, index))}
          </View>
        </View>

        {/* Payment Status */}
        {bookingData.paymentStatus !== 'paid' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment</Text>
            <TouchableOpacity style={styles.paymentButton} onPress={handlePayment}>
              <Icon name="credit-card" size={20} color={theme.colors.onPrimary} />
              <Text style={styles.paymentButtonText}>
                {bookingData.paymentStatus === 'pending' ? 'Complete Payment' : 'Pay Now'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        {bookingData.canRate && (
          <TouchableOpacity style={styles.primaryButton} onPress={handleRateService}>
            <Icon name="star" size={20} color={theme.colors.onPrimary} />
            <Text style={styles.primaryButtonText}>Rate Service</Text>
          </TouchableOpacity>
        )}
        
        {bookingData.canReschedule && (
          <TouchableOpacity style={styles.secondaryButton} onPress={handleRescheduleBooking}>
            <Text style={styles.secondaryButtonText}>Reschedule</Text>
          </TouchableOpacity>
        )}
        
        {bookingData.canCancel && (
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelBooking}>
            <Text style={styles.cancelButtonText}>Cancel Booking</Text>
          </TouchableOpacity>
        )}
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
  headerContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: theme.colors.surface,
  },
  serviceImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  statusContainer: {
    alignItems: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  detailLabel: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginLeft: 12,
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.onSurface,
    fontWeight: '500',
    textAlign: 'right',
  },
  providerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  providerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  providerInfo: {
    flex: 1,
  },
  providerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginRight: 6,
  },
  providerRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: theme.colors.onSurface,
    marginLeft: 4,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
    marginLeft: 6,
  },
  timeline: {
    paddingLeft: 10,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineIconContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 4,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  timelineDescription: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 2,
  },
  timelineTimestamp: {
    fontSize: 12,
    color: theme.colors.outline,
  },
  paymentButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  paymentButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onPrimary,
    marginLeft: 8,
  },
  actionContainer: {
    padding: 20,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onPrimary,
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    marginBottom: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  cancelButton: {
    backgroundColor: theme.colors.errorContainer,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.error,
  },
});

export default BookingDetailScreen;