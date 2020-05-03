import { ActionTypes } from './ActionTypes';
import { Action } from 'redux';

export enum WorkTypes {
  FullTime = 'Full time',
  PartTime = 'Part time',
  Contract = 'Contract',
  Casual = 'Casual',
}

export interface Identity {
  dateOfBirth: Date;
}

interface SetIdentityAction {
  type: typeof ActionTypes.SET_IDENTIFY;
  payload: Identity;
}

export interface Qualification {
  qualificationLevel: number;
  hasQualificationInNZ: boolean;
  startedBefore25July2011: boolean;
  recognisedLevel: number;
}

interface SetQualificationAction {
  type: typeof ActionTypes.SET_QUALIFICATION;
  payload: Qualification;
}

export interface WorkExperience {
  workExperienceYears: number;
  hasWorkExperienceInNZ: boolean;
  hasWorkExperienceInASS: boolean;
  workExperienceYearsInASS: number;
}

interface SetWorkExperienceAction {
  type: typeof ActionTypes.SET_WORK_EXPERIENCE;
  payload: WorkExperience;
}

export interface Employment {
  hasJobInNZ: boolean;
  hasJobOfferInNZ: boolean;
  hasWorkExperienceInASS: boolean;
  workOutsideAuckland: boolean;
  workType: number;
  hourlyRate: number;
}

interface SetEmploymentAction {
  type: typeof ActionTypes.SET_SKILLED_EMPLOYMENT;
  payload: Employment;
}

export interface Partner {
  hasRequiredLevel: boolean;
  hasSkilledJobInNZ: boolean;
  hasQualification: boolean;
  qualificationLevel: number;
}

interface SetPartnerAction {
  type: typeof ActionTypes.SET_PARTNER;
  payload: Partner;
}

interface SetFinalAction {
  type: typeof ActionTypes.SET_FINAL;
  payload: Boolean;
}

export interface Immigration {
  identity: Identity | null;
  qualification: Qualification | null;
  workExperience: WorkExperience | null;
  employment: Employment | null;
  partner: Partner | null;
}

interface ClearHistoryAction {
  type: typeof ActionTypes.CLEAR;
}

interface ResetHistoryAction {
  type: typeof ActionTypes.RESET;
}

interface SaveHistoryAction {
  type: typeof ActionTypes.SAVE;
  payload: Immigration;
}

export interface ImmigrationState extends Immigration {
  isFinal: boolean;
  history: Array<Immigration> | null;
}

export type AppActionTypes =
  | SetIdentityAction
  | SetQualificationAction
  | SetWorkExperienceAction
  | SetEmploymentAction
  | SetPartnerAction
  | SetFinalAction
  | ClearHistoryAction
  | ResetHistoryAction
  | SaveHistoryAction;
