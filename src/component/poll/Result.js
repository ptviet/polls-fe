import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Icon } from 'antd';
import './PollList.css';
import LoadingIndicator from '../../common/LoadingIndicator';
import { isEmpty } from '../../util';
import Poll from './Poll';
import { resetPoll, searchPolls } from '../../action/pollActions';

class Result extends Component {
  componentWillUnmount() {
    this.props.resetPoll();
  }

  componentDidMount() {
    if (
      isEmpty(this.props.poll.searchResults.content) &&
      !this.props.poll.loaded
    ) {
      this.props.history.push('/');
    }
  }

  loadMore = () => {
    this.props.searchPolls(
      this.props.poll.searchTerm,
      this.props.poll.searchResults.page + 1
    );
  };

  showPolls = () => {
    const polls = [];
    const data = this.props.poll.searchResults.content;
    if (!isEmpty(data)) {
      data.forEach((poll, index) => {
        polls.push(<Poll key={poll.id} pollObj={poll} />);
      });
    }
    return polls;
  };

  notFound = (
    <div className="no-polls-found">
      <span>No Polls Found.</span>
    </div>
  );

  showNoPollsFound = () => {
    if (!this.props.poll.loading && this.props.poll.loaded) {
      if (isEmpty(this.props.poll.searchResults.content)) {
        return this.notFound;
      }
    }
  };

  button = (
    <div className="load-more-polls">
      <Button
        type="dashed"
        onClick={this.loadMore}
        disabled={this.props.poll.loading}
      >
        <Icon type="plus" />
        Load more
      </Button>
    </div>
  );

  showLoadMore = () => {
    if (!this.props.poll.loading) {
      if (!this.props.poll.searchResults.last) {
        return this.button;
      }
    }
  };

  render() {
    return (
      <div className="polls-container">
        {this.showPolls()}
        {this.showNoPollsFound()}
        {this.showLoadMore()}
        {this.props.poll.loading && <LoadingIndicator />}
      </div>
    );
  }
}

Result.propTypes = {
  resetPoll: PropTypes.func.isRequired,
  searchPolls: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  error: state.error,
  auth: state.auth,
  user: state.user,
  poll: state.poll
});

export default connect(
  mapStateToProps,
  { resetPoll, searchPolls }
)(Result);
