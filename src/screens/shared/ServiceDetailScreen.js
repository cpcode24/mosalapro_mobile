/**
 * Service Detail Screen
 * Displays detailed information about a selected service
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { theme } from '../../theme/theme';

const { width } = Dimensions.get('window');

const ServiceDetailScreen = ({ route, navigation }) => {
  const { serviceId, service } = route.params || {};
  const [serviceData, setServiceData] = useState(service || null);
  const [loading, setLoading] = useState(!service);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!serviceData && serviceId) {
      loadServiceDetails();
    }
  }, [serviceId, serviceData]);

  const loadServiceDetails = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await serviceApi.getServiceDetails(serviceId);
      
      // Mock service data
      const mockService = {
        id: serviceId || '1',
        name: 'Professional House Cleaning',
        category: 'Home Services',
        description: 'Complete house cleaning service including all rooms, kitchen, and bathrooms. Our professional cleaners use eco-friendly products and bring all necessary equipment.',
        price: 75.00,
        duration: '2-3 hours',
        rating: 4.8,
        reviewCount: 156,
        images: [
          'https://via.placeholder.com/400x300/E3F2FD/1976D2?text=Cleaning+Service',
          'https://via.placeholder.com/400x300/F3E5F5/7B1FA2?text=Kitchen+Clean',
          'https://via.placeholder.com/400x300/E8F5E8/388E3C?text=Bathroom+Clean',
        ],
        features: [
          'All rooms cleaned',
          'Kitchen deep clean',
          'Bathroom sanitization',
          'Eco-friendly products',
          'Professional equipment',
          'Insured service',
        ],
        provider: {
          id: '1',
          name: 'CleanPro Services',
          rating: 4.9,
          reviewCount: 324,
          verified: true,
          image: 'https://via.placeholder.com/100x100/FF9800/FFFFFF?text=CP',
        }
      };

      setServiceData(mockService);
    } catch (error) {
      console.error('Error loading service details:', error);
      Alert.alert('Error', 'Failed to load service details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (serviceData) {
      navigation.navigate('Booking', { service: serviceData });
    }
  };

  const handleProviderPress = () => {
    if (serviceData?.provider) {
      navigation.navigate('ProviderDetail', { provider: serviceData.provider });
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Update favorite status on server
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading service details...</Text>
      </View>
    );
  }

  if (!serviceData) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle" size={64} color={theme.colors.error} />
        <Text style={styles.errorText}>Service not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Service Images */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.imageContainer}
        >
          {serviceData.images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={styles.serviceImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        <View style={styles.contentContainer}>
          {/* Service Header */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.serviceName}>{serviceData.name}</Text>
              <Text style={styles.category}>{serviceData.category}</Text>
            </View>
            <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
              <Icon
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={24}
                color={isFavorite ? theme.colors.error : theme.colors.outline}
              />
            </TouchableOpacity>
          </View>

          {/* Rating and Price */}
          <View style={styles.ratingPriceContainer}>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={18} color="#FFB400" />
              <Text style={styles.rating}>{serviceData.rating}</Text>
              <Text style={styles.reviewCount}>({serviceData.reviewCount} reviews)</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>${serviceData.price.toFixed(2)}</Text>
              <Text style={styles.duration}>{serviceData.duration}</Text>
            </View>
          </View>

          {/* Provider Info */}
          <TouchableOpacity style={styles.providerContainer} onPress={handleProviderPress}>
            <Image
              source={{ uri: serviceData.provider.image }}
              style={styles.providerImage}
            />
            <View style={styles.providerInfo}>
              <View style={styles.providerHeader}>
                <Text style={styles.providerName}>{serviceData.provider.name}</Text>
                {serviceData.provider.verified && (
                  <Icon name="check-decagram" size={16} color={theme.colors.primary} />
                )}
              </View>
              <View style={styles.providerRating}>
                <Icon name="star" size={14} color="#FFB400" />
                <Text style={styles.providerRatingText}>{serviceData.provider.rating}</Text>
                <Text style={styles.providerReviewCount}>({serviceData.provider.reviewCount} reviews)</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={24} color={theme.colors.outline} />
          </TouchableOpacity>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{serviceData.description}</Text>
          </View>

          {/* Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What's Included</Text>
            {serviceData.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Icon name="check-circle" size={16} color={theme.colors.primary} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Book Now Button */}
      <View style={styles.bookingContainer}>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
          <Text style={styles.bookButtonText}>Book Now - ${serviceData.price.toFixed(2)}</Text>
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
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.onSurface,
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
  imageContainer: {
    height: 250,
  },
  serviceImage: {
    width: width,
    height: 250,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
  },
  serviceName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  category: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
  },
  favoriteButton: {
    padding: 8,
  },
  ratingPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginLeft: 4,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  duration: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
  providerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
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
  providerRatingText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.onSurface,
    marginLeft: 4,
  },
  providerReviewCount: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 16,
    color: theme.colors.onSurface,
    marginLeft: 8,
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
  bookButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onPrimary,
  },
});

export default ServiceDetailScreen;