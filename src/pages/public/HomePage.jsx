import { useEffect, useState } from 'react';
import api from '../../api/axios';
import HomePageDesktop from './HomePageDesktop';
import HomePageMobile from './HomePageMobile';

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 768);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isDesktop;
}

export default function HomePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    api.get('/home').then(r => setData(r.data)).finally(() => setLoading(false));
  }, []);

  const { stats = {} } = data ?? {};

  const props = {
    loading,
    totalDonors:       stats.total_donors       ?? 0,
    availableDonors:   stats.available_donors   ?? 0,
    fulfilledRequests: stats.fulfilled_requests ?? 0,
    activeRequests:    stats.active_requests    ?? 0,
  };

  return isDesktop
    ? <HomePageDesktop {...props} />
    : <HomePageMobile {...props} />;
}
