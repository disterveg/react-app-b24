import {
  FETCH_USERS_START,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_ERROR,
  FETCH_HOURS_SUCCESS,
  FETCH_TASKS_SUCCESS,
  SET_HOURS_SUCCESS
} from './constants';

const initialState = {
  hours: [],
  users: [],
  tasks: [],
  loading: true,
  error: null
};

export default function usersReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_USERS_START:
      return {
        ...state,
        loading: true
      };
    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.users
      };
    case FETCH_HOURS_SUCCESS:
      return {
        ...state,
        loading: false,
        hours: action.hours
      };
    case FETCH_TASKS_SUCCESS:
      return {
        ...state,
        loading: false,
        tasks: action.tasks
      };
    case FETCH_USERS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case SET_HOURS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
}
