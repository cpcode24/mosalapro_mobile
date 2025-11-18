/**
 * API Configuration Manager
 * Handles environment-specific API configurations
 */
import { API_CONFIG } from '../constants/config';

class ApiConfigManager {
  constructor() {
    this.currentEnvironment = __DEV__ ? 'development' : 'production';
    this.configurations = this.loadConfigurations();
  }

  /**
   * Load configurations for different environments
   */
  loadConfigurations() {
    return {
      development: {
        baseURL: 'http://localhost:3000',
        timeout: 30000,
        enableLogging: true,
        enableRetry: true,
        retryAttempts: 3,
        endpoints: {
          ...API_CONFIG.ENDPOINTS,
        },
      },
      staging: {
        baseURL: 'https://staging-api.mosalapro.com',
        timeout: 25000,
        enableLogging: true,
        enableRetry: true,
        retryAttempts: 2,
        endpoints: {
          ...API_CONFIG.ENDPOINTS,
        },
      },
      production: {
        baseURL: 'https://api.mosalapro.com',
        timeout: 20000,
        enableLogging: false,
        enableRetry: true,
        retryAttempts: 3,
        endpoints: {
          ...API_CONFIG.ENDPOINTS,
        },
      },
    };
  }

  /**
   * Get current configuration
   */
  getCurrentConfig() {
    return this.configurations[this.currentEnvironment];
  }

  /**
   * Switch environment (useful for testing)
   */
  switchEnvironment(environment) {
    if (this.configurations[environment]) {
      this.currentEnvironment = environment;
      return this.getCurrentConfig();
    }
    throw new Error(`Environment '${environment}' not found`);
  }

  /**
   * Override specific configuration
   */
  overrideConfig(overrides) {
    this.configurations[this.currentEnvironment] = {
      ...this.configurations[this.currentEnvironment],
      ...overrides,
    };
  }

  /**
   * Get endpoint URL
   */
  getEndpoint(endpointKey, params = {}) {
    const config = this.getCurrentConfig();
    const endpoint = config.endpoints[endpointKey];
    
    if (!endpoint) {
      throw new Error(`Endpoint '${endpointKey}' not found`);
    }

    // Replace URL parameters
    let url = endpoint;
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, value);
    });

    return url;
  }

  /**
   * Validate configuration
   */
  validateConfig() {
    const config = this.getCurrentConfig();
    const errors = [];

    // Check required fields
    if (!config.baseURL) {
      errors.push('baseURL is required');
    }

    if (!config.timeout || config.timeout <= 0) {
      errors.push('timeout must be a positive number');
    }

    // Validate endpoints
    const requiredEndpoints = [
      'LOGIN',
      'REGISTER_USER',
      'FIND_SERVICES',
      'MY_BOOKINGS',
    ];

    requiredEndpoints.forEach(endpoint => {
      if (!config.endpoints[endpoint]) {
        errors.push(`Required endpoint '${endpoint}' is missing`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get configuration for debugging
   */
  getDebugInfo() {
    return {
      currentEnvironment: this.currentEnvironment,
      config: this.getCurrentConfig(),
      validation: this.validateConfig(),
    };
  }

  /**
   * Setup dynamic configuration (for remote config)
   */
  async setupDynamicConfig() {
    try {
      // You could fetch remote configuration here
      // const remoteConfig = await fetchRemoteConfig();
      // this.overrideConfig(remoteConfig);
      
      console.log('Dynamic configuration setup completed');
    } catch (error) {
      console.warn('Failed to setup dynamic configuration:', error);
    }
  }

  /**
   * Custom configuration for specific use cases
   */
  getCustomConfig(customizations = {}) {
    const baseConfig = this.getCurrentConfig();
    return {
      ...baseConfig,
      ...customizations,
    };
  }

  /**
   * Get configuration for different request types
   */
  getConfigForRequestType(requestType) {
    const baseConfig = this.getCurrentConfig();
    
    switch (requestType) {
      case 'upload':
        return {
          ...baseConfig,
          timeout: 60000, // Longer timeout for uploads
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
        
      case 'download':
        return {
          ...baseConfig,
          timeout: 120000, // Longer timeout for downloads
          responseType: 'blob',
        };
        
      case 'realtime':
        return {
          ...baseConfig,
          timeout: 5000, // Shorter timeout for real-time updates
        };
        
      default:
        return baseConfig;
    }
  }

  /**
   * Environment detection helpers
   */
  isDevelopment() {
    return this.currentEnvironment === 'development';
  }

  isProduction() {
    return this.currentEnvironment === 'production';
  }

  isStaging() {
    return this.currentEnvironment === 'staging';
  }
}

// Create and export singleton instance
const apiConfigManager = new ApiConfigManager();

// Auto-setup dynamic configuration
if (__DEV__) {
  apiConfigManager.setupDynamicConfig();
}

export default apiConfigManager;