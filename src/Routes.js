import React from 'react';
import PrivateRoute from './common/PrivateRoute';
import Home from './component/Home';
import SignIn from './component/signin/SignIn';
import SignUp from './component/signup/SignUp';
import NewPoll from './component/poll/NewPoll';
import NotFound from './common/NotFound';
import { Switch, Route } from 'react-router-dom';
import Profile from './component/user/Profile';

export default () => {
  return (
    <div className="container">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/signin" component={SignIn} />
        <Route exact path="/signup" component={SignUp} />
        <PrivateRoute exact path="/poll/new" component={NewPoll} />
        <Route exact path="/users/:username" component={Profile} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
};
