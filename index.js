/**
 * @format
 */

import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import { Provider } from 'react-redux';
import { createAppStore } from './store';

// class Index extends React.Component {
//   render() {
//     return (
//       <Provider store={createAppStore()}>
//         <App />
//       </Provider>
//     );
//   }
// }
const Index = () => {
  return (
    <Provider store={createAppStore()}>
      <App />
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => Index);
