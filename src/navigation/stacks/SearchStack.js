/**
 * Search Stack Navigator
 * Handles search and discovery navigation flow
 */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import search-related screens
import SearchScreen from '../../screens/main/SearchScreen';
import SearchResultsScreen from '../../screens/search/SearchResultsScreen';
import FilterScreen from '../../screens/search/FilterScreen';
import MapViewScreen from '../../screens/search/MapViewScreen';
import ServiceDetailScreen from '../../screens/shared/ServiceDetailScreen';
import ProviderDetailScreen from '../../screens/shared/ProviderDetailScreen';
import BookingScreen from '../../screens/shared/BookingScreen';

import { theme } from '../../theme/theme';

const Stack = createStackNavigator();

const SearchStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Search"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
          elevation: 2,
          shadowOpacity: 0.1,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
          color: theme.colors.onSurface,
        },
        headerTintColor: theme.colors.primary,
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
    >
      <Stack.Screen 
        name="Search" 
        component={SearchScreen}
        options={{
          headerShown: false, // Custom header in component
        }}
      />
      
      <Stack.Screen 
        name="SearchResults" 
        component={SearchResultsScreen}
        options={{
          title: 'Search Results',
          headerShown: true,
        }}
      />
      
      <Stack.Screen 
        name="Filter" 
        component={FilterScreen}
        options={{
          title: 'Filters',
          headerShown: true,
          presentation: 'modal',
        }}
      />
      
      <Stack.Screen 
        name="MapView" 
        component={MapViewScreen}
        options={{
          title: 'Map View',
          headerShown: true,
        }}
      />
      
      <Stack.Screen 
        name="ServiceDetail" 
        component={ServiceDetailScreen}
        options={{
          title: 'Service Details',
          headerShown: true,
        }}
      />
      
      <Stack.Screen 
        name="ProviderDetail" 
        component={ProviderDetailScreen}
        options={{
          title: 'Provider Profile',
          headerShown: true,
        }}
      />
      
      <Stack.Screen 
        name="Booking" 
        component={BookingScreen}
        options={{
          title: 'Book Service',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default SearchStack;