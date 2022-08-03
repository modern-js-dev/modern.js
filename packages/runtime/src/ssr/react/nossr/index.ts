import React, { useEffect, useState } from 'react';

let csr = false;
export const NoSSR = (props: React.PropsWithChildren<React.ReactNode>) => {
  const [isMounted, setMounted] = useState(csr);
  useEffect(() => {
    csr = true;
    setMounted(true);
  });

  const { children } = props;
  return React.createElement(React.Fragment, null, isMounted ? children : null);
};
