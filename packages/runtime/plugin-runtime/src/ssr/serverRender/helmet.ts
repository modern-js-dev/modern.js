// 用于 react-helmet 正则替换
import { HelmetData } from 'react-helmet';

const RE_HTML_ATTR = /<html[^>]*>/;
const RE_BODY_ATTR = /<body[^>]*>/;
const RE_LAST_IN_HEAD = /<\/head>/;
const RE_TITLE = /<title[^>]*>([\s\S\n\r]*?)<\/title>/g;
const TEST_TITLE_CONTENT =
  /(?<=<title[^>]*>)([\s\S\n\r]*?)([.|\S])([\s\S\n\r]*?)(?=<\/title>)/g;

// 通过 react-helmet 修改模板
export default function helmet(content: string, helmetData: HelmetData) {
  let result = content;
  const bodyAttributes = helmetData.bodyAttributes.toString();
  if (bodyAttributes) {
    result = result.replace(RE_BODY_ATTR, `<body ${bodyAttributes}>`);
  }

  const htmlAttributes = helmetData.htmlAttributes.toString();
  if (htmlAttributes) {
    result = result.replace(RE_HTML_ATTR, `<html ${htmlAttributes}>`);
  }

  const base = helmetData.base.toString();
  const link = helmetData.link.toString();
  const meta = helmetData.meta.toString();
  const noscript = helmetData.noscript.toString();
  const script = helmetData.script.toString();
  const style = helmetData.style.toString();
  const title = helmetData.title.toString();

  // 如果模板中存在 title，且 helmetData title 有内容则做替换
  const existTitle = RE_TITLE.test(content);
  if (TEST_TITLE_CONTENT.test(title.trim()) && existTitle) {
    result = result.replace(RE_TITLE, title);
  }

  return result.replace(
    RE_LAST_IN_HEAD,
    `
    ${base}
    ${link}
    ${meta}
    ${noscript}
    ${script}
    ${style}
    ${existTitle ? '' : title}
    </head>
  `,
  );
}
