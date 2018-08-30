import { combineReducers } from 'redux';
import error from './errorReducer';
import auth from './authReducer';
import user from './userReducer';
import poll from './pollReducer';

export default combineReducers({
  error,
  auth,
  user,
  poll
});
