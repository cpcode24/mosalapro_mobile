/**
 * Socket Service
 * Handles real-time communication via WebSocket/Socket.IO
 */
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, STORAGE_KEYS } from '../constants/config';
import apiConfigManager from './apiConfig';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.eventHandlers = new Map();
    this.connectionListeners = [];
  }

  /**
   * Initialize socket connection
   */
  async initialize() {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) {
        console.log('No auth token found, skipping socket initialization');
        return;
      }

      const config = apiConfigManager.getCurrentConfig();
      const socketUrl = config.baseURL.replace(/^http/, 'ws');

      const socketOptions = {
        auth: {
          token,
        },
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        maxReconnectionAttempts: this.maxReconnectAttempts,
        timeout: 20000,
        forceNew: true,
      };

      this.socket = io(socketUrl, socketOptions);
      this.setupEventHandlers();
      
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Socket connection timeout'));
        }, 10000);

        this.socket.once('connect', () => {
          clearTimeout(timeout);
          resolve();
        });

        this.socket.once('connect_error', (error) => {
          clearTimeout(timeout);
          reject(error);
        });
      });

    } catch (error) {
      console.error('Failed to initialize socket:', error);
      throw error;
    }
  }

  /**
   * Setup socket event handlers
   */
  setupEventHandlers() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.notifyConnectionListeners('connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.isConnected = false;
      this.notifyConnectionListeners('disconnected', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.reconnectAttempts++;
      this.notifyConnectionListeners('error', error);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
      this.notifyConnectionListeners('reconnected');
    });

    this.socket.on('reconnect_failed', () => {
      console.error('Socket reconnection failed after', this.maxReconnectAttempts, 'attempts');
      this.notifyConnectionListeners('reconnect_failed');
    });

    // Application-specific events
    this.setupApplicationEvents();
  }

  /**
   * Setup application-specific socket events
   */
  setupApplicationEvents() {
    // Message events
    this.socket.on('new_message', (data) => {
      this.emit('new_message', data);
    });

    this.socket.on('message_read', (data) => {
      this.emit('message_read', data);
    });

    this.socket.on('typing', (data) => {
      this.emit('typing', data);
    });

    this.socket.on('stop_typing', (data) => {
      this.emit('stop_typing', data);
    });

    // Booking events
    this.socket.on('booking_update', (data) => {
      this.emit('booking_update', data);
    });

    this.socket.on('booking_accepted', (data) => {
      this.emit('booking_accepted', data);
    });

    this.socket.on('booking_cancelled', (data) => {
      this.emit('booking_cancelled', data);
    });

    // Notification events
    this.socket.on('notification', (data) => {
      this.emit('notification', data);
    });

    // Quotation events
    this.socket.on('quotation_received', (data) => {
      this.emit('quotation_received', data);
    });

    this.socket.on('quotation_accepted', (data) => {
      this.emit('quotation_accepted', data);
    });

    // Provider status events
    this.socket.on('provider_online', (data) => {
      this.emit('provider_online', data);
    });

    this.socket.on('provider_offline', (data) => {
      this.emit('provider_offline', data);
    });
  }

  /**
   * Add event listener
   */
  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push(handler);
  }

  /**
   * Remove event listener
   */
  off(event, handler) {
    if (!this.eventHandlers.has(event)) return;
    
    const handlers = this.eventHandlers.get(event);
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
    }
  }

  /**
   * Emit event to handlers
   */
  emit(event, data) {
    if (!this.eventHandlers.has(event)) return;
    
    this.eventHandlers.get(event).forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error in socket event handler for ${event}:`, error);
      }
    });
  }

  /**
   * Send message
   */
  sendMessage(conversationId, message) {
    if (!this.isConnected) {
      throw new Error('Socket not connected');
    }

    return new Promise((resolve, reject) => {
      this.socket.emit('send_message', {
        conversationId,
        message,
      }, (response) => {
        if (response.success) {
          resolve(response.data);
        } else {
          reject(new Error(response.error || 'Failed to send message'));
        }
      });
    });
  }

  /**
   * Mark message as read
   */
  markMessageAsRead(messageId) {
    if (!this.isConnected) return;

    this.socket.emit('mark_read', { messageId });
  }

  /**
   * Send typing indicator
   */
  sendTyping(conversationId, isTyping = true) {
    if (!this.isConnected) return;

    this.socket.emit(isTyping ? 'typing' : 'stop_typing', {
      conversationId,
    });
  }

  /**
   * Join conversation room
   */
  joinConversation(conversationId) {
    if (!this.isConnected) return;

    this.socket.emit('join_conversation', { conversationId });
  }

  /**
   * Leave conversation room
   */
  leaveConversation(conversationId) {
    if (!this.isConnected) return;

    this.socket.emit('leave_conversation', { conversationId });
  }

  /**
   * Update user location for providers
   */
  updateLocation(location) {
    if (!this.isConnected) return;

    this.socket.emit('update_location', {
      latitude: location.latitude,
      longitude: location.longitude,
    });
  }

  /**
   * Set provider availability status
   */
  setProviderStatus(isAvailable) {
    if (!this.isConnected) return;

    this.socket.emit('set_availability', { isAvailable });
  }

  /**
   * Add connection listener
   */
  addConnectionListener(listener) {
    this.connectionListeners.push(listener);
  }

  /**
   * Remove connection listener
   */
  removeConnectionListener(listener) {
    const index = this.connectionListeners.indexOf(listener);
    if (index > -1) {
      this.connectionListeners.splice(index, 1);
    }
  }

  /**
   * Notify connection listeners
   */
  notifyConnectionListeners(event, data = null) {
    this.connectionListeners.forEach(listener => {
      try {
        listener(event, data);
      } catch (error) {
        console.error('Error in connection listener:', error);
      }
    });
  }

  /**
   * Get connection status
   */
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.socket?.id || null,
      reconnectAttempts: this.reconnectAttempts,
    };
  }

  /**
   * Manually reconnect
   */
  reconnect() {
    if (this.socket) {
      this.socket.connect();
    }
  }

  /**
   * Disconnect socket
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  /**
   * Cleanup on logout
   */
  cleanup() {
    this.disconnect();
    this.eventHandlers.clear();
    this.connectionListeners = [];
    this.reconnectAttempts = 0;
  }
}

// Create and export singleton instance
const socketService = new SocketService();
export default socketService;