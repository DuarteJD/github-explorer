import React from 'react';
import { ThemeProvider, DefaultTheme } from 'styled-components';

import { BrowserRouter } from 'react-router-dom';
import GlobalStyles from './styles/global';

import usePersistedState from './hooks/usePersistedState';

import light from './styles/themes/light';
import dark from './styles/themes/dark';

import Routes from './routes';

const App: React.FC = () => {
  const [theme, setTheme] = usePersistedState<DefaultTheme>('theme', dark);

  const toggleTheme = (): void => {
    setTheme(theme.title === 'light' ? dark : light);
  };

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes toggleTheme={toggleTheme} />
      </BrowserRouter>
      <GlobalStyles />
    </ThemeProvider>
  );
};

export default App;
