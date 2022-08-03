import type { ILibPresetOption } from '@modern-js/babel-preset-lib';

export type IModulePresetOption = ILibPresetOption & BuiltInOptsType;
export type ImportStyleType = 'source-code' | 'compiled-code';
export type { ISyntaxOption } from '@modern-js/babel-preset-lib';

export type BuiltInOptsType = {
  importStyle?: ImportStyleType;
  staticDir?: string;
  styleDir?: string;
  sourceDir?: string;
};
