import { compile } from 'path-to-regexp';

export const mergeExtension = (users: any[]) => {
  const output: any[] = [];
  return { middleware: output.concat(users) };
};

export const toMessage = (dig: string, e: Error | string): string => {
  const message = e instanceof Error ? e.message : e;
  if (message) {
    return `${dig}: ${message}`;
  } else {
    return dig;
  }
};

export const noop = () => {
  // noop
};

export const createErrorDocument = (status: number, text: string) => {
  const title = `${status}: ${text}`;
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>${title}</title>
    <style>
      html,body {
        margin: 0;
      }

      .page-container {
        color: #000;
        background: #fff;
        height: 100vh;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
    </style>
  </head>
  <body>
    <div class="page-container">
    <h1>${status}</h1>
    <div>${text}</div>
  </body>
  </html>
  `;
};

export type CollectMiddlewaresResult = {
  web: any[];
  api: any[];
};

export const createMiddlewareCollecter = () => {
  const webMiddlewares: any[] = [];
  const apiMiddlewares: any[] = [];

  const addWebMiddleware = (input: any) => {
    webMiddlewares.push(input);
  };

  const addAPIMiddleware = (input: any) => {
    apiMiddlewares.push(input);
  };

  const getMiddlewares = (): CollectMiddlewaresResult => ({
    web: webMiddlewares,
    api: apiMiddlewares,
  });
  return {
    getMiddlewares,
    addWebMiddleware,
    addAPIMiddleware,
  };
};

export const toPath = (reg: string, params: Record<string, any>) => {
  const fn = compile(reg, { encode: encodeURIComponent });
  return fn(params);
};
