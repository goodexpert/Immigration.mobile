import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Alert, Appearance } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { BannerAd, BannerAdSize } from '@react-native-firebase/admob';

import { asyncScheduler, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ADMOB_CONFIG, SkilledMigrantRequirements } from '../global';
import { AppState } from '../store';
import { Identity } from '../store/types';
import { setIdentify } from '../store/Actions';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from './AndroidBackButton';
import { isFinal, getDateOfBirth } from './utils';
import { IdentityProps } from './types';

const moment = require('moment');

const IdentityScreen: React.FC<IdentityProps> = ({ route, navigation, appState, setIdentify }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);
  const [dateOfBirth, setDateOfBirth] = React.useState<Date | null>(getDateOfBirth(appState));
  const colorScheme = Appearance.getColorScheme();
  const subject = new Subject<string>();

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const handleConfirm = (date: Date) => {
    const ages = moment().diff(date, 'year', false);
    if (ages > SkilledMigrantRequirements.maximumAge) {
      handleError('An applicant should be 55 years or under.');
    } else {
      setDateOfBirth(date);
      hideDatePicker();
    }
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const onPrev = () => {
    navigation.goBack();
    setIdentify({ dateOfBirth });
  };

  const onNext = () => {
    isFinal(appState) ? navigation.goBack() : navigation.push('Qualification');
    setIdentify({ dateOfBirth });
  };

  const canMoveNext = () => {
    if (dateOfBirth == null) {
      return false;
    }

    const diffYear = moment().diff(dateOfBirth, 'year', false);
    return diffYear <= SkilledMigrantRequirements.maximumAge;
  };

  const handleError = (message: string, title: string = 'Alert') => {
    Alert.alert(title, message, [{ text: 'OK', onPress: () => console.log('OK Pressed') }, ,], {
      cancelable: false,
    });
  };

  React.useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={styles.navItem} onPress={() => subject.next('onPrev')}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity style={styles.navItem} onPress={() => subject.next('onNext')}>
          <Text style={styles.navItemText}>{isFinal(appState) ? 'Done' : canMoveNext() ? 'Next' : 'Skip'}</Text>
        </TouchableOpacity>
      ),
    });

    subject.pipe(debounceTime(300, asyncScheduler)).subscribe((v) => {
      if (v === 'onNext') {
        onNext();
      } else {
        onPrev();
      }
    });

    handleAndroidBackButton(() => {
      subject.next('onPrev');
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
        <ScrollView contentInsetAdjustmentBehavior='automatic' style={styles.scrollView}>
          <View style={styles.container}>
            <View style={styles.titleSection}>
              <Text style={styles.titleText}>Date of birth</Text>
            </View>
            <TouchableOpacity style={styles.selectItem} onPress={showDatePicker}>
              <Text style={styles.selectItemTitle}>
                {dateOfBirth == null ? 'DD/MM/YY' : moment(dateOfBirth).format('DD/MM/YYYY')}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              date={dateOfBirth === null ? new Date() : dateOfBirth}
              isDarkModeEnabled={colorScheme === 'dark'}
              isVisible={isDatePickerVisible}
              mode='date'
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>
        </ScrollView>
        <View style={styles.banner}>
          <BannerAd
            unitId={ADMOB_CONFIG.admob_banner_app_id}
            size={BannerAdSize.SMART_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
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
  scrollView: {
    backgroundColor: Colors.lighter,
    flex: 1,
    flexDirection: 'column',
  },
  container: {
    backgroundColor: Colors.lighter,
    flex: 1,
    marginBottom: 100,
    minHeight: '90%',
  },
  navItem: {
    color: 'rgb(0, 0, 0)',
    marginLeft: 30,
    marginRight: 28,
  },
  navItemText: {
    color: '#5233FF',
    fontFamily: 'Avenir-Medium',
    fontSize: 14,
  },
  navItemTextDisabled: {
    color: 'rgb(0, 0, 0)',
    opacity: 0.5,
    fontFamily: 'Avenir-Medium',
    fontSize: 14,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 36,
  },
  titleText: {
    fontFamily: 'Avenir-Black',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0,
    marginRight: 6,
  },
  selectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 38,
    marginBottom: 12,
    marginLeft: 30,
    marginRight: 30,
    borderBottomColor: Colors.black,
    borderBottomWidth: 1.0,
  },
  selectItemTitle: {
    color: 'rgba(26, 24, 36, 0.5)',
    fontFamily: 'Avenir-Medium',
    fontSize: 16,
    letterSpacing: 0,
  },
  banner: {
    alignSelf: 'center',
  },
});

const mapStateToProps = (state: AppState) => ({
  appState: state.current,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setIdentify: (payload: Identity) => dispatch(setIdentify(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(IdentityScreen);
