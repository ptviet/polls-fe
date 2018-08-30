import * as types from './types';

export const clearError = () => dispatch => {
  dispatch({
    type: types.CLEAR_ERROR
  });
};
