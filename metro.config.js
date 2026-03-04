const {getDefaultConfig} = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Fix web bundling issues
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

config.resolver.alias = {
  ...(config.resolver.alias || {}),
  'react-native$': 'react-native-web',
  'react-native-web$': 'react-native-web',
  'react-native-pager-view': path.resolve(__dirname, 'react-native-pager-view.web.js'),
  '../../src/private/devsupport/rndevtools/ReactDevToolsSettingsManager': path.resolve(__dirname, 'ReactDevToolsSettingsManager.js'),
};

config.resolver.extensions = [
  '.web.tsx',
  '.web.ts', 
  '.web.jsx',
  '.web.js',
  '.tsx',
  '.ts',
  '.jsx',
  '.js',
  '.json',
];

// Enable web support
config.transformer.enableBabelRuntime = false;

// Hermes compatibility fixes for native platforms
config.transformer.hermesParser = true;
config.transformer.minifierConfig = {
  mangle: false,
  keep_fnames: true,
};

// Use default module ID factory to avoid polyfill path issues
// config.serializer.createModuleIdFactory is left as default

// Process module filter for proper initialization order
config.serializer.processModuleFilter = (module) => {
  // Always include polyfill files first
  if (module.path.includes('hermes-polyfill') || 
      module.path.includes('react-native-get-random-values')) {
    return true;
  }
  // Skip problematic React DevTools modules
  if (module.path.includes('ReactDevToolsSettingsManager') ||
      module.path.includes('setUpReactDevTools')) {
    return false;
  }
  return true;
};

module.exports = config;