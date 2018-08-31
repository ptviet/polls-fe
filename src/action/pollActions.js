import * as types from './types';
import { API_BASE_URL, POLL_LIST_SIZE } from '../constants';
import axios from 'axios';

export const setPollLoading = () => {
  return {
    type: types.POLL_LOADING
  };
};

export const resetPoll = () => dispatch => {
  dispatch({
    type: types.POLL_RESET
  });
};

export const clearPollRes = () => dispatch => {
  dispatch({
    type: types.CLEAR_POLL_RES
  });
};

export const clearVoteRes = () => dispatch => {
  dispatch({
    type: types.CLEAR_VOTE_RES
  });
};

export const getAllPolls = (page, size) => dispatch => {
  page = page || 0;
  size = size || POLL_LIST_SIZE;

  dispatch(setPollLoading());

  axios
    .get(API_BASE_URL + '/polls?page=' + page + '&size=' + size)
    .then(res => {
      dispatch({
        type: types.GET_ALL_POLLS,
        polls: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: types.GET_ERROR,
        payload: err.response.data
      });
    });
};

export const searchPolls = (term, page, size) => dispatch => {
  page = page || 0;
  size = size || POLL_LIST_SIZE;

  dispatch(setPollLoading());

  axios
    .get(
      API_BASE_URL +
        '/polls/search?term=' +
        term +
        '&page=' +
        page +
        '&size=' +
        size
    )
    .then(res => {
      dispatch({
        type: types.SEARCH_POLLS,
        results: res.data,
        term: term
      });
    })
    .catch(err => {
      dispatch({
        type: types.GET_ERROR,
        payload: err.response.data
      });
    });
};

export const getSinglePoll = id => dispatch => {
  dispatch(setPollLoading());

  axios
    .get(API_BASE_URL + `/polls/${id}`)
    .then(res => {
      dispatch({
        type: types.GET_SINGLE_POLL,
        singlePoll: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: types.GET_ERROR,
        payload: err.response.data
      });
    });
};

export const getUserCreatedPolls = (username, page, size) => dispatch => {
  page = page || 0;
  size = size || POLL_LIST_SIZE;

  dispatch(setPollLoading());

  axios
    .get(
      API_BASE_URL +
        '/users/' +
        username +
        '/polls?page=' +
        page +
        '&size=' +
        size
    )
    .then(res => {
      dispatch({
        type: types.GET_USER_CREATED_POLLS,
        userCreatedPolls: res.data
      });
    })
    .catch(err => {
      console.log('err');
      console.log(err);
      dispatch({
        type: types.GET_ERROR,
        payload: err.response.data
      });
    });
};

export const getUserVotedPolls = (username, page, size) => dispatch => {
  page = page || 0;
  size = size || POLL_LIST_SIZE;

  dispatch(setPollLoading());

  axios
    .get(
      API_BASE_URL +
        '/users/' +
        username +
        '/votes?page=' +
        page +
        '&size=' +
        size
    )
    .then(res => {
      dispatch({
        type: types.GET_USER_VOTED_POLLS,
        userVotedPolls: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: types.GET_ERROR,
        payload: err.response.data
      });
    });
};

export const createPoll = pollData => dispatch => {
  dispatch(setPollLoading());

  axios
    .post(API_BASE_URL + '/polls', pollData)
    .then(res => {
      dispatch({
        type: types.CREATE_POLL,
        createdPollRes: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: types.GET_ERROR,
        payload: err.response.data
      });
    });
};

export const castVote = voteData => dispatch => {
  dispatch(setPollLoading());

  axios
    .post(API_BASE_URL + '/polls/' + voteData.pollId + '/votes', voteData)
    .then(res => {
      dispatch({
        type: types.CAST_VOTE,
        votedPollRes: res.data
      });
    })
    .catch(err => {
      console.log('err');
      console.log(err);
      dispatch({
        type: types.GET_ERROR,
        payload: err.response.data
      });
    });
};
