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
import { SafeAreaView, StyleSheet, View, Text, StatusBar, TouchableOpacity, BackHandler } from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import admob, { MaxAdContentRating, TestIds } from '@react-native-firebase/admob';
import { BannerAd, BannerAdSize } from '@react-native-firebase/admob';

import { asyncScheduler, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ADMOB_CONFIG } from '../global';
import { SplashProps } from './types';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../components';

const SplashScreen: React.FC<SplashProps> = ({ route, navigation }) => {
  const [isInitialized, setIsInialized] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const subject = new Subject<string>();

  const onNext = () => {
    navigation.push('Identity');
  };

  const requestAd = () => {
    if (isLoading || isInitialized) {
      return;
    }
    setIsLoading(true);

    admob()
      .setRequestConfiguration({
        // Update all future requests suitable for parental guidance
        maxAdContentRating: MaxAdContentRating.PG,
        // Indicates that you want your content treated as child-directed for purposes of COPPA.
        tagForChildDirectedTreatment: true,
        // Indicates that you want the ad request to be handled in a
        // manner suitable for users under the age of consent.
        tagForUnderAgeOfConsent: true,
      })
      .then(() => {
        // Request config successfully set!
        console.info('Request config successfully');
        setIsInialized(true);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error', error);
        setIsLoading(false);
      });
  };

  React.useEffect(() => {
    requestAd();

    subject.pipe(debounceTime(300, asyncScheduler)).subscribe((v) => {
      if (v === 'onNext') {
        onNext();
      }
    });

    handleAndroidBackButton(() => {
      BackHandler.exitApp();
    });

    return () => {
      subject.unsubscribe();
      removeAndroidBackButtonHandler();
    };
  });

  return (
    <>
      <StatusBar barStyle='dark-content' />
      <SafeAreaView style={styles.content}>
        <View style={styles.container}>
          <View style={styles.banner}>
            <BannerAd
              unitId={ADMOB_CONFIG.admob_banner_app_id}
              size={BannerAdSize.SMART_BANNER}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
            />
          </View>
          <Text style={styles.text}>New Zealand Skilled Migrant Points Calculator</Text>
          <TouchableOpacity style={styles.button} onPress={() => subject.next('onNext')}>
            <Text style={styles.buttonText}>Get started</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: Colors.lighter,
    flex: 1,
  },
  container: {
    backgroundColor: Colors.lighter,
    flex: 1,
    marginBottom: 100,
    minHeight: '90%',
  },
  banner: {
    alignSelf: 'center',
    position: 'absolute',
  },
  text: {
    fontFamily: 'Avenir-Black',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 0,
    marginLeft: 32,
    marginRight: 48,
    marginTop: 'auto',
    marginBottom: 'auto',
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
