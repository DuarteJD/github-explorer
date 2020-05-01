import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeHookProvider } from './hooks/useTheme';

import GlobalStyles from './styles/global';
import Routes from './routes';

const App: React.FC = () => {
  return (
    <ThemeHookProvider>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
      <GlobalStyles />
    </ThemeHookProvider>
  );
};

export default App;
