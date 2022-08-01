import { Option } from './types';

export const CSS_EXTENSIONS = ['.css', '.less', '.sass', '.scss'];

export const CSS_EXTENSIONS_RULE = {
  cssRule: /\.css$/,
  cssModuleRule: /\.module\.css$/,
  lessRule: /\.less$/,
  lessModuleRule: /\.module\.less$/,
  sassRule: /\.(scss|sass)$/,
  sassModuleRule: /\.module\.(scss|sass)$/,
};

export const defaultCompilerOptions: Option = {
  less: {},
  sass: {
    file: '',
  },
  postcss: { options: {} },
};
