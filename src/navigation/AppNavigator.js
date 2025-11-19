/**
 * Main App Navigator
 * Routes between authenticated and unauthenticated flows
 */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';

// Import navigators
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import OnboardingNavigator from './OnboardingNavigator';

// Import screens
import SplashScreen from '../screens/SplashScreen';
import LoadingScreen from '../screens/LoadingScreen';

// Import Redux actions and selectors
import { 
  checkAuthStatus, 
  selectIsAuthenticated, 
  selectIsInitialized,
  selectAuthLoading 
} from '../store/slices/authSlice';
import { selectHasSeenOnboarding } from '../store/slices/appSlice';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isInitialized = useSelector(selectIsInitialized);
  const isLoading = useSelector(selectAuthLoading);
  const hasSeenOnboarding = useSelector(selectHasSeenOnboarding);

  useEffect(() => {
    // Check if user is already authenticated on app startup
    dispatch(checkAuthStatus());
  }, [dispatch]);

  // Show splash screen while initializing
  if (!isInitialized || isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator 
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
      {isAuthenticated ? (
        // User is authenticated - show main app
        <Stack.Screen 
          name="MainApp" 
          component={MainNavigator}
          options={{ animationEnabled: false }}
        />
      ) : (
        // User is not authenticated - show onboarding or auth flow
        <>
          {!hasSeenOnboarding ? (
            <Stack.Screen 
              name="Onboarding" 
              component={OnboardingNavigator}
              options={{ animationEnabled: false }}
            />
          ) : null}
          <Stack.Screen 
            name="Auth" 
            component={AuthNavigator}
            options={{ 
              animationEnabled: false,
              // Hide header for auth screens
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;