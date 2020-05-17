/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import {
  SplashScreen,
  IdentityScreen,
  QualificationScreen,
  ExperienceScreen,
  EmploymentScreen,
  PartnerScreen,
  ResultScreen,
} from './screens';

import { Colors } from 'react-native/Libraries/NewAppScreen';

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name='Splash'
          component={SplashScreen}
          options={{ title: 'NZ Immigration', headerShown: false, ...TransitionPresets.SlideFromRightIOS }}
        />
        <Stack.Screen
          name='Identity'
          component={IdentityScreen}
          options={{
            title: 'NZ Immigration',
            headerStyle: { backgroundColor: Colors.lighter },
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <Stack.Screen
          name='Qualification'
          component={QualificationScreen}
          options={{
            title: 'NZ Immigration',
            headerStyle: { backgroundColor: Colors.lighter },
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <Stack.Screen
          name='Experience'
          component={ExperienceScreen}
          options={{
            title: 'NZ Immigration',
            headerStyle: { backgroundColor: Colors.lighter },
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <Stack.Screen
          name='Employment'
          component={EmploymentScreen}
          options={{
            title: 'NZ Immigration',
            headerStyle: { backgroundColor: Colors.lighter },
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <Stack.Screen
          name='Partner'
          component={PartnerScreen}
          options={{
            title: 'NZ Immigration',
            headerStyle: { backgroundColor: Colors.lighter },
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <Stack.Screen
          name='Result'
          component={ResultScreen}
          options={{
            title: 'NZ Immigration',
            headerStyle: { backgroundColor: Colors.lighter },
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
