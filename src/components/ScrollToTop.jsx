import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Resets window scroll on every route change (SPAs keep the previous
// page's scroll position by default). Hash links are left alone so
// in-page anchors still work.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
