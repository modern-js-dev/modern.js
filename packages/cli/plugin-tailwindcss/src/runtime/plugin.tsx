import type { Plugin } from '@modern-js/runtime-core';
import hoistNonReactStatics from 'hoist-non-react-statics';
import React, { useContext } from 'react';

export const DesignTokenContext = React.createContext<any>({});

export const useDesignTokens = (): IDesignTokens =>
  useContext<IDesignTokens>(DesignTokenContext);

export default (
  options: {
    token?: Record<string, any>;
    useStyledComponentsThemeProvider?: boolean;
    useDesignTokenContext?: boolean;
  } = {},
): Plugin => ({
  name: '@modern-js/plugin-tailwindcss',

  setup: () => ({
    hoc({ App }, next) {
      const DesignTokenAppWrapper = (props: any) => {
        const {
          token = {},
          useStyledComponentsThemeProvider = false,
          useDesignTokenContext = false,
        } = options;
        if (useStyledComponentsThemeProvider && useDesignTokenContext) {
          const { ThemeProvider } = require('@modern-js/runtime-core/styled');
          return (
            <ThemeProvider theme={token}>
              <DesignTokenContext.Provider value={token}>
                <App {...props} />
              </DesignTokenContext.Provider>
            </ThemeProvider>
          );
        } else if (useStyledComponentsThemeProvider) {
          const { ThemeProvider } = require('@modern-js/runtime-core/styled');
          return (
            <ThemeProvider theme={token}>
              <App {...props} />
            </ThemeProvider>
          );
        } else if (useDesignTokenContext) {
          return (
            <DesignTokenContext.Provider value={token}>
              <App {...props} />
            </DesignTokenContext.Provider>
          );
        } else {
          return <App {...props} />;
        }
      };

      return next({
        App: hoistNonReactStatics(DesignTokenAppWrapper, App),
      });
    },
  }),
});
