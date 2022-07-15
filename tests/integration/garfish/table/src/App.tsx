import { Switch, Route } from '@modern-js/runtime/router';
import { List, Image } from '@arco-design/web-react';
import '@arco-design/web-react/dist/css/arco.css';

import './App.css';

const App = (props: any) => {
  return (
    <Switch>
      <Route exact={true} path="/">
        <div className="container">
          <main>
            <div className="logo">
              <Image
                src={
                  '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/8361eeb82904210b4f55fab888fe8416.png~tplv-uwbnlip3yd-webp.webp'
                }
                width={200}
              />
            </div>
            <p className="description">Tablelist home page</p>
            <div style={{ textAlign: 'center' }}>
              main app info: {props.msg}
            </div>
            <List
              style={{ width: 622 }}
              size="small"
              header="List title"
              dataSource={[
                'Beijing Bytedance Technology Co., Ltd.',
                'Bytedance Technology Co., Ltd.',
                'Beijing Toutiao Technology Co., Ltd.',
                'Beijing Volcengine Technology Co., Ltd.',
                'China Beijing Bytedance Technology Co., Ltd.',
              ]}
              render={(item, index) => (
                <List.Item key={index}>{item}</List.Item>
              )}
            />
          </main>
        </div>
      </Route>
      <Route path="*">
        <div>404</div>
      </Route>
    </Switch>
  );
};

export default App;
