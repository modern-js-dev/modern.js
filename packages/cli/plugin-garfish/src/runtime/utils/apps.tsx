import path from 'path';
import React from 'react';
// eslint-disable-next-line import/no-named-as-default
import Garfish, { interfaces as garfishInterfaces } from 'garfish';
import { withRouter } from '@modern-js/plugin-router';
import { Manifest, ModulesInfo } from '../useModuleApps';
import { logger } from '../../util';
import {
  generateSubAppContainerKey,
  SUBMODULE_APP_COMPONENT_KEY,
} from './constant';
import { RenderLoading } from './MApp';

type Provider = {
  render: () => void;
  destroy: () => void;
  [SUBMODULE_APP_COMPONENT_KEY]?: React.ComponentType<any>;
};

declare module 'garfish' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace interfaces {
    export interface AppInfo {
      Component: React.ComponentType;
    }
  }
}

export interface AppMap {
  [key: string]: React.ComponentType;
}

function getAppInstance(appInfo: ModulesInfo[number], manifest: Manifest) {
  const { componentKey = '' } = manifest;

  const AppComponentMaps: any = {};
  // let locationHref = '';
  class App extends React.Component<any, any> {
    appInstance: any;

    _isMounted: boolean = false;

    state: {
      loading: boolean;
      domId: string;
      MicroApp: React.ComponentType<any> | null;
    } = {
      loading: true,
      domId: generateSubAppContainerKey(appInfo),
      MicroApp: AppComponentMaps[appInfo.name],
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    async UNSAFE_componentWillMount() {
      this._isMounted = true;
      const { domId } = this.state;

      // ignore withRouter props
      const { history, location, match, staticContext, ...userProps } =
        this.props;
      const { options } = Garfish;

      const loadAppOptions: Omit<garfishInterfaces.AppInfo, 'name'> = {
        ...appInfo,
        domGetter: `#${domId}`,
        basename: path.join(
          options?.basename || '/',
          // eslint-disable-next-line react/destructuring-assignment
          this.props?.match?.path,
        ),
        cache: true,
        props: {
          ...appInfo.props,
          ...userProps,
        },
        // eslint-disable-next-line consistent-return
        customLoader: (provider, nAppInfo) => {
          const AppComponent: React.ComponentType<any> =
            (provider as Provider)[SUBMODULE_APP_COMPONENT_KEY] ||
            (provider as any)[componentKey];
          logger(`MicroApp customLoader "${nAppInfo.name}"`, {
            AppComponent,
            provider,
          });

          if (AppComponent && !AppComponentMaps[nAppInfo.name]) {
            return {
              mount: () => {
                logger(`MicroApp customLoader mount "${nAppInfo.name}"`, {
                  AppComponent,
                  provider,
                  _isMounted: this._isMounted,
                });
                // in the unmount state can't change state
                if (this._isMounted) {
                  const nAppComponent = () => (
                    <AppComponent
                      appName={nAppInfo.name}
                      basename={nAppInfo.basename}
                      props={nAppInfo.props}
                    />
                  );
                  AppComponentMaps[appInfo.name] = nAppComponent;
                  this.setState({
                    MicroApp: nAppComponent,
                  });
                }
              },
              unmount: () => {
                logger(`MicroApp destroy "${nAppInfo.name}"`, {
                  _isMounted: this._isMounted,
                });
                if (this._isMounted) {
                  this.setState({
                    MicroApp: null,
                  });
                }
              },
            };
          }
        },
      };

      logger(`MicroApp componentWillMount "${appInfo.name}"`, {
        domId,
        appInfo,
        options,
        loadAppOptions,
        location,
      });

      const app = await Garfish.loadApp(appInfo.name, loadAppOptions);

      logger(`MicroApp Garfish.loadApp "${appInfo.name}" result`, {
        appInstance: app,
      });

      if (!app) {
        throw new Error(
          `${appInfo.name} loaded error, appInfo: ${JSON.stringify(
            appInfo,
          )}, options: ${JSON.stringify(options)}`,
        );
      }

      this.appInstance = app;

      if (app?.mounted) {
        logger(`MicroApp Garfish.loadApp "${appInfo.name}" show`);
        await app?.show();
      } else {
        logger(`MicroApp Garfish.loadApp "${appInfo.name}" mount`);
        await app?.mount();
      }
      this.setState({
        loading: false,
      });

      // history?.listen(() => {
      //   if (locationHref !== history.location.pathname) {
      //     locationHref = history.location.pathname;
      //     const popStateEvent = new PopStateEvent('popstate');
      //     dispatchEvent(popStateEvent);
      //   }
      // });
    }

    componentWillUnmount() {
      this._isMounted = false;
      logger(`MicroApp componentWillUnmount "${appInfo.name}" hide`, {
        appInstance: this.appInstance,
      });
      if (this.appInstance) {
        this.appInstance.hide();
      }
    }

    render() {
      const { MicroApp, domId, loading } = this.state;
      logger(`MicroApp component render "${appInfo.name}"`, {
        MicroApp,
        domId,
        loading,
        appInfo,
      });

      return (
        <>
          <div id={domId}>
            {RenderLoading(loading, manifest)}
            {MicroApp && <MicroApp />}
          </div>
        </>
      );
    }
  }
  return withRouter(App);
}

export function generateApps(
  options: typeof Garfish.options,
  manifest: Manifest,
): {
  apps: AppMap;
  appInfoList: ModulesInfo;
} {
  const apps: AppMap = {};
  options.apps?.forEach(appInfo => {
    const Component = getAppInstance(appInfo, manifest);
    appInfo.Component = Component;
    apps[appInfo.name] = Component;
  });

  return { apps, appInfoList: options.apps || [] };
}
