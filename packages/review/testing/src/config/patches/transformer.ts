import { readCompilerOptions } from '@/utils';
import { TestConfigOperator } from '@/config/testConfigOperator';
import { upath } from '@modern-js/utils';
const resolveTsCompilerOptions = () => {
  const tsCompilerOptions = readCompilerOptions() || {};

  const { jsx } = tsCompilerOptions;

  if (!jsx) {
    return null;
  }

  tsCompilerOptions.jsx = 'react-jsx';

  return tsCompilerOptions;
};

/**
 * Map `TestConfig.transformer` to jest config
 */
export const patchTransformer = (testOperator: TestConfigOperator) => {
  const { transformer } = testOperator.testConfig;

  if (transformer === 'babel-jest') {
    testOperator.mergeJestConfig({
      transform: {
        '\\.[jt]sx?$': upath.normalizeSafe(require.resolve('../transformer/babelTransformer')),
      },
    });
  }

  if (transformer === 'ts-jest') {
    testOperator.mergeJestConfig({
      transform: {
        '\\.[jt]sx?$': upath.normalizeSafe(require.resolve('ts-jest')),
      },
    });

    const compilerOptions = resolveTsCompilerOptions();

    compilerOptions &&
      testOperator.mergeJestConfig({
        globals: {
          'ts-jest': {
            tsconfig: compilerOptions,
          },
        },
      });
  }
};
