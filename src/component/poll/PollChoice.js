import React, { Component } from 'react';
import { Form, Input, Icon } from 'antd';
import './NewPoll.css';

const FormItem = Form.Item;

class PollChoice extends Component {
  render() {
    return (
      <FormItem
        validateStatus={this.props.choice.validateStatus}
        help={this.props.choice.errorMsg}
        className="poll-form-row"
      >
        <Input
          placeholder={'Choice ' + (this.props.choiceNumber + 1)}
          size="large"
          value={this.props.choice.text}
          className={this.props.choiceNumber > 1 ? 'optional-choice' : ''}
          onChange={event =>
            this.props.handleChoiceChange(event, this.props.choiceNumber)
          }
        />
        {this.props.choiceNumber > 1 && (
          <Icon
            className="dynamic-delete-button"
            type="close"
            disabled={this.props.choiceNumber <= 1}
            onClick={() => this.props.removeChoice(this.props.choiceNumber)}
          />
        )}
      </FormItem>
    );
  }
}

export default PollChoice;
