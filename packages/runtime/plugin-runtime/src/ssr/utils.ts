import { BaseSSRServerContext } from '@modern-js/types';
import { SSRServerContext } from './serverRender/type';

export const formatServer = (
  request: BaseSSRServerContext['request'],
): SSRServerContext['request'] => {
  const {
    cookie = '',
    'user-agent': userAgent = '',
    referer,
  } = request.headers || {};

  return {
    cookie,
    userAgent,
    referer,
    ...request,
  };
};

const getQuery = () =>
  window.location.search
    .substring(1)
    .split('&')
    .reduce<Record<string, string>>((res, item) => {
      const [key, value] = item.split('=');
      res[key] = value;

      return res;
    }, {});

export const formatClient = (
  request: BaseSSRServerContext['request'],
): SSRServerContext['request'] => {
  return {
    params: request.params || {},
    host: request.host || location.host,
    pathname: request.pathname || location.pathname,
    headers: request.headers || {},
    cookieMap: request.cookieMap || {},
    cookie: request.headers.cookie || document.cookie,
    userAgent: request.headers['user-agent'] || navigator.userAgent,
    referer: request.referer || document.referrer,
    query: request.query || getQuery(),
    url: location.href,
  };
};

export const mockResponse = () => {
  return {
    setHeader() {
      console.info('setHeader can only be used in the server side');
    },
    status() {
      console.info('status can only be used in the server side');
    },
  };
};
