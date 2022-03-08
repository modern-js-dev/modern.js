import '@testing-library/jest-dom';
import GarfishPlugin, { resolvedConfig } from '../src/cli';
import { getRuntimeConfig, makeRenderFunction, setRuntimeConfig } from '../src/cli/utils';

describe('plugin-garfish cli', () => {
  test('cli garfish basename', async () => {
    expect(GarfishPlugin.name).toBe('@modern-js/plugin-garfish');
    const basename = '/test';
    const resolveConfig = {
      resolved: {
        runtime: {
          router: {
            historyOptions: { basename }
          },
          masterApp: {}
        },
      }
    };
    const config = await resolvedConfig(resolveConfig as any);
    expect(config.resolved.runtime.masterApp.basename).toBe(basename);
  });

  test('cli makeRender function', ()=>{
    const code = `
      const router = (config)=> config;
      const App = {};
      const routerConfig = router({...App?.config?.router, ...App?.config?.features?.router});
      const resultConfig = {
        routerConfig,
        renderByProvider: true,
      };
    
      if (IS_BROWSER) {
        resultConfig.renderByProvider = false;
      }
      return resultConfig;
    `;
    const generateNewRenderFn = new Function('appInfo', 'IS_BROWSER', '__GARFISH_EXPORTS__', makeRenderFunction(code));
    
    // render byGarfish but don't provider appInfo
    expect(generateNewRenderFn(undefined, true, false)).toBe(null);

    // run alone
    expect(generateNewRenderFn(undefined, true)).toMatchObject({
      renderByProvider: false
    });

    // render ByGarfish and provider appInfo
    expect(generateNewRenderFn({ basename: '/test' }, true, true)).toMatchObject({
      renderByProvider: true,
      routerConfig: {
        basename: '/test',
        historyOptions: {
          basename: '/test'
        }
      }
    });
  });

  test('cli get runtime config', ()=>{
    const runtimeConfig = getRuntimeConfig({
      runtime: {
        masterApp: {
          basename: '/test'
        }
      }
    });
    expect(runtimeConfig).toMatchObject({
      masterApp: {
        basename: '/test'
      }
    });
  });

  test('cli get runtime features config', ()=>{
    const runtimeConfig = getRuntimeConfig({
      runtime: {
        masterApp: {
          basename: '/test'
        },
        features: {
          masterApp: {
            basename: '/test2'
          }
        }
      }
    });

    expect(runtimeConfig).toMatchObject({
      masterApp: {
        basename: '/test2'
      }
    });
  });

  test('cli set runtime config', ()=>{
    const runtimeConfig = {
      runtime: {
        masterApp: {
          basename: '/test'
        }
      }
    };

    setRuntimeConfig(runtimeConfig, 'masterApp', true);

    expect(runtimeConfig.runtime.masterApp).toBe(true);
  });

  test('cli set runtime features config', ()=>{
    const runtimeConfig = {
      runtime: {
        features: {
          masterApp: {
            basename: '/test'
          }
        }
      }
    };

    setRuntimeConfig(runtimeConfig, 'masterApp', true);

    expect(runtimeConfig.runtime.features.masterApp).toBe(true);
  });
});
