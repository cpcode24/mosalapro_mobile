/**
 * Home Stack Navigator
 * Handles home tab navigation flow
 */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import home-related screens
import HomeScreen from '../../screens/main/HomeScreen';
import NotificationsScreen from '../../screens/main/NotificationsScreen';
import ServiceDetailScreen from '../../screens/shared/ServiceDetailScreen';
import ProviderDetailScreen from '../../screens/shared/ProviderDetailScreen';
import BookingScreen from '../../screens/shared/BookingScreen';

import { theme } from '../../theme/theme';

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
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
        name="Home" 
        component={HomeScreen}
        options={{
          headerShown: false, // Custom header in component
        }}
      />
      
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{
          title: 'Notifications',
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

export default HomeStack;