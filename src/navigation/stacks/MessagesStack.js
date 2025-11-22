/**
 * Messages Stack Navigator
 * Handles messaging and chat navigation flow
 */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import message-related screens
import MessagesScreen from '../../screens/main/MessagesScreen';
import ChatScreen from '../../screens/messages/ChatScreen';
import ChatInfoScreen from '../../screens/messages/ChatInfoScreen';
import ProviderDetailScreen from '../../screens/shared/ProviderDetailScreen';

import { theme } from '../../theme/theme';

const Stack = createStackNavigator();

const MessagesStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Messages"
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
        name="Messages" 
        component={MessagesScreen}
        options={{
          headerShown: false, // Custom header in component
        }}
      />
      
      <Stack.Screen 
        name="Chat" 
        component={ChatScreen}
        options={({ route }) => ({
          title: route.params?.chatTitle || 'Chat',
          headerShown: true,
        })}
      />
      
      <Stack.Screen 
        name="ChatInfo" 
        component={ChatInfoScreen}
        options={{
          title: 'Chat Info',
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
    </Stack.Navigator>
  );
};

export default MessagesStack;