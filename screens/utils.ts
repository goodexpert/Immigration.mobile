import { ImmigrationState, Qualification, WorkExperience, Employment, Partner, Identity } from '../store/types';
import { ResultItem, ScreenName } from './types';

const moment = require('moment');

export const isFinal = (state: ImmigrationState) => {
  return state ? state.isFinal : false;
};

export const getDateOfBirth = (state: ImmigrationState) => {
  if (state && state.identity) {
    return state.identity.dateOfBirth;
  }
  return null;
};

export const getQualificationLevel = (state: ImmigrationState) => {
  if (state && state.qualification) {
    return state.qualification.qualificationLevel;
  }
  return -1;
};

export const getHasQualificationInNZ = (state: ImmigrationState) => {
  if (state && state.qualification) {
    return state.qualification.hasQualificationInNZ;
  }
  return false;
};

export const getStartedBefore25July2011 = (state: ImmigrationState) => {
  if (state && state.qualification) {
    return state.qualification.startedBefore25July2011;
  }
  return false;
};

export const getRecognisedLevel = (state: ImmigrationState) => {
  if (state && state.qualification) {
    return state.qualification.recognisedLevel;
  }
  return -1;
};

export const getWorkExperienceYears = (state: ImmigrationState) => {
  if (state && state.workExperience) {
    return state.workExperience.workExperienceYears;
  }
  return -1;
};

export const getHasWorkExperienceInNZ = (state: ImmigrationState) => {
  if (state && state.workExperience) {
    return state.workExperience.hasWorkExperienceInNZ;
  }
  return false;
};

export const getHasWorkExperienceInASS = (state: ImmigrationState) => {
  if (state && state.workExperience) {
    return state.workExperience.hasWorkExperienceInASS;
  }
  return false;
};

export const getWorkExperienceYearsInASS = (state: ImmigrationState) => {
  if (state && state.workExperience) {
    return state.workExperience.workExperienceYearsInASS;
  }
  return -1;
};

export const getEmploymentSelectType = (state: ImmigrationState) => {
  if (state && state.employment) {
    if (state.employment.hasJobInNZ) {
      return 0;
    }
    if (state.employment.hasJobOfferInNZ) {
      return 1;
    }
  }
  return -1;
};

export const getHasEmpoymentExperienceInASS = (state: ImmigrationState) => {
  if (state && state.employment) {
    return state.employment.hasWorkExperienceInASS;
  }
  return false;
};

export const getWorkOutsideAuckland = (state: ImmigrationState) => {
  if (state && state.employment) {
    return state.employment.workOutsideAuckland;
  }
  return false;
};

export const getWorkType = (state: ImmigrationState) => {
  if (state && state.employment) {
    return state.employment.workType;
  }
  return -1;
};

export const getHourlyRate = (state: ImmigrationState) => {
  if (state && state.employment) {
    return state.employment.hourlyRate;
  }
  return '';
};

export const getPartnerHasRequiredLevel = (state: ImmigrationState) => {
  if (state && state.partner) {
    return state.partner.hasRequiredLevel;
  }
  return false;
};

export const getPartnerHasSkilledJobInNZ = (state: ImmigrationState) => {
  if (state && state.partner) {
    return state.partner.hasSkilledJobInNZ;
  }
  return false;
};

export const getPartnerHasQualification = (state: ImmigrationState) => {
  if (state && state.partner) {
    return state.partner.hasQualification;
  }
  return false;
};

export const getPartnerHasQualificationLevel = (state: ImmigrationState) => {
  if (state && state.partner) {
    return state.partner.qualificationLevel;
  }
  return -1;
};

const pointsForAge = (param: Identity | null): number => {
  if (param !== null) {
    const ages = moment().diff(param.dateOfBirth, 'year', false);
    if (ages < 20 || ages > 55) {
      return 0;
    } else if (ages < 40) {
      return 30;
    } else if (ages < 45) {
      return 20;
    } else if (ages < 50) {
      return 10;
    } else {
      return 5;
    }
  }
  return 0;
};

const getQualificationPoints = (qualificationLevel: number): number => {
  switch (qualificationLevel) {
    case 0: // Level 3-6
      return 40;

    case 1: // Level 7-8
      return 50;

    case 2: // Level 9-10
      return 60;
  }
  return 0;
};

const getStartedBefore25July2011Points = (hasQualificationInNZ: boolean, startedBefore25July2011: boolean) => {
  if (hasQualificationInNZ && startedBefore25July2011) {
    return 10;
  }
  return 0;
};

