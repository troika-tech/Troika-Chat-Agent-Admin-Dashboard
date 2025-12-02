/**
 * API Configuration
 *
 * This file manages all API endpoint configurations for the Admin Dashboard.
 *
 * IMPORTANT: Toggle between environments by changing the 'environment' value below.
 *
 * SETUP INSTRUCTIONS:
 * 1. For LOCAL DEVELOPMENT: Set environment to 'local'
 * 2. For PRODUCTION: Set environment to 'production'
 * 3. Update the URLs below if your backend is hosted elsewhere
 */

const config = {
  // ============================================
  // TOGGLE THIS VALUE TO SWITCH ENVIRONMENTS
  // ============================================
  // Options: 'local' | 'production'
  // For deployment, this will be set to 'production' automatically during build
  environment: import.meta.env.MODE === 'production' ? 'production' : 'local',

  // ============================================
  // API BACKEND URLS
  // ============================================
  urls: {
    // Local development backend
    local: 'http://localhost:5000',

    // Production/Live backend
    production: 'https://api.0804.in',
  },
};

// ============================================
// EXPORTS - Don't modify below this line
// ============================================

// Get the current API URL based on environment
export const API_BASE_URL = config.urls[config.environment];

// Export the full config for reference
export default config;

// Log configuration on first import (helps with debugging)
if (typeof window !== 'undefined' && !window.__API_CONFIG_LOGGED__) {
  window.__API_CONFIG_LOGGED__ = true;
  
  console.log('%c 🔧 API Configuration Loaded ', 'background: #4F46E5; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;');
  console.log('  Environment:', config.environment);
  console.log('  Base URL:', API_BASE_URL);
  console.log('  💡 To change: Edit src/config/api.config.js');
}

