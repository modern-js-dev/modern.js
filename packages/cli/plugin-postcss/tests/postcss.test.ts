import path from 'path';
import { getPostcssConfig } from '../src';

describe('base postcss config', () => {
  const fixture = path.resolve(__dirname, './fixtures/with-autoprefixer');

  test('should return plugins with autoprefixer', () => {
    process.env.NODE_ENV = 'development';
    const {
      postcssOptions: { plugins },
    } = getPostcssConfig(fixture, {
      tools: {
        postcss: (config: any) => {
          const newConfig = {
            postcssOptions: {
              plugins: [...config.postcssOptions.plugins, 'postcss-modules'],
            },
          };
          return newConfig;
        },
        autoprefixer: (config: any) => {
          config.grid = 'autoplace';
        },
      },
    } as any);

    expect(plugins?.length).toBe(9);

    expect(plugins ? plugins[plugins.length - 2] : undefined).toHaveProperty(
      'options',
      {
        flexbox: 'no-2009',
        grid: 'autoplace',
        overrideBrowserslist: [
          'last 1 chrome version',
          'last 1 firefox version',
          'last 1 safari version',
        ],
      },
    );
  });

  test(`should return plugins without autoprefixer`, () => {
    const {
      postcssOptions: { plugins },
    } = getPostcssConfig(fixture, { tools: {} } as any, false);

    expect(plugins?.length).toBe(7);
  });

  test('should allow to using addPlugins to add plugins', () => {
    const {
      postcssOptions: { plugins },
    } = getPostcssConfig(
      fixture,
      {
        tools: {
          postcss(
            _: unknown,
            { addPlugins }: { addPlugins: (plugins: unknown) => void },
          ) {
            addPlugins({});
            addPlugins([{}, {}]);
          },
        },
      } as any,
      false,
    );

    expect(plugins?.length).toBe(10);
  });
});
