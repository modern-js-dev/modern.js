declare module '@loadable/server' {
  export class ChunkExtractor {
    chunks: any;

    getScriptTags: () => string;

    collectChunks: (
      jsx: React.ReactElement<any, string | React.JSXElementConstructor<any>>,
    ) => ReactElement<any, string | JSXElementConstructor<any>>;

    getChunkAssets: (chunks: any) => any;

    constructor({ statsFile, entrypoints });
  }
}

declare module '@modern-js/runtime' {}
