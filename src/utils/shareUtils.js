export const getShareUrl = () => {
  if (typeof window === 'undefined') return 'https://www.jnureddrop.com';
  if (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')) {
    return window.location.href.replace(/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/, 'https://www.jnureddrop.com');
  }
  return window.location.href;
};

export const getShareOrigin = () => {
  if (typeof window === 'undefined') return 'https://www.jnureddrop.com';
  if (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')) {
    return 'https://www.jnureddrop.com';
  }
  return window.location.origin;
};