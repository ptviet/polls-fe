import React, { Component } from 'react';
import { Spin, Icon } from 'antd';

class LoadingIndicator extends Component {
  antIcon = <Icon type="loading-3-quarters" style={{ fontSize: 30 }} spin />;

  render() {
    return (
      <Spin
        indicator={this.antIcon}
        style={{ display: 'block', textAlign: 'center', marginTop: 30 }}
      />
    );
  }
}

export default LoadingIndicator;
