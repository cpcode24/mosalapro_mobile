/**
 * Chat Screen
 * Handles individual chat conversations with providers/customers
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { theme } from '../../theme/theme';

const ChatScreen = ({ route, navigation }) => {
  const { chatId, providerId, customerId, chatTitle } = route.params || {};
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [chatInfo, setChatInfo] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    loadChatData();
    loadMessages();
    
    // Set up header with chat info button
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('ChatInfo', { chatId, chatInfo })}
        >
          <Icon name="information" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      ),
    });
  }, [chatId, navigation]);

  const loadChatData = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await chatApi.getChatInfo(chatId);
      
      // Mock chat info
      const mockChatInfo = {
        id: chatId || '1',
        providerId: providerId || 'provider-1',
        customerId: customerId || 'customer-1',
        provider: {
          id: 'provider-1',
          name: 'CleanPro Services',
          image: 'https://via.placeholder.com/50x50/FF9800/FFFFFF?text=CP',
          verified: true,
          online: true,
        },
        customer: {
          id: 'customer-1',
          name: 'John Doe',
          image: 'https://via.placeholder.com/50x50/2196F3/FFFFFF?text=JD',
          online: false,
        },
        bookingId: 'booking-1',
        serviceName: 'Professional House Cleaning',
        status: 'active',
        createdAt: '2024-01-15T10:30:00Z',
      };

      setChatInfo(mockChatInfo);
      
      // Update header title with participant name
      const participantName = mockChatInfo.provider.name || mockChatInfo.customer.name;
      navigation.setOptions({
        title: participantName,
      });
    } catch (error) {
      console.error('Error loading chat data:', error);
    }
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await chatApi.getChatMessages(chatId);
      
      // Mock messages
      const mockMessages = [
        {
          id: '1',
          text: 'Hi! I have a question about the cleaning service booking for tomorrow.',
          senderId: 'customer-1',
          senderType: 'customer',
          timestamp: '2024-01-20T09:00:00Z',
          status: 'read',
        },
        {
          id: '2',
          text: 'Hello! I\'d be happy to help. What would you like to know?',
          senderId: 'provider-1',
          senderType: 'provider',
          timestamp: '2024-01-20T09:02:00Z',
          status: 'read',
        },
        {
          id: '3',
          text: 'Do you bring your own cleaning supplies, or should I have them ready?',
          senderId: 'customer-1',
          senderType: 'customer',
          timestamp: '2024-01-20T09:03:00Z',
          status: 'read',
        },
        {
          id: '4',
          text: 'We bring all necessary cleaning supplies and equipment. You don\'t need to prepare anything!',
          senderId: 'provider-1',
          senderType: 'provider',
          timestamp: '2024-01-20T09:05:00Z',
          status: 'read',
        },
        {
          id: '5',
          text: 'Perfect! Also, I have a cat. Is that okay?',
          senderId: 'customer-1',
          senderType: 'customer',
          timestamp: '2024-01-20T09:07:00Z',
          status: 'read',
        },
        {
          id: '6',
          text: 'Absolutely! We\'re pet-friendly and use safe, non-toxic products. Your cat will be fine. 🐱',
          senderId: 'provider-1',
          senderType: 'provider',
          timestamp: '2024-01-20T09:08:00Z',
          status: 'delivered',
        },
        {
          id: '7',
          text: 'Great! Looking forward to tomorrow. What time should I expect you?',
          senderId: 'customer-1',
          senderType: 'customer',
          timestamp: '2024-01-20T09:10:00Z',
          status: 'sent',
        },
      ];

      setMessages(mockMessages.reverse()); // Reverse for FlatList
    } catch (error) {
      console.error('Error loading messages:', error);
      Alert.alert('Error', 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      // Create temporary message for immediate UI update
      const tempMessage = {
        id: `temp-${Date.now()}`,
        text: messageText,
        senderId: 'current-user',
        senderType: 'customer', // Assume current user is customer
        timestamp: new Date().toISOString(),
        status: 'sending',
      };

      // Add message to list immediately
      setMessages(prev => [tempMessage, ...prev]);

      // TODO: Replace with actual API call
      // const response = await chatApi.sendMessage({
      //   chatId,
      //   text: messageText,
      //   recipientId: providerId || customerId
      // });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update message status
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempMessage.id 
            ? { ...msg, id: `msg-${Date.now()}`, status: 'sent' }
            : msg
        )
      );

      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: 0, animated: true });
      }, 100);

    } catch (error) {
      console.error('Error sending message:', error);
      // Remove failed message
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getMessageStatusIcon = (status) => {
    switch (status) {
      case 'sending':
        return 'clock-outline';
      case 'sent':
        return 'check';
      case 'delivered':
        return 'check-all';
      case 'read':
        return 'check-all';
      default:
        return 'clock-outline';
    }
  };

  const getMessageStatusColor = (status) => {
    switch (status) {
      case 'read':
        return theme.colors.primary;
      case 'delivered':
        return theme.colors.outline;
      case 'sent':
        return theme.colors.outline;
      default:
        return theme.colors.outline;
    }
  };

  const renderMessage = ({ item, index }) => {
    const isCurrentUser = item.senderId === 'current-user';
    const isConsecutive = index < messages.length - 1 && 
      messages[index + 1].senderId === item.senderId;

    return (
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
        !isConsecutive && styles.messageSpacing
      ]}>
        {!isCurrentUser && !isConsecutive && (
          <View style={styles.messageHeader}>
            <Image
              source={{ uri: chatInfo?.provider?.image || 'https://via.placeholder.com/30x30' }}
              style={styles.messageAvatar}
            />
          </View>
        )}
        
        <View style={[
          styles.messageBubble,
          isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
          !isConsecutive && styles.firstMessageBubble
        ]}>
          <Text style={[
            styles.messageText,
            isCurrentUser ? styles.currentUserText : styles.otherUserText
          ]}>
            {item.text}
          </Text>
        </View>

        <View style={styles.messageInfo}>
          <Text style={styles.messageTime}>
            {formatTimestamp(item.timestamp)}
          </Text>
          {isCurrentUser && (
            <Icon
              name={getMessageStatusIcon(item.status)}
              size={14}
              color={getMessageStatusColor(item.status)}
              style={styles.statusIcon}
            />
          )}
        </View>
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (!chatInfo?.provider?.online) return null;

    return (
      <View style={styles.typingContainer}>
        <View style={styles.typingBubble}>
          <View style={styles.typingDots}>
            <View style={[styles.typingDot, { animationDelay: '0ms' }]} />
            <View style={[styles.typingDot, { animationDelay: '150ms' }]} />
            <View style={[styles.typingDot, { animationDelay: '300ms' }]} />
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading conversation...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        inverted
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messagesList}
        ListHeaderComponent={renderTypingIndicator}
      />

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor={theme.colors.outline}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!newMessage.trim() || sending) && styles.sendButtonDisabled
          ]}
          onPress={sendMessage}
          disabled={!newMessage.trim() || sending}
        >
          <Icon
            name={sending ? 'loading' : 'send'}
            size={20}
            color={(!newMessage.trim() || sending) ? theme.colors.outline : theme.colors.onPrimary}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  headerButton: {
    padding: 8,
    marginRight: 8,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginVertical: 2,
  },
  messageSpacing: {
    marginTop: 12,
  },
  currentUserMessage: {
    alignItems: 'flex-end',
  },
  otherUserMessage: {
    alignItems: 'flex-start',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  firstMessageBubble: {
    // Additional styling for first message in group
  },
  currentUserBubble: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 4,
  },
  otherUserBubble: {
    backgroundColor: theme.colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  currentUserText: {
    color: theme.colors.onPrimary,
  },
  otherUserText: {
    color: theme.colors.onSurface,
  },
  messageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    paddingHorizontal: 4,
  },
  messageTime: {
    fontSize: 11,
    color: theme.colors.outline,
  },
  statusIcon: {
    marginLeft: 4,
  },
  typingContainer: {
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  typingBubble: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.outline,
    marginHorizontal: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
  },
  textInput: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: theme.colors.onSurface,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.surfaceVariant,
  },
});

export default ChatScreen;