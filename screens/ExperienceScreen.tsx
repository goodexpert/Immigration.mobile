import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar } from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faInfo } from '@fortawesome/free-solid-svg-icons';

import { ExperienceProps } from './types';
import { CheckBox, ComboBox } from '../components';
import { AppState } from '../store';
import { WorkExperience } from '../store/types';
import { setWorkExperience } from '../store/Actions';
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
  const [workExperienceYears, setWorkExperienceYears] = React.useState(getWorkExperienceYears(appState));
  const [hasWorkExperienceInNZ, setHasWorkExperienceInNZ] = React.useState(getHasWorkExperienceInNZ(appState));
  const [hasWorkExperienceInASS, setHasWorkExperienceInASS] = React.useState(getHasWorkExperienceInASS(appState));
  const [workExperienceYearsInASS, setWorkExperienceYearsInASS] = React.useState(getWorkExperienceYearsInASS(appState));

  const onPrev = () => {
    isFinal(appState) ? navigation.push('Result') : navigation.goBack();
  };

  const onNext = () => {
    navigation.push(isFinal(appState) ? 'Result' : 'Employment');
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

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={styles.navItem} onPress={onPrev}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity style={styles.navItem} disabled={!canMoveNext()} onPress={onNext}>
          <Text style={{ ...styles.navItemText, opacity: canMoveNext() ? 1 : 0.5 }}>
            {isFinal(appState) ? 'Done' : 'Next'}
          </Text>
        </TouchableOpacity>
      ),
    });
  });

  return (
    <>
      <StatusBar barStyle='dark-content' />
      <SafeAreaView style={styles.content}>
        <ScrollView contentInsetAdjustmentBehavior='automatic' style={styles.scrollView}>
          <View style={styles.container}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>Work experience</Text>
              <View style={styles.titleIconCircle}>
                <FontAwesomeIcon icon={faInfo} size={8} style={styles.titleIcon} />
              </View>
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
                  label={'I have work experience in an area of absolute skills shortage'}
                />
              </>
            ) : (
              <></>
            )}
            {workExperienceYears !== -1 && hasWorkExperienceInASS ? (
              <View style={styles.subContainer}>
                <ComboBox
                  data={workExperiences}
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
    color: 'rgb(0, 0, 0)',
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
});

const mapStateToProps = (state: AppState) => ({
  appState: state.current,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setWorkExperience: (payload: WorkExperience) => dispatch(setWorkExperience(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExperienceScreen);
