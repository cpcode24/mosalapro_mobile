/**
 * Location Setup Screen
 * Helps users set up their location preferences
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDispatch } from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import { colors, typography, spacing, shadows } from '../../theme/theme';
import { setCurrentLocation, setHasSeenOnboarding } from '../../store/slices/appSlice';

const LocationSetupScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  
  const [locationState, setLocationState] = useState({
    current: null,
    manual: '',
    isLoading: false,
    method: null, // 'auto' or 'manual'
  });

  const [cities] = useState([
    'New York, NY',
    'Los Angeles, CA',
    'Chicago, IL',
    'Houston, TX',
    'Phoenix, AZ',
    'Philadelphia, PA',
    'San Antonio, TX',
    'San Diego, CA',
    'Dallas, TX',
    'San Jose, CA',
  ]);

  const getCurrentLocation = () => {
    setLocationState(prev => ({ ...prev, isLoading: true }));

    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocoding to get city name
          const cityName = await reverseGeocode(latitude, longitude);
          
          const location = {
            latitude,
            longitude,
            city: cityName,
            method: 'auto',
          };

          setLocationState(prev => ({
            ...prev,
            current: location,
            isLoading: false,
            method: 'auto',
          }));

          dispatch(setCurrentLocation(location));
        } catch (error) {
          console.error('Reverse geocoding error:', error);
          setLocationState(prev => ({
            ...prev,
            current: { latitude, longitude, city: 'Unknown Location' },
            isLoading: false,
            method: 'auto',
          }));
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationState(prev => ({ ...prev, isLoading: false }));
        
        Alert.alert(
          'Location Error',
          'Unable to get your current location. Please enter your city manually or try again.',
          [{ text: 'OK' }]
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  const reverseGeocode = async (latitude, longitude) => {
    try {
      // This is a mock implementation. In a real app, you'd use a geocoding service
      // like Google Maps Geocoding API or a similar service
      return 'Current Location';
    } catch (error) {
      return 'Unknown Location';
    }
  };

  const handleManualLocation = (city) => {
    const location = {
      city: city,
      method: 'manual',
    };

    setLocationState(prev => ({
      ...prev,
      manual: city,
      method: 'manual',
    }));

    dispatch(setCurrentLocation(location));
  };

  const handleFinishOnboarding = () => {
    // Check if location is set
    if (!locationState.method) {
      Alert.alert(
        'Location Required',
        'Please set your location to find services near you.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Mark onboarding as completed
    dispatch(setHasSeenOnboarding(true));
    
    // Navigate to auth flow
    navigation.navigate('Auth');
  };

  const handleSkipLocation = () => {
    Alert.alert(
      'Skip Location Setup?',
      'You can set your location later in the app settings. Some features may be limited without location access.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Skip', 
          style: 'destructive', 
          onPress: () => {
            dispatch(setHasSeenOnboarding(true));
            navigation.navigate('Auth');
          }
        },
      ]
    );
  };

  const renderLocationOption = () => {
    if (locationState.method === 'auto' && locationState.current) {
      return (
        <View style={styles.selectedLocationContainer}>
          <View style={styles.selectedLocationIcon}>
            <Text style={styles.selectedLocationIconText}>📍</Text>
          </View>
          <View style={styles.selectedLocationInfo}>
            <Text style={styles.selectedLocationTitle}>Current Location</Text>
            <Text style={styles.selectedLocationSubtitle}>
              {locationState.current.city}
            </Text>
            <Text style={styles.selectedLocationCoords}>
              {locationState.current.latitude?.toFixed(4)}, {locationState.current.longitude?.toFixed(4)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.changeLocationButton}
            onPress={() => setLocationState(prev => ({ ...prev, method: null, current: null }))}
          >
            <Text style={styles.changeLocationText}>Change</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (locationState.method === 'manual' && locationState.manual) {
      return (
        <View style={styles.selectedLocationContainer}>
          <View style={styles.selectedLocationIcon}>
            <Text style={styles.selectedLocationIconText}>🏙️</Text>
          </View>
          <View style={styles.selectedLocationInfo}>
            <Text style={styles.selectedLocationTitle}>Manual Location</Text>
            <Text style={styles.selectedLocationSubtitle}>
              {locationState.manual}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.changeLocationButton}
            onPress={() => setLocationState(prev => ({ ...prev, method: null, manual: '' }))}
          >
            <Text style={styles.changeLocationText}>Change</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
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
        <Text style={styles.headerTitle}>Location Setup</Text>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkipLocation}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Set Your Location</Text>
          <Text style={styles.subtitle}>
            Help us find the best services near you by setting your location.
          </Text>
        </View>

        {/* Selected Location Display */}
        {renderLocationOption()}

        {/* Location Options */}
        {!locationState.method && (
          <View style={styles.optionsContainer}>
            {/* Auto Location */}
            <TouchableOpacity
              style={styles.optionButton}
              onPress={getCurrentLocation}
              disabled={locationState.isLoading}
            >
              <View style={styles.optionIcon}>
                {locationState.isLoading ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <Text style={styles.optionIconText}>📍</Text>
                )}
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Use Current Location</Text>
                <Text style={styles.optionDescription}>
                  Automatically detect your location
                </Text>
              </View>
            </TouchableOpacity>

            {/* Manual Location */}
            <View style={styles.manualLocationContainer}>
              <Text style={styles.manualLocationTitle}>Or enter your city:</Text>
              
              <TextInput
                style={styles.cityInput}
                placeholder="Enter your city"
                placeholderTextColor={colors.gray400}
                value={locationState.manual}
                onChangeText={(text) => setLocationState(prev => ({ ...prev, manual: text }))}
                onSubmitEditing={() => {
                  if (locationState.manual.trim()) {
                    handleManualLocation(locationState.manual.trim());
                  }
                }}
                returnKeyType="done"
              />

              {/* Popular Cities */}
              <Text style={styles.popularCitiesTitle}>Popular cities:</Text>
              <View style={styles.citiesContainer}>
                {cities.map((city) => (
                  <TouchableOpacity
                    key={city}
                    style={styles.cityChip}
                    onPress={() => handleManualLocation(city)}
                  >
                    <Text style={styles.cityChipText}>{city}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Info Section */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Why do we need your location?</Text>
          <View style={styles.infoList}>
            <Text style={styles.infoItem}>• Find services and providers near you</Text>
            <Text style={styles.infoItem}>• Show accurate distance and travel time</Text>
            <Text style={styles.infoItem}>• Get relevant local recommendations</Text>
            <Text style={styles.infoItem}>• Enable location-based notifications</Text>
          </View>
        </View>
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.finishButton,
            !locationState.method && styles.finishButtonDisabled
          ]}
          onPress={handleFinishOnboarding}
        >
          <Text style={[
            styles.finishButtonText,
            !locationState.method && styles.finishButtonTextDisabled
          ]}>
            {locationState.method ? 'Complete Setup' : 'Set Location to Continue'}
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
  selectedLocationContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
    borderWidth: 2,
    borderColor: colors.primary,
    ...shadows.sm,
  },
  selectedLocationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryTransparent || colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.base,
  },
  selectedLocationIconText: {
    fontSize: 20,
  },
  selectedLocationInfo: {
    flex: 1,
  },
  selectedLocationTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.onSurface,
    marginBottom: spacing.xs,
  },
  selectedLocationSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    marginBottom: spacing.xs,
  },
  selectedLocationCoords: {
    fontSize: typography.fontSize.xs,
    color: colors.gray500,
  },
  changeLocationButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  changeLocationText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
  },
  optionsContainer: {
    marginBottom: spacing.xl,
  },
  optionButton: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.base,
    borderWidth: 1,
    borderColor: colors.gray200,
    ...shadows.sm,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryTransparent || colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.base,
  },
  optionIconText: {
    fontSize: 20,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.onSurface,
    marginBottom: spacing.xs,
  },
  optionDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
  },
  manualLocationContainer: {
    marginTop: spacing.base,
  },
  manualLocationTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.onBackground,
    marginBottom: spacing.sm,
  },
  cityInput: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    fontSize: typography.fontSize.base,
    color: colors.onSurface,
    borderWidth: 1,
    borderColor: colors.gray200,
    marginBottom: spacing.base,
  },
  popularCitiesTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray600,
    marginBottom: spacing.sm,
  },
  citiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  cityChip: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    margin: spacing.xs,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  cityChipText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray700,
  },
  infoContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    borderLeftWidth: 4,
    borderLeftColor: colors.info || colors.primary,
  },
  infoTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.onSurface,
    marginBottom: spacing.sm,
  },
  infoList: {
    paddingLeft: spacing.sm,
  },
  infoItem: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  bottomContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['2xl'],
  },
  finishButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.base,
    ...shadows.base,
  },
  finishButtonDisabled: {
    backgroundColor: colors.gray400,
  },
  finishButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },
  finishButtonTextDisabled: {
    color: colors.gray600,
  },
});

export default LocationSetupScreen;