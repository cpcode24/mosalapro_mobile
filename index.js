/**
 * @format
 */

// Import Hermes polyfill first
import './hermes-polyfill';

// Import crypto polyfill for Hermes
import 'react-native-get-random-values';

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);