/**
 * Messages Screen
 * Chat interface for communication between customers and providers
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  TextInput,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, typography, spacing, shadows } from '../../theme/theme';
import { selectCurrentUser } from '../../store/slices/authSlice';

const MessagesScreen = ({ navigation, route }) => {
  const currentUser = useSelector(selectCurrentUser);
  const isProvider = currentUser?.accountType === 'provider';
  
  const [conversations, setConversations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState([]);

  // Sample data - replace with real API data
  const sampleConversations = [
    {
      id: '1',
      participantName: 'Sarah Johnson',
      participantType: isProvider ? 'customer' : 'provider',
      participantAvatar: null,
      lastMessage: 'Thank you for the excellent cleaning service!',
      lastMessageTime: '2024-01-20T14:30:00Z',
      unreadCount: 0,
      isOnline: true,
      service: 'House Cleaning',
      bookingId: 'booking_1',
      status: 'active',
    },
    {
      id: '2',
      participantName: 'Mike Smith',
      participantType: isProvider ? 'customer' : 'provider',
      participantAvatar: null,
      lastMessage: 'I can come tomorrow at 2 PM for the plumbing repair',
      lastMessageTime: '2024-01-19T16:45:00Z',
      unreadCount: 2,
      isOnline: false,
      service: 'Plumbing Repair',
      bookingId: 'booking_2',
      status: 'active',
    },
    {
      id: '3',
      participantName: 'David Wilson',
      participantType: isProvider ? 'customer' : 'provider',
      participantAvatar: null,
      lastMessage: 'The electrical work has been completed successfully.',
      lastMessageTime: '2024-01-18T11:20:00Z',
      unreadCount: 0,
      isOnline: false,
      service: 'Electrical Installation',
      bookingId: 'booking_3',
      status: 'completed',
    },
    {
      id: '4',
      participantName: 'Lisa Green',
      participantType: isProvider ? 'customer' : 'provider',
      participantAvatar: null,
      lastMessage: 'Unfortunately, I need to reschedule due to weather',
      lastMessageTime: '2024-01-17T09:15:00Z',
      unreadCount: 1,
      isOnline: true,
      service: 'Garden Maintenance',
      bookingId: 'booking_4',
      status: 'rescheduled',
    },
  ];

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    filterConversations();
  }, [searchQuery, conversations]);

  const loadConversations = async () => {
    // API call to load conversations
    setConversations(sampleConversations);
  };

  const filterConversations = () => {
    if (!searchQuery.trim()) {
      setFilteredConversations(conversations);
      return;
    }

    const filtered = conversations.filter(conversation =>
      conversation.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredConversations(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadConversations();
    setRefreshing(false);
  };

  const handleConversationPress = (conversation) => {
    navigation.navigate('ChatDetail', {
      conversationId: conversation.id,
      participantName: conversation.participantName,
      participantType: conversation.participantType,
      service: conversation.service,
      bookingId: conversation.bookingId,
    });
  };

  const handleNewMessage = () => {
    navigation.navigate('NewMessage');
  };

  const handleDeleteConversation = (conversationId) => {
    Alert.alert(
      'Delete Conversation',
      'Are you sure you want to delete this conversation? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setConversations(prev => prev.filter(c => c.id !== conversationId));
          },
        },
      ]
    );
  };

  const formatMessageTime = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = (now - messageTime) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
      return diffInMinutes < 1 ? 'now' : `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return diffInDays === 1 ? '1d' : `${diffInDays}d`;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return colors.success || '#4CAF50';
      case 'completed':
        return colors.info || '#2196F3';
      case 'rescheduled':
        return colors.warning || '#FF9800';
      default:
        return colors.gray500;
    }
  };

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <Icon name="search" size={20} color={colors.gray500} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
          placeholderTextColor={colors.gray400}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close" size={20} color={colors.gray500} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderConversationItem = ({ item: conversation }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => handleConversationPress(conversation)}
      onLongPress={() => handleDeleteConversation(conversation.id)}
    >
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {conversation.participantName.charAt(0).toUpperCase()}
          </Text>
        </View>
        {conversation.isOnline && (
          <View style={styles.onlineIndicator} />
        )}
        {conversation.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>
              {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.participantName} numberOfLines={1}>
            {conversation.participantName}
          </Text>
          <Text style={styles.messageTime}>
            {formatMessageTime(conversation.lastMessageTime)}
          </Text>
        </View>

        <View style={styles.serviceContainer}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(conversation.status) }]} />
          <Text style={styles.serviceText} numberOfLines={1}>
            {conversation.service}
          </Text>
        </View>

        <Text
          style={[
            styles.lastMessage,
            conversation.unreadCount > 0 && styles.unreadMessage
          ]}
          numberOfLines={2}
        >
          {conversation.lastMessage}
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.conversationActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleConversationPress(conversation)}
        >
          <Icon name="chat" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="chat-bubble-outline" size={64} color={colors.gray400} />
      <Text style={styles.emptyStateTitle}>No Messages Yet</Text>
      <Text style={styles.emptyStateText}>
        {isProvider
          ? 'When customers contact you about your services, their messages will appear here.'
          : 'Start a conversation with a service provider to see your messages here.'
        }
      </Text>
      {!isProvider && (
        <TouchableOpacity
          style={styles.findServicesButton}
          onPress={() => navigation.navigate('SearchTab')}
        >
          <Text style={styles.findServicesButtonText}>Find Services</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const totalUnreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Messages</Text>
          {totalUnreadCount > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>
                {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.newMessageButton}
          onPress={handleNewMessage}
        >
          <Icon name="edit" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {renderSearchBar()}

      {/* Conversations List */}
      <View style={styles.content}>
        {filteredConversations.length > 0 ? (
          <FlatList
            data={filteredConversations}
            renderItem={renderConversationItem}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.conversationsList}
          />
        ) : (
          renderEmptyState()
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.onBackground,
  },
  headerBadge: {
    backgroundColor: colors.error,
    borderRadius: 10,
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  headerBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
  },
  newMessageButton: {
    padding: spacing.xs,
  },
  searchContainer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.onSurface,
    marginLeft: spacing.sm,
  },
  content: {
    flex: 1,
  },
  conversationsList: {
    paddingVertical: spacing.xs,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.base,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success || '#4CAF50',
    borderWidth: 2,
    borderColor: colors.background,
  },
  unreadBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.error,
    borderRadius: 10,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },
  conversationContent: {
    flex: 1,
    marginRight: spacing.sm,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  participantName: {
    flex: 1,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.onBackground,
    marginRight: spacing.sm,
  },
  messageTime: {
    fontSize: typography.fontSize.xs,
    color: colors.gray500,
  },
  serviceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs,
  },
  serviceText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    fontWeight: typography.fontWeight.medium,
  },
  lastMessage: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    lineHeight: 18,
  },
  unreadMessage: {
    color: colors.onBackground,
    fontWeight: typography.fontWeight.medium,
  },
  conversationActions: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    padding: spacing.xs,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyStateTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.gray700,
    marginTop: spacing.base,
    marginBottom: spacing.sm,
  },
  emptyStateText: {
    fontSize: typography.fontSize.base,
    color: colors.gray600,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  findServicesButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.xl,
  },
  findServicesButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
});

export default MessagesScreen;