/**
 * Home Screen
 * Main dashboard for both customers and service providers
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
  Dimensions,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, typography, spacing, shadows } from '../../theme/theme';
import { selectCurrentUser, selectIsAuthenticated } from '../../store/slices/authSlice';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  const [refreshing, setRefreshing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Your Location');
  
  const isProvider = currentUser?.accountType === 'provider';

  useEffect(() => {
    // Get user's current location
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    // Implement location fetching
    // For now, using placeholder
    setCurrentLocation('San Francisco, CA');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Refresh data
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleSearch = () => {
    navigation.navigate('SearchTab');
  };

  const handleViewAllServices = () => {
    navigation.navigate('SearchTab', { category: 'all' });
  };

  const handleServicePress = (serviceId) => {
    navigation.navigate('SearchTab', { serviceId });
  };

  const handleBookingPress = (bookingId) => {
    navigation.navigate('BookingsTab', { bookingId });
  };

  const handleNotifications = () => {
    navigation.navigate('Notifications');
  };

  // Sample data - replace with real data from API
  const popularServices = [
    { id: '1', name: 'House Cleaning', icon: '🏠', price: 'From $50', rating: 4.8 },
    { id: '2', name: 'Plumbing', icon: '🔧', price: 'From $80', rating: 4.7 },
    { id: '3', name: 'Electrical', icon: '⚡', price: 'From $100', rating: 4.9 },
    { id: '4', name: 'Handyman', icon: '🔨', price: 'From $60', rating: 4.6 },
  ];

  const recentBookings = [
    { id: '1', service: 'House Cleaning', provider: 'Sarah Johnson', date: '2024-01-15', status: 'completed' },
    { id: '2', service: 'Plumbing Repair', provider: 'Mike Smith', date: '2024-01-12', status: 'upcoming' },
  ];

  const providerStats = {
    totalJobs: 47,
    activeJobs: 3,
    monthlyEarnings: 2850,
    rating: 4.8,
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.locationContainer}>
          <Icon name="location-on" size={16} color={colors.gray600} />
          <Text style={styles.locationText}>{currentLocation}</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton} onPress={handleNotifications}>
          <Icon name="notifications" size={24} color={colors.gray700} />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>
          Hello, {currentUser?.firstName || 'User'}! 👋
        </Text>
        <Text style={styles.welcomeSubtext}>
          {isProvider ? 'Manage your services and bookings' : 'What service do you need today?'}
        </Text>
      </View>
    </View>
  );

  const renderSearchBar = () => (
    <TouchableOpacity style={styles.searchBar} onPress={handleSearch}>
      <Icon name="search" size={20} color={colors.gray500} />
      <Text style={styles.searchPlaceholder}>Search for services...</Text>
      <Icon name="filter-list" size={20} color={colors.gray500} />
    </TouchableOpacity>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActions}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionButtons}>
        {isProvider ? (
          <>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('AddService')}>
              <Icon name="add" size={24} color={colors.primary} />
              <Text style={styles.actionButtonText}>Add Service</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('BookingsTab')}>
              <Icon name="work" size={24} color={colors.primary} />
              <Text style={styles.actionButtonText}>My Jobs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Earnings')}>
              <Icon name="attach-money" size={24} color={colors.primary} />
              <Text style={styles.actionButtonText}>Earnings</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('SearchTab')}>
              <Icon name="search" size={24} color={colors.primary} />
              <Text style={styles.actionButtonText}>Find Services</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('BookingsTab')}>
              <Icon name="book" size={24} color={colors.primary} />
              <Text style={styles.actionButtonText}>My Bookings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Favorites')}>
              <Icon name="favorite" size={24} color={colors.primary} />
              <Text style={styles.actionButtonText}>Favorites</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  const renderProviderStats = () => (
    <View style={styles.statsContainer}>
      <Text style={styles.sectionTitle}>Your Statistics</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{providerStats.totalJobs}</Text>
          <Text style={styles.statLabel}>Total Jobs</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{providerStats.activeJobs}</Text>
          <Text style={styles.statLabel}>Active Jobs</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>${providerStats.monthlyEarnings}</Text>
          <Text style={styles.statLabel}>This Month</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{providerStats.rating} ⭐</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>
    </View>
  );

  const renderPopularServices = () => (
    <View style={styles.servicesContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular Services</Text>
        <TouchableOpacity onPress={handleViewAllServices}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {popularServices.map((service) => (
          <TouchableOpacity 
            key={service.id} 
            style={styles.serviceCard}
            onPress={() => handleServicePress(service.id)}
          >
            <Text style={styles.serviceIcon}>{service.icon}</Text>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.servicePrice}>{service.price}</Text>
            <View style={styles.serviceRating}>
              <Icon name="star" size={14} color={colors.warning || '#FFD700'} />
              <Text style={styles.ratingText}>{service.rating}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderRecentBookings = () => (
    <View style={styles.bookingsContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {isProvider ? 'Recent Jobs' : 'Recent Bookings'}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('BookingsTab')}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      {recentBookings.map((booking) => (
        <TouchableOpacity 
          key={booking.id} 
          style={styles.bookingCard}
          onPress={() => handleBookingPress(booking.id)}
        >
          <View style={styles.bookingInfo}>
            <Text style={styles.bookingService}>{booking.service}</Text>
            <Text style={styles.bookingProvider}>
              {isProvider ? `Customer: ${booking.provider}` : `Provider: ${booking.provider}`}
            </Text>
            <Text style={styles.bookingDate}>{booking.date}</Text>
          </View>
          <View style={[
            styles.statusBadge, 
            booking.status === 'completed' ? styles.completedBadge : styles.upcomingBadge
          ]}>
            <Text style={[
              styles.statusText,
              booking.status === 'completed' ? styles.completedText : styles.upcomingText
            ]}>
              {booking.status}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        {!isProvider && renderSearchBar()}
        {renderQuickActions()}
        {isProvider && renderProviderStats()}
        {!isProvider && renderPopularServices()}
        {renderRecentBookings()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: spacing.xs,
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.error,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },
  welcomeContainer: {
    marginTop: spacing.sm,
  },
  welcomeText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.onBackground,
    marginBottom: spacing.xs,
  },
  welcomeSubtext: {
    fontSize: typography.fontSize.base,
    color: colors.gray600,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray200,
    ...shadows.sm,
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: typography.fontSize.base,
    color: colors.gray500,
  },
  quickActions: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.onBackground,
    marginBottom: spacing.base,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.sm,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray200,
    ...shadows.sm,
  },
  actionButtonText: {
    marginTop: spacing.xs,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray700,
    textAlign: 'center',
  },
  statsContainer: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray200,
    ...shadows.sm,
  },
  statNumber: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    textAlign: 'center',
  },
  servicesContainer: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.base,
  },
  viewAllText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary,
  },
  serviceCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    marginLeft: spacing.xl,
    width: 120,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray200,
    ...shadows.sm,
  },
  serviceIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  serviceName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  servicePrice: {
    fontSize: typography.fontSize.xs,
    color: colors.gray600,
    marginBottom: spacing.xs,
  },
  serviceRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: typography.fontSize.xs,
    color: colors.gray600,
    marginLeft: spacing.xs,
  },
  bookingsContainer: {
    paddingHorizontal: spacing.xl,
  },
  bookingCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray200,
    ...shadows.sm,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingService: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.onSurface,
    marginBottom: spacing.xs,
  },
  bookingProvider: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    marginBottom: spacing.xs,
  },
  bookingDate: {
    fontSize: typography.fontSize.sm,
    color: colors.gray500,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  completedBadge: {
    backgroundColor: colors.success || '#E8F5E8',
  },
  upcomingBadge: {
    backgroundColor: colors.warning || '#FFF4E6',
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    textTransform: 'capitalize',
  },
  completedText: {
    color: colors.successDark || '#2E7D32',
  },
  upcomingText: {
    color: colors.warningDark || '#F57C00',
  },
});

export default HomeScreen;