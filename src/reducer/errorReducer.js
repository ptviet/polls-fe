import * as types from '../action/types';

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.GET_ERROR:
      return {
        ...state,
        error: action.payload
      };

    case types.CLEAR_ERROR:
      return {
        ...initialState
      };

    default:
      return state;
  }
}
