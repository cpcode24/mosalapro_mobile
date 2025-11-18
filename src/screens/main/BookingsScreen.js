/**
 * Bookings Screen
 * Shows user's bookings (for customers) or jobs (for providers)
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  FlatList,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, typography, spacing, shadows } from '../../theme/theme';
import { selectCurrentUser } from '../../store/slices/authSlice';

const BookingsScreen = ({ navigation, route }) => {
  const currentUser = useSelector(selectCurrentUser);
  const isProvider = currentUser?.accountType === 'provider';
  
  const [activeTab, setActiveTab] = useState('upcoming'); // upcoming, completed, cancelled
  const [refreshing, setRefreshing] = useState(false);

  // Sample data - replace with real API data
  const bookingsData = {
    upcoming: [
      {
        id: '1',
        service: 'House Cleaning',
        provider: 'Sarah Johnson',
        customer: 'John Doe',
        date: '2024-01-20',
        time: '10:00 AM',
        price: 120,
        status: 'confirmed',
        address: '123 Main St, San Francisco, CA',
        phone: '+1 (555) 123-4567',
        notes: 'Please bring eco-friendly cleaning supplies',
        duration: '3 hours',
      },
      {
        id: '2',
        service: 'Plumbing Repair',
        provider: 'Mike Smith',
        customer: 'Jane Wilson',
        date: '2024-01-22',
        time: '2:00 PM',
        price: 150,
        status: 'pending',
        address: '456 Oak Ave, San Francisco, CA',
        phone: '+1 (555) 987-6543',
        notes: 'Kitchen sink leak',
        duration: '2 hours',
      },
    ],
    completed: [
      {
        id: '3',
        service: 'Electrical Installation',
        provider: 'David Wilson',
        customer: 'Bob Johnson',
        date: '2024-01-15',
        time: '11:00 AM',
        price: 200,
        status: 'completed',
        address: '789 Pine St, San Francisco, CA',
        phone: '+1 (555) 456-7890',
        notes: 'Install ceiling fan in living room',
        duration: '2.5 hours',
        rating: 5,
        review: 'Excellent work! Very professional and clean.',
      },
    ],
    cancelled: [
      {
        id: '4',
        service: 'Garden Maintenance',
        provider: 'Lisa Green',
        customer: 'Mary Smith',
        date: '2024-01-18',
        time: '9:00 AM',
        price: 80,
        status: 'cancelled',
        address: '321 Elm St, San Francisco, CA',
        phone: '+1 (555) 234-5678',
        notes: 'Lawn mowing and trimming',
        duration: '2 hours',
        cancelledBy: 'customer',
        cancelReason: 'Weather conditions',
      },
    ],
  };

  const [bookings, setBookings] = useState(bookingsData);

  useEffect(() => {
    // Load bookings data
    loadBookings();
  }, []);

  const loadBookings = async () => {
    // API call to load bookings
    // setBookings(response.data);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  };

  const handleBookingPress = (booking) => {
    navigation.navigate('BookingDetail', { 
      bookingId: booking.id, 
      booking 
    });
  };

  const handleContactPress = (booking) => {
    const phoneNumber = booking.phone;
    Alert.alert(
      'Contact',
      `Call ${isProvider ? booking.customer : booking.provider}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => {
          // Implement phone call functionality
          console.log('Calling:', phoneNumber);
        }},
      ]
    );
  };

  const handleMessagePress = (booking) => {
    navigation.navigate('MessagesTab', { 
      conversationId: booking.id,
      recipientName: isProvider ? booking.customer : booking.provider 
    });
  };

  const handleCancelBooking = (bookingId) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          style: 'destructive',
          onPress: () => {
            // API call to cancel booking
            console.log('Cancelling booking:', bookingId);
          }
        },
      ]
    );
  };

  const handleRateService = (booking) => {
    navigation.navigate('RateService', { 
      bookingId: booking.id,
      booking 
    });
  };

  const handleRebookService = (booking) => {
    navigation.navigate('BookService', {
      serviceId: booking.service,
      providerId: booking.provider,
      prefillData: booking
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return colors.success || '#4CAF50';
      case 'pending':
        return colors.warning || '#FF9800';
      case 'completed':
        return colors.info || '#2196F3';
      case 'cancelled':
        return colors.error || '#F44336';
      default:
        return colors.gray500;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return 'check-circle';
      case 'pending':
        return 'schedule';
      case 'completed':
        return 'done-all';
      case 'cancelled':
        return 'cancel';
      default:
        return 'help';
    }
  };

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {[
        { key: 'upcoming', label: 'Upcoming', count: bookings.upcoming.length },
        { key: 'completed', label: 'Completed', count: bookings.completed.length },
        { key: 'cancelled', label: 'Cancelled', count: bookings.cancelled.length },
      ].map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tab,
            activeTab === tab.key && styles.activeTab
          ]}
          onPress={() => setActiveTab(tab.key)}
        >
          <Text style={[
            styles.tabText,
            activeTab === tab.key && styles.activeTabText
          ]}>
            {tab.label}
          </Text>
          {tab.count > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{tab.count}</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderBookingCard = ({ item: booking }) => (
    <TouchableOpacity 
      style={styles.bookingCard}
      onPress={() => handleBookingPress(booking)}
    >
      {/* Header */}
      <View style={styles.bookingHeader}>
        <View style={styles.bookingTitleContainer}>
          <Text style={styles.bookingService}>{booking.service}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
            <Icon 
              name={getStatusIcon(booking.status)} 
              size={14} 
              color={colors.white} 
            />
            <Text style={styles.statusText}>{booking.status}</Text>
          </View>
        </View>
        <Text style={styles.bookingPrice}>${booking.price}</Text>
      </View>

      {/* Details */}
      <View style={styles.bookingDetails}>
        <View style={styles.detailRow}>
          <Icon name="person" size={16} color={colors.gray600} />
          <Text style={styles.detailText}>
            {isProvider ? booking.customer : booking.provider}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Icon name="schedule" size={16} color={colors.gray600} />
          <Text style={styles.detailText}>
            {booking.date} at {booking.time} ({booking.duration})
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Icon name="location-on" size={16} color={colors.gray600} />
          <Text style={styles.detailText} numberOfLines={1}>
            {booking.address}
          </Text>
        </View>

        {booking.notes && (
          <View style={styles.detailRow}>
            <Icon name="note" size={16} color={colors.gray600} />
            <Text style={styles.detailText} numberOfLines={2}>
              {booking.notes}
            </Text>
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.bookingActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleContactPress(booking)}
        >
          <Icon name="phone" size={18} color={colors.primary} />
          <Text style={styles.actionButtonText}>Call</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleMessagePress(booking)}
        >
          <Icon name="message" size={18} color={colors.primary} />
          <Text style={styles.actionButtonText}>Message</Text>
        </TouchableOpacity>

        {activeTab === 'upcoming' && booking.status !== 'cancelled' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => handleCancelBooking(booking.id)}
          >
            <Icon name="cancel" size={18} color={colors.error} />
            <Text style={[styles.actionButtonText, styles.cancelButtonText]}>Cancel</Text>
          </TouchableOpacity>
        )}

        {activeTab === 'completed' && !booking.rating && !isProvider && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.rateButton]}
            onPress={() => handleRateService(booking)}
          >
            <Icon name="star" size={18} color={colors.warning || '#FFD700'} />
            <Text style={styles.actionButtonText}>Rate</Text>
          </TouchableOpacity>
        )}

        {activeTab === 'completed' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.rebookButton]}
            onPress={() => handleRebookService(booking)}
          >
            <Icon name="refresh" size={18} color={colors.success || '#4CAF50'} />
            <Text style={styles.actionButtonText}>Rebook</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Rating Display (for completed bookings) */}
      {activeTab === 'completed' && booking.rating && (
        <View style={styles.ratingContainer}>
          <View style={styles.ratingStars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Icon
                key={star}
                name="star"
                size={16}
                color={star <= booking.rating ? colors.warning || '#FFD700' : colors.gray300}
              />
            ))}
          </View>
          {booking.review && (
            <Text style={styles.reviewText} numberOfLines={2}>
              "{booking.review}"
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon 
        name={
          activeTab === 'upcoming' ? 'schedule' : 
          activeTab === 'completed' ? 'done-all' : 'cancel'
        } 
        size={64} 
        color={colors.gray400} 
      />
      <Text style={styles.emptyStateTitle}>
        No {activeTab} {isProvider ? 'jobs' : 'bookings'}
      </Text>
      <Text style={styles.emptyStateText}>
        {activeTab === 'upcoming' 
          ? `You don't have any upcoming ${isProvider ? 'jobs' : 'bookings'}.`
          : activeTab === 'completed'
          ? `You haven't completed any ${isProvider ? 'jobs' : 'bookings'} yet.`
          : `You don't have any cancelled ${isProvider ? 'jobs' : 'bookings'}.`
        }
      </Text>
      {activeTab === 'upcoming' && !isProvider && (
        <TouchableOpacity 
          style={styles.findServicesButton}
          onPress={() => navigation.navigate('SearchTab')}
        >
          <Text style={styles.findServicesButtonText}>Find Services</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {isProvider ? 'My Jobs' : 'My Bookings'}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('BookingCalendar')}>
          <Icon name="calendar-today" size={24} color={colors.gray700} />
        </TouchableOpacity>
      </View>

      {renderTabBar()}

      {/* Content */}
      <View style={styles.content}>
        {bookings[activeTab].length > 0 ? (
          <FlatList
            data={bookings[activeTab]}
            renderItem={renderBookingCard}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.bookingsList}
          />
        ) : (
          renderEmptyState()
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.onBackground,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.base,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray600,
  },
  activeTabText: {
    color: colors.primary,
  },
  tabBadge: {
    backgroundColor: colors.error,
    borderRadius: 10,
    marginLeft: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    minWidth: 18,
    alignItems: 'center',
  },
  tabBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },
  content: {
    flex: 1,
  },
  bookingsList: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
  },
  bookingCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    marginBottom: spacing.base,
    borderWidth: 1,
    borderColor: colors.gray200,
    ...shadows.sm,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  bookingTitleContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  bookingService: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.onSurface,
    marginBottom: spacing.xs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: colors.white,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    marginLeft: spacing.xs,
    textTransform: 'capitalize',
  },
  bookingPrice: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  bookingDetails: {
    marginBottom: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  detailText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    marginLeft: spacing.sm,
    flex: 1,
  },
  bookingActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    paddingTop: spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  actionButtonText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    marginLeft: spacing.xs,
    fontWeight: typography.fontWeight.medium,
  },
  cancelButton: {
    // Additional styles for cancel button if needed
  },
  cancelButtonText: {
    color: colors.error,
  },
  rateButton: {
    // Additional styles for rate button if needed
  },
  rebookButton: {
    // Additional styles for rebook button if needed
  },
  ratingContainer: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  ratingStars: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  reviewText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyStateTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.gray700,
    marginTop: spacing.base,
    marginBottom: spacing.sm,
  },
  emptyStateText: {
    fontSize: typography.fontSize.base,
    color: colors.gray600,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  findServicesButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.xl,
  },
  findServicesButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
});

export default BookingsScreen;