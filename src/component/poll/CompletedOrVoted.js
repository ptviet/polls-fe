import React, { Component } from 'react';
import './Poll.css';
import { Icon } from 'antd';

class CompletedOrVoted extends Component {
  render() {
    return (
      <div className="cv-poll-choice">
        <span className="cv-poll-choice-details">
          <span className="cv-choice-percentage">
            {Math.round(this.props.percentVote * 100) / 100}%
          </span>
          <span className="cv-choice-text">{this.props.choice.text}</span>
          {this.props.isSelected && (
            <Icon className="selected-choice-icon" type="check-circle-o" />
          )}
        </span>
        <span
          className={
            this.props.isWinner
              ? 'cv-choice-percent-chart winner'
              : 'cv-choice-percent-chart'
          }
          style={{ width: this.props.percentVote + '%' }}
        />
        <br />
        <br />
      </div>
    );
  }
}

export default CompletedOrVoted;
