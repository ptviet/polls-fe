import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import pollIcon from '../../poll.svg';
import './Header.css';
import { Layout, Menu, Icon, Input, notification } from 'antd';
import { Row, Col } from 'antd';
import ProfileDropdownMenu from './ProfileDropdownMenu';
import { isEmpty } from '../../util';
import { signOut } from '../../action/authActions';
import { searchPolls } from '../../action/pollActions';

class Header extends Component {
  handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      this.props.signOut();
      this.props.history.push('/');
    }
  };

  onSearch = term => {
    if (isEmpty(term)) {
      notification.info({
        message: 'Type something!'
      });
    } else {
      this.props.searchPolls(term);
      this.refs.searchBar.input.input.value = '';
      this.props.history.push('/results');
    }
  };

  render() {
    let menuItems;
    if (this.props.auth.isAuthenticated) {
      menuItems = [
        <Menu.Item key="/">
          <Link to="/">
            <Icon type="home" className="nav-icon" />
          </Link>
        </Menu.Item>,
        <Menu.Item key="/poll/new">
          <Link to="/poll/new">
            <img src={pollIcon} alt="poll" className="poll-icon" />
          </Link>
        </Menu.Item>,
        <Menu.Item key="/profile" className="profile-menu">
          {!isEmpty(this.props.user.userInfo) && (
            <ProfileDropdownMenu handleMenuClick={this.handleMenuClick} />
          )}
        </Menu.Item>
      ];
    } else {
      menuItems = [
        <Menu.Item key="/signin">
          <Link to="/signin">Sign In</Link>
        </Menu.Item>,
        <Menu.Item key="/signup">
          <Link to="/signup">Sign Up</Link>
        </Menu.Item>
      ];
    }

    return (
      <Layout.Header className="app-header">
        <div className="container">
          <Row>
            <Col xs={4} sm={4} md={6} lg={6} xl={6}>
              <div className="app-title">
                <Link to="/">EziPoll</Link>
              </div>
            </Col>
            <Col xs={9} sm={12} md={12} lg={12} xl={12}>
              <Input.Search
                ref="searchBar"
                placeholder="Search..."
                onSearch={value => this.onSearch(value)}
                className="search-bar"
              />
            </Col>
            <Col xs={11} sm={8} md={6} lg={6} xl={6}>
              <Menu
                className="app-menu"
                mode="horizontal"
                selectedKeys={[this.props.location.pathname]}
                style={{ lineHeight: '64px' }}
              >
                {menuItems}
              </Menu>
            </Col>
          </Row>
        </div>
      </Layout.Header>
    );
  }
}

Header.propTypes = {
  signOut: PropTypes.func.isRequired,
  searchPolls: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  user: state.user,
  error: state.error
});
export default connect(
  mapStateToProps,
  { signOut, searchPolls }
)(withRouter(Header));
