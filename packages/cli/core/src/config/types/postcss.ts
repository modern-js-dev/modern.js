import type {
  Syntax,
  Parser,
  Stringifier,
  AcceptedPlugin,
  SourceMapOptions,
  ProcessOptions,
} from 'postcss';

export type PostCSSOptions = {
  to?: string;
  from?: string;
  map?: boolean | SourceMapOptions;
  syntax?: Syntax;
  parser?: string | object | (() => Parser);
  plugins?: AcceptedPlugin[];
  stringifier?: Stringifier | Syntax;
};

export type PostCSSLoaderOptions = {
  /**
   * Enable PostCSS Parser support in CSS-in-JS. If you use JS styles the postcss-js parser, add the execute option.
   */
  execute?: boolean;
  /**
   * By default generation of source maps depends on the devtool option. All values enable source map generation except eval and false value.
   */
  sourceMap?: boolean;
  /**
   * The special implementation option determines which implementation of PostCSS to use.
   */
  implementation?: unknown;
  /**
   * Allows to set PostCSS options and plugins.
   */
  postcssOptions?: PostCSSOptions;
};

export interface PostcssOption {
  enableSourceMap?: boolean;
  plugins?: AcceptedPlugin[];
  options: ProcessOptions;
}
