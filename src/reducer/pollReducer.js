import * as types from '../action/types';
import _ from 'lodash';
import { isEmpty } from '../util';

const initialState = {
  polls: {
    content: [],
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    last: true
  },
  userCreatedPolls: {
    polls: [],
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    last: true
  },
  userVotedPolls: {
    polls: [],
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    last: true
  },
  createdPollRes: {},
  votedPollRes: {},
  singlePoll: {},
  searchResults: {
    content: [],
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    last: true
  },
  searchTerm: '',
  loading: false,
  loaded: false
};

const updatePolls = (polls, votedPollRes) => {
  let updated = [];
  if (!isEmpty(votedPollRes) && !isEmpty(polls)) {
    updated = polls.filter(poll => poll.id !== votedPollRes.id);
    if (!isEmpty(updated)) {
      updated.unshift(votedPollRes);
    } else updated = [votedPollRes];
  }

  return updated;
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.POLL_LOADING:
      return {
        ...state,
        loading: true
      };

    case types.GET_ALL_POLLS:
      const newPolls = _.uniqBy(
        state.polls.content.concat(action.polls.content),
        'id'
      );
      return {
        ...state,
        polls: {
          content: newPolls,
          page: action.polls.page,
          size: action.polls.size,
          totalElements: action.polls.totalElements,
          totalPages: action.polls.totalPages,
          last: action.polls.last
        },
        loading: false,
        loaded: true
      };

    case types.SEARCH_POLLS:
      let newResults;
      if (state.searchTerm === action.term) {
        newResults = _.uniqBy(
          state.searchResults.content.concat(action.results.content),
          'id'
        );
      } else {
        newResults = action.results.content;
      }

      return {
        ...state,
        searchResults: {
          content: newResults,
          page: action.results.page,
          size: action.results.size,
          totalElements: action.results.totalElements,
          totalPages: action.results.totalPages,
          last: action.results.last
        },
        searchTerm: action.term,
        loading: false,
        loaded: true
      };

    case types.GET_USER_CREATED_POLLS:
      return {
        ...state,
        userCreatedPolls: {
          polls: state.userCreatedPolls.polls.concat(
            action.userCreatedPolls.content
          ),
          page: action.userCreatedPolls.page,
          size: action.userCreatedPolls.size,
          totalElements: action.userCreatedPolls.totalElements,
          totalPages: action.userCreatedPolls.totalPages,
          last: action.userCreatedPolls.last
        },
        loading: false,
        loaded: true
      };

    case types.GET_USER_VOTED_POLLS:
      return {
        ...state,
        userVotedPolls: {
          polls: state.userVotedPolls.polls.concat(
            action.userVotedPolls.content
          ),
          page: action.userVotedPolls.page,
          size: action.userVotedPolls.size,
          totalElements: action.userVotedPolls.totalElements,
          totalPages: action.userVotedPolls.totalPages,
          last: action.userVotedPolls.last
        },
        loading: false,
        loaded: true
      };

    case types.CREATE_POLL:
      return {
        ...state,
        createdPollRes: action.createdPollRes,
        loading: false,
        loaded: true
      };

    case types.GET_SINGLE_POLL:
      return {
        ...state,
        singlePoll: action.singlePoll,
        loading: false,
        loaded: true
      };

    case types.CAST_VOTE:
      let updatedPolls = updatePolls(state.polls.content, action.votedPollRes);
      let updatedSearchResults = updatePolls(
        state.searchResults.content,
        action.votedPollRes
      );
      let updatedCreatedPolls = updatePolls(
        state.userCreatedPolls.polls,
        action.votedPollRes
      );
      let updatedVotedPolls = updatePolls(
        state.userVotedPolls.polls,
        action.votedPollRes
      );
      const polls = Object.assign(state.polls, { content: updatedPolls });
      const searchResults = Object.assign(state.searchResults, {
        content: updatedSearchResults
      });
      const userCreatedPolls = Object.assign(state.userCreatedPolls, {
        polls: updatedCreatedPolls
      });
      const userVotedPolls = Object.assign(state.userVotedPolls, {
        polls: updatedVotedPolls
      });
      return {
        ...state,
        polls: polls,
        userCreatedPolls: userCreatedPolls,
        userVotedPolls: userVotedPolls,
        votedPollRes: action.votedPollRes,
        singlePoll: action.votedPollRes,
        searchResults: searchResults,
        loading: false,
        loaded: true
      };

    case types.POLL_RESET:
      return {
        ...initialState
      };

    case types.CLEAR_POLL_RES:
      return {
        ...state,
        createdPollRes: {}
      };
    case types.CLEAR_VOTE_RES:
      return {
        ...state,
        votedPollRes: {}
      };

    default:
      return state;
  }
}
