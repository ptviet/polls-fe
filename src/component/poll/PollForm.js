import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createPoll } from '../../action/pollActions';
import {
  MAX_CHOICES,
  POLL_QUESTION_MAX_LENGTH,
  POLL_CHOICE_MAX_LENGTH
} from '../../constants';
import './NewPoll.css';
import { Form, Input, Button, Icon, Select, Col } from 'antd';
import PollChoice from './PollChoice';

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;

class PollForm extends Component {
  state = {
    question: {
      text: ''
    },
    choices: [
      {
        text: ''
      },
      {
        text: ''
      }
    ],
    pollLength: {
      days: 1,
      hours: 0
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    const pollData = {
      question: this.state.question.text,
      choices: this.state.choices.map(choice => {
        return { text: choice.text };
      }),
      pollLength: this.state.pollLength
    };

    this.props.createPoll(pollData);
  };

  addChoice = event => {
    event.preventDefault();
    const choices = this.state.choices.slice();
    this.setState({
      choices: choices.concat([
        {
          text: ''
        }
      ])
    });
  };

  removeChoice = choiceNumber => {
    const choices = this.state.choices.slice();
    this.setState({
      choices: [
        ...choices.slice(0, choiceNumber),
        ...choices.slice(choiceNumber + 1)
      ]
    });
  };

  handleQuestionChange = event => {
    const value = event.target.value;
    this.setState({
      question: {
        text: value,
        ...this.validateQuestion(value)
      }
    });
  };

  handleChoiceChange = (event, index) => {
    const choices = this.state.choices.slice();
    const value = event.target.value;
    choices[index] = {
      text: value,
      ...this.validateChoice(value)
    };

    this.setState({
      choices: choices
    });
  };

  handlePollDaysChange = value => {
    this.setState({
      pollLength: Object.assign(this.state.pollLength, { days: value })
    });
  };

  handlePollHoursChange = value => {
    this.setState({
      pollLength: Object.assign(this.state.pollLength, { hours: value })
    });
  };

  showChoices = () => {
    const choiceViews = [];
    this.state.choices.forEach((choice, index) => {
      choiceViews.push(
        <PollChoice
          key={index}
          choice={choice}
          choiceNumber={index}
          removeChoice={this.removeChoice}
          handleChoiceChange={this.handleChoiceChange}
        />
      );
    });
    return choiceViews;
  };

  render() {
    return (
      <div className="new-poll-container">
        <h3 className="page-title">Create Poll</h3>
        <div className="new-poll-content">
          <Form onSubmit={this.handleSubmit} className="create-poll-form">
            <FormItem
              validateStatus={this.state.question.validateStatus}
              help={this.state.question.errorMsg}
              className="poll-form-row"
            >
              <TextArea
                placeholder="Enter your question"
                style={{ fontSize: '16px' }}
                autosize={{ minRows: 3, maxRows: 6 }}
                name="question"
                value={this.state.question.text}
                onChange={this.handleQuestionChange}
              />
            </FormItem>
            {this.showChoices()}
            <FormItem className="poll-form-row">
              <Button
                type="dashed"
                onClick={this.addChoice}
                disabled={this.state.choices.length === MAX_CHOICES}
              >
                <Icon type="plus" /> Add a choice
              </Button>
            </FormItem>
            <FormItem className="poll-form-row">
              <Col xs={24} sm={4}>
                Poll length:
              </Col>
              <Col xs={24} sm={20}>
                <span style={{ marginRight: '18px' }}>
                  <Select
                    name="days"
                    defaultValue="1"
                    onChange={this.handlePollDaysChange}
                    value={this.state.pollLength.days}
                    style={{ width: 60 }}
                  >
                    {Array.from(Array(8).keys()).map(i => (
                      <Option key={i}>{i}</Option>
                    ))}
                  </Select>
                  {' Days'}
                </span>
                <span>
                  <Select
                    name="hours"
                    defaultValue="0"
                    onChange={this.handlePollHoursChange}
                    value={this.state.pollLength.hours}
                    style={{ width: 60 }}
                  >
                    {Array.from(Array(24).keys()).map(i => (
                      <Option key={i}>{i}</Option>
                    ))}
                  </Select>
                  {' Hours'}
                </span>
              </Col>
            </FormItem>
            <FormItem className="poll-form-row">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                disabled={this.isFormInvalid()}
                className="create-poll-form-button"
              >
                Create Poll
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }

  // Validations
  isFormInvalid() {
    if (this.state.question.validateStatus !== 'success') {
      return true;
    }

    for (let i = 0; i < this.state.choices.length; i++) {
      const choice = this.state.choices[i];
      if (choice.validateStatus !== 'success') {
        return true;
      }
    }
  }

  validateQuestion = questionText => {
    if (questionText.length === 0) {
      return {
        validateStatus: 'error',
        errorMsg: 'Please enter your question!'
      };
    } else if (questionText.length > POLL_QUESTION_MAX_LENGTH) {
      return {
        validateStatus: 'error',
        errorMsg: `Question is too long (Maximum ${POLL_QUESTION_MAX_LENGTH} characters allowed)`
      };
    } else {
      return {
        validateStatus: 'success',
        errorMsg: null
      };
    }
  };

  validateChoice = choiceText => {
    if (choiceText.length === 0) {
      return {
        validateStatus: 'error',
        errorMsg: 'Please enter a choice!'
      };
    } else if (choiceText.length > POLL_CHOICE_MAX_LENGTH) {
      return {
        validateStatus: 'error',
        errorMsg: `Choice is too long (Maximum ${POLL_CHOICE_MAX_LENGTH} characters allowed)`
      };
    } else {
      return {
        validateStatus: 'success',
        errorMsg: null
      };
    }
  };
}

PollForm.propTypes = {
  createPoll: PropTypes.func.isRequired
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
    createPoll
  }
)(PollForm);
