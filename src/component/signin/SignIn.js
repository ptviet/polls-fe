import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './SignIn.css';
import SignInForm from './SignInForm';
import { Form } from 'antd';
import { connect } from 'react-redux';
import { getCurrentUser } from '../../action/userActions';
import { clearError } from '../../action/errorActions';
import { isEmpty } from '../../util';
import { notification } from 'antd';

class SignIn extends Component {
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/');
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.auth.isAuthenticated) {
      notification.success({
        message: 'Welcome!',
        description: "You're successfully logged in."
      });
      this.onLogin();
    }

    if (!isEmpty(this.props.error.error)) {
      const { error } = this.props.error;
      if (error.status === 401) {
        notification.error({
          message: 'Please try again!',
          description: 'Your Username or Password is incorrect.'
        });
      } else {
        notification.error({
          message: 'Please try again!',
          description: 'Sorry! Something went wrong.'
        });
      }
      this.props.clearError();
    }
  }

  onLogin = () => {
    this.props.getCurrentUser();
    this.props.history.push('/');
  };

  render() {
    const AntWrappedLoginForm = Form.create()(SignInForm);
    return (
      <div className="login-container">
        <h1 className="page-title">Login</h1>
        <div className="login-content">
          <AntWrappedLoginForm onLogin={this.onLogin} />
        </div>
      </div>
    );
  }
}

SignIn.propTypes = {
  getCurrentUser: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  error: state.error,
  auth: state.auth,
  user: state.user
});

export default connect(
  mapStateToProps,
  { getCurrentUser, clearError }
)(SignIn);
