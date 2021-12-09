import { ENTRY_NAME_PATTERN } from '@modern-js/utils';

export const output = {
  type: 'object',
  additionalProperties: false,
  properties: {
    assetPrefix: { type: 'string' },
    path: { type: 'string' },
    jsPath: { type: 'string' },
    cssPath: { type: 'string' },
    htmlPath: { type: 'string' },
    mediaPath: { type: 'string' },
    mountId: { type: 'string' },
    favicon: { type: 'string' },
    faviconByEntries: {
      type: 'object',
      patternProperties: { [ENTRY_NAME_PATTERN]: { type: 'string' } },
    },
    title: { type: 'string' },
    titleByEntries: {
      type: 'object',
      patternProperties: { [ENTRY_NAME_PATTERN]: { type: 'string' } },
    },
    meta: { type: 'object' },
    metaByEntries: {
      type: 'object',
      patternProperties: { [ENTRY_NAME_PATTERN]: { type: 'object' } },
    },
    inject: { enum: [true, 'head', 'body', false] },
    injectByEntries: {
      type: 'object',
      patternProperties: {
        [ENTRY_NAME_PATTERN]: { enum: [true, 'head', 'body', false] },
      },
    },
    copy: { type: 'array' },
    scriptExt: { type: 'object' },
    disableHtmlFolder: { type: 'boolean' },
    disableCssModuleExtension: { type: 'boolean' },
    disableCssExtract: { type: 'boolean' },
    enableCssModuleTSDeclaration: { type: 'boolean' },
    disableMinimize: { type: 'boolean' },
    enableInlineStyles: { type: 'boolean' },
    enableInlineScripts: { type: 'boolean' },
    disableSourceMap: { type: 'boolean' },
    disableInlineRuntimeChunk: { type: 'boolean' },
    disableAssetsCache: { type: 'boolean' },
    enableLatestDecorators: { type: 'boolean' },
    enableTsLoader: { type: 'boolean' },
    dataUriLimit: { type: 'number' },
    templateParameters: { type: 'object' },
    templateParametersByEntries: {
      type: 'object',
      patternProperties: { [ENTRY_NAME_PATTERN]: { type: 'object' } },
    },
    polyfill: {
      type: 'string',
      enum: ['usage', 'entry', 'off', 'ua'],
    },
    cssModuleLocalIdentName: { type: 'string' },
    federation: { type: 'object' },
    disableNodePolyfill: { type: 'boolean' },
    enableModernMode: { type: 'boolean' },
  },
};
