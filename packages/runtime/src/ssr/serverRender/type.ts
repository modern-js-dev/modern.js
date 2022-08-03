// import { IncomingHttpHeaders } from 'http';
import type { BaseSSRServerContext } from '@modern-js/types';
import type { RuntimeContext } from '../../core';

export enum RenderLevel {
  CLIENT_RENDER,
  SERVER_PREFETCH,
  SERVER_RENDER,
}

export type SSRServerContext = BaseSSRServerContext & {
  request: BaseSSRServerContext['request'] & {
    userAgent: string;
    cookie: string;
  };
};

export type ModernSSRReactComponent = React.ComponentType<any> & {
  init: (context: RuntimeContext) => Promise<void>;
  prefetch: (context: RuntimeContext) => Promise<Record<string, any>>;
};

export interface RenderEntry {
  entryName: string;
  result: RenderResult;
  loadableManifest: string | undefined;
}

export type RenderHandler = (
  jsx: React.ReactElement,
  renderer: RenderEntry,
  next: (jsx: React.ReactElement) => string,
) => string;

export type RenderResult = {
  renderLevel: RenderLevel;
  html?: string;
  chunksMap: {
    js: string;
    css: string;
  };
};
