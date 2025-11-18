/**
 * Filter Screen
 * Allows users to set search filters and preferences
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Slider from '@react-native-community/slider';

import { theme } from '../../theme/theme';

const FilterScreen = ({ route, navigation }) => {
  const { currentFilters = {}, onApplyFilters } = route.params || {};
  
  // Filter state
  const [priceRange, setPriceRange] = useState(currentFilters.priceRange || [0, 500]);
  const [distance, setDistance] = useState(currentFilters.distance || 25);
  const [rating, setRating] = useState(currentFilters.rating || 0);
  const [categories, setCategories] = useState(currentFilters.categories || []);
  const [availability, setAvailability] = useState(currentFilters.availability || 'any');
  const [serviceFeatures, setServiceFeatures] = useState(currentFilters.serviceFeatures || []);
  const [providerFeatures, setProviderFeatures] = useState(currentFilters.providerFeatures || []);
  const [sortBy, setSortBy] = useState(currentFilters.sortBy || 'relevance');

  const availableCategories = [
    { id: 'home_cleaning', name: 'Home Cleaning', icon: 'home' },
    { id: 'office_cleaning', name: 'Office Cleaning', icon: 'office-building' },
    { id: 'deep_cleaning', name: 'Deep Cleaning', icon: 'spray' },
    { id: 'carpet_cleaning', name: 'Carpet Cleaning', icon: 'rug' },
    { id: 'window_cleaning', name: 'Window Cleaning', icon: 'window-maximize' },
    { id: 'move_in_out', name: 'Move In/Out', icon: 'truck' },
    { id: 'post_construction', name: 'Post Construction', icon: 'hard-hat' },
    { id: 'maintenance', name: 'Maintenance', icon: 'tools' },
  ];

  const availabilityOptions = [
    { value: 'any', label: 'Any Time' },
    { value: 'today', label: 'Today' },
    { value: 'tomorrow', label: 'Tomorrow' },
    { value: 'this_week', label: 'This Week' },
    { value: 'weekend', label: 'Weekends Only' },
  ];

  const serviceFeatureOptions = [
    { id: 'eco_friendly', name: 'Eco-Friendly Products', icon: 'leaf' },
    { id: 'same_day', name: 'Same Day Service', icon: 'clock-fast' },
    { id: 'recurring', name: 'Recurring Service', icon: 'repeat' },
    { id: 'supplies_included', name: 'Supplies Included', icon: 'package' },
    { id: 'pet_friendly', name: 'Pet Friendly', icon: 'paw' },
    { id: 'disinfection', name: 'Disinfection Service', icon: 'spray-bottle' },
  ];

  const providerFeatureOptions = [
    { id: 'verified', name: 'Verified Providers', icon: 'check-decagram' },
    { id: 'insured', name: 'Insured', icon: 'shield-check' },
    { id: 'background_checked', name: 'Background Checked', icon: 'account-check' },
    { id: 'top_rated', name: 'Top Rated (4.5+ stars)', icon: 'star' },
    { id: 'quick_response', name: 'Quick Response', icon: 'reply' },
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'distance', label: 'Nearest First' },
    { value: 'newest', label: 'Newest First' },
  ];

  const toggleCategory = (categoryId) => {
    setCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleServiceFeature = (featureId) => {
    setServiceFeatures(prev => 
      prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const toggleProviderFeature = (featureId) => {
    setProviderFeatures(prev => 
      prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const clearAllFilters = () => {
    setPriceRange([0, 500]);
    setDistance(25);
    setRating(0);
    setCategories([]);
    setAvailability('any');
    setServiceFeatures([]);
    setProviderFeatures([]);
    setSortBy('relevance');
  };

  const applyFilters = () => {
    const filters = {
      priceRange,
      distance,
      rating,
      categories,
      availability,
      serviceFeatures,
      providerFeatures,
      sortBy,
    };

    if (onApplyFilters) {
      onApplyFilters(filters);
    }

    navigation.goBack();
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (priceRange[0] > 0 || priceRange[1] < 500) count++;
    if (distance < 25) count++;
    if (rating > 0) count++;
    if (categories.length > 0) count++;
    if (availability !== 'any') count++;
    if (serviceFeatures.length > 0) count++;
    if (providerFeatures.length > 0) count++;
    if (sortBy !== 'relevance') count++;
    return count;
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Price Range */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Range</Text>
          <View style={styles.priceRangeContainer}>
            <Text style={styles.priceLabel}>${priceRange[0]}</Text>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={500}
                value={priceRange[0]}
                onValueChange={(value) => setPriceRange([Math.round(value), priceRange[1]])}
                minimumTrackTintColor={theme.colors.primary}
                maximumTrackTintColor={theme.colors.outline}
                thumbStyle={styles.sliderThumb}
              />
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={500}
                value={priceRange[1]}
                onValueChange={(value) => setPriceRange([priceRange[0], Math.round(value)])}
                minimumTrackTintColor={theme.colors.primary}
                maximumTrackTintColor={theme.colors.outline}
                thumbStyle={styles.sliderThumb}
              />
            </View>
            <Text style={styles.priceLabel}>${priceRange[1]}</Text>
          </View>
          <Text style={styles.rangeText}>
            ${priceRange[0]} - ${priceRange[1]}
          </Text>
        </View>

        {/* Distance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Distance</Text>
          <View style={styles.distanceContainer}>
            <Slider
              style={styles.fullSlider}
              minimumValue={1}
              maximumValue={50}
              value={distance}
              onValueChange={(value) => setDistance(Math.round(value))}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor={theme.colors.outline}
              thumbStyle={styles.sliderThumb}
            />
            <Text style={styles.distanceText}>
              Within {distance} miles
            </Text>
          </View>
        </View>

        {/* Minimum Rating */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Minimum Rating</Text>
          <View style={styles.ratingContainer}>
            {[0, 3, 4, 4.5].map((ratingValue) => (
              <TouchableOpacity
                key={ratingValue}
                style={[
                  styles.ratingOption,
                  rating === ratingValue && styles.selectedRatingOption
                ]}
                onPress={() => setRating(ratingValue)}
              >
                <Icon 
                  name="star" 
                  size={16} 
                  color={rating === ratingValue ? theme.colors.onPrimary : '#FFB400'} 
                />
                <Text style={[
                  styles.ratingOptionText,
                  rating === ratingValue && styles.selectedOptionText
                ]}>
                  {ratingValue === 0 ? 'Any' : `${ratingValue}+`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.optionsGrid}>
            {availableCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryOption,
                  categories.includes(category.id) && styles.selectedCategoryOption
                ]}
                onPress={() => toggleCategory(category.id)}
              >
                <Icon
                  name={category.icon}
                  size={20}
                  color={categories.includes(category.id) ? theme.colors.onPrimary : theme.colors.primary}
                />
                <Text style={[
                  styles.categoryOptionText,
                  categories.includes(category.id) && styles.selectedOptionText
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Availability */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Availability</Text>
          <View style={styles.optionsList}>
            {availabilityOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.listOption,
                  availability === option.value && styles.selectedListOption
                ]}
                onPress={() => setAvailability(option.value)}
              >
                <Text style={[
                  styles.listOptionText,
                  availability === option.value && styles.selectedOptionText
                ]}>
                  {option.label}
                </Text>
                {availability === option.value && (
                  <Icon name="check" size={20} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Service Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Features</Text>
          <View style={styles.featuresList}>
            {serviceFeatureOptions.map((feature) => (
              <TouchableOpacity
                key={feature.id}
                style={styles.featureOption}
                onPress={() => toggleServiceFeature(feature.id)}
              >
                <View style={styles.featureLeft}>
                  <Icon
                    name={feature.icon}
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.featureText}>{feature.name}</Text>
                </View>
                <Switch
                  value={serviceFeatures.includes(feature.id)}
                  onValueChange={() => toggleServiceFeature(feature.id)}
                  trackColor={{ false: theme.colors.outline, true: theme.colors.primary }}
                  thumbColor={theme.colors.surface}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Provider Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Provider Requirements</Text>
          <View style={styles.featuresList}>
            {providerFeatureOptions.map((feature) => (
              <TouchableOpacity
                key={feature.id}
                style={styles.featureOption}
                onPress={() => toggleProviderFeature(feature.id)}
              >
                <View style={styles.featureLeft}>
                  <Icon
                    name={feature.icon}
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.featureText}>{feature.name}</Text>
                </View>
                <Switch
                  value={providerFeatures.includes(feature.id)}
                  onValueChange={() => toggleProviderFeature(feature.id)}
                  trackColor={{ false: theme.colors.outline, true: theme.colors.primary }}
                  thumbColor={theme.colors.surface}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sort By */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sort By</Text>
          <View style={styles.optionsList}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.listOption,
                  sortBy === option.value && styles.selectedListOption
                ]}
                onPress={() => setSortBy(option.value)}
              >
                <Text style={[
                  styles.listOptionText,
                  sortBy === option.value && styles.selectedOptionText
                ]}>
                  {option.label}
                </Text>
                {sortBy === option.value && (
                  <Icon name="check" size={20} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.clearButton} onPress={clearAllFilters}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
          <Text style={styles.applyButtonText}>
            Apply Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
          </Text>
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
  section: {
    backgroundColor: theme.colors.surface,
    padding: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 16,
  },
  priceRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
    minWidth: 50,
  },
  sliderContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  slider: {
    height: 40,
  },
  fullSlider: {
    height: 40,
    marginBottom: 8,
  },
  sliderThumb: {
    backgroundColor: theme.colors.primary,
    width: 20,
    height: 20,
  },
  rangeText: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
  distanceContainer: {
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.onSurface,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  ratingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  selectedRatingOption: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  ratingOptionText: {
    fontSize: 14,
    color: theme.colors.onSurface,
    marginLeft: 4,
  },
  selectedOptionText: {
    color: theme.colors.onPrimary,
    fontWeight: '600',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    minWidth: '45%',
  },
  selectedCategoryOption: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryOptionText: {
    fontSize: 12,
    color: theme.colors.onSurface,
    marginLeft: 6,
    flex: 1,
  },
  optionsList: {
    gap: 2,
  },
  listOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  selectedListOption: {
    backgroundColor: theme.colors.primaryContainer,
  },
  listOptionText: {
    fontSize: 16,
    color: theme.colors.onSurface,
  },
  featuresList: {
    gap: 2,
  },
  featureOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  featureLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  featureText: {
    fontSize: 16,
    color: theme.colors.onSurface,
    marginLeft: 12,
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
    gap: 12,
  },
  clearButton: {
    flex: 1,
    backgroundColor: theme.colors.surfaceVariant,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  applyButton: {
    flex: 2,
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onPrimary,
  },
});

export default FilterScreen;