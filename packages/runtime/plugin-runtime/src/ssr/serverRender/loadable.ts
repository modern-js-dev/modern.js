import path from 'path';
import { ChunkExtractor } from '@loadable/server';
import { RenderHandler } from './type';

function getLoadableScripts(extractor: ChunkExtractor) {
  const check = (scripts: string) =>
    (scripts || '').includes('__LOADABLE_REQUIRED_CHUNKS___ext');

  const scripts = extractor.getScriptTags();

  if (!check(scripts)) {
    return '';
  }

  return (
    scripts
      .split('</script>')
      // 前两个 script为 loadable 必须的 script
      .slice(0, 2)
      .map(i => `${i}</script>`)
      .join('')
  );
}

export const toHtml: RenderHandler = (jsx, renderer, next) => {
  const {
    loadableManifest,
    result: { chunksMap },
  } = renderer;

  if (!loadableManifest || chunksMap.js) {
    return next(jsx);
  }

  const extractor = new ChunkExtractor({
    statsFile: loadableManifest,
    entrypoints: [renderer.entryName],
  });

  const html = next(extractor.collectChunks(jsx));
  const chunks = extractor.getChunkAssets(extractor.chunks);

  chunksMap.js = (chunksMap.js || '') + getLoadableScripts(extractor);

  for (const v of chunks) {
    const fileType = path.extname(v.url).slice(1);

    if (fileType === 'js') {
      chunksMap[fileType] += `<script src="${v.url}"></script>`;
    } else if (fileType === 'css') {
      chunksMap[fileType] += `<link href="${v.url}" rel="stylesheet" />`;
    }
  }

  return html;
};
