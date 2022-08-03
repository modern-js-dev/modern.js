import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createApp } from '@modern-js/runtime';
import fetchMock from 'jest-fetch-mock';
import '@testing-library/jest-dom';
// https://stackoverflow.com/questions/49034907/fetch-mock-does-not-mock-my-fetch
import {
  Link,
  Route,
  Switch,
  useLocation,
  MemoryRouter,
} from '@modern-js/runtime/router';
import ModernGarfishPlugin, { useModuleApp } from '../src/runtime';
import { useModuleApps } from '../src';
import {
  TABLE_LIST_ESCAPE_NODE,
  TABLE_LIST_HTML,
  TABLE_LIST_ROOT_NODE,
} from './resource/table';
import {
  DASHBOARD_ESCAPE_NODE,
  DASHBOARD_HTML,
  DASHBOARD_ROOT_NODE,
} from './resource/dashboard';
import {
  USER_INFO_ESCAPE_NODE,
  USER_INFO_HTML,
  USER_INFO_ROOT_NODE,
} from './resource/userInfo';

global.React = React;
global.fetch = fetchMock;

function waitFor(delay = 200) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(false);
    }, delay);
  });
}

const dashboardPath = 'http://garfish-mock.com/dashboard';
const tableListPath = 'http://garfish-mock.com/table-list';
const userInfoPath = 'http://garfish-mock.com/user-info';

describe('plugin-garfish', () => {
  beforeEach(() => {
    // https://www.npmjs.com/package/jest-fetch-mock
    fetchMock.mockIf(/^https?:\/\/garfish-mock.com.*$/, req => {
      if (req.url.endsWith('/dashboard')) {
        return Promise.resolve({
          body: DASHBOARD_HTML,
          headers: {
            'Content-Type': 'text/html',
          },
        });
      } else if (req.url.endsWith('/table-list')) {
        return Promise.resolve({
          body: TABLE_LIST_HTML,
          headers: {
            'Content-Type': 'text/html',
          },
        });
      } else if (req.url.endsWith('/user-info')) {
        return Promise.resolve({
          body: USER_INFO_HTML,
          headers: {
            'Content-Type': 'text/html',
          },
        });
      } else {
        return Promise.resolve({
          status: 404,
          body: 'Not Found',
        });
      }
    });

    fetchMock.doMock();
  });

  // testing-library.com/docs/example-react-router/
  test('useModuleApps hooks', async () => {
    const dashBoardModuleInfo = {
      name: 'Dashboard',
      entry: dashboardPath,
    };
    const tableListModuleInfo = {
      name: 'TableList',
      entry: tableListPath,
    };
    const userInfo = {
      name: 'UserInfo',
      activeWhen: '/user-info',
      entry: userInfoPath,
    };

    const microFrontendConfig = {
      apps: [tableListModuleInfo, dashBoardModuleInfo, userInfo],
      manifest: {
        loadable: {
          loading: ()=> {
            return <div data-testid="loading-id">loading</div>;
          }
        },
      },
    };

    const App = () => {
      const HomeTitle = 'Micro home page';
      const Home = () => <div data-testid="home-title">{HomeTitle}</div>;
      const { Dashboard, TableList } = useModuleApps();

      const LocationDisplay = () => {
        const location = useLocation();
        return <div data-testid="location-display">{location.pathname}</div>;
      };

      return (
        <MemoryRouter>
          <div id="app">
            <Link to="/">home</Link>
            <Link data-testid="dashboard-link" to="/dashboard">
              dashboard
            </Link>
            <Link data-testid="table-list-link" to="/table-list">
              table-list
            </Link>
            <Link data-testid="user-info-link" to="/user-info">
              user-info
            </Link>
            <Switch>
              <Route exact={true} path="/">
                <Home />
              </Route>
              <Route path="/dashboard">
                <Dashboard />
              </Route>
              <Route path="/table-list">
                <TableList />
              </Route>
              <LocationDisplay />
            </Switch>
          </div>
        </MemoryRouter>
      );
    };

    const AppWrapper = createApp({
      plugins: [ModernGarfishPlugin(microFrontendConfig)],
    })(App);

    const { unmount } = render(<AppWrapper />);
    expect(screen.getByTestId('home-title')).toBeInTheDocument();
    const leftClick = { button: 0 };
    userEvent.click(screen.getByTestId('dashboard-link'), leftClick);
    // expect(await screen.findByText('loading')).toBeInTheDocument();
    expect(
      await screen.findByText(DASHBOARD_ROOT_NODE.text),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(DASHBOARD_ESCAPE_NODE.text),
    ).toBeInTheDocument();

    userEvent.click(screen.getByTestId('table-list-link'), leftClick);
    expect(screen.queryByText(DASHBOARD_ROOT_NODE.text)).toBeNull();
    expect(screen.queryByText(DASHBOARD_ESCAPE_NODE.text)).toBeNull();
    // expect(await screen.findByText('loading')).toBeInTheDocument();
    expect(
      await screen.findByText(TABLE_LIST_ROOT_NODE.text),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(TABLE_LIST_ESCAPE_NODE.text),
    ).toBeInTheDocument();

    unmount();
  });

  test('legacyModule hooks MApp', async () => {
    const userInfo = {
      name: 'UserInfo',
      activeWhen: '/user-info',
      entry: userInfoPath,
    };
    const tableList2 = {
      name: 'tablist2',
      activeWhen: '/table-list',
      entry: tableListPath,
    };

    const microFrontendConfig = {
      apps: [userInfo, tableList2],
      LoadingComponent() {
        return <div data-testid="loading-id">loading</div>;
      },
    };

    const App = () => {
      const { MApp } = useModuleApps();
      const NMApp = useModuleApp();
      expect(MApp).toBe(NMApp);

      return (
        <MemoryRouter>
          <div id="app">
            <Link to="/">home</Link>
            <Link data-testid="dashboard-link" to="/dashboard">
              dashboard
            </Link>
            <Link data-testid="table-list-link" to="/table-list">
              table-list
            </Link>
            <Link data-testid="user-info-link" to="/user-info">
              user-info
            </Link>
            <MApp />
          </div>
        </MemoryRouter>
      );
    };

    const AppWrapper = createApp({
      plugins: [ModernGarfishPlugin(microFrontendConfig)],
    })(App);

    const { unmount } = render(<AppWrapper />);

    history.pushState(null, '', '/user-info');
    expect(
      await screen.findByText(USER_INFO_ROOT_NODE.text),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(USER_INFO_ESCAPE_NODE.text),
    ).toBeInTheDocument();

    history.pushState(null, '', '/table-list');
    await waitFor();
    expect(screen.queryByText(USER_INFO_ROOT_NODE.text)).toBeNull();
    expect(screen.queryByText(USER_INFO_ESCAPE_NODE.text)).toBeNull();

    expect(
      await screen.findByText(TABLE_LIST_ROOT_NODE.text),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(TABLE_LIST_ESCAPE_NODE.text),
    ).toBeInTheDocument();

    unmount();
  });
});
