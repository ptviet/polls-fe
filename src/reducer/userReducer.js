import * as types from '../action/types';

const initialState = {
  userInfo: {},
  profileInfo: {},
  loading: false,
  notFound: false,
  serverError: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.USER_LOADING:
      return {
        ...state,
        loading: true
      };

    case types.PROFILE_LOADING:
      return {
        ...state,
        loading: true
      };

    case types.GET_CURRENT_USER:
      return {
        ...state,
        userInfo: action.userInfo,
        loading: false
      };

    case types.GET_PROFILE:
      return {
        ...state,
        profileInfo: action.profileInfo,
        loading: false
      };

    case types.CLEAR_CURRENT_PROFILE:
      return {
        ...initialState
      };

    default:
      return state;
  }
}
