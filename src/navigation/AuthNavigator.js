/**
 * Authentication Navigator
 * Handles all authentication-related screens
 */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import authentication screens
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import RegisterTypeScreen from '../screens/auth/RegisterTypeScreen';
import PhoneAuthScreen from '../screens/auth/PhoneAuthScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import EmailVerificationScreen from '../screens/auth/EmailVerificationScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
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
        name="Welcome" 
        component={WelcomeScreen}
        options={{
          gestureEnabled: false, // Don't allow swipe back from welcome
        }}
      />
      
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
      />
      
      <Stack.Screen 
        name="RegisterType" 
        component={RegisterTypeScreen}
      />
      
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
      />
      
      <Stack.Screen 
        name="PhoneAuth" 
        component={PhoneAuthScreen}
      />
      
      <Stack.Screen 
        name="OTPVerification" 
        component={OTPVerificationScreen}
      />
      
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
      />
      
      <Stack.Screen 
        name="EmailVerification" 
        component={EmailVerificationScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;