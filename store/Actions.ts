import { ActionTypes } from './ActionTypes';
import { AppActionTypes, Identity, Qualification, WorkExperience, Employment, Partner, Immigration } from './types';

export function setIdentify(payload: Identity): AppActionTypes {
  return {
    type: ActionTypes.SET_IDENTIFY,
    payload,
  };
}

export function setQualification(payload: Qualification): AppActionTypes {
  return {
    type: ActionTypes.SET_QUALIFICATION,
    payload,
  };
}

export function setWorkExperience(payload: WorkExperience): AppActionTypes {
  return {
    type: ActionTypes.SET_WORK_EXPERIENCE,
    payload,
  };
}

export function setEmployment(payload: Employment): AppActionTypes {
  return {
    type: ActionTypes.SET_SKILLED_EMPLOYMENT,
    payload,
  };
}

export function setPartner(payload: Partner): AppActionTypes {
  return {
    type: ActionTypes.SET_PARTNER,
    payload,
  };
}

export function setFinal(payload: Boolean): AppActionTypes {
  return {
    type: ActionTypes.SET_FINAL,
    payload,
  };
}

export function clear(): AppActionTypes {
  return {
    type: ActionTypes.CLEAR,
  };
}

export function reset(): AppActionTypes {
  return {
    type: ActionTypes.RESET,
  };
}

export function saveHistory(payload: Immigration): AppActionTypes {
  return {
    type: ActionTypes.SAVE,
    payload,
  };
}
