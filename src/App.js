import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import Header from './component/header/Header';
import Routes from './Routes';
import { BrowserRouter } from 'react-router-dom';
import { Layout, notification } from 'antd';
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
        <Layout className="app-container">
          <Header />
          <Layout.Content className="app-content">
            <Routes />
          </Layout.Content>
        </Layout>
      </BrowserRouter>
    );
  }
}
const mapStateToProps = state => ({
  auth: state.auth,
  user: state.user,
  error: state.error
});
export default connect(
  mapStateToProps,
  { authenticateWithToken }
)(App);
