export const isBrowser = () =>
  typeof window !== 'undefined' && window.name !== 'nodejs';
