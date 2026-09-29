const PROD_ORIGIN = 'https://www.jnureddrop.com';

const isLocal = () =>
  typeof window !== 'undefined' &&
  (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1'));

export const getShareUrl = () => {
  if (typeof window === 'undefined') return PROD_ORIGIN;
  const path = window.location.pathname + window.location.search + window.location.hash;
  return PROD_ORIGIN + path;
};

export const getShareOrigin = () => PROD_ORIGIN;