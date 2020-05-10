import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar } from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faInfo } from '@fortawesome/free-solid-svg-icons';
import { BannerAd, BannerAdSize } from '@react-native-firebase/admob';

import { asyncScheduler, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ADMOB_CONFIG } from '../global';
import { ExperienceProps } from './types';
import { CheckBox, ComboBox, ExperienceModal, SkillsShortageModal } from '../components';
import { AppState } from '../store';
import { WorkExperience } from '../store/types';
import { setWorkExperience } from '../store/Actions';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from './AndroidBackButton';
import {
  isFinal,
  getWorkExperienceYears,
  getHasWorkExperienceInNZ,
  getHasWorkExperienceInASS,
  getWorkExperienceYearsInASS,
} from './utils';

const workExperiences = ['2 - 4 years', '4 - 6 years', '6 - 8 years', '8 - 10 years', '10 years or more'];
const workExperiencesInASS = ['2-5 years', '6 years or more'];

const ExperienceScreen: React.FC<ExperienceProps> = ({ route, navigation, appState, setWorkExperience }) => {
  const [isOpenInfo, setIsOpenInfo] = React.useState(false);
  const [isOpenAssInfo, setIsOpenAssInfo] = React.useState(false);
  const [workExperienceYears, setWorkExperienceYears] = React.useState(getWorkExperienceYears(appState));
  const [hasWorkExperienceInNZ, setHasWorkExperienceInNZ] = React.useState(getHasWorkExperienceInNZ(appState));
  const [hasWorkExperienceInASS, setHasWorkExperienceInASS] = React.useState(getHasWorkExperienceInASS(appState));
  const [workExperienceYearsInASS, setWorkExperienceYearsInASS] = React.useState(getWorkExperienceYearsInASS(appState));
  const subject = new Subject<string>();

  const onPrev = () => {
    navigation.goBack();
    setWorkExperience({
      workExperienceYears,
      hasWorkExperienceInNZ,
      hasWorkExperienceInASS,
      workExperienceYearsInASS,
    });
  };

  const onNext = () => {
    isFinal(appState) ? navigation.goBack() : navigation.push('Employment');
    setWorkExperience({
      workExperienceYears,
      hasWorkExperienceInNZ,
      hasWorkExperienceInASS,
      workExperienceYearsInASS,
    });
  };

  const canMoveNext = () => {
    return workExperienceYears !== -1 && (!hasWorkExperienceInASS || workExperienceYearsInASS !== -1);
  };

  const onItemSelectedWorkExperience = (index: number) => {
    setWorkExperienceYears(index);
  };

  const onItemSelectedWorkExperienceInASS = (index: number) => {
    setWorkExperienceYearsInASS(index);
  };

  const onChangeHasWorkExperienceInASS = (value: boolean) => {
    setHasWorkExperienceInASS(value);
    if (!value) {
      setWorkExperienceYearsInASS(-1);
    }
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
      } else if (v === 'openAssInfo') {
        setIsOpenAssInfo(true);
      } else if (v === 'onNext') {
        onNext();
      } else {
        onPrev();
      }
    });

    handleAndroidBackButton(() => {
      if (isOpenInfo) {
        setIsOpenInfo(false);
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
              <Text style={styles.titleText}>Work experience</Text>
              <TouchableOpacity style={styles.titleIconCircle} onPress={() => subject.next('openInfo')}>
                <FontAwesomeIcon icon={faInfo} size={8} style={styles.titleIcon} />
              </TouchableOpacity>
            </View>
            <ComboBox
              data={workExperiences}
              placeholder={'Length of time'}
              onItemSelected={onItemSelectedWorkExperience}
              selectedIndex={workExperienceYears}
            />
            {workExperienceYears !== -1 ? (
              <>
                <CheckBox
                  value={hasWorkExperienceInNZ}
                  onValueChange={setHasWorkExperienceInNZ}
                  label={'I have at least one year of NZ work experience'}
                />
                <CheckBox
                  value={hasWorkExperienceInASS}
                  onValueChange={onChangeHasWorkExperienceInASS}
                  label={
                    <Text>
                      I have work experience in an area of{' '}
                      <Text style={styles.linkText} onPress={() => setIsOpenAssInfo(true)}>
                        absolute skills shortage
                      </Text>
                    </Text>
                  }
                />
              </>
            ) : (
              <></>
            )}
            {workExperienceYears !== -1 && hasWorkExperienceInASS ? (
              <View style={styles.subContainer}>
                <ComboBox
                  data={workExperiencesInASS}
                  placeholder={'Length of time'}
                  onItemSelected={onItemSelectedWorkExperienceInASS}
                  selectedIndex={workExperienceYearsInASS}
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
        <ExperienceModal visible={isOpenInfo} onClose={() => setIsOpenInfo(false)} />
        <SkillsShortageModal visible={isOpenAssInfo} onClose={() => setIsOpenAssInfo(false)} />
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
  banner: {
    alignSelf: 'center',
  },
});

const mapStateToProps = (state: AppState) => ({
  appState: state.current,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setWorkExperience: (payload: WorkExperience) => dispatch(setWorkExperience(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExperienceScreen);
