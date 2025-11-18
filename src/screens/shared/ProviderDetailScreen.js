/**
 * Provider Detail Screen
 * Displays detailed information about a service provider
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
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { theme } from '../../theme/theme';

const ProviderDetailScreen = ({ route, navigation }) => {
  const { providerId, provider } = route.params || {};
  const [providerData, setProviderData] = useState(provider || null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(!provider);

  useEffect(() => {
    if (!providerData && providerId) {
      loadProviderDetails();
    } else if (providerData) {
      loadProviderServices();
      loadProviderReviews();
    }
  }, [providerId, providerData]);

  const loadProviderDetails = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await providerApi.getProviderDetails(providerId);
      
      // Mock provider data
      const mockProvider = {
        id: providerId || '1',
        name: 'CleanPro Services',
        description: 'Professional cleaning services with over 10 years of experience. We specialize in residential and commercial cleaning using eco-friendly products.',
        rating: 4.9,
        reviewCount: 324,
        completedJobs: 1250,
        responseTime: '< 2 hours',
        verified: true,
        image: 'https://via.placeholder.com/150x150/FF9800/FFFFFF?text=CP',
        location: 'New York, NY',
        joinedDate: '2019-03-15',
        badges: ['Top Rated', 'Quick Response', 'Eco-Friendly'],
        contact: {
          phone: '+1 (555) 123-4567',
          email: 'info@cleanpro.com',
        }
      };

      setProviderData(mockProvider);
      loadProviderServices();
      loadProviderReviews();
    } catch (error) {
      console.error('Error loading provider details:', error);
      Alert.alert('Error', 'Failed to load provider details');
    } finally {
      setLoading(false);
    }
  };

  const loadProviderServices = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await serviceApi.getProviderServices(providerId);
      
      // Mock services data
      const mockServices = [
        {
          id: '1',
          name: 'House Cleaning',
          price: 75.00,
          rating: 4.8,
          image: 'https://via.placeholder.com/100x100/E3F2FD/1976D2?text=Clean',
        },
        {
          id: '2',
          name: 'Deep Cleaning',
          price: 120.00,
          rating: 4.9,
          image: 'https://via.placeholder.com/100x100/F3E5F5/7B1FA2?text=Deep',
        },
        {
          id: '3',
          name: 'Office Cleaning',
          price: 95.00,
          rating: 4.7,
          image: 'https://via.placeholder.com/100x100/E8F5E8/388E3C?text=Office',
        }
      ];

      setServices(mockServices);
    } catch (error) {
      console.error('Error loading provider services:', error);
    }
  };

  const loadProviderReviews = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await reviewApi.getProviderReviews(providerId);
      
      // Mock reviews data
      const mockReviews = [
        {
          id: '1',
          userName: 'Sarah Johnson',
          userImage: 'https://via.placeholder.com/40x40/2196F3/FFFFFF?text=SJ',
          rating: 5,
          comment: 'Excellent service! Very professional and thorough. My house has never been cleaner.',
          date: '2024-01-15',
          service: 'House Cleaning'
        },
        {
          id: '2',
          userName: 'Mike Chen',
          userImage: 'https://via.placeholder.com/40x40/4CAF50/FFFFFF?text=MC',
          rating: 4,
          comment: 'Great work, arrived on time and did a fantastic job. Will definitely book again.',
          date: '2024-01-10',
          service: 'Deep Cleaning'
        },
        {
          id: '3',
          userName: 'Emily Davis',
          userImage: 'https://via.placeholder.com/40x40/FF9800/FFFFFF?text=ED',
          rating: 5,
          comment: 'Amazing attention to detail. The team was friendly and efficient.',
          date: '2024-01-05',
          service: 'Office Cleaning'
        }
      ];

      setReviews(mockReviews);
    } catch (error) {
      console.error('Error loading provider reviews:', error);
    }
  };

  const handleServicePress = (service) => {
    navigation.navigate('ServiceDetail', { service });
  };

  const handleContactPress = () => {
    Alert.alert(
      'Contact Provider',
      `Phone: ${providerData.contact.phone}\nEmail: ${providerData.contact.email}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => {/* TODO: Implement call functionality */} },
        { text: 'Message', onPress: () => navigation.navigate('Messages') },
      ]
    );
  };

  const renderServiceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.serviceCard}
      onPress={() => handleServicePress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.serviceImage} />
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <View style={styles.serviceRating}>
          <Icon name="star" size={14} color="#FFB400" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
        <Text style={styles.servicePrice}>${item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Image source={{ uri: item.userImage }} style={styles.reviewUserImage} />
        <View style={styles.reviewUserInfo}>
          <Text style={styles.reviewUserName}>{item.userName}</Text>
          <View style={styles.reviewRating}>
            {[...Array(5)].map((_, i) => (
              <Icon
                key={i}
                name="star"
                size={12}
                color={i < item.rating ? '#FFB400' : '#E0E0E0'}
              />
            ))}
            <Text style={styles.reviewService}>• {item.service}</Text>
          </View>
        </View>
        <Text style={styles.reviewDate}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
      <Text style={styles.reviewComment}>{item.comment}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading provider details...</Text>
      </View>
    );
  }

  if (!providerData) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle" size={64} color={theme.colors.error} />
        <Text style={styles.errorText}>Provider not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Provider Header */}
      <View style={styles.headerContainer}>
        <Image source={{ uri: providerData.image }} style={styles.providerImage} />
        <View style={styles.providerInfo}>
          <View style={styles.providerNameContainer}>
            <Text style={styles.providerName}>{providerData.name}</Text>
            {providerData.verified && (
              <Icon name="check-decagram" size={20} color={theme.colors.primary} />
            )}
          </View>
          <Text style={styles.providerLocation}>{providerData.location}</Text>
          <View style={styles.providerStats}>
            <View style={styles.statItem}>
              <Icon name="star" size={16} color="#FFB400" />
              <Text style={styles.statText}>{providerData.rating} ({providerData.reviewCount})</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="briefcase-check" size={16} color={theme.colors.primary} />
              <Text style={styles.statText}>{providerData.completedJobs} jobs</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Badges */}
      <View style={styles.badgesContainer}>
        {providerData.badges.map((badge, index) => (
          <View key={index} style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ))}
      </View>

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        <View style={styles.quickStatItem}>
          <Icon name="clock-fast" size={24} color={theme.colors.primary} />
          <Text style={styles.quickStatLabel}>Response Time</Text>
          <Text style={styles.quickStatValue}>{providerData.responseTime}</Text>
        </View>
        <View style={styles.quickStatItem}>
          <Icon name="calendar" size={24} color={theme.colors.primary} />
          <Text style={styles.quickStatLabel}>Member Since</Text>
          <Text style={styles.quickStatValue}>{new Date(providerData.joinedDate).getFullYear()}</Text>
        </View>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.description}>{providerData.description}</Text>
      </View>

      {/* Services */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Services</Text>
        <FlatList
          data={services}
          renderItem={renderServiceItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.servicesList}
        />
      </View>

      {/* Reviews */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Reviews</Text>
        <FlatList
          data={reviews}
          renderItem={renderReviewItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>

      {/* Contact Button */}
      <TouchableOpacity style={styles.contactButton} onPress={handleContactPress}>
        <Icon name="message" size={20} color={theme.colors.onPrimary} />
        <Text style={styles.contactButtonText}>Contact Provider</Text>
      </TouchableOpacity>
    </ScrollView>
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
  headerContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
  },
  providerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  providerInfo: {
    flex: 1,
  },
  providerNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  providerName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    marginRight: 8,
  },
  providerLocation: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 8,
  },
  providerStats: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 14,
    color: theme.colors.onSurface,
    marginLeft: 4,
  },
  badgesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: theme.colors.surface,
  },
  badge: {
    backgroundColor: theme.colors.primaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    color: theme.colors.onPrimaryContainer,
    fontWeight: '500',
  },
  quickStats: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.colors.surfaceVariant,
  },
  quickStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  quickStatLabel: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
  },
  quickStatValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginTop: 2,
  },
  section: {
    padding: 20,
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
  servicesList: {
    paddingRight: 20,
  },
  serviceCard: {
    width: 140,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    marginRight: 12,
    padding: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  serviceImage: {
    width: 116,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  serviceRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
    color: theme.colors.onSurface,
    marginLeft: 4,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  reviewCard: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewUserImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  reviewUserInfo: {
    flex: 1,
  },
  reviewUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 2,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewService: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginLeft: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
  },
  reviewComment: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 20,
  },
  contactButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginVertical: 20,
    paddingVertical: 16,
    borderRadius: 12,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onPrimary,
    marginLeft: 8,
  },
});

export default ProviderDetailScreen;