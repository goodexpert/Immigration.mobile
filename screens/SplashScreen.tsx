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
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar } from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { SplashProps } from './types';

const SplashScreen: React.FC<SplashProps> = ({ route, navigation }) => {
  const onNext = () => {
    navigation.push('Identity');
  };

  return (
    <>
      <StatusBar barStyle='dark-content' />
      <SafeAreaView style={styles.content}>
        <ScrollView contentInsetAdjustmentBehavior='automatic' style={styles.scrollView}>
          <View style={styles.container}>
            <Text style={styles.text}>New Zealand Skilled Migrant Points Calculator</Text>
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.button} onPress={onNext}>
          <Text style={styles.buttonText}>Get started</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: Colors.lighter,
    flex: 1,
  },
  scrollView: {
    backgroundColor: Colors.lighter,
    flex: 1,
    flexDirection: 'column',
  },
  container: {
    backgroundColor: Colors.lighter,
    flex: 1,
    justifyContent: 'center',
    marginBottom: 100,
    minHeight: '90%',
  },
  text: {
    color: 'rgb(0, 0, 0)',
    fontFamily: 'Avenir-Black',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 0,
    marginLeft: 32,
    marginRight: 48,
  },
  button: {
    backgroundColor: 'rgb(82, 51, 255)',
    borderRadius: 28,
    paddingLeft: 16,
    paddingRight: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    margin: 16,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Avenir-Heavy',
    fontSize: 16,
  },
});

export default SplashScreen;
