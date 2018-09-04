import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import Header from './component/header/Header';
import Routes from './Routes';
import { BrowserRouter } from 'react-router-dom';
import { Layout, notification } from 'antd';
import LoadingOverlay from 'react-loading-overlay';
import { authenticateWithToken } from './action/authActions';

class App extends Component {
  constructor(props) {
    super(props);
    notification.config({
      placement: 'topRight',
      top: 70,
      duration: 3
    });
  }

  componentWillMount() {
    this.props.authenticateWithToken();
  }

  render() {
    return (
      <BrowserRouter>
        <LoadingOverlay
          background="transparent"
          active={
            this.props.auth.loading ||
            this.props.user.loading ||
            this.props.poll.loading
          }
        >
          <Layout className="app-container">
            <Header />
            <Layout.Content className="app-content">
              <Routes />
            </Layout.Content>
          </Layout>
        </LoadingOverlay>
      </BrowserRouter>
    );
  }
}
const mapStateToProps = state => ({
  auth: state.auth,
  user: state.user,
  poll: state.poll,
  error: state.error
});
export default connect(
  mapStateToProps,
  { authenticateWithToken }
)(App);
