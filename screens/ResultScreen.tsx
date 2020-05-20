import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Share,
  ShareContent,
  TouchableOpacity,
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

import { asyncScheduler, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ResultItem, ResultProps, ScreenName } from './types';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../components';
import { makeResults, makeTotalPoints } from './utils';

import SadIcon from '../assets/img/sad-icon.svg';
import SmileIcon from '../assets/img/smile-icon.svg';
import { AppState } from '../store';
import { reset } from '../store/Actions';

const ResultScreen: React.FC<ResultProps> = ({ route, navigation, appState, reset }) => {
  const [results, setResults] = React.useState<Array<ResultItem>>(makeResults(appState));
  const [totalPoints, setTotalPoints] = React.useState(makeTotalPoints(makeResults(appState)));
  const subject = new Subject<string>();

  const shareContent = Platform.select({
    android: {
      title: 'New Zealand Skilled Migrant Points Calculator',
    },
    ios: {
      title: 'New Zealand Skilled Migrant Points Calculator',
    },
    default: {
      message: `My New Zealand immigration points is ${totalPoints}`,
    },
  }) as ShareContent;

  const onReset = () => {
    reset();
    navigation.navigate('Splash');
  };

  const onShare = async () => {
    try {
      const result = await Share.share(shareContent);
      if (result.action === Share.sharedAction) {
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const onClickedItem = (screenName: ScreenName) => {
    navigation.push(screenName);
  };

  const renderItem = (item: ResultItem, index: number) => {
    return (
      <TouchableOpacity key={index} style={styles.resultItem} onPress={() => subject.next(item.screen)}>
        <Text style={styles.resultItemTitleText}>{item.title}</Text>
        <Text style={styles.resultItemPointsText}>{item.value}pt</Text>
        <View style={styles.resultItemIconCircle}>
          <FontAwesomeIcon icon={faPencilAlt} size={13} style={styles.resultItemIcon} />
        </View>
      </TouchableOpacity>
    );
  };

  const checkAndUpdate = () => {
    const result = makeResults(appState);
    const points = makeTotalPoints(result);
    if (points !== totalPoints) {
      setResults(result);
      setTotalPoints(points);
    }
  };

  React.useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <></>,
      headerRight: () => (
        <TouchableOpacity style={styles.navItem} onPress={() => subject.next('onShare')}>
          <Text style={styles.navItemText}>{'Share'}</Text>
        </TouchableOpacity>
      ),
    });
    checkAndUpdate();

    subject.pipe(debounceTime(300, asyncScheduler)).subscribe((v) => {
      if (v === 'onReset') {
        onReset();
      } else if (v === 'onShare') {
        onShare();
      } else {
        onClickedItem(v as ScreenName);
      }
    });

    handleAndroidBackButton(() => {
      subject.next('onReset');
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
              <View style={styles.spaceView} />
              {totalPoints < 160 ? <SadIcon width={64} height={64} /> : <SmileIcon width={64} height={64} />}
              <View style={styles.pointContainer}>
                <Text style={styles.pointsText}>{totalPoints}</Text>
                <Text style={styles.pointsLabelText}>{'Points'}</Text>
              </View>
              <View style={styles.spaceView} />
            </View>
            <View>{results.map((item, index) => renderItem(item, index))}</View>
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.button} onPress={() => subject.next('onReset')}>
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
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 8,
    paddingBottom: 8,
  },
  navItemText: {
    color: '#5233FF',
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
    letterSpacing: 0,
  },
  pointsLabelText: {
    fontFamily: 'Avenir-Medium',
    fontSize: 14,
    letterSpacing: 0,
    marginTop: -16,
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
  reset: () => dispatch(reset()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResultScreen);
