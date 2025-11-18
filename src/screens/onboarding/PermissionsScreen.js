/**
 * Permissions Screen
 * Requests necessary permissions for app functionality
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { request, PERMISSIONS, RESULTS, check } from 'react-native-permissions';
import { colors, typography, spacing, shadows } from '../../theme/theme';
import { setLocationPermission } from '../../store/slices/appSlice';

const PermissionsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  
  const [permissions, setPermissions] = useState({
    location: 'not_requested',
    notifications: 'not_requested',
    camera: 'not_requested',
  });

  const permissionData = [
    {
      key: 'location',
      title: 'Location Access',
      description: 'Find services and providers near you',
      icon: '📍',
      permission: Platform.OS === 'ios' 
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE 
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      required: true,
    },
    {
      key: 'notifications',
      title: 'Push Notifications',
      description: 'Get updates about your bookings and messages',
      icon: '🔔',
      permission: Platform.OS === 'ios' 
        ? PERMISSIONS.IOS.NOTIFICATIONS 
        : PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
      required: false,
    },
    {
      key: 'camera',
      title: 'Camera Access',
      description: 'Take photos for your profile and service requests',
      icon: '📷',
      permission: Platform.OS === 'ios' 
        ? PERMISSIONS.IOS.CAMERA 
        : PERMISSIONS.ANDROID.CAMERA,
      required: false,
    },
  ];

  useEffect(() => {
    checkCurrentPermissions();
  }, []);

  const checkCurrentPermissions = async () => {
    const newPermissions = { ...permissions };
    
    for (const item of permissionData) {
      try {
        const result = await check(item.permission);
        newPermissions[item.key] = result;
      } catch (error) {
        console.error(`Error checking ${item.key} permission:`, error);
        newPermissions[item.key] = 'unavailable';
      }
    }
    
    setPermissions(newPermissions);
  };

  const requestPermission = async (permissionItem) => {
    try {
      const result = await request(permissionItem.permission);
      
      setPermissions(prev => ({
        ...prev,
        [permissionItem.key]: result,
      }));

      // Handle specific permission results
      if (permissionItem.key === 'location') {
        dispatch(setLocationPermission(result));
      }

      // Show appropriate message based on result
      switch (result) {
        case RESULTS.GRANTED:
          // Permission granted
          break;
        case RESULTS.DENIED:
          Alert.alert(
            'Permission Denied',
            `${permissionItem.title} was denied. You can enable it later in app settings.`,
            [{ text: 'OK' }]
          );
          break;
        case RESULTS.BLOCKED:
          Alert.alert(
            'Permission Blocked',
            `${permissionItem.title} is blocked. Please enable it in device settings.`,
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ]
          );
          break;
        case RESULTS.UNAVAILABLE:
          Alert.alert(
            'Permission Unavailable',
            `${permissionItem.title} is not available on this device.`,
            [{ text: 'OK' }]
          );
          break;
      }
    } catch (error) {
      console.error(`Error requesting ${permissionItem.key} permission:`, error);
      Alert.alert(
        'Permission Error',
        'There was an error requesting permission. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const getPermissionStatus = (key) => {
    const status = permissions[key];
    switch (status) {
      case RESULTS.GRANTED:
        return { text: 'Granted', color: colors.success || '#4CAF50', icon: '✅' };
      case RESULTS.DENIED:
        return { text: 'Denied', color: colors.warning || '#FF9800', icon: '⚠️' };
      case RESULTS.BLOCKED:
        return { text: 'Blocked', color: colors.error, icon: '❌' };
      case RESULTS.UNAVAILABLE:
        return { text: 'Unavailable', color: colors.gray500, icon: '➖' };
      default:
        return { text: 'Not Requested', color: colors.gray500, icon: '❓' };
    }
  };

  const canProceed = () => {
    // Check if all required permissions are granted
    const requiredPermissions = permissionData.filter(item => item.required);
    return requiredPermissions.every(item => 
      permissions[item.key] === RESULTS.GRANTED
    );
  };

  const handleContinue = () => {
    if (canProceed()) {
      navigation.navigate('LocationSetup');
    } else {
      Alert.alert(
        'Required Permissions',
        'Please grant location permission to continue. This is required to find services near you.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Permissions?',
      'Some features may not work properly without these permissions. You can grant them later in app settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Skip', style: 'destructive', onPress: () => navigation.navigate('LocationSetup') },
      ]
    );
  };

  const renderPermissionItem = (item) => {
    const status = getPermissionStatus(item.key);
    const isGranted = permissions[item.key] === RESULTS.GRANTED;
    
    return (
      <TouchableOpacity
        key={item.key}
        style={[
          styles.permissionItem,
          isGranted && styles.permissionItemGranted
        ]}
        onPress={() => requestPermission(item)}
        disabled={isGranted}
      >
        <View style={styles.permissionHeader}>
          <View style={styles.permissionIcon}>
            <Text style={styles.permissionIconText}>{item.icon}</Text>
          </View>
          <View style={styles.permissionInfo}>
            <Text style={styles.permissionTitle}>
              {item.title}
              {item.required && <Text style={styles.requiredIndicator}> *</Text>}
            </Text>
            <Text style={styles.permissionDescription}>{item.description}</Text>
          </View>
        </View>
        
        <View style={styles.permissionStatus}>
          <View style={[styles.statusIndicator, { backgroundColor: status.color }]}>
            <Text style={styles.statusIcon}>{status.icon}</Text>
          </View>
          <Text style={[styles.statusText, { color: status.color }]}>
            {status.text}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>App Permissions</Text>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Grant Permissions</Text>
          <Text style={styles.subtitle}>
            To provide you with the best experience, we need access to some device features.
          </Text>
        </View>

        <View style={styles.permissionsList}>
          {permissionData.map(renderPermissionItem)}
        </View>

        <View style={styles.noticeContainer}>
          <Text style={styles.noticeText}>
            <Text style={styles.requiredIndicator}>*</Text> Required permissions
          </Text>
          <Text style={styles.helpText}>
            You can change these permissions later in your device settings.
          </Text>
        </View>
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !canProceed() && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
        >
          <Text style={[
            styles.continueButtonText,
            !canProceed() && styles.continueButtonTextDisabled
          ]}>
            {canProceed() ? 'Continue' : 'Grant Required Permissions'}
          </Text>
        </TouchableOpacity>
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
    paddingVertical: spacing.base,
  },
  backButton: {
    padding: spacing.sm,
  },
  backButtonText: {
    fontSize: 24,
    color: colors.gray600,
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.onBackground,
  },
  skipButton: {
    padding: spacing.sm,
  },
  skipText: {
    fontSize: typography.fontSize.base,
    color: colors.gray600,
    fontWeight: typography.fontWeight.medium,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  titleContainer: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.onBackground,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.gray600,
    lineHeight: 22,
  },
  permissionsList: {
    flex: 1,
  },
  permissionItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    marginBottom: spacing.base,
    borderWidth: 2,
    borderColor: colors.gray200,
    ...shadows.sm,
  },
  permissionItemGranted: {
    borderColor: colors.success || '#4CAF50',
    backgroundColor: colors.successTransparent || '#E8F5E8',
  },
  permissionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  permissionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryTransparent || colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.base,
  },
  permissionIconText: {
    fontSize: 20,
  },
  permissionInfo: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.onSurface,
    marginBottom: spacing.xs,
  },
  requiredIndicator: {
    color: colors.error,
    fontWeight: typography.fontWeight.bold,
  },
  permissionDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    lineHeight: 18,
  },
  permissionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  statusIcon: {
    fontSize: 12,
  },
  statusText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  noticeContainer: {
    paddingVertical: spacing.base,
  },
  noticeText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    marginBottom: spacing.xs,
  },
  helpText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray500,
    lineHeight: 18,
  },
  bottomContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['2xl'],
  },
  continueButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.base,
    ...shadows.base,
  },
  continueButtonDisabled: {
    backgroundColor: colors.gray400,
  },
  continueButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },
  continueButtonTextDisabled: {
    color: colors.gray600,
  },
});

export default PermissionsScreen;