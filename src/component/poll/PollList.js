import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Icon, notification } from 'antd';
import './PollList.css';
import LoadingIndicator from '../../common/LoadingIndicator';
import { isEmpty } from '../../util';
import { clearError } from '../../action/errorActions';
import Poll from './Poll';
import { POLL_LIST_SIZE } from '../../constants';
import {
  getAllPolls,
  getUserCreatedPolls,
  getUserVotedPolls,
  resetPoll,
  createPoll,
  castVote,
  clearVoteRes
} from '../../action/pollActions';
import { signOut } from '../../action/authActions';

class PollList extends Component {
  state = {
    currentVotes: []
  };

  componentWillMount() {
    this.loadPollList();
  }

  componentWillUnmount() {
    this.props.resetPoll();
  }

  componentDidUpdate(prevProps) {
    if (this.props.auth.isAuthenticated !== prevProps.auth.isAuthenticated) {
      // Reset State
      this.props.resetPoll();
      this.loadPollList();
    }
    const { error } = this.props.error;
    if (!isEmpty(error)) {
      if (error.status === 401) {
        notification.error({
          message: 'Unauthorized',
          description:
            error.message || 'You have been logged out. Please login to vote.'
        });
        this.props.signOut();
      } else {
        notification.error({
          message: 'Something went wrong!',
          description: error.message
        });
      }
      this.props.clearError();
    }
  }

  loadPollList = (page = 0, size = POLL_LIST_SIZE) => {
    if (this.props.username) {
      if (this.props.type === 'USER_CREATED_POLLS') {
        this.props.getUserCreatedPolls(this.props.username, page, size);
      } else if (this.props.type === 'USER_VOTED_POLLS') {
        this.props.getUserVotedPolls(this.props.username, page, size);
      }
    } else {
      this.props.getAllPolls(page, size);
    }
  };

  loadMore = () => {
    if (this.props.username) {
      if (this.props.type === 'USER_CREATED_POLLS') {
        this.loadPollList(this.props.poll.userCreatedPolls.page + 1);
      } else if (this.props.type === 'USER_VOTED_POLLS') {
        this.loadPollList(this.props.poll.userVotedPolls.page + 1);
      }
    } else {
      this.props.getAllPolls(this.props.poll.polls.page + 1);
    }
  };

  handleVoteChange = (event, poll, index) => {
    const currentVotes = this.state.currentVotes.slice();
    currentVotes[index] = event.target.value;

    this.setState({
      currentVotes: currentVotes
    });
  };

  handleVoteSubmit = (event, poll, index) => {
    event.preventDefault();
    if (!this.props.auth.isAuthenticated) {
      //this.props.history.push('/login');
      notification.info({
        message: 'Unauthorized',
        description: 'Please login to vote.'
      });
      return;
    }

    const selectedChoice = this.state.currentVotes[index];

    const voteData = {
      pollId: poll.id,
      choiceId: selectedChoice
    };

    this.props.castVote(voteData);
  };

  showPolls = () => {
    const polls = [];
    let data;

    if (this.props.username) {
      if (this.props.type === 'USER_CREATED_POLLS') {
        data = this.props.poll.userCreatedPolls.polls;
      } else if (this.props.type === 'USER_VOTED_POLLS') {
        data = this.props.poll.userVotedPolls.polls;
      }
    } else {
      data = this.props.poll.polls.content;
    }
    if (!isEmpty(data)) {
      data.forEach((poll, index) => {
        polls.push(
          <Poll
            key={poll.id}
            pollObj={poll}
            currentVote={this.state.currentVotes[index]}
            handleVoteChange={event =>
              this.handleVoteChange(event, poll, index)
            }
            handleVoteSubmit={event =>
              this.handleVoteSubmit(event, poll, index)
            }
          />
        );
      });
    }
    return polls;
  };

  notFound = (
    <div className="no-polls-found">
      <span>No Polls Found.</span>
    </div>
  );

  showNoPollsFound = () => {
    if (!this.props.poll.loading && this.props.poll.loaded) {
      if (this.props.username) {
        if (this.props.type === 'USER_CREATED_POLLS') {
          if (isEmpty(this.props.poll.userCreatedPolls.polls)) {
            return this.notFound;
          }
        } else if (this.props.type === 'USER_VOTED_POLLS') {
          if (isEmpty(this.props.poll.userVotedPolls.polls)) {
            return this.notFound;
          }
        }
      } else {
        if (isEmpty(this.props.poll.polls.content)) {
          return this.notFound;
        }
      }
    }
  };

  button = (
    <div className="load-more-polls">
      <Button
        type="dashed"
        onClick={this.loadMore}
        disabled={this.props.poll.loading}
      >
        <Icon type="plus" /> Load more
      </Button>
    </div>
  );

  showLoadMore = () => {
    if (!this.props.poll.loading) {
      if (this.props.username) {
        if (this.props.type === 'USER_CREATED_POLLS') {
          if (!this.props.poll.userCreatedPolls.last) {
            return this.button;
          }
        } else if (this.props.type === 'USER_VOTED_POLLS') {
          if (!this.props.poll.userVotedPolls.last) {
            return this.button;
          }
        }
      } else {
        if (!this.props.poll.polls.last) {
          return this.button;
        }
      }
    }
  };

  render() {
    return (
      <div className="polls-container">
        {this.showPolls()}
        {this.showNoPollsFound()}
        {this.showLoadMore()}
        {this.props.poll.loading && <LoadingIndicator />}
      </div>
    );
  }
}

PollList.propTypes = {
  getAllPolls: PropTypes.func.isRequired,
  getUserCreatedPolls: PropTypes.func.isRequired,
  getUserVotedPolls: PropTypes.func.isRequired,
  resetPoll: PropTypes.func.isRequired,
  createPoll: PropTypes.func.isRequired,
  castVote: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired,
  clearVoteRes: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  error: state.error,
  auth: state.auth,
  user: state.user,
  poll: state.poll
});

export default connect(
  mapStateToProps,
  {
    getAllPolls,
    getUserCreatedPolls,
    getUserVotedPolls,
    resetPoll,
    createPoll,
    castVote,
    signOut,
    clearError,
    clearVoteRes
  }
)(PollList);
