import { applyMiddleware, combineReducers, legacy_createStore as createStore } from 'redux';
import { createLogger } from 'redux-logger';
import { thunk } from 'redux-thunk';

import { immigrationReducer } from './immigration.reducer';

const rootReducer = combineReducers({
  current: immigrationReducer,
});
export type AppState = ReturnType<typeof rootReducer>;

const createAppStore = () => {
  const logger = createLogger({
    collapsed: true,
  });

  const store = createStore(rootReducer as any, applyMiddleware(logger as any, thunk));
  return store;
};

export default createAppStore;
