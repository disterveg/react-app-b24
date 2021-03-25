import {combineReducers} from 'redux';
import usersReducer from './components/UsersList/reducer';

export default function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    hours: usersReducer,
    users: usersReducer,
    tasks: usersReducer,
    ...injectedReducers,
  });

  return rootReducer;
}
