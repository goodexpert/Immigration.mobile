import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, TouchableOpacity } from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faInfo } from '@fortawesome/free-solid-svg-icons';
import { BannerAd, BannerAdSize } from '@react-native-firebase/admob';

import { asyncScheduler, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ADMOB_CONFIG } from '../global';
import { QualificationProps } from './types';
import {
  CheckBox,
  ComboBox,
  QualificationModal,
  handleAndroidBackButton,
  removeAndroidBackButtonHandler,
} from '../components';
import { AppState } from '../store';
import { setQualification } from '../store/Actions';
import { Qualification } from '../store/types';
import {
  isFinal,
  getQualificationLevel,
  getHasQualificationInNZ,
  getStartedBefore25July2011,
  getRecognisedLevel,
} from './utils';

const qualifications = ['Level 3-6', 'Level 7-8', 'Level 9-10'];
const nzQualificationLabels = [
  'Post-graduate qualification - 2 years or more',
  'Post-graduate qualification - 1 year or more',
  "Bachelor's degree - 2 years or more",
  'Recognised Level 4-8 qualification completed before 25 July 2011',
  'Any recognised qualification started before 25 July 2011 - 2 years or more',
];

const QualificationScreen: React.FC<QualificationProps> = ({ route, navigation, appState, setQualification }) => {
  const [isOpenInfo, setIsOpenInfo] = React.useState(false);
  const [qualificationLevel, setQualificationLevel] = React.useState(getQualificationLevel(appState));
  const [hasQualificationInNZ, setHasQualificationInNZ] = React.useState(getHasQualificationInNZ(appState));
  const [startedBefore25July2011, setStartedBefore25July2011] = React.useState(getStartedBefore25July2011(appState));
  const [recognisedLevel, setRecognisedLevel] = React.useState(getRecognisedLevel(appState));
  const subject = new Subject<string>();

  const onPrev = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
    setQualification({ qualificationLevel, hasQualificationInNZ, startedBefore25July2011, recognisedLevel });
  };

  const onNext = () => {
    isFinal(appState) ? navigation.goBack() : navigation.push('Experience');
    setQualification({ qualificationLevel, hasQualificationInNZ, startedBefore25July2011, recognisedLevel });
  };

  const canMoveNext = () => {
    return qualificationLevel !== -1 && (!hasQualificationInNZ || (hasQualificationInNZ && recognisedLevel !== -1));
  };

  const onItemSelectedQualificationLevel = (index: number) => {
    setQualificationLevel(index);
    setHasQualificationInNZ(false);
  };

  const onItemSelectedRecorgnizeLevel = (index: number) => {
    setRecognisedLevel(index);
  };

  const onChangeHasQualificationGainedInNZ = (value: boolean) => {
    setHasQualificationInNZ(value);
    setStartedBefore25July2011(false);
    setRecognisedLevel(-1);
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
      if (v === 'openInfo') {
        setIsOpenInfo(true);
      } else if (v === 'onNext') {
        onNext();
      } else {
        onPrev();
      }
    });

    handleAndroidBackButton(() => {
      if (isOpenInfo) {
        setIsOpenInfo(false);
      } else {
        subject.next('onPrev');
      }
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
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>Qualification</Text>
              <TouchableOpacity style={styles.titleIconCircle} onPress={() => subject.next('openInfo')}>
                <FontAwesomeIcon icon={faInfo} size={8} style={styles.titleIcon} />
              </TouchableOpacity>
            </View>
            <ComboBox
              data={qualifications}
              placeholder={'Select your qualification'}
              onItemSelected={onItemSelectedQualificationLevel}
              selectedIndex={qualificationLevel}
            />
            {qualificationLevel !== -1 ? (
              <CheckBox
                value={hasQualificationInNZ}
                onValueChange={onChangeHasQualificationGainedInNZ}
                label={'Have a NZ qualification'}
              />
            ) : (
              <></>
            )}
            {qualificationLevel === 0 && hasQualificationInNZ ? (
              <CheckBox
                value={startedBefore25July2011}
                onValueChange={setStartedBefore25July2011}
                label={'Started before 25 July 2011'}
              />
            ) : (
              <></>
            )}
            {qualificationLevel !== -1 && hasQualificationInNZ ? (
              <ComboBox
                data={nzQualificationLabels}
                placeholder={'NZ qualification (Full-time)'}
                onItemSelected={onItemSelectedRecorgnizeLevel}
                selectedIndex={recognisedLevel}
              />
            ) : (
              <></>
            )}
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
        <QualificationModal visible={isOpenInfo} onClose={() => setIsOpenInfo(false)} />
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
  container: {
    backgroundColor: Colors.lighter,
    flex: 1,
    marginBottom: 100,
    minHeight: '90%',
    marginLeft: 30,
    marginRight: 30,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 36,
  },
  titleText: {
    fontFamily: 'Avenir-Black',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0,
    marginRight: 6,
  },
  titleIconCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'rgb(56, 59, 65)',
    borderRadius: 35,
    borderWidth: 2,
    width: 18,
    height: 18,
  },
  titleIcon: {
    color: 'rgb(56, 59, 65)',
  },
  banner: {
    alignSelf: 'center',
  },
});

const mapStateToProps = (state: AppState) => ({
  appState: state.current,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setQualification: (payload: Qualification) => dispatch(setQualification(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(QualificationScreen);
