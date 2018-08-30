import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Menu, Dropdown, Icon } from 'antd';
import './Header.css';

import { isEmpty } from '../../util';

class ProfileDropdownMenu extends Component {
  showDropdownItems() {
    if (!isEmpty(this.props.user.userInfo)) {
      const { userInfo } = this.props.user;
      return (
        <Menu.Item key="user-info" className="dropdown-item" disabled>
          <div className="user-full-name-info">{userInfo.name}</div>
          <div className="username-info">@{userInfo.username}</div>
        </Menu.Item>
      );
    }
  }

  showLink() {
    if (!isEmpty(this.props.user.userInfo)) {
      const { userInfo } = this.props.user;
      return (
        <Menu.Item key="profile" className="dropdown-item">
          <Link to={`/users/${userInfo.username}`}>Profile</Link>
        </Menu.Item>
      );
    }
  }

  dropdownMenu = (
    <Menu
      onClick={this.props.handleMenuClick}
      className="profile-dropdown-menu"
    >
      {this.showDropdownItems()}
      <Menu.Divider />
      {this.showLink()}
      <Menu.Item key="logout" className="dropdown-item">
        Logout
      </Menu.Item>
    </Menu>
  );

  render() {
    return (
      <Dropdown
        overlay={this.dropdownMenu}
        trigger={['click']}
        getPopupContainer={() =>
          document.getElementsByClassName('profile-menu')[0]
        }
      >
        <a className="ant-dropdown-link">
          <Icon type="user" className="nav-icon" style={{ marginRight: 0 }} />
          <Icon type="down" />
        </a>
      </Dropdown>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  user: state.user,
  error: state.error
});
export default connect(mapStateToProps)(withRouter(ProfileDropdownMenu));
