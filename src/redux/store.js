import { createStore, combineReducers } from 'redux';
import gptReducer from './reducers/gptReducer';

const rootReducer = combineReducers({
  gpt: gptReducer,
});

export const store = createStore(rootReducer);
