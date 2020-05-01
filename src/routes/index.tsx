import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import Repository from '../pages/Repository';
import User from '../pages/User';

interface Props {
  toggleTheme(): void;
}

const Routes: React.FC<Props> = prevProps => (
  <Switch>
    <Route
      path="/"
      exact
      render={() => <Dashboard toggleTheme={prevProps.toggleTheme} />}
    />
    <Route path="/repository/:repository+" component={Repository} />
    <Route path="/user/:user+" component={User} />
  </Switch>
);

export default Routes;
