import {call, addBatchCall, uniqid, batch} from '../../utils/fetchDataBitrix24';
import {
  FETCH_USERS_START,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_ERROR,
  FETCH_HOURS_SUCCESS,
  SET_HOURS_SUCCESS
} from './constants';

export function fetchUsers() {
  // console.log(cmd);
  // batch(cmd);
  return async dispatch => {
    dispatch(fetchUsersStart());
    try {
      const response = await call('user.get');
      const users = [];
      let name;
      response.result.map((user) => {
        if (user.LAST_NAME) {
          name = user.LAST_NAME + ' ' + user.NAME;
        } else {
          name = user.NAME ? user.NAME : 'user';
        }
        users.push({
          id: user.ID,
          name,
          email: user.EMAIL,
          photo: user.PERSONAL_PHOTO,
          position: user.WORK_POSITION
        });
      });
      dispatch(fetchUsersSuccess(users));
    } catch (error) {
      dispatch(fetchUsersError(error));
    }
  };
}

export function fetchUsersStart() {
  return {
    type: FETCH_USERS_START
  };
}

export function fetchUsersSuccess(users) {
  return {
    type: FETCH_USERS_SUCCESS,
    users
  };
}

export function fetchUsersError(error) {
  return {
    type: FETCH_USERS_ERROR,
    error
  };
}

export function fetchWorkHours() {
  return async dispatch => {
    dispatch(fetchUsersStart());
    try {
      const params = {
        'IBLOCK_TYPE_ID': 'lists',
        'IBLOCK_ID': '45'
      };
      const response = await call('lists.element.get', params);
      const hoursById = [];
      response.result.map((user) => {
        const hours = Object.values(user.PROPERTY_267)[0];
        hoursById[user.NAME] = hours;
      });
      dispatch(fetchHoursSuccess(hoursById));
    } catch (error) {
      dispatch(fetchUsersError(error));
    }
  };
}

export function fetchHoursSuccess(hours) {
  return {
    type: FETCH_HOURS_SUCCESS,
    hours
  };
}

export function setWorkHoursQw(userId, hours) {
  console.log(hours);
  return async dispatch => {
    dispatch(fetchUsersStart());
    try {
      const params = {
        'IBLOCK_TYPE_ID': 'lists',
        'IBLOCK_ID': '45',
        'ELEMENT_CODE': 'element' + userId,
        'FIELDS': {
          'NAME': userId,
          'PROPERTY_267': hours[userId]
        }
      };
      const response = await call('lists.element.add', params);
      dispatch(fetchHoursSuccess(hours));
    } catch (error) {
      dispatch(fetchUsersError(error));
    }
  };
}

export function setHoursSuccess(hours) {
  return {
    type: SET_HOURS_SUCCESS,
    hours
  };
}
