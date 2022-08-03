import path from 'path';
import { LOADABLE_STATS_FILE } from '@modern-js/utils/constants';
import React from 'react';
import { RuntimeContext } from '@modern-js/runtime-core';
import ReactDomServer from 'react-dom/server';
import serialize from 'serialize-javascript';
import ReactHelmet, { HelmetData } from 'react-helmet';
import { Fragment, toFragments } from './template';
import {
  ModernSSRReactComponent,
  RenderLevel,
  SSRServerContext,
  RenderResult,
} from './type';

import helmetReplace from './helmet';
import { reduce } from './reduce';
import * as loadableRenderer from './loadable';
import * as styledComponentRenderer from './styledComponent';
import { time } from './measure';

type EntryOptions = {
  ctx: SSRServerContext;
  App: ModernSSRReactComponent;
};

const buildTemplateData = (
  context: SSRServerContext,
  data: Record<string, any>,
  renderLevel: RenderLevel,
) => {
  const { request } = context;
  return {
    data,
    context: {
      request: {
        params: request.params,
        query: request.query,
        pathname: request.pathname,
        host: request.host,
        url: request.url,
        headers: request.headers,
        cookieMap: request.cookieMap,
      },
    },
    renderLevel,
  };
};

export default class Entry {
  public entryName: string;

  public result: RenderResult;

  public metrics: SSRServerContext['metrics'];

  public logger: SSRServerContext['logger'];

  private readonly App: ModernSSRReactComponent;

  private readonly fragments: Fragment[];

  constructor(options: EntryOptions) {
    const { ctx } = options;
    const { entryName, template: templateHTML } = ctx;
    this.fragments = toFragments(templateHTML);
    this.entryName = entryName;
    this.App = options.App;

    this.metrics = ctx.metrics;
    this.logger = ctx.logger;

    this.result = {
      renderLevel: RenderLevel.CLIENT_RENDER,
      html: '',
      chunksMap: {
        js: '',
        css: '',
      },
    };
  }

  public async renderToHtml(context: RuntimeContext): Promise<string> {
    const { ssrContext } = context;

    if (ssrContext.redirection.url) {
      return '';
    }

    const prefetchData = await this.prefetch(context);
    if (ssrContext.redirection.url) {
      return '';
    }

    if (this.result.renderLevel >= RenderLevel.SERVER_PREFETCH) {
      this.result.html = this.renderToString(context);
    }
    if (ssrContext.redirection.url) {
      return '';
    }

    let html = '';
    const templateData = buildTemplateData(
      ssrContext,
      prefetchData,
      this.result.renderLevel,
    );
    const SSRData = this.getSSRDataScript(templateData);
    for (const fragment of this.fragments) {
      if (fragment.isVariable && fragment.content === 'SSRDataScript') {
        html += fragment.getValue(SSRData);
      } else {
        html += fragment.getValue(this.result);
      }
    }

    const helmetData: HelmetData = ReactHelmet.renderStatic();

    return helmetData ? helmetReplace(html, helmetData) : html;
  }

  private async prefetch(context: RuntimeContext) {
    const {
      App: { prefetch },
    } = this;

    let prefetchData;
    const end = time();

    try {
      prefetchData = prefetch ? await prefetch(context) : null;
      this.result.renderLevel = RenderLevel.SERVER_PREFETCH;
      const prefetchCost = end();
      this.logger.debug(`App Prefetch cost = %d ms`, prefetchCost);
      this.metrics.emitTimer('app.prefetch.cost', prefetchCost);
    } catch (e) {
      this.result.renderLevel = RenderLevel.CLIENT_RENDER;
      this.logger.error('App Prefetch Render', e as Error);
      this.metrics.emitCounter('app.prefetch.render.error', 1);
    }

    return prefetchData || {};
  }

  private renderToString(context: RuntimeContext): string {
    let html = '';
    const end = time();
    const { ssrContext } = context;

    try {
      const App = React.createElement(this.App, {
        context: Object.assign(context, { ssr: true }),
      });

      // Todo render Hook
      const renderContext = {
        loadableManifest: path.resolve(ssrContext.distDir, LOADABLE_STATS_FILE),
        result: this.result,
        entryName: this.entryName,
      };
      html = reduce(App, renderContext, [
        styledComponentRenderer.toHtml,
        loadableRenderer.toHtml,
        (jsx: React.ReactElement) => ReactDomServer.renderToString(jsx),
      ]);

      const cost = end();
      this.logger.debug('App Render To HTML cost = %d ms', cost);
      this.metrics.emitTimer('app.render.html.cost', cost);
      this.result.renderLevel = RenderLevel.SERVER_RENDER;
    } catch (e) {
      this.logger.error('App Render To HTML', e as Error);
      this.metrics.emitCounter('app.render.html.error', 1);
    }

    return html;
  }

  private getSSRDataScript(templateData: ReturnType<typeof buildTemplateData>) {
    return {
      SSRDataScript: `
        <script>window._SSR_DATA = ${serialize(templateData, {
          isJSON: true,
        })}</script>
      `,
    };
  }
}
