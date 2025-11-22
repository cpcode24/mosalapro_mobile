/**
 * Profile Stack Navigator
 * Handles profile and settings navigation flow
 */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import profile-related screens
import ProfileScreen from '../../screens/main/ProfileScreen';
import EditProfileScreen from '../../screens/profile/EditProfileScreen';
import SettingsScreen from '../../screens/profile/SettingsScreen';
import NotificationSettingsScreen from '../../screens/profile/NotificationSettingsScreen';
import PrivacySettingsScreen from '../../screens/profile/PrivacySettingsScreen';
import HelpScreen from '../../screens/profile/HelpScreen';
import AboutScreen from '../../screens/profile/AboutScreen';
import LanguageScreen from '../../screens/profile/LanguageScreen';
import PaymentMethodsScreen from '../../screens/profile/PaymentMethodsScreen';
import AddressBookScreen from '../../screens/profile/AddressBookScreen';
import FavoritesScreen from '../../screens/profile/FavoritesScreen';

import { theme } from '../../theme/theme';

const Stack = createStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
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
        name="Profile" 
        component={ProfileScreen}
        options={{
          headerShown: false, // Custom header in component
        }}
      />
      
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{
          title: 'Edit Profile',
          headerShown: true,
        }}
      />
      
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: 'Settings',
          headerShown: true,
        }}
      />
      
      <Stack.Screen 
        name="NotificationSettings" 
        component={NotificationSettingsScreen}
        options={{
          title: 'Notifications',
          headerShown: true,
        }}
      />
      
      <Stack.Screen 
        name="PrivacySettings" 
        component={PrivacySettingsScreen}
        options={{
          title: 'Privacy',
          headerShown: true,
        }}
      />
      
      <Stack.Screen 
        name="Language" 
        component={LanguageScreen}
        options={{
          title: 'Language',
          headerShown: true,
        }}
      />
      
      <Stack.Screen 
        name="PaymentMethods" 
        component={PaymentMethodsScreen}
        options={{
          title: 'Payment Methods',
          headerShown: true,
        }}
      />
      
      <Stack.Screen 
        name="AddressBook" 
        component={AddressBookScreen}
        options={{
          title: 'Saved Addresses',
          headerShown: true,
        }}
      />
      
      <Stack.Screen 
        name="Favorites" 
        component={FavoritesScreen}
        options={{
          title: 'Favorites',
          headerShown: true,
        }}
      />
      
      <Stack.Screen 
        name="Help" 
        component={HelpScreen}
        options={{
          title: 'Help & Support',
          headerShown: true,
        }}
      />
      
      <Stack.Screen 
        name="About" 
        component={AboutScreen}
        options={{
          title: 'About',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;