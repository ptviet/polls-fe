import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { clearPollRes } from '../../action/pollActions';
import { clearError } from '../../action/errorActions';
import './NewPoll.css';
import { notification } from 'antd';
import PollForm from './PollForm';
import { isEmpty } from '../../util';

class NewPoll extends Component {
  componentDidUpdate(prevProps) {
    if (
      !isEmpty(this.props.poll.createdPollRes) &&
      this.props.poll.createdPollRes.success
    ) {
      notification.success({
        message: 'Succeeded',
        description: this.props.poll.createdPollRes.message
      });
      this.props.clearPollRes();
      this.props.history.push('/');
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
          message: 'Please try again!',
          description: error.message || 'Sorry! Something went wrong.'
        });
      }
      this.props.clearError();
    }
  }

  render() {
    return (
      <div>
        <PollForm />
      </div>
    );
  }
}

NewPoll.propTypes = {
  clearPollRes: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  error: state.error,
  auth: state.auth,
  user: state.user,
  poll: state.poll
});

export default connect(
  mapStateToProps,
  { clearPollRes, clearError }
)(NewPoll);
