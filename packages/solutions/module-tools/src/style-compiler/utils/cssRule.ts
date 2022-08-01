import { CSS_EXTENSIONS_RULE } from '../constants';

export const isCssRule = (file: string) => file.endsWith('.css');
export const isCssModuleRule = (file: string) => file.endsWith('.module.css');
export const isLessRule = (file: string) => file.endsWith('.less');
export const isLessModuleRule = (file: string) => file.endsWith('.module.less');
export const isSassRule = (file: string) =>
  CSS_EXTENSIONS_RULE.sassRule.test(file);
export const isSassModuleRule = (file: string) =>
  CSS_EXTENSIONS_RULE.sassModuleRule.test(file);
