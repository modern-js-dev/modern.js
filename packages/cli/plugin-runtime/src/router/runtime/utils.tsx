// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { Route, matchPath } from 'react-router-dom';
import { DefaultNotFound } from './DefaultNotFound';
import { RouterConfig } from './plugin';

export function renderRoutes(
  routesConfig: RouterConfig['routesConfig'],
  extraProps: any = {},
) {
  const Layout = ({ Component, ...props }: any) => {
    const GlobalLayout = routesConfig?.globalApp;

    if (!GlobalLayout) {
      return <Component {...props} />;
    }

    return <GlobalLayout Component={Component} {...props} />;
  };

  const findMatchedRoute = (pathname: string) =>
    routesConfig?.routes?.find(route => {
      const info = matchPath(
        {
          path: route.path as string,
          caseSensitive: route.caseSensitive,
        },
        pathname,
      );

      return Boolean(info);
    });

  return (
    <Route
      path="/"
      element={(props: any) => {
        const matchedRoute = findMatchedRoute(props.location.pathname);
        if (!matchedRoute) {
          return <DefaultNotFound />;
        }

        return (
          <Route
            path={matchedRoute.path as string}
            caseSensitive={matchedRoute.caseSensitive}
            element={(routeProps: any) => (
              <Layout
                Component={matchedRoute.component}
                {...routeProps}
                {...extraProps}
              />
            )}
          />
        );
      }}
    />
  );
}

export function getLocation(serverContext: any): string {
  const { pathname, url }: { [p: string]: string } =
    serverContext?.request || {};

  const cleanUrl = url.replace('http://', '').replace('https://', '');

  const index = (cleanUrl || '').indexOf(pathname);

  if (index === -1) {
    return pathname;
  }

  return cleanUrl.substring(index);
}

export const urlJoin = (...parts: string[]) => {
  const separator = '/';
  const replace = new RegExp(`${separator}{1,}`, 'g');
  return standardSlash(parts.join(separator).replace(replace, separator));
};

export function standardSlash(str: string) {
  let addr = str;
  if (!addr || typeof addr !== 'string') {
    return addr;
  }
  if (addr.startsWith('.')) {
    addr = addr.slice(1);
  }
  if (!addr.startsWith('/')) {
    addr = `/${addr}`;
  }
  if (addr.endsWith('/') && addr !== '/') {
    addr = addr.slice(0, addr.length - 1);
  }

  return addr;
}
