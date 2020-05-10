import { AppState } from './AppStore';
import { initialState } from './constants';

import AsyncStorage from '@react-native-community/async-storage';

export class StateLoader {
  loadState = async () => {
    try {
      const state = await AsyncStorage.getItem('ImmigrationNZ');
      if (state !== undefined && state !== null) {
        return JSON.parse(state);
      }
    } catch (error) {
      console.log('error', error);
    }
    return this.initialState();
  };

  saveState = async (state: AppState) => {
    try {
      const json = JSON.stringify(state);
      await AsyncStorage.setItem('ImmigrationNZ', json);
    } catch (error) {
      console.log('error', error);
    }
  };

  initialState = () => {
    return {
      current: initialState,
    };
  };
}
