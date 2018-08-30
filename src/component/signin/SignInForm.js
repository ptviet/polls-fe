import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './SignIn.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { signIn } from '../../action/authActions';
import { clearError } from '../../action/errorActions';
import LoadingIndicator from '../../common/LoadingIndicator';
import { Form, Input, Button, Icon } from 'antd';
const FormItem = Form.Item;

class SignInForm extends Component {
  handleSubmit = event => {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const loginRequest = Object.assign({}, values);
        this.props.signIn(loginRequest);
      }
    });
  };

  show() {
    if (this.props.auth.loading) {
      return <LoadingIndicator />;
    } else {
      const { getFieldDecorator } = this.props.form;
      return (
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
            {getFieldDecorator('usernameOrEmail', {
              rules: [
                {
                  required: true,
                  message: 'Please input your username or email!'
                }
              ]
            })(
              <Input
                prefix={<Icon type="user" />}
                size="large"
                name="usernameOrEmail"
                placeholder="Username or Email"
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: 'Please input your Password!' }
              ]
            })(
              <Input
                prefix={<Icon type="lock" />}
                size="large"
                name="password"
                type="password"
                placeholder="Password"
              />
            )}
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="login-form-button"
            >
              Login
            </Button>
            Or <Link to="/signup">register now!</Link>
          </FormItem>
        </Form>
      );
    }
  }

  render() {
    return <div>{this.show()}</div>;
  }
}

SignInForm.propTypes = {
  signIn: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  user: state.user,
  error: state.error
});

export default connect(
  mapStateToProps,
  { signIn, clearError }
)(SignInForm);
