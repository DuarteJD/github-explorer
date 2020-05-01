import React, { createContext, useCallback } from 'react';
import { ThemeProvider, DefaultTheme } from 'styled-components';
import usePersistedState from './usePersistedState';

import light from '../styles/themes/light';
import dark from '../styles/themes/dark';

interface ThemeContextData {
  theme: DefaultTheme;
  toggleTheme(): void;
}

export const Theme = createContext<ThemeContextData>({} as ThemeContextData);

export const ThemeHookProvider: React.FC = ({ children }) => {
  const [theme, setTheme] = usePersistedState<DefaultTheme>('theme', dark);

  const toggleTheme = useCallback(() => {
    setTheme(theme.title === 'light' ? dark : light);
  }, [setTheme, theme]);

  return (
    <Theme.Provider value={{ theme, toggleTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </Theme.Provider>
  );
};
