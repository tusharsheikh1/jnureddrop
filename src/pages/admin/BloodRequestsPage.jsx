import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../api/axios';
import Loader from '../../components/Loader';

const STATUS_CONFIG = {
  active:    { label: 'Active',    cls: 'bg-green-100 text-green-700',  dot: 'bg-green-500' },
  fulfilled: { label: 'Fulfilled', cls: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-500' },
  cancelled: { label: 'Cancelled', cls: 'bg-gray-100 text-gray-500',   dot: 'bg-gray-400' },
};

const TABS = [
  { value: 'active',    label: 'Active' },
  { value: 'fulfilled', label: 'Fulfilled' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'all',       label: 'All' },
];

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

export default function AdminBloodRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [meta, setMeta]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [status, setStatus]     = useState('active');
  const [search, setSearch]     = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const load = (s = status, q = search, page = 1) => {
    setLoading(true);
    api.get('/admin/blood-requests', { params: { status: s, search: q, page } })
      .then(r => { setRequests(r.data.data); setMeta(r.data); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const switchTab = (val) => {
    setStatus(val);
    load(val, search);
  };

  const deleteReq = async (id) => {
    if (!window.confirm('Delete this blood request? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/blood-requests/${id}`);
      load(status, search);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blood Requests</h1>
        {meta && <p className="text-sm text-gray-500 mt-0.5">{meta.total} requests found</p>}
      </div>

      {/* Status tabs + search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-5 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {TABS.map(t => (
            <button
              key={t.value}
              onClick={() => switchTab(t.value)}
              className={`flex-1 sm:flex-none px-5 py-3.5 text-sm font-semibold transition-colors relative ${
                status === t.value
                  ? 'text-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
              {status === t.value && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Search row */}
        <div className="p-4 flex gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search patient or hospital..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && load(status, search)}
            />
          </div>
          <button
            onClick={() => load(status, search)}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors flex-shrink-0"
          >
            Search
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-16"><Loader fullPage={false} /></div>
        ) : requests.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No requests found</p>
            <p className="text-sm text-gray-400 mt-1">Try a different status or search term</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Patient</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Blood</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Hospital</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Location</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {requests.map(req => {
                  const sc = STATUS_CONFIG[req.status] ?? STATUS_CONFIG.cancelled;
                  return (
                    <tr key={req.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-gray-900">{req.patient_name}</p>
                        {req.is_emergency && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            Emergency
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center shadow-sm">
                          <span className="text-white font-bold text-[10px] leading-none">{req.blood_type}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-gray-600 hidden sm:table-cell">{req.hospital_name ?? '—'}</td>
                      <td className="px-4 py-3.5 text-gray-500 hidden md:table-cell">
                        {[req.upazila, req.district].filter(Boolean).join(', ') || '—'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${sc.cls}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => deleteReq(req.id)}
                          disabled={deletingId === req.id}
                          className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                          title="Delete request"
                        >
                          <TrashIcon />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="mt-4 flex justify-center items-center gap-1.5">
          {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => load(status, search, p)}
              className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                p === meta.current_page
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-red-200 hover:text-red-600'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
