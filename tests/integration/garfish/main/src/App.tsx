import { useModuleApps } from '@modern-js/plugin-garfish';
import { Switch, Route, Link } from '@modern-js/runtime/router';
import { getAppInfo } from '../../../../utils/testCase';
import { name } from '../package.json';
import './App.css';

function Home() {
  return (
    <div style={{ textAlign: 'center', padding: '30px' }}>
      {getAppInfo(name).homeTitle}
    </div>
  );
}

const App: React.FC = () => {
  const { MApp, Dashboard } = useModuleApps();
  return (
    <div>
      <div style={{ textAlign: 'center' }}>
        <Link data-test="link-home" to="/">
          Home |{' '}
        </Link>{' '}
        &nbsp;
        <Link data-test="link-dashboard" to="/dashboard">
          Dashboard |{' '}
        </Link>{' '}
        &nbsp;
        <Link data-test="link-dashboard-detail" to="/dashboard/detail">
          Dashboard detail |{' '}
        </Link>
        <Link data-test="link-tablelist" to="/tablelist">
          Table
        </Link>{' '}
        &nbsp;
      </div>
      <Switch>
        <Route path="/" exact={true}>
          <Home />
        </Route>
        <Route path="/dashboard" exact={false}>
          <Dashboard
            msg={'hello world from main app'}
            loadable={{
              loading: ({ _pastDelay, error }: any) => {
                if (error) {
                  return <div>error: {error?.message}</div>;
                } else {
                  return <div>dashboard loading</div>;
                }
              },
            }}
          />
        </Route>
        {/* <Route path="/tablelist" exact={false}>
          <TableList
            loadable={{
              loading: ({ pastDelay, error }: any) => {
                if (error) {
                  return <div>error: {error?.message}</div>;
                } else if (pastDelay) {
                  return <div>tablelist loading</div>;
                } else {
                  return <div>empty placeholder</div>;
                }
              },
            }}
          />
        </Route> */}
      </Switch>
      <MApp
        msg={'hello world tablelist'}
        loadable={{
          loading: ({ pastDelay, error }: any) => {
            if (error) {
              return <div>error: {error?.message}</div>;
            } else if (pastDelay) {
              return <div>tablelist loading</div>;
            } else {
              return <div>tablelist empty placeholder</div>;
            }
          },
        }}
      />
    </div>
  );
};

// defineConfig(App, {
//   masterApp: {
//     // apps: [
//     //   {
//     //     name: 'Dashboard',
//     //     activeWhen: '/dashboard',
//     //     entry: 'http://localhost:8081/',
//     //   },
//     //   {
//     //     name: 'TableList',
//     //     activeWhen: '/tablelist',
//     //     entry: 'http://localhost:8082',
//     //   },
//     // ],
//     manifest: {
//       LoadingComponent() {
//         return <div>loading</div>;
//       },
//     },
//   },
// });

// eslint-disable-next-line no-console
console.log((App as any).config);

export default App;
