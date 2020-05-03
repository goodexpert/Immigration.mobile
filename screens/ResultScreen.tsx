import React from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar } from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import { TouchableOpacity, FlatList } from 'react-native-gesture-handler';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

import { ResultItem, ResultProps } from './types';
import { makeResults, makeTotalPoints } from './utils';

import SadIcon from '../assets/img/sad-icon.svg';
import SmileIcon from '../assets/img/smile-icon.svg';
import { AppState } from '../store';
import { clear } from '../store/Actions';

const ResultScreen: React.FC<ResultProps> = ({ route, navigation, appState, clear }) => {
  const [results] = React.useState<Array<ResultItem>>(makeResults(appState));
  const [totalPoints] = React.useState(makeTotalPoints(makeResults(appState)));

  const onClear = () => {
    clear();
    navigation.navigate('Splash');
  };

  const onShare = () => {
    navigation.navigate('Splash');
  };

  const onClickedItem = (item: ResultItem) => {
    navigation.push(item.screen);
  };

  const renderItem = (item: ResultItem) => {
    return (
      <TouchableOpacity style={styles.resultItem} onPress={() => onClickedItem(item)}>
        <Text style={styles.resultItemTitleText}>{item.title}</Text>
        <Text style={styles.resultItemPointsText}>{item.value}pt</Text>
        <View style={styles.resultItemIconCircle}>
          <FontAwesomeIcon icon={faPencilAlt} size={13} style={styles.resultItemIcon} />
        </View>
      </TouchableOpacity>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <></>,
      headerRight: () => (
        <TouchableOpacity style={styles.navItem} onPress={onShare}>
          <Text style={styles.navItemText}>{'Share'}</Text>
        </TouchableOpacity>
      ),
    });
  });

  console.log('current', appState);

  return (
    <>
      <StatusBar barStyle='dark-content' />
      <SafeAreaView style={styles.content}>
        <ScrollView contentInsetAdjustmentBehavior='automatic' style={styles.scrollView}>
          <View style={styles.container}>
            <View style={styles.titleContainer}>
              <View style={styles.spaceView} />
              {totalPoints < 160 ? <SadIcon width={64} height={64} /> : <SmileIcon width={64} height={64} />}
              <View style={styles.pointContainer}>
                <Text style={styles.pointsText}>{totalPoints}</Text>
                <Text style={styles.pointsLabelText}>{'Points'}</Text>
              </View>
              <View style={styles.spaceView} />
            </View>
            <FlatList<ResultItem>
              data={results}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => renderItem(item)}
              scrollEnabled={false}
            />
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.button} onPress={onClear}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
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
    paddingLeft: 20,
    paddingRight: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginBottom: 18,
    marginTop: 36,
  },
  headerLayout: {
    flexDirection: 'row',
  },
  pointContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointsText: {
    fontFamily: 'Avenir-Black',
    fontSize: 60,
    fontWeight: '900',
  },
  pointsLabelText: {
    fontFamily: 'Avenir-Medium',
    fontSize: 14,
  },
  spaceView: {
    minWidth: 10,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 8,
    minHeight: 50,
    marginBottom: 10,
    paddingLeft: 18,
    paddingRight: 18,
  },
  resultItemTitleText: {
    flex: 1,
    fontFamily: 'Avenir-Medium',
    fontSize: 16,
  },
  resultItemPointsText: {
    color: 'rgb(82, 51, 255)',
    fontFamily: 'Avenir-Black',
    fontSize: 16,
    fontWeight: '800',
    marginRight: 16,
  },
  resultItemIcon: {
    color: 'rgb(82, 51, 255)',
  },
  resultItemIconCircle: {
    backgroundColor: Colors.lighter,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 35,
    width: 30,
    height: 30,
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

const mapStateToProps = (state: AppState) => ({
  appState: state.current,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  clear: () => dispatch(clear()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResultScreen);
