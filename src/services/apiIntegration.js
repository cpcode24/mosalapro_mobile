/**
 * API Integration Helper
 * Provides utilities for testing and integrating with the backend API
 */
import apiService from './api';
import { API_CONFIG, STORAGE_KEYS } from '../constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

class ApiIntegration {
  
  /**
   * Test API connectivity and basic endpoints
   */
  async testApiConnection() {
    const results = {
      connectivity: false,
      endpoints: {},
      overall: false,
    };

    try {
      // Test basic connectivity
      const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
        method: 'GET',
        timeout: 5000,
      });
      
      results.connectivity = response.ok;
      
      if (results.connectivity) {
        // Test public endpoints (no auth required)
        const publicTests = await this.testPublicEndpoints();
        results.endpoints.public = publicTests;
        
        // Test authenticated endpoints (if user is logged in)
        const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
          const authTests = await this.testAuthenticatedEndpoints();
          results.endpoints.authenticated = authTests;
        }
        
        results.overall = this.calculateOverallHealth(results);
      }
      
    } catch (error) {
      console.error('API Connection Test Failed:', error);
      results.error = error.message;
    }

    return results;
  }

  /**
   * Test public endpoints that don't require authentication
   */
  async testPublicEndpoints() {
    const tests = {};
    
    try {
      // Test categories endpoint
      tests.categories = await this.testEndpoint(() => apiService.getCategories());
      
      // Test countries endpoint
      tests.countries = await this.testEndpoint(() => apiService.getCountries());
      
      // Test public search (if available)
      tests.search = await this.testEndpoint(() => 
        apiService.searchProviders({ category: 'cleaning', limit: 1 })
      );
      
    } catch (error) {
      console.error('Public endpoints test failed:', error);
    }
    
    return tests;
  }

  /**
   * Test authenticated endpoints
   */
  async testAuthenticatedEndpoints() {
    const tests = {};
    
    try {
      // Test user profile
      tests.userProfile = await this.testEndpoint(() => apiService.getCurrentUser());
      
      // Test bookings
      tests.bookings = await this.testEndpoint(() => apiService.getMyBookings());
      
      // Test notifications
      tests.notifications = await this.testEndpoint(() => apiService.getNotifications());
      
      // Test conversations
      tests.conversations = await this.testEndpoint(() => apiService.getConversations());
      
    } catch (error) {
      console.error('Authenticated endpoints test failed:', error);
    }
    
    return tests;
  }

  /**
   * Test individual endpoint
   */
  async testEndpoint(apiCall, timeout = 10000) {
    const startTime = Date.now();
    
    try {
      const result = await Promise.race([
        apiCall(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), timeout)
        )
      ]);
      
      const responseTime = Date.now() - startTime;
      
      return {
        success: true,
        responseTime,
        data: result,
      };
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        success: false,
        responseTime,
        error: error.message,
        status: error.status || null,
      };
    }
  }

  /**
   * Calculate overall API health
   */
  calculateOverallHealth(results) {
    if (!results.connectivity) return false;
    
    const { public: publicTests = {}, authenticated: authTests = {} } = results.endpoints;
    
    const allTests = { ...publicTests, ...authTests };
    const testResults = Object.values(allTests);
    
    if (testResults.length === 0) return false;
    
    const successfulTests = testResults.filter(test => test.success).length;
    const successRate = successfulTests / testResults.length;
    
    return successRate >= 0.7; // 70% success rate threshold
  }

  /**
   * Get API health status with recommendations
   */
  async getApiHealthStatus() {
    const testResults = await this.testApiConnection();
    
    const health = {
      status: testResults.overall ? 'healthy' : 'unhealthy',
      connectivity: testResults.connectivity,
      lastChecked: new Date().toISOString(),
      recommendations: [],
    };

    // Add recommendations based on test results
    if (!testResults.connectivity) {
      health.recommendations.push('Check internet connection');
      health.recommendations.push('Verify API base URL configuration');
    }

    if (testResults.endpoints) {
      const { public: publicTests, authenticated: authTests } = testResults.endpoints;
      
      if (publicTests) {
        const failedPublic = Object.entries(publicTests)
          .filter(([_, test]) => !test.success)
          .map(([endpoint]) => endpoint);
          
        if (failedPublic.length > 0) {
          health.recommendations.push(`Check public endpoints: ${failedPublic.join(', ')}`);
        }
      }

      if (authTests) {
        const failedAuth = Object.entries(authTests)
          .filter(([_, test]) => !test.success)
          .map(([endpoint]) => endpoint);
          
        if (failedAuth.length > 0) {
          health.recommendations.push(`Check authenticated endpoints: ${failedAuth.join(', ')}`);
        }
      }
    }

    return health;
  }

  /**
   * Setup API monitoring for development
   */
  setupApiMonitoring() {
    if (!__DEV__) return;

    // Log all API calls in development
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      if (args[0]?.includes('API')) {
        // Enhanced API logging
        originalConsoleLog('🔗 API Monitor:', ...args);
      } else {
        originalConsoleLog(...args);
      }
    };

    // Monitor network state changes
    this.monitorNetworkChanges();
  }

  /**
   * Monitor network state changes
   */
  async monitorNetworkChanges() {
    try {
      const unsubscribe = NetInfo.addEventListener(state => {
        console.log('🌐 Network State Changed:', {
          isConnected: state.isConnected,
          type: state.type,
          isInternetReachable: state.isInternetReachable,
        });

        // Optionally trigger API health check on network changes
        if (state.isConnected && state.isInternetReachable) {
          this.testApiConnection().then(results => {
            console.log('📊 API Health Check:', results.overall ? '✅ Healthy' : '❌ Unhealthy');
          });
        }
      });

      return unsubscribe;
    } catch (error) {
      console.warn('Network monitoring not available:', error);
    }
  }

  /**
   * Validate API response structure
   */
  validateApiResponse(response, expectedFields = []) {
    const validation = {
      valid: true,
      missingFields: [],
      extraFields: [],
    };

    if (!response || typeof response !== 'object') {
      validation.valid = false;
      validation.error = 'Response is not an object';
      return validation;
    }

    // Check for expected fields
    expectedFields.forEach(field => {
      if (!(field in response)) {
        validation.missingFields.push(field);
        validation.valid = false;
      }
    });

    return validation;
  }

  /**
   * Generate API integration report
   */
  async generateIntegrationReport() {
    const report = {
      timestamp: new Date().toISOString(),
      apiConfig: {
        baseUrl: API_CONFIG.BASE_URL,
        timeout: API_CONFIG.TIMEOUT,
      },
      tests: {},
      recommendations: [],
    };

    // Run comprehensive tests
    report.tests = await this.testApiConnection();
    
    // Generate recommendations
    if (!report.tests.overall) {
      report.recommendations.push('API integration needs attention');
    }

    if (!report.tests.connectivity) {
      report.recommendations.push('Check server connectivity and configuration');
    }

    // Add performance recommendations
    const endpoints = { ...report.tests.endpoints.public, ...report.tests.endpoints.authenticated };
    const slowEndpoints = Object.entries(endpoints)
      .filter(([_, test]) => test.responseTime > 3000)
      .map(([endpoint]) => endpoint);

    if (slowEndpoints.length > 0) {
      report.recommendations.push(`Optimize slow endpoints: ${slowEndpoints.join(', ')}`);
    }

    return report;
  }
}

// Create and export singleton instance
const apiIntegration = new ApiIntegration();
export default apiIntegration;