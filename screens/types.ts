import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

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
  route: RouteProp<RootStackParamList, ScreenName.Splash>;
  navigation: StackNavigationProp<RootStackParamList, ScreenName.Splash>;
};

export type IdentityProps = {
  route: RouteProp<RootStackParamList, ScreenName.Identity>;
  navigation: StackNavigationProp<RootStackParamList, ScreenName.Identity>;
};

export type QualificationProps = {
  route: RouteProp<RootStackParamList, ScreenName.Qualification>;
  navigation: StackNavigationProp<RootStackParamList, ScreenName.Qualification>;
};

export type ExperienceProps = {
  route: RouteProp<RootStackParamList, ScreenName.Experience>;
  navigation: StackNavigationProp<RootStackParamList, ScreenName.Experience>;
};

export type EmploymentProps = {
  route: RouteProp<RootStackParamList, ScreenName.Employment>;
  navigation: StackNavigationProp<RootStackParamList, ScreenName.Employment>;
};

export type PartnerProps = {
  route: RouteProp<RootStackParamList, ScreenName.Partner>;
  navigation: StackNavigationProp<RootStackParamList, ScreenName.Partner>;
};

export type ResultProps = {
  route: RouteProp<RootStackParamList, ScreenName.Result>;
  navigation: StackNavigationProp<RootStackParamList, ScreenName.Result>;
};
