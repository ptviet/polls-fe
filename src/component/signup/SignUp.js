import React, { Component } from 'react';
import SignUpForm from './SignUpForm';

export default class SignUp extends Component {
  onSignUp = () => {
    this.props.history.push('/signin');
  };
  render() {
    return (
      <div>
        <SignUpForm onSignUp={this.onSignUp} />
      </div>
    );
  }
}
