/**
 * Map View Screen
 * Displays search results on a map with location markers
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import MapView, { Marker, Callout } from 'react-native-maps';

import { theme } from '../../theme/theme';

const { width, height } = Dimensions.get('window');

const MapViewScreen = ({ route, navigation }) => {
  const { results = [], query, location } = route.params || {};
  const [selectedService, setSelectedService] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 40.7589, // Default to NYC
    longitude: -73.9851,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    generateMarkers();
  }, [results]);

  const generateMarkers = () => {
    // Generate mock coordinates for services around the map center
    const mockMarkers = results.map((service, index) => ({
      id: service.id,
      service: service,
      coordinate: {
        latitude: mapRegion.latitude + (Math.random() - 0.5) * 0.01,
        longitude: mapRegion.longitude + (Math.random() - 0.5) * 0.01,
      },
    }));

    setMarkers(mockMarkers);
  };

  const handleMarkerPress = (marker) => {
    setSelectedService(marker.service);
  };

  const handleServicePress = (service) => {
    navigation.navigate('ServiceDetail', { service });
  };

  const handleListViewPress = () => {
    navigation.goBack();
  };

  const renderSelectedService = () => {
    if (!selectedService) return null;

    return (
      <View style={styles.selectedServiceCard}>
        <TouchableOpacity 
          style={styles.cardContent}
          onPress={() => handleServicePress(selectedService)}
        >
          <Image 
            source={{ uri: selectedService.image }} 
            style={styles.cardImage} 
          />
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {selectedService.name}
            </Text>
            <Text style={styles.cardProvider}>
              by {selectedService.provider.name}
            </Text>
            <View style={styles.cardMeta}>
              <View style={styles.cardRating}>
                <Icon name="star" size={14} color="#FFB400" />
                <Text style={styles.cardRatingText}>
                  {selectedService.rating}
                </Text>
              </View>
              <Text style={styles.cardDistance}>
                {selectedService.distance}
              </Text>
            </View>
            <Text style={styles.cardPrice}>
              ${selectedService.price.toFixed(2)}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => setSelectedService(null)}
        >
          <Icon name="close" size={20} color={theme.colors.outline} />
        </TouchableOpacity>
      </View>
    );
  };

  // Mock MapView component since react-native-maps might not be installed
  const MockMapView = () => (
    <View style={styles.mockMap}>
      <View style={styles.mapPlaceholder}>
        <Icon name="map" size={64} color={theme.colors.outline} />
        <Text style={styles.mapPlaceholderText}>Map View</Text>
        <Text style={styles.mapPlaceholderSubtext}>
          {results.length} services found
        </Text>
        <View style={styles.mockMarkers}>
          {markers.slice(0, 3).map((marker, index) => (
            <TouchableOpacity
              key={marker.id}
              style={[styles.mockMarker, { 
                top: 100 + index * 50, 
                left: 50 + index * 40 
              }]}
              onPress={() => handleMarkerPress(marker)}
            >
              <View style={styles.markerPin}>
                <Icon name="map-marker" size={24} color={theme.colors.primary} />
              </View>
              <Text style={styles.markerPrice}>
                ${marker.service.price}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Mock installation message */}
        <View style={styles.installMessage}>
          <Icon name="information" size={20} color={theme.colors.primary} />
          <Text style={styles.installMessageText}>
            Install react-native-maps for full map functionality
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Map View */}
      <MockMapView />
      
      {/* Uncomment when react-native-maps is installed */}
      {/* <MapView
        style={styles.map}
        region={mapRegion}
        onRegionChangeComplete={setMapRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            onPress={() => handleMarkerPress(marker)}
          >
            <View style={styles.customMarker}>
              <View style={styles.markerContainer}>
                <Text style={styles.markerText}>
                  ${marker.service.price}
                </Text>
              </View>
              <View style={styles.markerArrow} />
            </View>
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>
                  {marker.service.name}
                </Text>
                <Text style={styles.calloutProvider}>
                  {marker.service.provider.name}
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView> */}

      {/* Top Controls */}
      <View style={styles.topControls}>
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={handleListViewPress}
        >
          <Icon name="view-list" size={20} color={theme.colors.primary} />
          <Text style={styles.controlButtonText}>List View</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={() => navigation.navigate('Filter')}
        >
          <Icon name="filter" size={20} color={theme.colors.primary} />
          <Text style={styles.controlButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Results Counter */}
      <View style={styles.resultsCounter}>
        <Text style={styles.resultsCounterText}>
          {results.length} services found
        </Text>
      </View>

      {/* Selected Service Card */}
      {renderSelectedService()}

      {/* Bottom Search Results List */}
      <View style={styles.bottomSheet}>
        <View style={styles.bottomSheetHandle} />
        <Text style={styles.bottomSheetTitle}>Nearby Services</Text>
        
        <View style={styles.servicesList}>
          {results.slice(0, 3).map((service, index) => (
            <TouchableOpacity
              key={service.id}
              style={[
                styles.serviceItem,
                selectedService?.id === service.id && styles.selectedServiceItem
              ]}
              onPress={() => setSelectedService(service)}
            >
              <Image 
                source={{ uri: service.image }} 
                style={styles.serviceItemImage} 
              />
              <View style={styles.serviceItemInfo}>
                <Text style={styles.serviceItemName} numberOfLines={1}>
                  {service.name}
                </Text>
                <Text style={styles.serviceItemProvider}>
                  {service.provider.name}
                </Text>
                <View style={styles.serviceItemMeta}>
                  <View style={styles.serviceItemRating}>
                    <Icon name="star" size={12} color="#FFB400" />
                    <Text style={styles.serviceItemRatingText}>
                      {service.rating}
                    </Text>
                  </View>
                  <Text style={styles.serviceItemPrice}>
                    ${service.price.toFixed(2)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          
          {results.length > 3 && (
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={handleListViewPress}
            >
              <Text style={styles.viewAllButtonText}>
                View all {results.length} results
              </Text>
              <Icon name="chevron-right" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  map: {
    flex: 1,
  },
  mockMap: {
    flex: 1,
    backgroundColor: theme.colors.surfaceVariant,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  mapPlaceholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    marginTop: 16,
  },
  mapPlaceholderSubtext: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
    marginTop: 8,
  },
  mockMarkers: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mockMarker: {
    position: 'absolute',
    alignItems: 'center',
  },
  markerPin: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 4,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  markerPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.onSurface,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  installMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryContainer,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 20,
  },
  installMessageText: {
    fontSize: 12,
    color: theme.colors.onPrimaryContainer,
    marginLeft: 6,
  },
  customMarker: {
    alignItems: 'center',
  },
  markerContainer: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    minWidth: 50,
    alignItems: 'center',
  },
  markerText: {
    color: theme.colors.onPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  markerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: theme.colors.primary,
  },
  callout: {
    padding: 10,
    minWidth: 120,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  calloutProvider: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginTop: 2,
  },
  topControls: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 12,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.primary,
    marginLeft: 6,
  },
  resultsCounter: {
    position: 'absolute',
    top: 80,
    left: 20,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  resultsCounterText: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.onSurface,
  },
  selectedServiceCard: {
    position: 'absolute',
    bottom: 280,
    left: 20,
    right: 20,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    flexDirection: 'row',
  },
  cardContent: {
    flexDirection: 'row',
    flex: 1,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  cardProvider: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardRatingText: {
    fontSize: 12,
    color: theme.colors.onSurface,
    marginLeft: 2,
  },
  cardDistance: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  closeButton: {
    padding: 4,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
    maxHeight: 250,
    elevation: 8,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.outline,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 16,
  },
  servicesList: {
    gap: 12,
  },
  serviceItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedServiceItem: {
    borderColor: theme.colors.primary,
  },
  serviceItemImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 12,
  },
  serviceItemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  serviceItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  serviceItemProvider: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
  },
  serviceItemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceItemRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceItemRatingText: {
    fontSize: 12,
    color: theme.colors.onSurface,
    marginLeft: 2,
  },
  serviceItemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  viewAllButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryContainer,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  viewAllButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
});

export default MapViewScreen;