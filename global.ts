import { Platform } from 'react-native';
import { TestIds } from '@react-native-firebase/admob';

/**
 * Global contants
 */
export const ADMOB_CONFIG = Platform.select({
  android: {
    admob_banner_app_id: __DEV__ ? TestIds.BANNER : 'ca-app-pub-3542184687162386/3940848199',
    admob_interstitial_app_id: __DEV__ ? TestIds.REWARDED : 'ca-app-pub-3542184687162386/1685595222',
    admob_reward_app_id: __DEV__ ? TestIds.REWARDED : 'ca-app-pub-3542184687162386/1877166915',
  },
  ios: {
    admob_banner_app_id: __DEV__ ? TestIds.BANNER : 'ca-app-pub-3542184687162386/6952920692',
    admob_interstitial_app_id: __DEV__ ? TestIds.REWARDED : 'ca-app-pub-3542184687162386/5433268546',
    admob_reward_app_id: __DEV__ ? TestIds.REWARDED : 'ca-app-pub-3542184687162386/4902591982',
  },
  default: {
    admob_banner_app_id: TestIds.BANNER,
    admob_interstitial_app_id: TestIds.INTERSTITIAL,
    admob_reward_app_id: TestIds.REWARDED,
  },
});

const SKILLED_MIGRANT_REQUIRED_MIN_AGE = 20;
const SKILLED_MIGRANT_REQUIRED_MAX_AGE = 55;

interface Requirements {
  minimumAge: Number;
  maximumAge: Number;
}

export const SkilledMigrantRequirements: Requirements = {
  minimumAge: SKILLED_MIGRANT_REQUIRED_MIN_AGE,
  maximumAge: SKILLED_MIGRANT_REQUIRED_MAX_AGE,
};
