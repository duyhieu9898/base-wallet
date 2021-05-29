import { useMemo } from 'react';
import { createMuiTheme } from '@material-ui/core';
// import { theme as styledTheme } from './index';

const useMuiThemeOverrides = () => {
  // const theme = styledTheme(darkMode);

  return useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: 'dark',
        },
        spacing: factor => `${factor * 10}px`,
        overrides: {
          MuiTypography: {
            body1: {
              fontFamily: 'inherit',
            },
          },
          MuiListItemText: {
            primary: {
              fontSize: '95%',
            },
          },
          MuiTab: {
            root: {
              fontFamily: 'inherit',
            },
          },
        },
      }),
    []
  );
};

export default useMuiThemeOverrides;
