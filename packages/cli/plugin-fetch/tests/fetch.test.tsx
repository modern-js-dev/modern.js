import React from 'react';
import { initialWrapper, createPlugin } from '@modern-js/runtime';
import { render } from '@testing-library/react';
import { fetchPlugin, useFetch } from '../src/plugin';

describe.skip('@modern-js/plugin-fetch', () => {
  it('base usage', () => {
    const wrap = initialWrapper([
      createPlugin(() => ({
        hoc: ({ App: App1 }, next) => next({ App: App1 }),
      })),
      fetchPlugin,
    ]);

    interface Props {
      test: number;
    }
    function App({ test }: Props) {
      const fetch = useFetch();
      fetch('http://localhost/test');
      return <div>App:{test}</div>;
    }

    const AppWrapper = wrap(App, {});

    const { container } = render(<AppWrapper test={1} />);
    expect(container.firstChild?.textContent).toBe(`App:1`);
    expect(container.innerHTML).toBe('<div>App:1</div>');
  });
});
