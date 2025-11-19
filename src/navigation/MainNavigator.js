/**
 * Main App Navigator
 * Bottom tab navigation for authenticated users
 */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';

// Import screens
import HomeScreen from '../screens/main/HomeScreen';
import SearchScreen from '../screens/main/SearchScreen';
import BookingsScreen from '../screens/main/BookingsScreen';
import MessagesScreen from '../screens/main/MessagesScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

// Import stack navigators for each tab
import HomeStack from './stacks/HomeStack';
import SearchStack from './stacks/SearchStack';
import BookingsStack from './stacks/BookingsStack';
import MessagesStack from './stacks/MessagesStack';
import ProfileStack from './stacks/ProfileStack';

// Import theme
import { theme } from '../theme/theme';
import { selectCurrentUser } from '../store/slices/authSlice';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  const currentUser = useSelector(selectCurrentUser);
  const isProvider = currentUser?.accountType === 'provider';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'HomeTab':
              iconName = 'home';
              break;
            case 'SearchTab':
              iconName = 'search';
              break;
            case 'BookingsTab':
              iconName = isProvider ? 'work' : 'book';
              break;
            case 'MessagesTab':
              iconName = 'chat';
              break;
            case 'ProfileTab':
              iconName = 'person';
              break;
            default:
              iconName = 'help';
          }

          return (
            <Icon 
              name={iconName} 
              size={size} 
              color={color}
              style={{
                marginTop: 2,
              }}
            />
          );
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurface,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 1,
          borderTopColor: theme.colors.outline,
          paddingBottom: 5,
          paddingTop: 5,
          height: 65,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: -2,
        },
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      
      <Tab.Screen 
        name="SearchTab" 
        component={SearchStack}
        options={{
          tabBarLabel: 'Find Services',
        }}
      />
      
      <Tab.Screen 
        name="BookingsTab" 
        component={BookingsStack}
        options={{
          tabBarLabel: isProvider ? 'Jobs' : 'Bookings',
        }}
      />
      
      <Tab.Screen 
        name="MessagesTab" 
        component={MessagesStack}
        options={{
          tabBarLabel: 'Messages',
          tabBarBadge: undefined, // You can add unread count here
        }}
      />
      
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;