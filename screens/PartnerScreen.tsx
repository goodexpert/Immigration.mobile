import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar } from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faInfo } from '@fortawesome/free-solid-svg-icons';

import { PartnerProps } from './types';
import { CheckBox, ComboBox } from '../components';
import { AppState } from '../store';
import { Partner } from '../store/types';
import { setPartner, setFinal } from '../store/Actions';
import {
  isFinal,
  getPartnerHasRequiredLevel,
  getPartnerHasSkilledJobInNZ,
  getPartnerHasQualification,
  getPartnerHasQualificationLevel,
} from './utils';

const qualifications = ['Level 3-6', 'Level 7-8', 'Level 9-10'];

const PartnerScreen: React.FC<PartnerProps> = ({ route, navigation, appState, setPartner, setFinal }) => {
  const [hasRequiredLevel, setHasRequiredLevel] = React.useState(getPartnerHasRequiredLevel(appState));
  const [hasSkilledJobInNZ, setHasSkilledJobInNZ] = React.useState(getPartnerHasSkilledJobInNZ(appState));
  const [hasQualification, setHasQualification] = React.useState(getPartnerHasQualification(appState));
  const [qualificationLevel, setQualificationLevel] = React.useState(getPartnerHasQualificationLevel(appState));

  const onPrev = () => {
    isFinal(appState) ? navigation.push('Result') : navigation.goBack();
  };

  const onNext = () => {
    navigation.push('Result');
    setPartner({ hasRequiredLevel, hasSkilledJobInNZ, hasQualification, qualificationLevel });
    setFinal(true);
  };

  const canMoveNext = () => {
    return !hasQualification || qualificationLevel !== -1;
  };

  const onItemSelectedQualification = (index: number) => {
    setQualificationLevel(index);
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
          <Text style={{ ...styles.navItemText, opacity: canMoveNext() ? 1 : 0.5 }}>Done</Text>
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
              <Text style={styles.titleText}>Partner</Text>
              <View style={styles.titleIconCircle}>
                <FontAwesomeIcon icon={faInfo} size={8} style={styles.titleIcon} />
              </View>
            </View>
            <CheckBox
              value={hasRequiredLevel}
              onValueChange={setHasRequiredLevel}
              label={"My partner speaks English at the same\nlevel that I'm required to"}
            />
            <CheckBox
              value={hasSkilledJobInNZ}
              onValueChange={setHasSkilledJobInNZ}
              label={
                'My partner is working in skilled employment,\nor has been offered skilled employment, in New Zealand'
              }
            />
            <CheckBox
              value={hasQualification}
              onValueChange={setHasQualification}
              label={'My partner has a recognised qualification'}
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
  setPartner: (payload: Partner) => dispatch(setPartner(payload)),
  setFinal: (payload: Boolean) => dispatch(setFinal(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PartnerScreen);
