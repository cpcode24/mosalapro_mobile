/**
 * Search Screen
 * Search and browse available services
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, typography, spacing, shadows } from '../../theme/theme';
import { selectCurrentUser } from '../../store/slices/authSlice';

const { width } = Dimensions.get('window');

const SearchScreen = ({ navigation, route }) => {
  const currentUser = useSelector(selectCurrentUser);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating'); // rating, price, distance
  const [showFilters, setShowFilters] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Your Location');

  // Sample data - replace with real API data
  const categories = [
    { id: 'all', name: 'All', icon: '🔍' },
    { id: 'cleaning', name: 'Cleaning', icon: '🏠' },
    { id: 'plumbing', name: 'Plumbing', icon: '🔧' },
    { id: 'electrical', name: 'Electrical', icon: '⚡' },
    { id: 'handyman', name: 'Handyman', icon: '🔨' },
    { id: 'gardening', name: 'Gardening', icon: '🌱' },
    { id: 'painting', name: 'Painting', icon: '🎨' },
    { id: 'moving', name: 'Moving', icon: '📦' },
  ];

  const services = [
    {
      id: '1',
      title: 'Professional House Cleaning',
      provider: 'Sarah Johnson',
      rating: 4.9,
      reviewCount: 127,
      price: 80,
      distance: '0.5 miles',
      category: 'cleaning',
      image: 'https://via.placeholder.com/150x100',
      description: 'Complete house cleaning service including all rooms, kitchen, and bathrooms.',
      availability: 'Available today',
      verified: true,
    },
    {
      id: '2',
      title: 'Emergency Plumbing Repair',
      provider: 'Mike Smith',
      rating: 4.8,
      reviewCount: 89,
      price: 120,
      distance: '1.2 miles',
      category: 'plumbing',
      image: 'https://via.placeholder.com/150x100',
      description: 'Fast and reliable plumbing repairs. Available 24/7 for emergencies.',
      availability: 'Available now',
      verified: true,
    },
    {
      id: '3',
      title: 'Electrical Installation & Repair',
      provider: 'David Wilson',
      rating: 4.7,
      reviewCount: 156,
      price: 100,
      distance: '0.8 miles',
      category: 'electrical',
      image: 'https://via.placeholder.com/150x100',
      description: 'Licensed electrician for all your electrical needs.',
      availability: 'Available tomorrow',
      verified: true,
    },
    {
      id: '4',
      title: 'General Handyman Services',
      provider: 'Tom Brown',
      rating: 4.6,
      reviewCount: 203,
      price: 60,
      distance: '2.1 miles',
      category: 'handyman',
      image: 'https://via.placeholder.com/150x100',
      description: 'Fix anything around your home. From small repairs to installations.',
      availability: 'Available this week',
      verified: false,
    },
  ];

  const [filteredServices, setFilteredServices] = useState(services);

  useEffect(() => {
    filterServices();
  }, [searchQuery, selectedCategory, sortBy]);

  const filterServices = () => {
    let filtered = services;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return a.price - b.price;
        case 'distance':
          return parseFloat(a.distance) - parseFloat(b.distance);
        default:
          return 0;
      }
    });

    setFilteredServices(filtered);
  };

  const handleServicePress = (service) => {
    navigation.navigate('ServiceDetail', { serviceId: service.id, service });
  };

  const handleBookService = (service) => {
    navigation.navigate('BookService', { serviceId: service.id, service });
  };

  const handleProviderPress = (providerId) => {
    navigation.navigate('ProviderProfile', { providerId });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.locationContainer}>
        <Icon name="location-on" size={16} color={colors.gray600} />
        <Text style={styles.locationText}>{currentLocation}</Text>
        <TouchableOpacity>
          <Icon name="keyboard-arrow-down" size={20} color={colors.gray600} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color={colors.gray500} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for services..."
            placeholderTextColor={colors.gray400}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close" size={20} color={colors.gray500} />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Icon name="tune" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCategories = () => (
    <View style={styles.categoriesContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScroll}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipSelected
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.categoryTextSelected
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderFilters = () => {
    if (!showFilters) return null;
    
    return (
      <View style={styles.filtersContainer}>
        <Text style={styles.filtersTitle}>Sort by:</Text>
        <View style={styles.sortOptions}>
          {[
            { key: 'rating', label: 'Rating' },
            { key: 'price', label: 'Price' },
            { key: 'distance', label: 'Distance' },
          ].map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.sortOption,
                sortBy === option.key && styles.sortOptionSelected
              ]}
              onPress={() => setSortBy(option.key)}
            >
              <Text style={[
                styles.sortOptionText,
                sortBy === option.key && styles.sortOptionTextSelected
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderServiceCard = ({ item: service }) => (
    <TouchableOpacity 
      style={styles.serviceCard}
      onPress={() => handleServicePress(service)}
    >
      <View style={styles.serviceImageContainer}>
        <View style={styles.servicePlaceholderImage}>
          <Text style={styles.serviceImageText}>📷</Text>
        </View>
        {service.verified && (
          <View style={styles.verifiedBadge}>
            <Icon name="verified" size={16} color={colors.white} />
          </View>
        )}
      </View>
      
      <View style={styles.serviceContent}>
        <View style={styles.serviceHeader}>
          <Text style={styles.serviceTitle} numberOfLines={2}>
            {service.title}
          </Text>
          <Text style={styles.servicePrice}>${service.price}</Text>
        </View>
        
        <TouchableOpacity onPress={() => handleProviderPress(service.provider)}>
          <Text style={styles.providerName}>{service.provider}</Text>
        </TouchableOpacity>
        
        <Text style={styles.serviceDescription} numberOfLines={2}>
          {service.description}
        </Text>
        
        <View style={styles.serviceFooter}>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color={colors.warning || '#FFD700'} />
            <Text style={styles.ratingText}>{service.rating}</Text>
            <Text style={styles.reviewCount}>({service.reviewCount})</Text>
          </View>
          
          <View style={styles.serviceDetails}>
            <Text style={styles.distanceText}>{service.distance}</Text>
            <Text style={styles.availabilityText}>{service.availability}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.bookButton}
          onPress={() => handleBookService(service)}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderResults = () => (
    <View style={styles.resultsContainer}>
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {filteredServices.length} services found
        </Text>
      </View>
      
      <FlatList
        data={filteredServices}
        renderItem={renderServiceCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.servicesList}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {renderHeader()}
      {renderCategories()}
      {renderFilters()}
      {renderResults()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  locationText: {
    marginLeft: spacing.xs,
    marginRight: spacing.xs,
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    fontWeight: typography.fontWeight.medium,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.gray200,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.onSurface,
    marginLeft: spacing.sm,
  },
  filterButton: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  categoriesContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  categoriesScroll: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  categoryChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  categoryText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray700,
  },
  categoryTextSelected: {
    color: colors.white,
  },
  filtersContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  filtersTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray700,
    marginBottom: spacing.sm,
  },
  sortOptions: {
    flexDirection: 'row',
  },
  sortOption: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.gray100,
    marginRight: spacing.sm,
  },
  sortOptionSelected: {
    backgroundColor: colors.primary,
  },
  sortOptionText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray700,
  },
  sortOptionTextSelected: {
    color: colors.white,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
  },
  resultsText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    fontWeight: typography.fontWeight.medium,
  },
  servicesList: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  serviceCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: spacing.base,
    borderWidth: 1,
    borderColor: colors.gray200,
    ...shadows.sm,
  },
  serviceImageContainer: {
    position: 'relative',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  servicePlaceholderImage: {
    flex: 1,
    backgroundColor: colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceImageText: {
    fontSize: 32,
    opacity: 0.5,
  },
  verifiedBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.success || '#4CAF50',
    borderRadius: 12,
    padding: spacing.xs,
  },
  serviceContent: {
    padding: spacing.base,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  serviceTitle: {
    flex: 1,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.onSurface,
    marginRight: spacing.sm,
  },
  servicePrice: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  providerName: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing.xs,
  },
  serviceDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray700,
    marginLeft: spacing.xs,
  },
  reviewCount: {
    fontSize: typography.fontSize.sm,
    color: colors.gray500,
    marginLeft: spacing.xs,
  },
  serviceDetails: {
    alignItems: 'flex-end',
  },
  distanceText: {
    fontSize: typography.fontSize.xs,
    color: colors.gray500,
  },
  availabilityText: {
    fontSize: typography.fontSize.xs,
    color: colors.success || '#4CAF50',
    fontWeight: typography.fontWeight.medium,
  },
  bookButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  bookButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
});

export default SearchScreen;