const getRecognisedLevelPoints = (hasQualificationInNZ: boolean, recognisedLevel: number): number => {
  if (hasQualificationInNZ) {
    switch (recognisedLevel) {
      case 0: // Post-graduate qualification - 2 years or more
        return 15;

      case 1: // Post-graduate qualification - 1 year or more
      case 2: // Bachelor's degree - 2 years or more
        return 10;

      case 3: // Recognised Level 4-8 qualification completed before 25 July 2011
      case 4: // Any recognised qualification started before 25 July 2011 - 2 years or more
        return 5;
    }
  }
  return 0;
};

const pointsForQualification = (param: Qualification | null): number => {
  if (param) {
    return (
      getQualificationPoints(param.qualificationLevel) +
      getStartedBefore25July2011Points(param.hasQualificationInNZ, param.startedBefore25July2011) +
      getRecognisedLevelPoints(param.hasQualificationInNZ, param.recognisedLevel)
    );
  }
  return 0;
};

const getWorkExperiencePoints = (workExperienceYears: number): number => {
  switch (workExperienceYears) {
    case 0: // 2-5 years
      return 10;

    case 1: // 6 years or more
      return 15;
  }
  return 0;
};

const getHasWorkExperienceInNZPoints = (hasWorkExperienceInNZ: boolean): number => {
  return hasWorkExperienceInNZ ? 10 : 0;
};

const getWorkExperienceInAssPoitns = (hasWorkExperienceInASS: boolean, workExperienceYearsInASS: number): number => {
  if (hasWorkExperienceInASS) {
    switch (workExperienceYearsInASS) {
      case 0: // 2 - 4 years
        return 10;

      case 1: // 4 - 6 years
        return 20;

      case 2: // 6 - 8 years
        return 30;

      case 3: // 8 - 10 years
        return 40;

      case 4: // 10 years or more
        return 40;
    }
  }
  return 0;
};

const pointsForWorkExperience = (param: WorkExperience | null): number => {
  if (param) {
    return (
      getWorkExperiencePoints(param.workExperienceYears) +
      getHasWorkExperienceInNZPoints(param.hasWorkExperienceInNZ) +
      getWorkExperienceInAssPoitns(param.hasWorkExperienceInASS, param.workExperienceYearsInASS)
    );
  }
  return 0;
};

const pointsForEmployment = (param: Employment | null): number => {
  if (param && (param.hasJobInNZ || param.hasJobInNZ)) {
    const hasJobOrJobOfferPoints = 50;
    const hourlyRatePoints = param.hourlyRate >= 51 ? 20 : 0;
    const hasWorkExperienceInAssPoints = param.hasWorkExperienceInASS ? 10 : 0;
    const workOutsideAucklandPoints = param.workOutsideAuckland ? 30 : 0;
    return hasJobOrJobOfferPoints + hourlyRatePoints + hasWorkExperienceInAssPoints + workOutsideAucklandPoints;
  }
  return 0;
};

const getPartnerQualificationPoints = (hasQualification: boolean, qualificationLevel: number) => {
  if (hasQualification) {
    return qualificationLevel === 0 ? 10 : 20;
  }
  return 0;
};

const pointsForPartner = (param: Partner | null): number => {
  if (param) {
    const hasSkilledJobInNZPoints = param.hasSkilledJobInNZ ? 20 : 0;
    return hasSkilledJobInNZPoints + getPartnerQualificationPoints(param.hasQualification, param.qualificationLevel);
  }
  return 0;
};

const makeResultItem = (screen: ScreenName, title: string, value: number): ResultItem => {
  return { screen, title, value };
};

export const makeResults = (appState: ImmigrationState): ResultItem[] => {
  const results = [];
  results.push(makeResultItem(ScreenName.Identity, 'Date of birth', pointsForAge(appState.identity)));
  results.push(
    makeResultItem(ScreenName.Qualification, 'Qualification', pointsForQualification(appState.qualification))
  );
  results.push(
    makeResultItem(ScreenName.Experience, 'Work experience', pointsForWorkExperience(appState.workExperience))
  );
  results.push(makeResultItem(ScreenName.Employment, 'Skilled employment', pointsForEmployment(appState.employment)));
  results.push(makeResultItem(ScreenName.Partner, 'Partner', pointsForPartner(appState.partner)));
  return results;
};

export const makeTotalPoints = (items: ResultItem[]): number => {
  return items.reduce((prev, item) => (prev ? prev : 0) + item.value, 0);
};
