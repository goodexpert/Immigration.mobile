import { applyMiddleware, combineReducers, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import { immigrationReducer } from './immigration.reducer';

const rootReducer = combineReducers({
  current: immigrationReducer,
});
export type AppState = ReturnType<typeof rootReducer>;

const createAppStore = () => {
  const logger = createLogger({
    collapsed: true,
  });

  const store = createStore(rootReducer, applyMiddleware(logger, thunk));
  return store;
};

export default createAppStore;
