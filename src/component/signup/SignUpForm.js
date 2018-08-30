import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  signUp,
  checkUsernameAvailability,
  checkEmailAvailability,
  clearValidation
} from '../../action/authActions';
import { clearError } from '../../action/errorActions';
import './SignUp.css';
import { Link } from 'react-router-dom';
import {
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  EMAIL_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH
} from '../../constants';
import { isEmpty } from '../../util';
import { Form, Input, Button, notification } from 'antd';
const FormItem = Form.Item;

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: {
        value: ''
      },
      username: {
        value: ''
      },
      email: {
        value: ''
      },
      password: {
        value: ''
      }
    };
    this.signUpSuccess = false;
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/');
    }
  }

  componentDidUpdate(prevProps) {
    if (!isEmpty(this.props.auth.usernameValidation)) {
      this.setState({
        username: this.props.auth.usernameValidation
      });
      this.props.clearValidation('username');
    }

    if (!isEmpty(this.props.auth.emailValidation)) {
      this.setState({
        email: this.props.auth.emailValidation
      });
      this.props.clearValidation('email');
    }
    if (!isEmpty(this.props.auth.signUpRes)) {
      if (this.props.auth.signUpRes.success) {
        notification.success({
          message: 'Thank you!',
          description:
            "You're successfully registered. Please Login to continue!"
        });
        this.signUpSuccess = true;
        this.props.onSignUp();
      } else {
        notification.error({
          message: 'Please try again!',
          description: this.props.error.error.message
        });
        this.props.clearError();
      }
    }
    if (!isEmpty(this.props.error.error)) {
      notification.error({
        message: 'Please try again!',
        description: this.props.error.error.message
      });
      this.props.clearError();
    }
  }

  handleInputChange = (event, validationFun) => {
    const { target } = event;
    const inputName = target.name;
    const inputValue = target.value;

    this.setState({
      [inputName]: {
        value: inputValue,
        ...validationFun(inputValue)
      }
    });
  };

  handleSubmit = event => {
    event.preventDefault();

    const signupRequest = {
      name: this.state.name.value,
      email: this.state.email.value,
      username: this.state.username.value,
      password: this.state.password.value
    };

    this.props.signUp(signupRequest);
  };

  isFormInvalid = () => {
    return !(
      this.state.name.validateStatus === 'success' &&
      this.state.username.validateStatus === 'success' &&
      this.state.email.validateStatus === 'success' &&
      this.state.password.validateStatus === 'success'
    );
  };

  showForm() {
    return (
      <div>
        <h1 className="page-title">Sign Up</h1>
        <div className="signup-content">
          <Form onSubmit={this.handleSubmit} className="signup-form">
            <FormItem
              label="Full Name"
              validateStatus={this.state.name.validateStatus}
              help={this.state.name.errorMsg}
            >
              <Input
                size="large"
                name="name"
                autoComplete="off"
                placeholder="Your full name"
                value={this.state.name.value}
                onChange={event =>
                  this.handleInputChange(event, this.validateName)
                }
              />
            </FormItem>
            <FormItem
              label="Username"
              hasFeedback
              validateStatus={this.state.username.validateStatus}
              help={this.state.username.errorMsg}
            >
              <Input
                size="large"
                name="username"
                autoComplete="off"
                placeholder="A unique username"
                value={this.state.username.value}
                onBlur={this.validateUsernameAvailability}
                onChange={event =>
                  this.handleInputChange(event, this.validateUsername)
                }
              />
            </FormItem>
            <FormItem
              label="Email"
              hasFeedback
              validateStatus={this.state.email.validateStatus}
              help={this.state.email.errorMsg}
            >
              <Input
                size="large"
                name="email"
                type="email"
                autoComplete="off"
                placeholder="Your email"
                value={this.state.email.value}
                onBlur={this.validateEmailAvailability}
                onChange={event =>
                  this.handleInputChange(event, this.validateEmail)
                }
              />
            </FormItem>
            <FormItem
              label="Password"
              validateStatus={this.state.password.validateStatus}
              help={this.state.password.errorMsg}
            >
              <Input
                size="large"
                name="password"
                type="password"
                autoComplete="off"
                placeholder="A password between 6 to 20 characters"
                value={this.state.password.value}
                onChange={event =>
                  this.handleInputChange(event, this.validatePassword)
                }
              />
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="signup-form-button"
                //disabled={this.isFormInvalid()}
              >
                Sign up
              </Button>
              Already registed? <Link to="/signin">Login now!</Link>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="signup-container">
        {!this.signUpSuccess && this.showForm()}
      </div>
    );
  }

  // Validation Functions

  validateName = name => {
    if (name.length < NAME_MIN_LENGTH) {
      return {
        validateStatus: 'error',
        errorMsg: `Name is too short (Minimum ${NAME_MIN_LENGTH} characters needed.)`
      };
    } else if (name.length > NAME_MAX_LENGTH) {
      return {
        validationStatus: 'error',
        errorMsg: `Name is too long (Maximum ${NAME_MAX_LENGTH} characters allowed.)`
      };
    } else {
      return {
        validateStatus: 'success',
        errorMsg: null
      };
    }
  };

  validateEmail = email => {
    if (!email) {
      return {
        validateStatus: 'error',
        errorMsg: 'Email may not be empty'
      };
    }

    const EMAIL_REGEX = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');
    if (!EMAIL_REGEX.test(email)) {
      return {
        validateStatus: 'error',
        errorMsg: 'Email not valid'
      };
    }

    if (email.length > EMAIL_MAX_LENGTH) {
      return {
        validateStatus: 'error',
        errorMsg: `Email is too long (Maximum ${EMAIL_MAX_LENGTH} characters allowed)`
      };
    }

    return {
      validateStatus: null,
      errorMsg: null
    };
  };

  validateUsername = username => {
    if (username.length < USERNAME_MIN_LENGTH) {
      return {
        validateStatus: 'error',
        errorMsg: `Username is too short (Minimum ${USERNAME_MIN_LENGTH} characters needed.)`
      };
    } else if (username.length > USERNAME_MAX_LENGTH) {
      return {
        validationStatus: 'error',
        errorMsg: `Username is too long (Maximum ${USERNAME_MAX_LENGTH} characters allowed.)`
      };
    } else {
      return {
        validateStatus: null,
        errorMsg: null
      };
    }
  };

  validateUsernameAvailability = () => {
    // First check for client side errors in username
    const usernameValue = this.state.username.value;
    const usernameValidation = this.validateUsername(usernameValue);

    if (usernameValidation.validateStatus === 'error') {
      this.setState({
        username: {
          value: usernameValue,
          ...usernameValidation
        }
      });
      return;
    }

    this.setState({
      username: {
        value: usernameValue,
        validateStatus: 'validating',
        errorMsg: null
      }
    });

    this.props.checkUsernameAvailability(usernameValue);
  };

  validateEmailAvailability = () => {
    // First check for client side errors in email
    const emailValue = this.state.email.value;
    const emailValidation = this.validateEmail(emailValue);

    if (emailValidation.validateStatus === 'error') {
      this.setState({
        email: {
          value: emailValue,
          ...emailValidation
        }
      });
      return;
    }

    this.setState({
      email: {
        value: emailValue,
        validateStatus: 'validating',
        errorMsg: null
      }
    });

    this.props.checkEmailAvailability(emailValue);
  };

  validatePassword = password => {
    if (password.length < PASSWORD_MIN_LENGTH) {
      return {
        validateStatus: 'error',
        errorMsg: `Password is too short (Minimum ${PASSWORD_MIN_LENGTH} characters needed.)`
      };
    } else if (password.length > PASSWORD_MAX_LENGTH) {
      return {
        validationStatus: 'error',
        errorMsg: `Password is too long (Maximum ${PASSWORD_MAX_LENGTH} characters allowed.)`
      };
    } else {
      return {
        validateStatus: 'success',
        errorMsg: null
      };
    }
  };
}

SignUp.propTypes = {
  signUp: PropTypes.func.isRequired,
  checkUsernameAvailability: PropTypes.func.isRequired,
  checkEmailAvailability: PropTypes.func.isRequired,
  clearValidation: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  error: state.error
});

export default connect(
  mapStateToProps,
  {
    signUp,
    checkUsernameAvailability,
    checkEmailAvailability,
    clearValidation,
    clearError
  }
)(SignUp);
