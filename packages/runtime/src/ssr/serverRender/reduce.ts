import React from 'react';
import { RenderHandler, RenderEntry } from './type';

export function reduce(
  jsx: React.ReactElement,
  renderer: RenderEntry,
  middleware: RenderHandler[],
): string {
  let index = 0;

  const createNext = () => (App: React.ReactElement) =>
    middleware[index++](App, renderer, createNext());

  return createNext()(jsx);
}
