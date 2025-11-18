/**
 * Search Results Screen
 * Displays search results with filtering and sorting options
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { theme } from '../../theme/theme';

const SearchResultsScreen = ({ route, navigation }) => {
  const { query, category, location, filters } = route.params || {};
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState(query || '');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('list'); // list or grid

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'distance', label: 'Nearest First' },
  ];

  useEffect(() => {
    loadSearchResults();
  }, [query, category, location, filters, sortBy]);

  const loadSearchResults = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await searchApi.searchServices({
      //   query: searchQuery,
      //   category,
      //   location,
      //   filters,
      //   sortBy
      // });

      // Mock search results
      const mockResults = [
        {
          id: '1',
          name: 'Professional House Cleaning',
          category: 'Home Services',
          provider: {
            id: 'provider-1',
            name: 'CleanPro Services',
            image: 'https://via.placeholder.com/60x60/FF9800/FFFFFF?text=CP',
            verified: true,
          },
          price: 75.00,
          rating: 4.8,
          reviewCount: 156,
          distance: '0.8 miles',
          image: 'https://via.placeholder.com/300x200/E3F2FD/1976D2?text=Cleaning+Service',
          availability: 'Available Today',
          tags: ['Eco-friendly', 'Insured', 'Same-day'],
        },
        {
          id: '2',
          name: 'Deep House Cleaning',
          category: 'Home Services',
          provider: {
            id: 'provider-2',
            name: 'Sparkle Clean Co.',
            image: 'https://via.placeholder.com/60x60/4CAF50/FFFFFF?text=SC',
            verified: true,
          },
          price: 120.00,
          rating: 4.9,
          reviewCount: 89,
          distance: '1.2 miles',
          image: 'https://via.placeholder.com/300x200/F3E5F5/7B1FA2?text=Deep+Clean',
          availability: 'Available Tomorrow',
          tags: ['Premium', 'Insured', 'Background-checked'],
        },
        {
          id: '3',
          name: 'Office Cleaning Service',
          category: 'Commercial Services',
          provider: {
            id: 'provider-3',
            name: 'Pro Clean Solutions',
            image: 'https://via.placeholder.com/60x60/2196F3/FFFFFF?text=PC',
            verified: false,
          },
          price: 95.00,
          rating: 4.6,
          reviewCount: 234,
          distance: '2.1 miles',
          image: 'https://via.placeholder.com/300x200/E8F5E8/388E3C?text=Office+Clean',
          availability: 'Available This Week',
          tags: ['Commercial', 'After-hours'],
        },
        {
          id: '4',
          name: 'Apartment Cleaning',
          category: 'Home Services',
          provider: {
            id: 'provider-4',
            name: 'Swift Cleaners',
            image: 'https://via.placeholder.com/60x60/9C27B0/FFFFFF?text=SW',
            verified: true,
          },
          price: 60.00,
          rating: 4.5,
          reviewCount: 67,
          distance: '0.5 miles',
          image: 'https://via.placeholder.com/300x200/FFF3E0/FF9800?text=Apartment+Clean',
          availability: 'Available Today',
          tags: ['Budget-friendly', 'Quick service'],
        },
      ];

      setSearchResults(mockResults);
    } catch (error) {
      console.error('Error loading search results:', error);
      Alert.alert('Error', 'Failed to load search results');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = () => {
    loadSearchResults();
  };

  const handleServicePress = (service) => {
    navigation.navigate('ServiceDetail', { service });
  };

  const handleProviderPress = (provider) => {
    navigation.navigate('ProviderDetail', { provider });
  };

  const handleFilterPress = () => {
    navigation.navigate('Filter', { 
      currentFilters: filters,
      onApplyFilters: (newFilters) => {
        // Update filters and reload results
        loadSearchResults();
      }
    });
  };

  const handleMapViewPress = () => {
    navigation.navigate('MapView', { 
      results: searchResults,
      query: searchQuery,
      location 
    });
  };

  const renderServiceItem = ({ item }) => {
    if (viewMode === 'grid') {
      return (
        <TouchableOpacity
          style={styles.gridItem}
          onPress={() => handleServicePress(item)}
        >
          <Image source={{ uri: item.image }} style={styles.gridItemImage} />
          <View style={styles.gridItemContent}>
            <Text style={styles.gridItemName} numberOfLines={2}>
              {item.name}
            </Text>
            <View style={styles.gridItemRating}>
              <Icon name="star" size={12} color="#FFB400" />
              <Text style={styles.gridItemRatingText}>{item.rating}</Text>
            </View>
            <Text style={styles.gridItemPrice}>${item.price.toFixed(2)}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.listItem}
        onPress={() => handleServicePress(item)}
      >
        <Image source={{ uri: item.image }} style={styles.listItemImage} />
        <View style={styles.listItemContent}>
          <View style={styles.listItemHeader}>
            <Text style={styles.listItemName}>{item.name}</Text>
            <Text style={styles.listItemPrice}>${item.price.toFixed(2)}</Text>
          </View>
          
          <TouchableOpacity
            style={styles.providerRow}
            onPress={() => handleProviderPress(item.provider)}
          >
            <Image
              source={{ uri: item.provider.image }}
              style={styles.providerImage}
            />
            <Text style={styles.providerName}>{item.provider.name}</Text>
            {item.provider.verified && (
              <Icon name="check-decagram" size={14} color={theme.colors.primary} />
            )}
          </TouchableOpacity>

          <View style={styles.listItemMeta}>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={14} color="#FFB400" />
              <Text style={styles.ratingText}>{item.rating}</Text>
              <Text style={styles.reviewText}>({item.reviewCount})</Text>
            </View>
            <View style={styles.distanceContainer}>
              <Icon name="map-marker" size={14} color={theme.colors.outline} />
              <Text style={styles.distanceText}>{item.distance}</Text>
            </View>
          </View>

          <View style={styles.availabilityRow}>
            <Text style={styles.availabilityText}>{item.availability}</Text>
          </View>

          <View style={styles.tagsContainer}>
            {item.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon name="magnify" size={20} color={theme.colors.outline} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search services..."
            placeholderTextColor={theme.colors.outline}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close" size={20} color={theme.colors.outline} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results Info */}
      <View style={styles.resultsInfo}>
        <Text style={styles.resultsCount}>
          {searchResults.length} results found
        </Text>
        {location && (
          <Text style={styles.locationText}>in {location}</Text>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.leftControls}>
          <TouchableOpacity style={styles.controlButton} onPress={handleFilterPress}>
            <Icon name="filter" size={18} color={theme.colors.primary} />
            <Text style={styles.controlButtonText}>Filter</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton} onPress={handleMapViewPress}>
            <Icon name="map" size={18} color={theme.colors.primary} />
            <Text style={styles.controlButtonText}>Map</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rightControls}>
          <TouchableOpacity 
            style={styles.viewToggle}
            onPress={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
          >
            <Icon 
              name={viewMode === 'list' ? 'view-grid' : 'view-list'} 
              size={18} 
              color={theme.colors.primary} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="magnify" size={64} color={theme.colors.outline} />
      <Text style={styles.emptyTitle}>No results found</Text>
      <Text style={styles.emptyMessage}>
        Try adjusting your search terms or filters
      </Text>
      <TouchableOpacity style={styles.emptyButton} onPress={handleFilterPress}>
        <Text style={styles.emptyButtonText}>Adjust Filters</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Searching...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={searchResults}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode} // Force re-render when changing view mode
        contentContainerStyle={[
          styles.listContainer,
          searchResults.length === 0 && styles.emptyContainer
        ]}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          loadSearchResults();
        }}
      />
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
  headerContainer: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    marginBottom: 8,
  },
  searchContainer: {
    marginBottom: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: theme.colors.onSurface,
  },
  resultsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  locationText: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginLeft: 4,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftControls: {
    flexDirection: 'row',
    gap: 12,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: 20,
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.primary,
    marginLeft: 6,
  },
  rightControls: {
    flexDirection: 'row',
  },
  viewToggle: {
    padding: 8,
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: 20,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  emptyContainer: {
    flexGrow: 1,
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  listItemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  listItemContent: {
    flex: 1,
  },
  listItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  listItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
    flex: 1,
    marginRight: 8,
  },
  listItemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  providerImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  providerName: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginRight: 4,
  },
  listItemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: theme.colors.onSurface,
    marginLeft: 2,
  },
  reviewText: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginLeft: 2,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginLeft: 2,
  },
  availabilityRow: {
    marginBottom: 6,
  },
  availabilityText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  tag: {
    backgroundColor: theme.colors.surfaceVariant,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 10,
    color: theme.colors.onSurfaceVariant,
  },
  gridItem: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    margin: 6,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  gridItemImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  gridItemContent: {
    padding: 12,
  },
  gridItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 6,
    minHeight: 34, // Consistent height for 2 lines
  },
  gridItemRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  gridItemRatingText: {
    fontSize: 12,
    color: theme.colors.onSurface,
    marginLeft: 2,
  },
  gridItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onPrimary,
  },
});

export default SearchResultsScreen;