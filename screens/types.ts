import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  ImmigrationState,
  Identity as StoreIdentity,
  Qualification as StoreQualification,
  WorkExperience,
  Employment as StoreEmployment,
  Partner as StorePartner,
} from '../store/types';

export interface ResultItem {
  screen: ScreenName;
  title: string;
  value: number;
}

export type RootStackParamList = {
  Splash: undefined;
  Identity: undefined;
  Qualification: undefined;
  Experience: undefined;
  Employment: undefined;
  Partner: undefined;
  Result: undefined;
};

export enum ScreenName {
  Splash = 'Splash',
  Identity = 'Identity',
  Qualification = 'Qualification',
  Experience = 'Experience',
  Employment = 'Employment',
  Partner = 'Partner',
  Result = 'Result',
}

export type SplashProps = {
  route: RouteProp<RootStackParamList, 'Splash'>;
  navigation: StackNavigationProp<RootStackParamList, 'Splash'>;
};

export type IdentityProps = {
  route: RouteProp<RootStackParamList, 'Identity'>;
  navigation: StackNavigationProp<RootStackParamList, 'Identity'>;
  appState: ImmigrationState;
  setIdentify: (payload: StoreIdentity) => void;
};

export type QualificationProps = {
  route: RouteProp<RootStackParamList, 'Qualification'>;
  navigation: StackNavigationProp<RootStackParamList, 'Qualification'>;
  appState: ImmigrationState;
  setQualification: (payload: StoreQualification) => void;
};

export type ExperienceProps = {
  route: RouteProp<RootStackParamList, 'Experience'>;
  navigation: StackNavigationProp<RootStackParamList, 'Experience'>;
  appState: ImmigrationState;
  setWorkExperience: (payload: WorkExperience) => void;
};

export type EmploymentProps = {
  route: RouteProp<RootStackParamList, 'Employment'>;
  navigation: StackNavigationProp<RootStackParamList, 'Employment'>;
  appState: ImmigrationState;
  setEmployment: (payload: StoreEmployment) => void;
};

export type PartnerProps = {
  route: RouteProp<RootStackParamList, 'Partner'>;
  navigation: StackNavigationProp<RootStackParamList, 'Partner'>;
  appState: ImmigrationState;
  setPartner: (payload: StorePartner) => void;
  setFinal: (payload: Boolean) => void;
};

export type ResultProps = {
  route: RouteProp<RootStackParamList, 'Result'>;
  navigation: StackNavigationProp<RootStackParamList, 'Result'>;
  appState: ImmigrationState;
  reset: () => void;
};
