import React, { Component } from 'react';
import { connect } from 'react-redux';
import PollList from './poll/PollList';

class Home extends Component {
  render() {
    return (
      <div>
        <PollList />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  error: state.error,
  auth: state.auth,
  user: state.user,
  poll: state.poll
});

export default connect(mapStateToProps)(Home);
