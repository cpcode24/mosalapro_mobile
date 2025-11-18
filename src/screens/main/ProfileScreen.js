/**
 * Profile Screen
 * User profile management for both customers and providers
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
  Alert,
  Switch,
  RefreshControl,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, typography, spacing, shadows } from '../../theme/theme';
import { selectCurrentUser, logoutUser } from '../../store/slices/authSlice';

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const isProvider = currentUser?.accountType === 'provider';
  
  const [refreshing, setRefreshing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  // Sample user stats - replace with real data
  const userStats = {
    rating: 4.8,
    reviewCount: 127,
    completedJobs: isProvider ? 45 : 23,
    memberSince: '2023',
    responseTime: isProvider ? '15 mins' : null,
    responseRate: isProvider ? '98%' : null,
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    // API call to load user profile data
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserProfile();
    setRefreshing(false);
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleViewProfile = () => {
    if (isProvider) {
      navigation.navigate('ProviderProfile', { 
        providerId: currentUser.id,
        isOwnProfile: true 
      });
    } else {
      navigation.navigate('CustomerProfile', { 
        customerId: currentUser.id,
        isOwnProfile: true 
      });
    }
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  const handleHelpSupport = () => {
    navigation.navigate('HelpSupport');
  };

  const handlePaymentMethods = () => {
    navigation.navigate('PaymentMethods');
  };

  const handleAddresses = () => {
    navigation.navigate('SavedAddresses');
  };

  const handleFavorites = () => {
    navigation.navigate('Favorites');
  };

  const handleEarnings = () => {
    navigation.navigate('Earnings');
  };

  const handleServices = () => {
    navigation.navigate('ManageServices');
  };

  const handleReviews = () => {
    navigation.navigate('Reviews');
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            dispatch(logoutUser());
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Handle account deletion
            Alert.alert('Account deletion requested. You will receive a confirmation email.');
          },
        },
      ]
    );
  };

  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {currentUser?.firstName?.charAt(0)?.toUpperCase() || 'U'}
          </Text>
        </View>
        <TouchableOpacity style={styles.editAvatarButton}>
          <Icon name="camera-alt" size={16} color={colors.white} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.profileInfo}>
        <Text style={styles.userName}>
          {currentUser?.firstName} {currentUser?.lastName}
        </Text>
        <Text style={styles.userType}>
          {isProvider ? 'Service Provider' : 'Customer'}
        </Text>
        {currentUser?.email && (
          <Text style={styles.userEmail}>{currentUser.email}</Text>
        )}
      </View>

      <View style={styles.profileActions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleEditProfile}>
          <Icon name="edit" size={18} color={colors.primary} />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleViewProfile}>
          <Icon name="visibility" size={18} color={colors.primary} />
          <Text style={styles.actionButtonText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderUserStats = () => (
    <View style={styles.statsContainer}>
      <Text style={styles.sectionTitle}>Your Statistics</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userStats.rating} ⭐</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userStats.reviewCount}</Text>
          <Text style={styles.statLabel}>Reviews</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userStats.completedJobs}</Text>
          <Text style={styles.statLabel}>
            {isProvider ? 'Jobs Done' : 'Bookings'}
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userStats.memberSince}</Text>
          <Text style={styles.statLabel}>Member Since</Text>
        </View>
      </View>

      {isProvider && (
        <View style={styles.providerStats}>
          <View style={styles.providerStatItem}>
            <Text style={styles.providerStatLabel}>Response Time</Text>
            <Text style={styles.providerStatValue}>{userStats.responseTime}</Text>
          </View>
          <View style={styles.providerStatItem}>
            <Text style={styles.providerStatLabel}>Response Rate</Text>
            <Text style={styles.providerStatValue}>{userStats.responseRate}</Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderQuickSettings = () => (
    <View style={styles.quickSettings}>
      <Text style={styles.sectionTitle}>Quick Settings</Text>
      
      <View style={styles.settingItem}>
        <View style={styles.settingLeft}>
          <Icon name="notifications" size={24} color={colors.gray600} />
          <Text style={styles.settingText}>Push Notifications</Text>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: colors.gray300, true: colors.primary }}
          thumbColor={notificationsEnabled ? colors.white : colors.gray500}
        />
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingLeft}>
          <Icon name="location-on" size={24} color={colors.gray600} />
          <Text style={styles.settingText}>Location Services</Text>
        </View>
        <Switch
          value={locationEnabled}
          onValueChange={setLocationEnabled}
          trackColor={{ false: colors.gray300, true: colors.primary }}
          thumbColor={locationEnabled ? colors.white : colors.gray500}
        />
      </View>
    </View>
  );

  const renderMenuSection = (title, items) => (
    <View style={styles.menuSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.menuItem,
            item.danger && styles.dangerMenuItem
          ]}
          onPress={item.onPress}
        >
          <View style={styles.menuItemLeft}>
            <Icon 
              name={item.icon} 
              size={24} 
              color={item.danger ? colors.error : colors.gray600} 
            />
            <Text style={[
              styles.menuItemText,
              item.danger && styles.dangerMenuText
            ]}>
              {item.title}
            </Text>
          </View>
          <Icon 
            name="chevron-right" 
            size={20} 
            color={item.danger ? colors.error : colors.gray400} 
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  // Menu items for customers
  const customerMenuItems = [
    { title: 'Payment Methods', icon: 'payment', onPress: handlePaymentMethods },
    { title: 'Saved Addresses', icon: 'location-on', onPress: handleAddresses },
    { title: 'Favorite Services', icon: 'favorite', onPress: handleFavorites },
    { title: 'My Reviews', icon: 'star', onPress: handleReviews },
  ];

  // Menu items for providers
  const providerMenuItems = [
    { title: 'My Services', icon: 'work', onPress: handleServices },
    { title: 'Earnings', icon: 'attach-money', onPress: handleEarnings },
    { title: 'Reviews & Ratings', icon: 'star', onPress: handleReviews },
    { title: 'Payment Methods', icon: 'payment', onPress: handlePaymentMethods },
  ];

  const generalMenuItems = [
    { title: 'Settings', icon: 'settings', onPress: handleSettings },
    { title: 'Help & Support', icon: 'help', onPress: handleHelpSupport },
    { title: 'Privacy Policy', icon: 'privacy-tip', onPress: () => navigation.navigate('PrivacyPolicy') },
    { title: 'Terms of Service', icon: 'description', onPress: () => navigation.navigate('TermsOfService') },
  ];

  const accountMenuItems = [
    { title: 'Sign Out', icon: 'logout', onPress: handleLogout },
    { title: 'Delete Account', icon: 'delete-forever', onPress: handleDeleteAccount, danger: true },
  ];

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
        {renderProfileHeader()}
        {renderUserStats()}
        {renderQuickSettings()}
        
        {isProvider ? 
          renderMenuSection('Provider Tools', providerMenuItems) :
          renderMenuSection('My Account', customerMenuItems)
        }
        
        {renderMenuSection('General', generalMenuItems)}
        {renderMenuSection('Account', accountMenuItems)}
        
        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>MosalaPro v1.0.0</Text>
        </View>
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
  profileHeader: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.base,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.base,
  },
  avatarText: {
    color: colors.white,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.xs,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  userName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.onSurface,
    marginBottom: spacing.xs,
  },
  userType: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
  },
  profileActions: {
    flexDirection: 'row',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryTransparent || colors.primary + '20',
    borderRadius: 8,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.xs,
  },
  actionButtonText: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    marginLeft: spacing.xs,
  },
  statsContainer: {
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.onBackground,
    marginBottom: spacing.base,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.base,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.sm,
    marginHorizontal: spacing.xs,
    ...shadows.sm,
  },
  statNumber: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.gray600,
    textAlign: 'center',
  },
  providerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  providerStatItem: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.sm,
    marginHorizontal: spacing.xs,
    ...shadows.sm,
  },
  providerStatLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.gray600,
    marginBottom: spacing.xs,
  },
  providerStatValue: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.onSurface,
  },
  quickSettings: {
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: typography.fontSize.base,
    color: colors.onBackground,
    marginLeft: spacing.base,
  },
  menuSection: {
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.base,
  },
  dangerMenuItem: {
    // Additional styles for danger menu items
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    fontSize: typography.fontSize.base,
    color: colors.onBackground,
    marginLeft: spacing.base,
  },
  dangerMenuText: {
    color: colors.error,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  versionText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray500,
  },
});

export default ProfileScreen;