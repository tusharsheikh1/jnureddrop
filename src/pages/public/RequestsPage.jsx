import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import ModernHeader from '../../components/ModernHeader';
import SEO from '../../components/SEO';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

function timeAgo(dateStr) {
  if (!dateStr) return null;
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  const days = Math.floor(diff / 86400);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function isRecent(dateStr) {
  if (!dateStr) return false;
  return Date.now() - new Date(dateStr) < 2 * 60 * 60 * 1000;
}

/* ── Icons ── */
function LocationIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  );
}

function DropletIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  );
}

/* ── Request Card ── */
function RequestCard({ req }) {
  const location = [req.upazila, req.district].filter(Boolean).join(', ');
  const ago = timeAgo(req.created_at);
  const fresh = isRecent(req.created_at);

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${req.is_emergency ? 'border-red-100' : 'border-gray-100'}`}>
      {req.is_emergency && (
        <div className="h-0.5 bg-gradient-to-r from-red-500 to-red-400" />
      )}
      <div className="p-4">
        <div className="flex gap-3">
          {/* Blood type */}
          <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${req.is_emergency ? 'bg-red-600' : 'bg-gray-800'}`}>
            <span className="text-white font-black text-sm leading-none">{req.blood_type}</span>
          </div>

          <div className="flex-1 min-w-0">
            {/* Name + badges + time */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                <span className="font-bold text-gray-900 text-sm truncate">{req.patient_name}</span>
                {req.is_emergency && (
                  <span className="flex-shrink-0 text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full uppercase tracking-wide">Urgent</span>
                )}
                {fresh && (
                  <span className="flex-shrink-0 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full uppercase">New</span>
                )}
              </div>
              <span className="flex-shrink-0 text-[11px] text-gray-400">{ago}</span>
            </div>

            {/* Hospital */}
            <p className="text-xs text-gray-600 mt-0.5 truncate">{req.hospital_name}</p>

            {/* Location + units */}
            <div className="flex items-center gap-3 mt-1.5">
              {location && (
                <span className="flex items-center gap-1 text-[11px] text-gray-400 min-w-0">
                  <LocationIcon size={11} />
                  <span className="truncate">{location}</span>
                </span>
              )}
              <span className="flex items-center gap-1 text-[11px] text-gray-400 flex-shrink-0">
                <DropletIcon size={11} />
                {req.blood_quantity || 1} unit{(req.blood_quantity || 1) > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Divider + action row */}
        <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
          {req.disease ? (
            <p className="text-[11px] text-gray-500 truncate mr-2">
              <span className="font-semibold">Condition:</span> {req.disease}
            </p>
          ) : <span />}
          <Link
            to={`/requests/${req.id}`}
            className="flex-shrink-0 flex items-center gap-0.5 text-xs font-bold text-red-600 hover:text-red-700"
          >
            View Details <ChevronRightIcon />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Skeleton ── */
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
      <div className="flex gap-3">
        <div className="w-14 h-14 bg-gray-200 rounded-2xl flex-shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
          <div className="h-3 bg-gray-100 rounded w-3/4" />
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-50 flex justify-end">
        <div className="h-4 w-24 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

/* ── Empty State ── */
function EmptyState({ hasFilters, onClear }) {
  return (
    <div className="col-span-2 flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
        </svg>
      </div>
      <p className="text-gray-700 font-semibold mb-1">No requests found</p>
      <p className="text-xs text-gray-400 mb-4">
        {hasFilters ? 'Try a different blood type or district.' : 'No blood requests right now.'}
      </p>
      {hasFilters && (
        <button onClick={onClear} className="text-sm font-semibold text-red-600 hover:text-red-700">
          Clear filters
        </button>
      )}
    </div>
  );
}

/* ── Main Page ── */
export default function RequestsPage() {
  const { isDonor } = useAuth();
  const { unreadCount } = useNotifications() ?? { unreadCount: 0 };

  const [requests, setRequests]         = useState([]);
  const [meta, setMeta]                 = useState(null);
  const [allDistricts, setAllDistricts] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [loadingMore, setLoadingMore]   = useState(false);

  const [activeTab, setActiveTab] = useState('active');
  const [filters, setFilters]     = useState({ blood_type: '', district: '', page: 1 });

  const hasFilters = !!(filters.blood_type || filters.district);

  const fetchRequests = async (f = filters, tab = activeTab, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(f).filter(([, v]) => v !== ''));
      params.status = tab;
      const { data } = await api.get('/requests', { params });
      setRequests(prev => append ? [...prev, ...data.requests.data] : data.requests.data);
      setMeta(data.requests);
    } finally {
      append ? setLoadingMore(false) : setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(filters, activeTab); }, [activeTab]);

  useEffect(() => {
    api.get('/locations/districts')
      .then(({ data }) => setAllDistricts([...data].sort()))
      .catch(() => {});
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFilters(f => ({ ...f, page: 1 }));
  };

  const handleFilterChange = (key, val) => {
    const next = { ...filters, [key]: val, page: 1 };
    setFilters(next);
    fetchRequests(next, activeTab);
  };

  const clearFilters = () => {
    const next = { blood_type: '', district: '', page: 1 };
    setFilters(next);
    fetchRequests(next, activeTab);
  };

  const handleLoadMore = () => {
    const next = { ...filters, page: (meta?.current_page ?? 1) + 1 };
    setFilters(next);
    fetchRequests(next, activeTab, true);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans pb-24 md:pb-0">
      <SEO
        title="Active Blood Requests"
        description="View urgent blood donation requests near Jagannath University. Find patients in need of A+, B+, O+, AB+ blood and respond as a verified donor."
        url="/requests"
      />

      <ModernHeader title="Blood Requests" />

      {/* Desktop header */}
      <div className="hidden md:block bg-white border-b border-gray-100 py-6">
        <div className="max-w-5xl mx-auto px-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Blood Requests</h1>
            <p className="text-sm text-gray-500 mt-1">Respond to blood requests in the JnU community</p>
          </div>
          {isDonor && (
            <Link
              to="/notifications"
              className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold min-w-[16px] h-4 flex items-center justify-center rounded-full px-0.5 leading-none">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-4 md:max-w-5xl md:px-8 md:pt-6">

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-4">
          {['active', 'fulfilled'].map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`flex-1 py-2.5 text-sm font-semibold text-center relative transition-colors ${
                activeTab === tab
                  ? tab === 'active' ? 'text-red-600' : 'text-gray-800'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab === 'active' ? 'Active' : 'Resolved'}
              {activeTab === tab && (
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full ${tab === 'active' ? 'bg-red-600' : 'bg-gray-800'}`} />
              )}
            </button>
          ))}
        </div>

        {/* Blood type chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          <button
            onClick={() => handleFilterChange('blood_type', '')}
            className={`flex-shrink-0 px-3.5 py-1.5 text-xs font-bold rounded-full border transition-colors ${
              !filters.blood_type
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
            }`}
          >
            All
          </button>
          {BLOOD_TYPES.map(bt => (
            <button
              key={bt}
              onClick={() => handleFilterChange('blood_type', filters.blood_type === bt ? '' : bt)}
              className={`flex-shrink-0 px-3.5 py-1.5 text-xs font-bold rounded-full border transition-colors ${
                filters.blood_type === bt
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
              }`}
            >
              {bt}
            </button>
          ))}
        </div>

        {/* District + clear row */}
        <div className="flex items-center gap-2 mt-2 mb-4">
          <div className="relative flex-1">
            <select
              value={filters.district}
              onChange={e => handleFilterChange('district', e.target.value)}
              className="w-full appearance-none text-xs font-medium border border-gray-200 rounded-xl pl-3 pr-8 py-2 bg-white text-gray-700 outline-none focus:border-red-300 focus:ring-1 focus:ring-red-100 transition-all"
            >
              <option value="">All Districts</option>
              {allDistricts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <polyline points="6 9 12 15 18 9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex-shrink-0 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : requests.length === 0 ? (
            <EmptyState hasFilters={hasFilters} onClear={clearFilters} />
          ) : (
            requests.map(r => <RequestCard key={r.id} req={r} />)
          )}
        </div>

        {/* Load more */}
        {!loading && meta && meta.current_page < meta.last_page && (
          <div className="mt-5 text-center">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors disabled:opacity-60"
            >
              {loadingMore ? 'Loading…' : 'Load more'}
            </button>
          </div>
        )}

        <div className="h-6" />
      </div>

      {/* Donor FAB: post a request */}
      {isDonor && (
        <Link
          to="/donor/blood-request/create"
          className="fixed bottom-20 right-4 z-40 md:bottom-6 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-4 py-3 rounded-2xl shadow-lg shadow-red-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Post Request
        </Link>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
