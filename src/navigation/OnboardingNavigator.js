/**
 * Onboarding Navigator
 * Handles first-time user onboarding flow
 */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import onboarding screens
import IntroScreen from '../screens/onboarding/IntroScreen';
import PermissionsScreen from '../screens/onboarding/PermissionsScreen';
import LocationSetupScreen from '../screens/onboarding/LocationSetupScreen';

const Stack = createStackNavigator();

const OnboardingNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Intro"
      screenOptions={{
        headerShown: false,
        gestureEnabled: false, // Prevent swipe back during onboarding
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
        name="Intro" 
        component={IntroScreen}
      />
      
      <Stack.Screen 
        name="Permissions" 
        component={PermissionsScreen}
      />
      
      <Stack.Screen 
        name="LocationSetup" 
        component={LocationSetupScreen}
      />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;