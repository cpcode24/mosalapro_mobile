/**
 * Chat Info Screen
 * Displays chat information, participants, and chat settings
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { theme } from '../../theme/theme';

const ChatInfoScreen = ({ route, navigation }) => {
  const { chatId, chatInfo } = route.params || {};
  const [notifications, setNotifications] = useState(true);
  const [archiveChat, setArchiveChat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chatDetails, setChatDetails] = useState(chatInfo || null);

  useEffect(() => {
    if (!chatDetails) {
      loadChatInfo();
    }
  }, [chatId]);

  const loadChatInfo = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await chatApi.getChatInfo(chatId);
      
      // Mock chat info
      const mockChatInfo = {
        id: chatId || '1',
        provider: {
          id: 'provider-1',
          name: 'CleanPro Services',
          image: 'https://via.placeholder.com/100x100/FF9800/FFFFFF?text=CP',
          verified: true,
          rating: 4.9,
          reviewCount: 324,
          phone: '+1 (555) 123-4567',
          email: 'info@cleanpro.com',
          joinedDate: '2019-03-15',
        },
        customer: {
          id: 'customer-1',
          name: 'John Doe',
          image: 'https://via.placeholder.com/100x100/2196F3/FFFFFF?text=JD',
          phone: '+1 (555) 987-6543',
          email: 'john.doe@email.com',
          joinedDate: '2023-08-22',
        },
        booking: {
          id: 'booking-1',
          serviceName: 'Professional House Cleaning',
          date: '2024-01-20',
          time: '10:00 AM',
          status: 'confirmed',
          price: 75.00,
        },
        chatStats: {
          messagesCount: 47,
          startDate: '2024-01-15T10:30:00Z',
          lastActivity: '2024-01-20T09:10:00Z',
        },
        settings: {
          notifications: true,
          archived: false,
          blocked: false,
        }
      };

      setChatDetails(mockChatInfo);
      setNotifications(mockChatInfo.settings.notifications);
      setArchiveChat(mockChatInfo.settings.archived);
    } catch (error) {
      console.error('Error loading chat info:', error);
      Alert.alert('Error', 'Failed to load chat information');
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (participant) => {
    if (participant.id.startsWith('provider')) {
      navigation.navigate('ProviderDetail', { provider: participant });
    } else {
      // Navigate to customer profile if available
      Alert.alert('Profile', `View ${participant.name}'s profile`);
    }
  };

  const handleViewBooking = () => {
    if (chatDetails?.booking) {
      navigation.navigate('BookingDetail', { 
        bookingId: chatDetails.booking.id,
        booking: chatDetails.booking 
      });
    }
  };

  const handleCallParticipant = (participant) => {
    if (participant.phone) {
      Alert.alert(
        'Call',
        `Call ${participant.name} at ${participant.phone}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Call', onPress: () => {/* TODO: Implement call functionality */} }
        ]
      );
    }
  };

  const handleToggleNotifications = (value) => {
    setNotifications(value);
    // TODO: Update notification settings on server
  };

  const handleArchiveChat = () => {
    Alert.alert(
      'Archive Chat',
      'This chat will be moved to your archived conversations.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Archive',
          onPress: () => {
            setArchiveChat(true);
            // TODO: Update archive status on server
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleBlockUser = () => {
    Alert.alert(
      'Block User',
      'You will no longer receive messages from this user. This action can be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement block functionality
            Alert.alert('User Blocked', 'This user has been blocked.');
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleReportUser = () => {
    Alert.alert(
      'Report User',
      'Report inappropriate behavior or content.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Report',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement report functionality
            Alert.alert('Report Submitted', 'Thank you for your report. We will review it shortly.');
          }
        }
      ]
    );
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear Chat History',
      'All messages in this chat will be permanently deleted. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement clear history functionality
            Alert.alert('Chat Cleared', 'Chat history has been cleared.');
            navigation.goBack();
          }
        }
      ]
    );
  };

  const renderParticipant = (participant, isProvider = false) => (
    <TouchableOpacity
      style={styles.participantCard}
      onPress={() => handleViewProfile(participant)}
    >
      <Image source={{ uri: participant.image }} style={styles.participantImage} />
      <View style={styles.participantInfo}>
        <View style={styles.participantHeader}>
          <Text style={styles.participantName}>{participant.name}</Text>
          {isProvider && participant.verified && (
            <Icon name="check-decagram" size={18} color={theme.colors.primary} />
          )}
        </View>
        <Text style={styles.participantRole}>
          {isProvider ? 'Service Provider' : 'Customer'}
        </Text>
        {isProvider && participant.rating && (
          <View style={styles.participantRating}>
            <Icon name="star" size={14} color="#FFB400" />
            <Text style={styles.ratingText}>{participant.rating}</Text>
            <Text style={styles.reviewText}>({participant.reviewCount} reviews)</Text>
          </View>
        )}
        <Text style={styles.participantJoinDate}>
          Member since {new Date(participant.joinedDate).getFullYear()}
        </Text>
      </View>
      <View style={styles.participantActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleCallParticipant(participant)}
        >
          <Icon name="phone" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="chevron-right" size={20} color={theme.colors.outline} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading chat information...</Text>
      </View>
    );
  }

  if (!chatDetails) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle" size={64} color={theme.colors.error} />
        <Text style={styles.errorText}>Chat information not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Chat Participants */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Participants</Text>
        {renderParticipant(chatDetails.provider, true)}
        {renderParticipant(chatDetails.customer, false)}
      </View>

      {/* Related Booking */}
      {chatDetails.booking && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Related Booking</Text>
          <TouchableOpacity style={styles.bookingCard} onPress={handleViewBooking}>
            <View style={styles.bookingInfo}>
              <Text style={styles.bookingService}>{chatDetails.booking.serviceName}</Text>
              <Text style={styles.bookingDate}>
                {new Date(chatDetails.booking.date).toLocaleDateString()} at {chatDetails.booking.time}
              </Text>
              <View style={styles.bookingMeta}>
                <View style={styles.bookingStatus}>
                  <Text style={styles.bookingStatusText}>
                    {chatDetails.booking.status.charAt(0).toUpperCase() + chatDetails.booking.status.slice(1)}
                  </Text>
                </View>
                <Text style={styles.bookingPrice}>
                  ${chatDetails.booking.price.toFixed(2)}
                </Text>
              </View>
            </View>
            <Icon name="chevron-right" size={24} color={theme.colors.outline} />
          </TouchableOpacity>
        </View>
      )}

      {/* Chat Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chat Information</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Icon name="message" size={20} color={theme.colors.primary} />
            <Text style={styles.statLabel}>Messages</Text>
            <Text style={styles.statValue}>{chatDetails.chatStats.messagesCount}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="calendar" size={20} color={theme.colors.primary} />
            <Text style={styles.statLabel}>Started</Text>
            <Text style={styles.statValue}>
              {new Date(chatDetails.chatStats.startDate).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="clock" size={20} color={theme.colors.primary} />
            <Text style={styles.statLabel}>Last Activity</Text>
            <Text style={styles.statValue}>
              {new Date(chatDetails.chatStats.lastActivity).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>

      {/* Chat Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Icon name="bell" size={20} color={theme.colors.primary} />
            <Text style={styles.settingLabel}>Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={handleToggleNotifications}
            trackColor={{ false: theme.colors.outline, true: theme.colors.primary }}
            thumbColor={theme.colors.surface}
          />
        </View>

        <TouchableOpacity style={styles.settingItem} onPress={handleArchiveChat}>
          <View style={styles.settingLeft}>
            <Icon name="archive" size={20} color={theme.colors.primary} />
            <Text style={styles.settingLabel}>Archive Chat</Text>
          </View>
          <Icon name="chevron-right" size={20} color={theme.colors.outline} />
        </TouchableOpacity>
      </View>

      {/* Danger Zone */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        
        <TouchableOpacity style={styles.dangerItem} onPress={handleClearHistory}>
          <Icon name="delete-sweep" size={20} color={theme.colors.error} />
          <Text style={styles.dangerLabel}>Clear Chat History</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dangerItem} onPress={handleBlockUser}>
          <Icon name="block-helper" size={20} color={theme.colors.error} />
          <Text style={styles.dangerLabel}>Block User</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dangerItem} onPress={handleReportUser}>
          <Icon name="flag" size={20} color={theme.colors.error} />
          <Text style={styles.dangerLabel}>Report User</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.onSurface,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: theme.colors.error,
    marginTop: 16,
  },
  section: {
    backgroundColor: theme.colors.surface,
    marginBottom: 8,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  participantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 12,
  },
  participantImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  participantInfo: {
    flex: 1,
  },
  participantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  participantName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginRight: 8,
  },
  participantRole: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 4,
  },
  participantRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  ratingText: {
    fontSize: 14,
    color: theme.colors.onSurface,
    marginLeft: 4,
  },
  reviewText: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginLeft: 4,
  },
  participantJoinDate: {
    fontSize: 12,
    color: theme.colors.outline,
  },
  participantActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  bookingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingService: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  bookingDate: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 8,
  },
  bookingMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingStatus: {
    backgroundColor: theme.colors.primaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  bookingStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  bookingPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: theme.colors.surfaceVariant,
    marginHorizontal: 4,
    borderRadius: 12,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: theme.colors.onSurface,
    marginLeft: 16,
  },
  dangerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  dangerLabel: {
    fontSize: 16,
    color: theme.colors.error,
    marginLeft: 16,
  },
});

export default ChatInfoScreen;