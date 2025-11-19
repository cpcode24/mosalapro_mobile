/**
 * Bookings Stack Navigator
 * Handles bookings/jobs navigation flow (different for customers vs providers)
 */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import booking-related screens
import BookingsScreen from '../../screens/main/BookingsScreen';
import BookingDetailScreen from '../../screens/bookings/BookingDetailScreen';
import BookingStatusScreen from '../../screens/bookings/BookingStatusScreen';
import PaymentScreen from '../../screens/bookings/PaymentScreen';
import RatingScreen from '../../screens/bookings/RatingScreen';
import ProviderDetailScreen from '../../screens/shared/ProviderDetailScreen';

import { theme } from '../../theme/theme';

const Stack = createStackNavigator();

const BookingsStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Bookings"
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
        name="Bookings" 
        component={BookingsScreen}
        options={{
          headerShown: false, // Custom header in component
        }}
      />
      
      <Stack.Screen 
        name="BookingDetail" 
        component={BookingDetailScreen}
        options={{
          title: 'Booking Details',
          headerShown: true,
        }}
      />
      
      <Stack.Screen 
        name="BookingStatus" 
        component={BookingStatusScreen}
        options={{
          title: 'Booking Status',
          headerShown: true,
        }}
      />
      
      <Stack.Screen 
        name="Payment" 
        component={PaymentScreen}
        options={{
          title: 'Payment',
          headerShown: true,
        }}
      />
      
      <Stack.Screen 
        name="Rating" 
        component={RatingScreen}
        options={{
          title: 'Rate Service',
          headerShown: true,
          presentation: 'modal',
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
    </Stack.Navigator>
  );
};

export default BookingsStack;