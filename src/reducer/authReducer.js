import * as types from '../action/types';

const initialState = {
  isAuthenticated: false,
  loading: false
};
export default function(state = initialState, action) {
  switch (action.type) {
    case types.USER_SIGN_IN:
      return {
        ...state,
        loading: true
      };
    case types.USER_SIGN_UP:
      return {
        ...state,
        loading: true
      };
    case types.USER_SIGN_IN_FAILURE:
      return {
        ...state,
        loading: false
      };
    case types.USER_SIGN_UP_FAILURE:
      return {
        ...state,
        loading: false
      };
    case types.USER_SIGN_UP_SUCCESS:
      return {
        ...state,
        signUpRes: action.response,
        loading: false
      };
    case types.CHECK_USERNAME_AVAIL:
      return {
        ...state,
        usernameValidation: action.usernameValidation
      };
    case types.CHECK_EMAIL_AVAIL:
      return {
        ...state,
        emailValidation: action.emailValidation
      };
    case types.CLEAR_USERNAME_VALIDATION:
      return {
        ...state,
        usernameValidation: null
      };
    case types.CLEAR_EMAIL_VALIDATION:
      return {
        ...state,
        emailValidation: null
      };
    case types.SET_CURRENT_USER:
      return {
        ...state,
        accessToken: action.payload.accessToken,
        info: action.info,
        isAuthenticated: true,
        loading: false
      };
    case types.CLEAR_CURRENT_USER:
      return {
        ...initialState
      };
    default:
      return state;
  }
}
