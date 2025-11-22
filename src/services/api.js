/**
 * API Service Layer
 * Handles all communication with the MosalaPro backend
 */
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, STORAGE_KEYS } from '../constants/config';
import NetInfo from '@react-native-community/netinfo';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add retry capability
    this.setupRetryInterceptor();
    
    // Request interceptor to add auth token and check network
    this.api.interceptors.request.use(
      async (config) => {
        // Check network connectivity
        const netInfo = await NetInfo.fetch();
        if (!netInfo.isConnected) {
          throw new Error('No internet connection');
        }

        // Add auth token
        const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add session ID if available
        const sessionId = await AsyncStorage.getItem(STORAGE_KEYS.SESSION_ID);
        if (sessionId) {
          config.headers['X-Session-ID'] = sessionId;
        }

        // Add user agent and app version
        config.headers['User-Agent'] = 'MosalaPro-Mobile/1.0.0';
        config.headers['X-App-Version'] = '1.0.0';

        if (__DEV__) {
          console.log('API Request:', config.method?.toUpperCase(), config.url);
        }
        return config;
      },
      (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling and token refresh
    this.api.interceptors.response.use(
      (response) => {
        if (__DEV__) {
          console.log('API Response:', response.status, response.config.url);
        }
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        
        if (__DEV__) {
          console.error('API Response Error:', error.response?.status, error.response?.data);
        }
        
        // Handle token expiration with auto-refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
            if (refreshToken) {
              const newToken = await this.refreshToken(refreshToken);
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, logout user
            await this.clearAuthData();
            // You could dispatch a logout action here
          }
        }
        
        return Promise.reject(this.handleError(error));
      }
    );
  }

  setupRetryInterceptor() {
    this.api.interceptors.response.use(undefined, async (error) => {
      const { config } = error;
      
      if (!config || !API_CONFIG.RETRY_CONFIG.retryCondition(error)) {
        return Promise.reject(error);
      }

      config.__retryCount = config.__retryCount || 0;

      if (config.__retryCount >= API_CONFIG.RETRY_CONFIG.retries) {
        return Promise.reject(error);
      }

      config.__retryCount += 1;

      // Exponential backoff
      const delay = API_CONFIG.RETRY_CONFIG.retryDelay * Math.pow(2, config.__retryCount - 1);
      await new Promise(resolve => setTimeout(resolve, delay));

      return this.api(config);
    });
  }

  async clearAuthData() {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.SESSION_ID,
      STORAGE_KEYS.USER_DATA,
      STORAGE_KEYS.REFRESH_TOKEN,
    ]);
  }

  async refreshToken(refreshToken) {
    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}/refresh-token`, {
        refreshToken,
      });
      
      const { token, refreshToken: newRefreshToken } = response.data;
      
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      if (newRefreshToken) {
        await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
      }
      
      return token;
    } catch (error) {
      throw error;
    }
  }

  handleError(error) {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.message || 'Server error occurred',
        status: error.response.status,
        data: error.response.data,
      };
    } else if (error.request) {
      // Request made but no response
      return {
        message: 'Network error - please check your connection',
        status: 0,
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
        status: -1,
      };
    }
  }

  // Authentication APIs
  async login(credentials) {
    const response = await this.api.post(API_CONFIG.ENDPOINTS.LOGIN, credentials);
    return response.data;
  }

  async register(userData) {
    const response = await this.api.post(API_CONFIG.ENDPOINTS.REGISTER_USER, userData);
    return response.data;
  }

  async registerProvider(providerData) {
    const response = await this.api.post(API_CONFIG.ENDPOINTS.REGISTER_PROVIDER, providerData);
    return response.data;
  }

  async logout() {
    try {
      const response = await this.api.post(API_CONFIG.ENDPOINTS.LOGOUT);
      await this.clearAuthData();
      return response.data;
    } catch (error) {
      // Even if logout API fails, clear local data
      await this.clearAuthData();
      throw error;
    }
  }

  async resetPassword(email) {
    const response = await this.api.post('/reset-password', { email });
    return response.data;
  }

  async verifyEmail(token) {
    const response = await this.api.post('/verify-email', { token });
    return response.data;
  }

  async resendVerificationEmail(email) {
    const response = await this.api.post('/resend-verification', { email });
    return response.data;
  }

  // Phone Authentication APIs
  async sendPhoneOTP(phoneNumber) {
    const response = await this.api.post(API_CONFIG.ENDPOINTS.SEND_PHONE_OTP, { phoneNumber });
    return response.data;
  }

  async verifyPhoneOTP(phoneNumber, otp) {
    const response = await this.api.post(API_CONFIG.ENDPOINTS.VERIFY_PHONE_OTP, { 
      phoneNumber, 
      otp 
    });
    return response.data;
  }

  async resendPhoneOTP(phoneNumber) {
    const response = await this.api.post(API_CONFIG.ENDPOINTS.SEND_PHONE_OTP, { phoneNumber });
    return response.data;
  }

  async checkPhoneUser(phoneNumber) {
    const response = await this.api.post(API_CONFIG.ENDPOINTS.CHECK_PHONE_USER, { phoneNumber });
    return response.data;
  }

  // User APIs
  async getCurrentUser() {
    const response = await this.api.get('/user');
    return response.data;
  }

  async updateProfile(profileData) {
    const response = await this.api.put('/user/profile', profileData);
    return response.data;
  }

  async uploadProfilePhoto(imageData) {
    const formData = new FormData();
    formData.append('profilePhoto', {
      uri: imageData.uri,
      type: imageData.type,
      name: imageData.fileName || 'profile.jpg',
    });

    const response = await this.api.post('/user/profile-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Provider Search APIs
  async searchProviders(searchParams) {
    const response = await this.api.get('/find-services', { params: searchParams });
    return response.data;
  }

  async getProviderDetails(providerId) {
    const response = await this.api.get(`/profile/${providerId}`);
    return response.data;
  }

  async getProvidersByCategory(category, page = 1) {
    const response = await this.api.get('/find-services', { 
      params: { category, page } 
    });
    return response.data;
  }

  // Service Request APIs
  async createServiceRequest(requestData) {
    const response = await this.api.post('/post-service-request', requestData);
    return response.data;
  }

  async getMyServiceRequests() {
    const response = await this.api.get('/my-requests');
    return response.data;
  }

  async updateServiceRequest(requestId, updates) {
    const response = await this.api.put(`/service-request/${requestId}`, updates);
    return response.data;
  }

  // Quotation APIs
  async getQuotations() {
    const response = await this.api.get('/quotations');
    return response.data;
  }

  async sendQuotation(quotationData) {
    const response = await this.api.post('/send-quotation', quotationData);
    return response.data;
  }

  async acceptQuotation(quotationId) {
    const response = await this.api.post(`/quotation/${quotationId}/accept`);
    return response.data;
  }

  async rejectQuotation(quotationId) {
    const response = await this.api.post(`/quotation/${quotationId}/reject`);
    return response.data;
  }

  // Booking APIs
  async createBooking(bookingData) {
    const response = await this.api.post('/book-service', bookingData);
    return response.data;
  }

  async getMyBookings() {
    const response = await this.api.get('/my-bookings');
    return response.data;
  }

  async updateBookingStatus(bookingId, status) {
    const response = await this.api.put(`/booking/${bookingId}/status`, { status });
    return response.data;
  }

  // Rating APIs
  async submitRating(ratingData) {
    const response = await this.api.post('/submit-rating', ratingData);
    return response.data;
  }

  async getProviderRatings(providerId) {
    const response = await this.api.get(`/provider/${providerId}/ratings`);
    return response.data;
  }

  // Notification APIs
  async getNotifications() {
    const response = await this.api.get('/notifications');
    return response.data;
  }

  async markNotificationAsRead(notificationId) {
    const response = await this.api.put(`/notification/${notificationId}/read`);
    return response.data;
  }

  async deleteNotification(notificationId) {
    const response = await this.api.delete(`/notification/${notificationId}`);
    return response.data;
  }

  // Categories API
  async getCategories() {
    const response = await this.api.get('/categories');
    return response.data;
  }

  // Location APIs
  async getCountries() {
    const response = await this.api.get('/countries');
    return response.data;
  }

  async getCitiesByCountry(countryId) {
    const response = await this.api.get(`/cities/${countryId}`);
    return response.data;
  }

  // Payment APIs
  async createPaymentIntent(amount, currency = 'USD') {
    const response = await this.api.post('/create-payment-intent', {
      amount,
      currency,
    });
    return response.data;
  }

  async confirmPayment(paymentIntentId, paymentMethodId) {
    const response = await this.api.post('/confirm-payment', {
      paymentIntentId,
      paymentMethodId,
    });
    return response.data;
  }

  // Favorites APIs
  async addToFavorites(providerId) {
    const response = await this.api.post('/addfavpro', { providerId });
    return response.data;
  }

  async removeFromFavorites(providerId) {
    const response = await this.api.post('/removefavpro', { providerId });
    return response.data;
  }

  async getFavoriteProviders() {
    const response = await this.api.get('/favorite-providers');
    return response.data;
  }

  // Messaging APIs
  async getMessages(conversationId) {
    const response = await this.api.get(`/messages/${conversationId}`);
    return response.data;
  }

  async sendMessage(messageData) {
    const response = await this.api.post('/send-message', messageData);
    return response.data;
  }

  async getConversations() {
    const response = await this.api.get('/conversations');
    return response.data;
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;