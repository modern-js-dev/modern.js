import React, { useContext } from 'react';
import { createBrowserHistory, createHashHistory, History } from 'history';
import {
  RouteProps,
  unstable_HistoryRouter as HistoryRouter,
} from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import { RuntimeReactContext } from '@modern-js/runtime-core';
import type { Plugin } from '@modern-js/runtime-core';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { isBrowser } from '../../common';
import { renderRoutes, getLocation, urlJoin } from './utils';
import { ServerRouterContext } from './context';

declare global {
  interface Window {
    _SERVER_DATA?: {
      router: {
        baseUrl: string;
        params: Record<string, string>;
      };
    };
  }
}

export type SingleRouteConfig = RouteProps & {
  redirect?: string;
  routes?: SingleRouteConfig[];
  key?: string;

  /**
   * layout component
   */
  layout?: React.ComponentType;

  /**
   * component would be rendered when route macthed.
   */
  component?: React.ComponentType;
};

export interface HistoryOptions {
  basename?: string;
  [key: string]: any;
}

export type HistoryConfig = {
  supportHtml5History?: boolean;
  historyOptions?: HistoryOptions;
};

export type RouterConfig = Partial<HistoryConfig> & {
  routesConfig?: {
    globalApp?: React.ComponentType<any>;
    routes?: SingleRouteConfig[];
  };
  history?: History;
  serverBase?: string[];
};

export const routerPlugin = ({
  serverBase = [],
  history: customHistory,
  supportHtml5History = true,
  routesConfig,
  // TODO: diff with history options 4 and 5
  historyOptions = {},
}: RouterConfig): Plugin => {
  const isBrow = isBrowser();

  const select = (pathname: string) =>
    serverBase.find(baseUrl => pathname.search(baseUrl) === 0) || '/';
  return {
    name: '@modern-js/plugin-router',
    setup: () => {
      return {
        hoc: ({ App }, next) => {
          const getRouteApp = () => {
            if (isBrow) {
              const baseUrl =
                window._SERVER_DATA?.router.baseUrl ||
                select(location.pathname);
              historyOptions.basename =
                baseUrl === '/'
                  ? urlJoin(baseUrl, historyOptions.basename as string)
                  : baseUrl;

              const history =
                customHistory ||
                (supportHtml5History
                  ? createBrowserHistory({ window })
                  : createHashHistory({ window }));

              // https://reactrouter.com/docs/en/v6/routers/history-router
              return (props: any) => (
                <HistoryRouter
                  basename={historyOptions.basename}
                  history={history}
                >
                  <App {...props}>
                    {routesConfig ? renderRoutes(routesConfig, props) : null}
                  </App>
                </HistoryRouter>
              );
            }
            return (props: any) => {
              const runtimeContext = useContext(RuntimeReactContext);
              const { ssrContext } = runtimeContext;
              const location = getLocation(ssrContext);
              const routerContext = ssrContext?.redirection || {};
              const request = ssrContext?.request;
              const baseUrl = request?.baseUrl as string;
              const basename =
                baseUrl === '/'
                  ? urlJoin(baseUrl, historyOptions.basename as string)
                  : baseUrl;
              return (
                // StaticRouter props context had been removed at v6
                // https://github.com/remix-run/react-router/issues/8406
                <ServerRouterContext.Provider value={routerContext}>
                  <StaticRouter
                    basename={basename === '/' ? '' : basename}
                    location={location}
                  >
                    <App {...props}>
                      {routesConfig ? renderRoutes(routesConfig, props) : null}
                    </App>
                  </StaticRouter>
                </ServerRouterContext.Provider>
              );
            };
          };
          let RouteApp = getRouteApp();

          if (App) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error hoist-non-react-statics types not adaptor for react 18
            RouteApp = hoistNonReactStatics(RouteApp, App);
          }

          if (routesConfig?.globalApp) {
            return next({
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error hoist-non-react-statics types not adaptor for react 18
              App: hoistNonReactStatics(RouteApp, routesConfig.globalApp),
            });
          }

          return next({
            App: RouteApp,
          });
        },
      };
    },
  };
};
