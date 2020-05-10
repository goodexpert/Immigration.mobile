import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, ActivityIndicator } from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { BannerAd, BannerAdSize, AdEventType, RewardedAd, RewardedAdEventType } from '@react-native-firebase/admob';

import { asyncScheduler, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ADMOB_CONFIG } from '../global';
import { PartnerProps } from './types';
import { CheckBox, ComboBox, QualificationModal, RequiredEnglishModal, SkillsShortageModal } from '../components';
import { AppState } from '../store';
import { Partner } from '../store/types';
import { setPartner, setFinal } from '../store/Actions';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from './AndroidBackButton';
import {
  isFinal,
  getPartnerHasRequiredLevel,
  getPartnerHasSkilledJobInNZ,
  getPartnerHasQualification,
  getPartnerHasQualificationLevel,
} from './utils';

const qualifications = ['Level 3-6', 'Level 7-8', 'Level 9-10'];

const rewardedAd = RewardedAd.createForAdRequest(ADMOB_CONFIG.admob_reward_app_id, {
  requestNonPersonalizedAdsOnly: false,
});

const PartnerScreen: React.FC<PartnerProps> = ({ route, navigation, appState, setPartner, setFinal }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpenRequiredEnglishInfo, setIsOpenRequiredEnglishInfo] = React.useState(false);
  const [isOpenQualifactionInfo, setIsOpenQualifactionInfo] = React.useState(false);
  const [isOpenAssInfo, setIsOpenAssInfo] = React.useState(false);
  const [hasRequiredLevel, setHasRequiredLevel] = React.useState(getPartnerHasRequiredLevel(appState));
  const [hasSkilledJobInNZ, setHasSkilledJobInNZ] = React.useState(getPartnerHasSkilledJobInNZ(appState));
  const [hasQualification, setHasQualification] = React.useState(getPartnerHasQualification(appState));
  const [qualificationLevel, setQualificationLevel] = React.useState(getPartnerHasQualificationLevel(appState));
  const subject = new Subject<string>();

  const onPrev = () => {
    navigation.goBack();
    setPartner({ hasRequiredLevel, hasSkilledJobInNZ, hasQualification, qualificationLevel });
  };

  const onNext = () => {
    if (isFinal(appState)) {
      setPartner({ hasRequiredLevel, hasSkilledJobInNZ, hasQualification, qualificationLevel });
      navigation.goBack();
    } else {
      setIsLoading(true);
      rewardedAd.load();
    }
    console.log('onNext', { hasRequiredLevel, hasSkilledJobInNZ, hasQualification, qualificationLevel });
  };

  const canMoveNext = () => {
    return !hasQualification || qualificationLevel !== -1;
  };

  const onItemSelectedQualification = (index: number) => {
    setQualificationLevel(index);
  };

  const eventListener = rewardedAd.onAdEvent((type, error, reward) => {
    switch (type) {
      case RewardedAdEventType.LOADED:
        rewardedAd.show();
        break;

      case RewardedAdEventType.EARNED_REWARD:
        console.info('User earned reward of ', reward);
        break;

      case AdEventType.CLOSED:
        navigation.push('Result');
        setFinal(true);
        setIsLoading(false);
        break;

      case AdEventType.ERROR:
        navigation.push('Result');
        setFinal(true);
        setIsLoading(false);
        break;
    }
  });

  React.useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={styles.navItem} onPress={() => subject.next('onPrev')}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity style={styles.navItem} onPress={() => subject.next('onNext')}>
          <Text style={styles.navItemText}>{isFinal(appState) ? 'Done' : canMoveNext() ? 'Done' : 'Skip'}</Text>
        </TouchableOpacity>
      ),
    });

    subject.pipe(debounceTime(300, asyncScheduler)).subscribe((v) => {
      if (v === 'openRequiredEnglishInfo') {
        setIsOpenRequiredEnglishInfo(true);
      } else if (v === 'openQualificationInfo') {
        setIsOpenQualifactionInfo(true);
      } else if (v === 'openAssInfo') {
        setIsOpenAssInfo(true);
      } else if (v === 'onNext') {
        onNext();
      } else if (v === 'onPrev') {
        onPrev();
      }
    });

    handleAndroidBackButton(() => {
      if (isOpenQualifactionInfo) {
        setIsOpenQualifactionInfo(false);
      } else if (isOpenRequiredEnglishInfo) {
        setIsOpenRequiredEnglishInfo(false);
      } else if (isOpenAssInfo) {
        setIsOpenAssInfo(false);
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
              <Text style={styles.titleText}>Partner</Text>
            </View>
            <CheckBox
              value={hasRequiredLevel}
              onValueChange={setHasRequiredLevel}
              label={
                <Text>
                  My partner speaks English at the same level that{' '}
                  <Text style={styles.linkText} onPress={() => subject.next('openRequiredEnglishInfo')}>
                    I'm required to
                  </Text>
                </Text>
              }
            />
            <CheckBox
              value={hasSkilledJobInNZ}
              onValueChange={setHasSkilledJobInNZ}
              label={
                <Text>
                  My partner is working in{' '}
                  <Text style={styles.linkText} onPress={() => subject.next('openAssInfo')}>
                    skilled employment
                  </Text>
                  , or has been offered{' '}
                  <Text style={styles.linkText} onPress={() => subject.next('openAssInfo')}>
                    skilled employment
                  </Text>
                  , in New Zealand
                </Text>
              }
            />
            <CheckBox
              value={hasQualification}
              onValueChange={setHasQualification}
              label={
                <Text>
                  My partner has a recognised{' '}
                  <Text style={styles.linkText} onPress={() => subject.next('openQualificationInfo')}>
                    qualification
                  </Text>
                </Text>
              }
            />
            {hasQualification ? (
              <View style={styles.subContainer}>
                <ComboBox
                  data={qualifications}
                  placeholder={'Qualification type'}
                  selectedIndex={qualificationLevel}
                  onItemSelected={onItemSelectedQualification}
                />
              </View>
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
        <QualificationModal visible={isOpenQualifactionInfo} onClose={() => setIsOpenQualifactionInfo(false)} />
        <RequiredEnglishModal visible={isOpenRequiredEnglishInfo} onClose={() => setIsOpenRequiredEnglishInfo(false)} />
        <SkillsShortageModal visible={isOpenAssInfo} onClose={() => setIsOpenAssInfo(false)} />
        {isLoading ? <ActivityIndicator size='large' color='#0000ff' style={styles.indicator} /> : <></>}
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
    paddingLeft: 30,
    paddingRight: 30,
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
  subContainer: {
    marginLeft: 24,
    marginTop: 20,
  },
  linkText: {
    color: '#5233ff',
  },
  indicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    alignSelf: 'center',
  },
});

const mapStateToProps = (state: AppState) => ({
  appState: state.current,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setPartner: (payload: Partner) => dispatch(setPartner(payload)),
  setFinal: (payload: Boolean) => dispatch(setFinal(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PartnerScreen);
