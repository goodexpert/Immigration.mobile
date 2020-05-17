import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, TextInput, StatusBar, Appearance } from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { BannerAd, BannerAdSize } from '@react-native-firebase/admob';

import { asyncScheduler, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ADMOB_CONFIG } from '../global';
import { EmploymentProps } from './types';
import {
  CheckBox,
  ComboBox,
  SkillsShortageModal,
  handleAndroidBackButton,
  removeAndroidBackButtonHandler,
} from '../components';
import { AppState } from '../store';
import { setEmployment } from '../store/Actions';
import { Employment } from '../store/types';
import {
  isFinal,
  getHasJobInNZ,
  getHasJobOfferInNZ,
  getHasEmpoymentExperienceInASS,
  getWorkOutsideAuckland,
  getWorkType,
  getHourlyRate,
} from './utils';

import OfferIcon from '../assets/img/offer-icon.svg';
import WorkingIcon from '../assets/img/working-icon.svg';

const workTypes = ['Full time', 'Part time', 'Contract', 'Casual'];

const EmploymentScreen: React.FC<EmploymentProps> = ({ route, navigation, appState, setEmployment }) => {
  const [isOpenAssInfo, setIsOpenAssInfo] = React.useState(false);
  const [hasJobInNZ, setHasJobInNZ] = React.useState(getHasJobInNZ(appState));
  const [hasJobOfferInNZ, setHasJobOfferInNZ] = React.useState(getHasJobOfferInNZ(appState));
  const [hasWorkExperienceInASS, setHasWorkExperienceInASS] = React.useState(getHasEmpoymentExperienceInASS(appState));
  const [workOutsideAuckland, setWorkOutsideAuckland] = React.useState(getWorkOutsideAuckland(appState));
  const [workType, setWorkType] = React.useState(getWorkType(appState));
  const [hourlyRate, setHourlyRate] = React.useState(getHourlyRate(appState));
  const subject = new Subject<string>();

  const saveState = () => {
    setEmployment({
      hasJobInNZ,
      hasJobOfferInNZ,
      hasWorkExperienceInASS,
      workOutsideAuckland,
      workType,
      hourlyRate,
    });
  };

  const onPrev = () => {
    saveState();
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const onNext = () => {
    saveState();
    isFinal(appState) ? navigation.goBack() : navigation.push('Partner');
  };

  const canMoveNext = () => {
    return (!hasJobInNZ && !hasJobOfferInNZ) || workType !== -1;
  };

  const onChangeSelectType = (index: number) => {
    if (index === 0) {
      setHasJobInNZ(hasJobInNZ !== true);
      setHasJobOfferInNZ(false);
    } else {
      setHasJobInNZ(false);
      setHasJobOfferInNZ(hasJobOfferInNZ !== true);
    }
  };

  const onItemSelectedWorkType = (index: number) => {
    setWorkType(index);
  };

  const onChangeText = (text: string) => {
    const matcher = /^[+-]?\d+(\.)?(\d+)?$/;

    if (matcher.test(text) || text.length === 0) {
      setHourlyRate(text);
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
      if (v === 'openAssInfo') {
        setIsOpenAssInfo(true);
      } else if (v === 'onNext') {
        onNext();
      } else {
        onPrev();
      }
    });

    handleAndroidBackButton(() => {
      if (isOpenAssInfo) {
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
              <Text style={styles.titleText}>Skilled employment</Text>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <TouchableOpacity
                  style={hasJobInNZ ? styles.buttonSelected : styles.button}
                  onPress={() => onChangeSelectType(0)}
                >
                  <WorkingIcon width={44} height={44} />
                </TouchableOpacity>
                <Text style={styles.labelText}>Working</Text>
                <Text style={styles.descriptionText}>{'I’m currently\nworking in NZ'}</Text>
              </View>
              <View style={{ width: 10 }} />
              <View style={styles.column}>
                <TouchableOpacity
                  style={hasJobOfferInNZ ? styles.buttonSelected : styles.button}
                  onPress={() => onChangeSelectType(1)}
                >
                  <OfferIcon width={44} height={44} />
                </TouchableOpacity>
                <Text style={styles.labelText}>Offered a job</Text>
                <Text style={styles.descriptionText}>{'I’ve been offered\na job in NZ'}</Text>
              </View>
            </View>
            <ComboBox
              data={workTypes}
              placeholder={'Work type'}
              onItemSelected={onItemSelectedWorkType}
              selectedIndex={workType}
            />
            <View style={styles.textInputGroup}>
              <Text style={styles.textLabel}>$</Text>
              <TextInput
                keyboardType='numeric'
                placeholder={'Hourly rate (NZD)'}
                placeholderTextColor={'rgba(26, 24, 36, 0.5)'}
                style={styles.textInput}
                underlineColorAndroid='transparent'
                onChangeText={onChangeText}
                value={hourlyRate}
              />
            </View>
            <CheckBox
              value={hasWorkExperienceInASS}
              onValueChange={setHasWorkExperienceInASS}
              label={
                <Text>
                  I work in an area of{' '}
                  <Text style={styles.linkText} onPress={() => setIsOpenAssInfo(true)}>
                    absolute skills shortage
                  </Text>
                </Text>
              }
            />
            <CheckBox
              value={workOutsideAuckland}
              onValueChange={setWorkOutsideAuckland}
              label={'I work outside of Auckland'}
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
  linkText: {
    color: '#5233ff',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  column: {
    flex: 1,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(255, 255, 255)',
    borderColor: 'rgb(0, 0, 0)',
    borderRadius: 8,
    borderWidth: 0,
    width: '100%',
    height: 80,
    marginBottom: 16,
  },
  buttonSelected: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(255, 255, 255)',
    borderColor: 'rgb(0, 0, 0)',
    borderRadius: 8,
    borderWidth: 2,
    width: '100%',
    height: 80,
    marginBottom: 16,
  },
  labelText: {
    fontFamily: 'Avenir-Medium',
    fontSize: 16,
    letterSpacing: 0,
  },
  descriptionText: {
    color: 'rgb(125, 127, 136)',
    fontFamily: 'Avenir-Medium',
    fontSize: 14,
    letterSpacing: 0,
  },
  textInputGroup: {
    flexDirection: 'row',
    alignContent: 'center',
    marginBottom: 12,
    borderBottomColor: 'rgb(0, 0, 0)',
    borderBottomWidth: 1.0,
  },
  textInput: {
    flex: 1,
    color: 'black',
    fontFamily: 'Avenir-Medium',
    fontSize: 16,
    letterSpacing: 0,
    minHeight: 38,
  },
  textLabel: {
    color: 'black',
    fontFamily: 'Avenir-Medium',
    fontSize: 16,
    letterSpacing: 0,
    alignSelf: 'center',
    marginRight: 4,
  },
  banner: {
    alignSelf: 'center',
  },
});

const mapStateToProps = (state: AppState) => ({
  appState: state.current,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setEmployment: (payload: Employment) => dispatch(setEmployment(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EmploymentScreen);
