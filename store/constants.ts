import { ImmigrationState } from './types';

/**
 * The initial state of immigration
 */
export const initialState: ImmigrationState = {
  identity: null,
  qualification: null,
  workExperience: null,
  employment: null,
  partner: null,
  isFinal: false,
  history: null,
};
