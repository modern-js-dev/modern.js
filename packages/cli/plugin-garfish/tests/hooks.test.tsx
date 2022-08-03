import React from 'react';
import { render } from '@testing-library/react';
import { createApp } from '@modern-js/runtime';
import '@testing-library/jest-dom';

import ModernGarfishPlugin, {
  useModuleApp,
  useModuleApps,
} from '../src/runtime';

global.React = React;

const dashboardPath = 'http://garfish-mock.com/dashboard';
const tableListPath = 'http://garfish-mock.com/table-list';

describe('plugin-garfish', () => {
  test('legacyModule hooks params', async () => {
    const dashBoardModuleInfo = {
      name: 'Dashboard',
      entry: dashboardPath,
    };
    const tableListModuleInfo = {
      name: 'TableList',
      entry: tableListPath,
    };

    const microFrontendConfig = {
      apps: [tableListModuleInfo, dashBoardModuleInfo],
      LoadingComponent() {
        return <div data-testid="loading-id">loading</div>;
      },
    };

    const App = () => {
      const { MApp, apps, Dashboard, TableList } = useModuleApps();


      if (apps.length > 0) {
        expect(apps[0].name).toBe(tableListModuleInfo.name);
        expect(apps[0].entry).toBe(tableListModuleInfo.entry);
        expect(apps[0].Component === TableList).toBeTruthy();

        expect(apps[1].name).toBe(dashBoardModuleInfo.name);
        expect(apps[1].entry).toBe(dashBoardModuleInfo.entry);
        expect(apps[1].Component === Dashboard).toBeTruthy();
      }

      return <div></div>;
    };

    const AppWrapper = createApp({
      plugins: [ModernGarfishPlugin(microFrontendConfig)],
    })(App);

    render(<AppWrapper />);
  });
});
