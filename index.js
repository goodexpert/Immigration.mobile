/**
 * @format
 */

import React from 'react';
import { AppRegistry, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import App from './App';
import { name as appName } from './app.json';

import { Provider } from 'react-redux';
import { createAppStore } from './store';

const Index = () => {
  return (
    <GestureHandlerRootView style={styles.root}>
      <Provider store={createAppStore()}>
        <App />
      </Provider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
});

AppRegistry.registerComponent(appName, () => Index);
