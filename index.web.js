/**
 * Web-specific entry point
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Register the component
AppRegistry.registerComponent(appName, () => App);

// Mount to DOM for web
AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag: document.getElementById('root')
});