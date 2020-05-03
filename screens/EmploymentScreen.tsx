import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, TextInput, StatusBar, Appearance } from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faInfo } from '@fortawesome/free-solid-svg-icons';

import { EmploymentProps } from './types';
import { CheckBox, ComboBox } from '../components';
import { AppState } from '../store';
import { setEmployment } from '../store/Actions';
import { Employment } from '../store/types';
import {
  isFinal,
  getEmploymentSelectType,
  getHasEmpoymentExperienceInASS,
  getWorkOutsideAuckland,
  getWorkType,
  getHourlyRate,
} from './utils';

import OfferIcon from '../assets/img/offer-icon.svg';
import WorkingIcon from '../assets/img/working-icon.svg';

const workTypes = ['Full time', 'Part time', 'Contract', 'Casual'];

const EmploymentScreen: React.FC<EmploymentProps> = ({ route, navigation, appState, setEmployment }) => {
  const [selectedType, setSelectedType] = React.useState(getEmploymentSelectType(appState));
  const [hasWorkExperienceInASS, setHasWorkExperienceInASS] = React.useState(getHasEmpoymentExperienceInASS(appState));
  const [workOutsideAuckland, setWorkOutsideAuckland] = React.useState(getWorkOutsideAuckland(appState));
  const [workType, setWorkType] = React.useState(getWorkType(appState));
  const [hourlyRate, setHourlyRate] = React.useState(getHourlyRate(appState));
  const colorScheme = Appearance.getColorScheme();

  const onPrev = () => {
    isFinal(appState) ? navigation.push('Result') : navigation.goBack();
  };

  const onNext = () => {
    navigation.push(isFinal(appState) ? 'Result' : 'Partner');
    setEmployment({
      hasJobInNZ: selectedType === 0,
      hasJobOfferInNZ: selectedType === 1,
      hasWorkExperienceInASS,
      workOutsideAuckland,
      workType,
      hourlyRate,
    });
  };

  const canMoveNext = () => {
    return true;
  };

  const isWorking = () => {
    return selectedType === 0;
  };

  const hasJobOffer = () => {
    return selectedType === 1;
  };

  const onChangeSelectType = (index: number) => {
    setSelectedType(index === selectedType ? -1 : index);
  };

  const onItemSelectedWorkType = (index: number) => {
    setWorkType(index);
  };

  const onChangeText = (text: string) => {
    const matcher = /^[+-]?\d+(\.)?(\d+)?$/;

    if (matcher.test(text)) {
      setHourlyRate(text);
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
              <Text style={styles.titleText}>Skilled employment</Text>
              <View style={styles.titleIconCircle}>
                <FontAwesomeIcon icon={faInfo} size={8} style={styles.titleIcon} />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <TouchableOpacity
                  style={isWorking() ? styles.buttonSelected : styles.button}
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
                  style={hasJobOffer() ? styles.buttonSelected : styles.button}
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
            <TextInput
              keyboardType='numeric'
              isDarkModeEnabled={false}
              placeholder={'Hourly rate (NZD)'}
              style={styles.textInput}
              underlineColorAndroid='transparent'
              onChangeText={onChangeText}
              value={hourlyRate}
            />
            <CheckBox
              value={hasWorkExperienceInASS}
              onValueChange={setHasWorkExperienceInASS}
              label={'I work in an area of absolute skills shortage'}
            />
            <CheckBox
              value={workOutsideAuckland}
              onValueChange={setWorkOutsideAuckland}
              label={'I work outside of Auckland'}
            />
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
  textInput: {
    color: 'black',
    minHeight: 38,
    marginBottom: 12,
    borderBottomColor: 'rgb(0, 0, 0)',
    borderBottomWidth: 1.0,
  },
});

const mapStateToProps = (state: AppState) => ({
  appState: state.current,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setEmployment: (payload: Employment) => dispatch(setEmployment(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EmploymentScreen);
