import React, { Component } from 'react';
import './Poll.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Avatar, Radio, Button, Divider, notification } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import LoadingIndicator from '../../common/LoadingIndicator';
import CompletedOrVoted from './CompletedOrVoted';
import { isEmpty, getAvatarColor, formatDateTime } from '../../util';
import { BASE_URL } from '../../constants';
import { getSinglePoll, castVote } from '../../action/pollActions';
class Poll extends Component {
  state = {
    currentVote: null
  };

  componentWillMount() {
    if (this.props.match.params.id) {
      this.props.getSinglePoll(this.props.match.params.id);
    }
  }

  handleVoteChange = event => {
    this.setState({
      currentVote: event.target.value
    });
  };

  handleVoteSubmit = (event, poll) => {
    event.preventDefault();
    if (!this.props.auth.isAuthenticated) {
      notification.info({
        message: 'Unauthorized',
        description: 'Please login to vote.'
      });
      return;
    }

    const selectedChoice = this.state.currentVote;

    const voteData = {
      pollId: poll.id,
      choiceId: selectedChoice
    };

    this.props.castVote(voteData);
  };

  copyToClipboard = pollId => {
    var textField = document.createElement('textarea');
    textField.innerText = `${BASE_URL}/poll/${pollId}`;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
    notification.success({
      message: 'Copied!',
      description: 'Link copied to clipboard!'
    });
  };

  calculatePercentage = (poll, choice) => {
    if (poll.totalVotes === 0) {
      return 0;
    }
    return (choice.voteCount * 100) / poll.totalVotes;
  };

  isSelected = (poll, choice) => {
    return poll.selectedChoice === choice.id;
  };

  getWinningChoice = poll => {
    return poll.choices.reduce(
      (prevChoice, currentChoice) =>
        currentChoice.voteCount > prevChoice.voteCount
          ? currentChoice
          : prevChoice,
      { voteCount: -Infinity }
    );
  };

  getTimeRemaining = poll => {
    const expirationTime = new Date(poll.expirationDateTime).getTime();
    const currentTime = new Date().getTime();

    var difference_ms = expirationTime - currentTime;
    var seconds = Math.floor((difference_ms / 1000) % 60);
    var minutes = Math.floor((difference_ms / 1000 / 60) % 60);
    var hours = Math.floor((difference_ms / (1000 * 60 * 60)) % 24);
    var days = Math.floor(difference_ms / (1000 * 60 * 60 * 24));

    let timeRemaining;

    if (days > 0) {
      timeRemaining = days + ' days left';
    } else if (hours > 0) {
      timeRemaining = hours + ' hours left';
    } else if (minutes > 0) {
      timeRemaining = minutes + ' minutes left';
    } else if (seconds > 0) {
      timeRemaining = seconds + ' seconds left';
    } else {
      timeRemaining = 'less than a second left';
    }

    return timeRemaining;
  };

  showChoices(poll) {
    const pollChoices = [];
    if (poll.selectedChoice || poll.expired) {
      const winningChoice = poll.expired ? this.getWinningChoice(poll) : null;

      poll.choices.forEach(choice => {
        pollChoices.push(
          <CompletedOrVoted
            key={choice.id}
            choice={choice}
            isWinner={winningChoice && choice.id === winningChoice.id}
            isSelected={this.isSelected(poll, choice)}
            percentVote={this.calculatePercentage(poll, choice)}
          />
        );
      });
    } else {
      poll.choices.forEach(choice => {
        pollChoices.push(
          <Radio
            className="poll-choice-radio"
            key={choice.id}
            value={choice.id}
          >
            {choice.text}
          </Radio>
        );
      });
    }
    return pollChoices;
  }

  render() {
    let pollObj;
    if (this.props.match.params.id) {
      pollObj = this.props.poll.singlePoll;
    } else {
      pollObj = this.props.pollObj;
    }

    if (isEmpty(pollObj) && this.props.poll.loaded) {
      return (
        <div>
          <span>No Polls Found</span>
        </div>
      );
    }

    if (!isEmpty(pollObj)) {
      return (
        <div className="poll-content">
          <div className="poll-header">
            <div className="poll-creator-info">
              <Link
                className="creator-link"
                to={`/users/${pollObj.createdBy.username}`}
              >
                <Avatar
                  className="poll-creator-avatar"
                  style={{
                    backgroundColor: getAvatarColor(pollObj.createdBy.name)
                  }}
                >
                  {pollObj.createdBy.name[0].toUpperCase()}
                </Avatar>
                <span className="poll-creator-name">
                  {pollObj.createdBy.name}
                </span>
                <span className="poll-creator-username">
                  @{pollObj.createdBy.username}
                </span>
                <span className="poll-creation-date">
                  {formatDateTime(pollObj.creationDateTime)}
                </span>
              </Link>
            </div>
            <div className="poll-question">{pollObj.question}</div>
            <span className="total-votes">{pollObj.totalVotes}{pollObj.totalVotes > 1 ? " votes" : " vote"}</span>
            <span className="separator">•</span>
            <span className="time-left">
              {pollObj.expired
                ? 'Ended'
                : this.getTimeRemaining(pollObj)}
            </span>
            <Divider dashed />
          </div>
          <div className="poll-choices">
            <Radio.Group
              className="poll-choice-radio-group"
              onChange={this.handleVoteChange}
              value={this.state.currentVote}
            >
              {this.showChoices(pollObj)}
            </Radio.Group>
          </div>
          <div className="poll-footer">
              <Button
                className="vote-button"
                disabled={!this.state.currentVote}
                onClick={event => this.handleVoteSubmit(event, pollObj)}
              >
                Vote
              </Button>
              <Button
                type="dashed"
                className="copy-button"
                onClick={() => {
                  this.copyToClipboard(pollObj.id);
                }}
              >
                Copy Link
              </Button>
          </div>
        </div>
      );
    }

    return <LoadingIndicator />;
  }
}

Poll.propTypes = {
  getSinglePoll: PropTypes.func.isRequired,
  castVote: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  error: state.error,
  auth: state.auth,
  user: state.user,
  poll: state.poll
});

export default connect(
  mapStateToProps,
  { getSinglePoll, castVote }
)(withRouter(Poll));
