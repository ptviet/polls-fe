import React, { Component } from 'react';
import './Poll.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Avatar, Radio, Button, notification } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import LoadingIndicator from '../../common/LoadingIndicator';
import CompletedOrVoted from './CompletedOrVoted';
import { isEmpty, getAvatarColor, formatDateTime } from '../../util';
import { BASE_URL } from '../../constants';
import { getSinglePoll } from '../../action/pollActions';

class Poll extends Component {
  componentWillMount() {
    if (this.props.match.params.id) {
      this.props.getSinglePoll(this.props.match.params.id);
    }
  }

  copyToClipboard = pollId => {
    var textField = document.createElement('textarea');
    textField.innerText = `${BASE_URL}/poll/${pollId}`;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
    notification.success({
      message: 'Link copied to clipboard!'
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
    if (isEmpty(pollObj) && this.props.poll.loading) {
      return <LoadingIndicator />;
    } else if (isEmpty(pollObj) && this.props.poll.loaded) {
      return (
        <div>
          <span>No Polls Found</span>
        </div>
      );
    } else
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
          </div>
          <div className="poll-choices">
            <Radio.Group
              className="poll-choice-radio-group"
              onChange={this.props.handleVoteChange}
              value={this.props.currentVote}
            >
              {this.showChoices(pollObj)}
            </Radio.Group>
          </div>
          <div className="poll-footer">
            {!(pollObj.selectedChoice || pollObj.expired) && (
              <Button
                className="vote-button"
                disabled={!this.props.currentVote}
                onClick={this.props.handleVoteSubmit}
              >
                Vote
              </Button>
            )}
            <span className="total-votes">{pollObj.totalVotes} votes</span>
            <span className="separator">•</span>
            <span className="time-left">
              {pollObj.expired
                ? 'Final results'
                : this.getTimeRemaining(pollObj)}
            </span>
            <span>
              <Button
                className="copy-button"
                onClick={() => {
                  this.copyToClipboard(pollObj.id);
                }}
              >
                Copy Link
              </Button>
            </span>
          </div>
        </div>
      );
  }
}

Poll.propTypes = {
  getSinglePoll: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  error: state.error,
  auth: state.auth,
  user: state.user,
  poll: state.poll
});

export default connect(
  mapStateToProps,
  { getSinglePoll }
)(withRouter(Poll));
