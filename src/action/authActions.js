import * as types from './types';
import { API_BASE_URL, ACCESS_TOKEN } from '../constants';
import setAuthToken from '../token-util/setAuthToken';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { getCurrentUser, clearUsersProfile } from './userActions';

export const signIn = signinRequest => dispatch => {
  dispatch(setUserSignIn());
  axios
    .post(API_BASE_URL + '/auth/signin', signinRequest)
    .then(res => {
      localStorage.setItem(ACCESS_TOKEN, res.data.accessToken);
      setAuthToken(res.data.accessToken);
      const decoded = jwt_decode(res.data.accessToken);
      dispatch({
        type: types.SET_CURRENT_USER,
        payload: res.data,
        info: decoded
      });
    })
    .catch(err => {
      dispatch({
        type: types.USER_SIGN_IN_FAILURE
      });
      dispatch({
        type: types.GET_ERROR,
        payload: err.response.data
      });
    });
};

export const setUserSignIn = () => {
  return {
    type: types.USER_SIGN_IN
  };
};

export const setUserSignUp = () => {
  return {
    type: types.USER_SIGN_UP
  };
};

export const checkUsernameAvailability = username => dispatch => {
  axios
    .get(API_BASE_URL + `/user/checkUsernameAvailability?username=${username}`)
    .then(response => {
      const { available } = response.data;
      dispatch({
        type: types.CHECK_USERNAME_AVAIL,
        usernameValidation: {
          value: username,
          validateStatus: available ? 'success' : 'error',
          errorMsg: available ? null : 'This username is already taken'
        }
      });
    })
    .catch(error => {
      // Marking validateStatus as success, Form will be rechecked at server
      dispatch({
        type: types.CHECK_USERNAME_AVAIL,
        usernameValidation: {
          value: username,
          validateStatus: 'success',
          errorMsg: null
        }
      });
    });
};

export const checkEmailAvailability = email => dispatch => {
  axios
    .get(API_BASE_URL + `/user/checkEmailAvailability?email=${email}`)
    .then(response => {
      const { available } = response.data;
      dispatch({
        type: types.CHECK_EMAIL_AVAIL,
        emailValidation: {
          value: email,
          validateStatus: available ? 'success' : 'error',
          errorMsg: available ? null : 'This email is already registered'
        }
      });
    })
    .catch(error => {
      // Marking validateStatus as success, Form will be rechecked at server
      dispatch({
        type: types.CHECK_EMAIL_AVAIL,
        emailValidation: {
          value: email,
          validateStatus: 'success',
          errorMsg: null
        }
      });
    });
};

export const clearValidation = input => dispatch => {
  if (input === 'username') {
    dispatch({
      type: types.CLEAR_USERNAME_VALIDATION
    });
  }

  if (input === 'email') {
    dispatch({
      type: types.CLEAR_EMAIL_VALIDATION
    });
  }
};

export const signUp = signUpRequest => dispatch => {
  dispatch(setUserSignUp());
  axios
    .post(API_BASE_URL + '/auth/signup', signUpRequest)
    .then(res => {
      dispatch({
        type: types.USER_SIGN_UP_SUCCESS,
        response: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: types.USER_SIGN_UP_FAILURE
      });
      dispatch({
        type: types.GET_ERROR,
        payload: err.response.data
      });
    });
};

export const authenticateWithToken = () => dispatch => {
  if (localStorage.getItem(ACCESS_TOKEN)) {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    setAuthToken(accessToken);
    const decoded = jwt_decode(accessToken);
    dispatch({
      type: types.SET_CURRENT_USER,
      payload: { accessToken },
      info: decoded
    });
    dispatch(getCurrentUser());
  }
};

export const signOut = () => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem(ACCESS_TOKEN);
  // Remove auth header for future requests
  setAuthToken(false);
  dispatch(clearCurrentUser());
  dispatch(clearUsersProfile());
};

export const clearCurrentUser = () => {
  return {
    type: types.CLEAR_CURRENT_USER
  };
};
