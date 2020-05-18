import { AnyAction } from 'redux';
import { ActionTypes } from './ActionTypes';
import { initialState } from './constants';

/**
 * A reducer function that returns the next state tree,
 * given the current state tree and the action to handle.
 *
 * @param {any} state the current state
 * @param {Object} action A plain object representing “what changed”.
 * @return {any} the next state
 */
export const immigrationReducer = (state = initialState, action: AnyAction) => {
  const { payload } = action;
  const { history } = state;

  switch (action.type) {
    case ActionTypes.CLEAR:
      return initialState;

    case ActionTypes.RESET:
      return { ...initialState, history };

    case ActionTypes.SAVE:
      return { ...initialState, history: Array.isArray(history) ? history?.push(payload) : [payload] };

    case ActionTypes.SET_IDENTIFY:
      return { ...state, identity: payload };

    case ActionTypes.SET_QUALIFICATION:
      return { ...state, qualification: payload };

    case ActionTypes.SET_WORK_EXPERIENCE:
      return { ...state, workExperience: payload };

    case ActionTypes.SET_SKILLED_EMPLOYMENT:
      return { ...state, employment: payload };

    case ActionTypes.SET_PARTNER:
      return { ...state, partner: payload };

    case ActionTypes.SET_FINAL:
      return { ...state, isFinal: true };

    default:
      return state;
  }
};
