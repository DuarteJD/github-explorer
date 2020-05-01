import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import Repository from '../pages/Repository';

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
  </Switch>
);

export default Routes;
