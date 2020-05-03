import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Button } from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faInfo } from '@fortawesome/free-solid-svg-icons';

import { QualificationProps } from './types';
import { CheckBox, ComboBox } from '../components';
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
  const [qualificationLevel, setQualificationLevel] = React.useState(getQualificationLevel(appState));
  const [hasQualificationInNZ, setHasQualificationInNZ] = React.useState(getHasQualificationInNZ(appState));
  const [startedBefore25July2011, setStartedBefore25July2011] = React.useState(getStartedBefore25July2011(appState));
  const [recognisedLevel, setRecognisedLevel] = React.useState(getRecognisedLevel(appState));

  const onPrev = () => {
    isFinal(appState) ? navigation.push('Result') : navigation.goBack();
  };

  const onNext = () => {
    navigation.push(isFinal(appState) ? 'Result' : 'Experience');
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
              <Text style={styles.titleText}>Qualification</Text>
              <View style={styles.titleIconCircle}>
                <FontAwesomeIcon icon={faInfo} size={8} style={styles.titleIcon} />
              </View>
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
});

const mapStateToProps = (state: AppState) => ({
  appState: state.current,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setQualification: (payload: Qualification) => dispatch(setQualification(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(QualificationScreen);
