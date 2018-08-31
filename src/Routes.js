import React from 'react';
import PrivateRoute from './common/PrivateRoute';
import PollList from './component/poll/PollList';
import Result from './component/poll/Result';
import SignIn from './component/signin/SignIn';
import SignUp from './component/signup/SignUp';
import NewPoll from './component/poll/NewPoll';
import Poll from './component/poll/Poll';
import NotFound from './common/NotFound';
import { Switch, Route } from 'react-router-dom';
import Profile from './component/user/Profile';

export default () => {
  return (
    <div className="container">
      <Switch>
        <Route exact path="/" component={PollList} />
        <Route exact path="/signin" component={SignIn} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/results" component={Result} />
        <PrivateRoute exact path="/poll/new" component={NewPoll} />
        <Route exact path="/poll/:id" component={Poll} />
        <Route exact path="/users/:username" component={Profile} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
};
