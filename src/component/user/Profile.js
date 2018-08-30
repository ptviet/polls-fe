import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Avatar, Tabs } from 'antd';
import './Profile.css';
import LoadingIndicator from '../../common/LoadingIndicator';
import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';
import { getUsersProfile } from '../../action/userActions';
import { isEmpty, formatDate, getAvatarColor } from '../../util';
import PollList from '../poll/PollList';

class Profile extends Component {
  getUsername = () => {
    return this.props.match.params.username;
  };

  componentWillMount() {
    this.loadUserProfile(this.getUsername());
  }

  componentDidMount() {
    // Load profile if empty
    if (isEmpty(this.props.user.profileInfo)) {
      this.loadUserProfile(this.getUsername());
    }
  }

  componentDidUpdate(prevProps) {
    if (this.getUsername() !== prevProps.match.params.username) {
      this.loadUserProfile(this.getUsername());
    }
  }

  loadUserProfile = username => {
    this.props.getUsersProfile(username);
  };

  render() {
    const { isLoading, notFound, serverError } = this.props.user;
    if (isLoading || isEmpty(this.props.user.profileInfo)) {
      return <LoadingIndicator />;
    }

    if (notFound) {
      return <NotFound />;
    }

    if (serverError) {
      return <ServerError />;
    }

    if (!isEmpty(this.props.user.profileInfo)) {
      const { profileInfo } = this.props.user;
      return (
        <div className="profile">
          <div className="user-profile">
            <div className="user-details">
              <div className="user-avatar">
                <Avatar
                  className="user-avatar-circle"
                  style={{
                    backgroundColor: getAvatarColor(profileInfo.name)
                  }}
                >
                  {profileInfo.name[0].toUpperCase()}
                </Avatar>
              </div>
              <div className="user-summary">
                <div className="full-name">{profileInfo.name}</div>
                <div className="username">@{profileInfo.username}</div>
                <div className="user-joined">
                  Joined: {formatDate(profileInfo.joinedAt)}
                </div>
              </div>
            </div>
            <div className="user-poll-details">
              <Tabs
                defaultActiveKey="1"
                animated={false}
                tabBarStyle={{ textAlign: 'center' }}
                size="large"
                className="profile-tabs"
              >
                <Tabs.TabPane tab={`${profileInfo.pollCount} Polls`} key="1">
                  <PollList
                    username={profileInfo.username}
                    type="USER_CREATED_POLLS"
                  />
                </Tabs.TabPane>
                <Tabs.TabPane tab={`${profileInfo.voteCount} Votes`} key="2">
                  <PollList
                    username={profileInfo.username}
                    type="USER_VOTED_POLLS"
                  />
                </Tabs.TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      );
    }
  }
}

Profile.propTypes = {
  getUsersProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  error: state.error,
  auth: state.auth,
  user: state.user
});

export default connect(
  mapStateToProps,
  { getUsersProfile }
)(Profile);
