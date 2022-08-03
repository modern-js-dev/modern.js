import React from 'react';
import type { Plugin } from '@modern-js/runtime';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { logger } from '../util';
import { GarfishProvider } from './utils/Context';
import setExternal from './utils/setExternal';
import {
  Config,
  Manifest,
  MicroComponentProps,
  ModulesInfo,
  Options,
} from './useModuleApps';
import { generateMApp } from './utils/MApp';
import { AppMap, generateApps } from './utils/apps';

async function initOptions(manifest: Manifest = {}, options: Options) {
  let apps: ModulesInfo = options.apps || [];

  // use manifest modules
  if (manifest?.modules) {
    if (manifest?.modules.length > 0) {
      apps = manifest?.modules;
    }
    logger('manifest modules', apps);
  }

  // get module list
  if (manifest?.getAppList) {
    const getAppList = await manifest?.getAppList(manifest);
    if (getAppList.length > 0) {
      apps = getAppList;
    }
    logger('getAppList modules', apps);
  }

  // get inject modules list
  if (
    window?.modern_manifest?.modules &&
    window?.modern_manifest?.modules.length > 0
  ) {
    apps = window?.modern_manifest?.modules;
    logger('modern_manifest', apps);
  }

  return {
    ...options,
    apps,
  };
}

// export default GarfishPlugin;
export default (config: Config): Plugin => ({
  name: '@modern-js/garfish-plugin',
  setup: () => {
    setExternal();

    const { manifest, ...options } = config;
    logger('createPlugin', config);
    const promise = initOptions(manifest, options);
    return {
      hoc({ App }, next) {
        class GetMicroFrontendApp extends React.Component {
          state: {
            MApp: React.FC<MicroComponentProps>;
            apps: AppMap;
            appInfoList: ModulesInfo;
          } = {
            MApp: () => {
              logger('MApp init Component Render');
              return React.createElement('div');
            },
            apps: new Proxy(
              {},
              {
                get() {
                  return () => React.createElement('div');
                },
              },
            ),
            appInfoList: [],
          };

          constructor(props: any) {
            super(props);
            const load = async () => {
              const GarfishConfig = await promise;
              logger('initOptions result', { manifest, GarfishConfig });
              const MApp = generateMApp(GarfishConfig, manifest);
              const { appInfoList, apps } = generateApps(
                GarfishConfig,
                manifest,
              );
              logger('generateApps', { MApp, apps, appInfoList });
              this.setState({
                MApp,
                apps,
                appInfoList,
              });
            };
            load();
          }

          render() {
            logger('GarfishProvider state', this.state);
            return (
              <GarfishProvider value={this.state}>
                <App {...this.props} {...this.state} />
              </GarfishProvider>
            );
          }
        }

        return next({
          App: hoistNonReactStatics(GetMicroFrontendApp, App),
        });
      },
    };
  },
});
