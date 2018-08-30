import * as types from './types';
import { API_BASE_URL, ACCESS_TOKEN } from '../constants';
import axios from 'axios';

export const getCurrentUser = () => dispatch => {
  if (localStorage.getItem(ACCESS_TOKEN)) {
    dispatch(setUserLoading());
    axios
      .get(API_BASE_URL + '/user/me')
      .then(res => {
        dispatch({
          type: types.GET_CURRENT_USER,
          userInfo: res.data
        });
      })
      .catch(err => {
        dispatch({
          type: types.GET_ERROR,
          payload: err.response.data
        });
      });
  }
};

export const getUsersProfile = username => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get(API_BASE_URL + `/users/${username}`)
    .then(res => {
      dispatch({
        type: types.GET_PROFILE,
        profileInfo: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: types.GET_ERROR,
        payload: err.response.data
      });
    });
};

export const setUserLoading = () => {
  return {
    type: types.USER_LOADING
  };
};

export const setProfileLoading = () => {
  return {
    type: types.PROFILE_LOADING
  };
};

export const clearUsersProfile = () => {
  return {
    type: types.CLEAR_CURRENT_PROFILE
  };
};
