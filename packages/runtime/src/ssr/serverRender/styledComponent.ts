import { ServerStyleSheet } from 'styled-components';
import { RenderHandler } from './type';

export const toHtml: RenderHandler = (jsx, renderer, next) => {
  const sheet = new ServerStyleSheet();

  const html = next(sheet.collectStyles(jsx));

  const css = sheet.getStyleTags();

  renderer.result.chunksMap.css += css;

  return html;
};
