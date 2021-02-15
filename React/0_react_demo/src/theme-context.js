import { createContext } from 'react';

export const themes = {
  light: {
    color: '#000',
    backgroundColor: '#eee',
    borderColor: "red"
  },
  dark: {
    color: '#fff',
    backgroundColor: '#222',
    borderColor: "green"
  },
};

export const ThemeContext = createContext(
  // 默认值  (实际好像没啥用)
  themes.dark
);