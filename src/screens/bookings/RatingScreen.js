/**
 * Rating Screen
 * Allows users to rate and review completed services
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
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { theme } from '../../theme/theme';

const RatingScreen = ({ route, navigation }) => {
  const { bookingId, serviceId, providerId } = route.params || {};
  const [booking, setBooking] = useState(null);
  const [overallRating, setOverallRating] = useState(0);
  const [qualityRating, setQualityRating] = useState(0);
  const [timelinessRating, setTimelinessRating] = useState(0);
  const [communicationRating, setCommunicationRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const ratingCategories = [
    {
      key: 'overall',
      label: 'Overall Experience',
      rating: overallRating,
      setRating: setOverallRating,
      icon: 'star',
    },
    {
      key: 'quality',
      label: 'Quality of Work',
      rating: qualityRating,
      setRating: setQualityRating,
      icon: 'check-circle',
    },
    {
      key: 'timeliness',
      label: 'Punctuality',
      rating: timelinessRating,
      setRating: setTimelinessRating,
      icon: 'clock',
    },
    {
      key: 'communication',
      label: 'Communication',
      rating: communicationRating,
      setRating: setCommunicationRating,
      icon: 'message',
    },
  ];

  const predefinedReviews = [
    'Excellent service! Highly recommend.',
    'Great work, very professional.',
    'Good service, arrived on time.',
    'Satisfied with the quality of work.',
    'Could be better, but acceptable.',
    'Not satisfied with the service.',
  ];

  useEffect(() => {
    loadBookingDetails();
  }, [bookingId]);

  const loadBookingDetails = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await bookingApi.getBookingDetails(bookingId);
      
      // Mock booking data
      const mockBooking = {
        id: bookingId || '1',
        serviceName: 'Professional House Cleaning',
        serviceImage: 'https://via.placeholder.com/300x200/E3F2FD/1976D2?text=Cleaning+Service',
        provider: {
          id: providerId || 'provider-1',
          name: 'CleanPro Services',
          image: 'https://via.placeholder.com/80x80/FF9800/FFFFFF?text=CP',
        },
        date: '2024-01-20',
        time: '10:00 AM',
        completedAt: '2024-01-20T13:30:00Z',
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

  const renderStarRating = (rating, setRating, size = 32) => {
    return (
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            style={styles.starButton}
          >
            <Icon
              name={star <= rating ? 'star' : 'star-outline'}
              size={size}
              color={star <= rating ? '#FFB400' : theme.colors.outline}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const getRatingText = (rating) => {
    const texts = {
      1: 'Poor',
      2: 'Fair',
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent',
    };
    return texts[rating] || 'Not Rated';
  };

  const validateRating = () => {
    if (overallRating === 0) {
      Alert.alert('Rating Required', 'Please provide an overall rating for the service.');
      return false;
    }
    return true;
  };

  const handleSubmitReview = async () => {
    if (!validateRating()) {
      return;
    }

    setSubmitting(true);

    try {
      // TODO: Replace with actual API call
      // const reviewData = {
      //   bookingId,
      //   serviceId,
      //   providerId,
      //   overallRating,
      //   qualityRating,
      //   timelinessRating,
      //   communicationRating,
      //   review: review.trim(),
      //   submittedAt: new Date().toISOString()
      // };
      // const response = await reviewService.submitReview(reviewData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        'Review Submitted',
        'Thank you for your feedback! Your review helps other customers make better choices.',
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
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePredefinedReview = (reviewText) => {
    setReview(reviewText);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading booking details...</Text>
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

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Service Header */}
        <View style={styles.serviceHeader}>
          <Image
            source={{ uri: booking.serviceImage }}
            style={styles.serviceImage}
          />
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>{booking.serviceName}</Text>
            <Text style={styles.providerName}>by {booking.provider.name}</Text>
            <Text style={styles.completedDate}>
              Completed on {new Date(booking.completedAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Rating Prompt */}
        <View style={styles.section}>
          <Text style={styles.promptTitle}>How was your experience?</Text>
          <Text style={styles.promptSubtitle}>
            Your feedback helps us improve our services
          </Text>
        </View>

        {/* Rating Categories */}
        <View style={styles.section}>
          {ratingCategories.map((category, index) => (
            <View key={category.key} style={styles.ratingCategory}>
              <View style={styles.categoryHeader}>
                <Icon 
                  name={category.icon} 
                  size={20} 
                  color={theme.colors.primary} 
                />
                <Text style={styles.categoryLabel}>{category.label}</Text>
                <Text style={styles.ratingText}>
                  {getRatingText(category.rating)}
                </Text>
              </View>
              {renderStarRating(category.rating, category.setRating)}
              {index < ratingCategories.length - 1 && <View style={styles.categoryDivider} />}
            </View>
          ))}
        </View>

        {/* Written Review */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Write a Review (Optional)</Text>
          <TextInput
            style={styles.reviewInput}
            value={review}
            onChangeText={setReview}
            placeholder="Share your experience with other customers..."
            placeholderTextColor={theme.colors.outline}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Quick Review Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Reviews</Text>
          <View style={styles.quickReviews}>
            {predefinedReviews.map((reviewText, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.quickReviewButton,
                  review === reviewText && styles.selectedQuickReview
                ]}
                onPress={() => handlePredefinedReview(reviewText)}
              >
                <Text style={[
                  styles.quickReviewText,
                  review === reviewText && styles.selectedQuickReviewText
                ]}>
                  {reviewText}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Provider Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Provider</Text>
          <View style={styles.providerContainer}>
            <Image
              source={{ uri: booking.provider.image }}
              style={styles.providerImage}
            />
            <View style={styles.providerDetails}>
              <Text style={styles.providerNameLarge}>{booking.provider.name}</Text>
              <Text style={styles.providerNote}>
                Your review will be visible to other customers
              </Text>
            </View>
          </View>
        </View>

        {/* Rating Summary */}
        {overallRating > 0 && (
          <View style={styles.ratingSummary}>
            <Text style={styles.summaryTitle}>Your Rating Summary</Text>
            <View style={styles.summaryContent}>
              <View style={styles.overallRatingDisplay}>
                <Text style={styles.overallRatingNumber}>{overallRating}.0</Text>
                {renderStarRating(overallRating, () => {}, 20)}
              </View>
              <Text style={styles.overallRatingText}>
                {getRatingText(overallRating)}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.submitContainer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            (submitting || overallRating === 0) && styles.disabledButton
          ]}
          onPress={handleSubmitReview}
          disabled={submitting || overallRating === 0}
        >
          {submitting ? (
            <Text style={styles.submitButtonText}>Submitting...</Text>
          ) : (
            <>
              <Icon name="check" size={20} color={theme.colors.onPrimary} />
              <Text style={styles.submitButtonText}>Submit Review</Text>
            </>
          )}
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
  serviceHeader: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    padding: 20,
    alignItems: 'center',
  },
  serviceImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  providerName: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 2,
  },
  completedDate: {
    fontSize: 12,
    color: theme.colors.outline,
  },
  section: {
    backgroundColor: theme.colors.surface,
    padding: 20,
    marginTop: 8,
  },
  promptTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    textAlign: 'center',
    marginBottom: 8,
  },
  promptSubtitle: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 16,
  },
  ratingCategory: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.onSurface,
    marginLeft: 8,
    flex: 1,
  },
  ratingText: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    fontWeight: '500',
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  starButton: {
    padding: 4,
  },
  categoryDivider: {
    height: 1,
    backgroundColor: theme.colors.outline,
    marginTop: 16,
  },
  reviewInput: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: theme.colors.onSurface,
    minHeight: 120,
  },
  quickReviews: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickReviewButton: {
    backgroundColor: theme.colors.surfaceVariant,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  selectedQuickReview: {
    backgroundColor: theme.colors.primaryContainer,
    borderColor: theme.colors.primary,
  },
  quickReviewText: {
    fontSize: 12,
    color: theme.colors.onSurface,
  },
  selectedQuickReviewText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  providerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    padding: 16,
    borderRadius: 12,
  },
  providerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  providerDetails: {
    flex: 1,
  },
  providerNameLarge: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  providerNote: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
  },
  ratingSummary: {
    backgroundColor: theme.colors.primaryContainer,
    margin: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onPrimaryContainer,
    marginBottom: 12,
  },
  summaryContent: {
    alignItems: 'center',
  },
  overallRatingDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  overallRatingNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginRight: 12,
  },
  overallRatingText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onPrimaryContainer,
  },
  submitContainer: {
    padding: 20,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  disabledButton: {
    backgroundColor: theme.colors.outline,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onPrimary,
    marginLeft: 8,
  },
});

export default RatingScreen;