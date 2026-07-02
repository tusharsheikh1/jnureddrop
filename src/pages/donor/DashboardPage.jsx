import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import Loader from '../../components/Loader';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

function formatDate(str) {
  if (!str) return '—';
  return new Date(str).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onChange(!checked); }}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-green-500' : 'bg-gray-200'}`}
    >
      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

export default function DonorDashboardPage() {
  const { user } = useAuth();
  const [info, setInfo] = useState(null);
  const [publicData, setPublicData] = useState(null);
  const [myRequests, setMyRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggles, setToggles] = useState({ is_available: true, share_phone: true });

  // Log Donation modal
  const [logOpen, setLogOpen] = useState(false);
  const [logForm, setLogForm] = useState({ donation_date: '', hospital_name: '', blood_type: '', units: 1, notes: '' });
  const [logSaving, setLogSaving] = useState(false);
  const [logError, setLogError] = useState('');

  const fetchDonations = () =>
    api.get('/donor/donations').then(r => setDonations(r.data.data ?? [])).catch(() => {});

  const fetchDonorInfo = () =>
    api.get('/donor/me').then(r => {
      setInfo(r.data);
      const d = r.data.donor ?? {};
      setToggles({ is_available: d.is_available ?? true, share_phone: d.share_phone ?? true });
    }).catch(() => {});

  useEffect(() => {
    Promise.all([
      api.get('/donor/me'),
      api.get('/home'),
      api.get('/donor/blood-requests'),
      api.get('/donor/donations').catch(() => ({ data: { data: [] } })),
    ]).then(([meRes, homeRes, myReqRes, donRes]) => {
      setInfo(meRes.data);
      setPublicData(homeRes.data);
      setMyRequests(myReqRes.data.data ?? []);
      setDonations(donRes.data.data ?? []);
      const d = meRes.data.donor ?? {};
      setToggles({
        is_available: d.is_available ?? true,
        share_phone: d.share_phone ?? true,
      });
    }).finally(() => setLoading(false));
  }, []);

  const handleLogDonation = async (e) => {
    e.preventDefault();
    setLogError('');
    setLogSaving(true);
    try {
      await api.post('/donor/donations', logForm);
      setLogOpen(false);
      const loggedDate = logForm.donation_date;
      setLogForm({ donation_date: '', hospital_name: '', blood_type: '', units: 1, notes: '' });
      fetchDonations();
      // Sync last_donation_date display if the logged donation is the most recent
      setInfo(prev => {
        if (!prev) return prev;
        const current = prev.donor?.last_donation_date?.split('T')[0];
        if (!current || loggedDate >= current) {
          return { ...prev, donor: { ...(prev.donor ?? {}), last_donation_date: loggedDate } };
        }
        return prev;
      });
    } catch (err) {
      const d = err.response?.data;
      setLogError(d?.errors ? Object.values(d.errors)[0][0] : 'Failed to save. Please try again.');
    } finally {
      setLogSaving(false);
    }
  };

  const handleDeleteDonation = async (id) => {
    if (!window.confirm('Delete this donation record?')) return;
    await api.delete(`/donor/donations/${id}`).catch(() => {});
    fetchDonations();
    fetchDonorInfo();
  };

  const handleToggle = async (field, value) => {
    setToggles(prev => ({ ...prev, [field]: value }));
    try {
      const donor = info?.donor ?? user;
      await api.put('/donor/profile', { ...donor, [field]: value });
    } catch {
      setToggles(prev => ({ ...prev, [field]: !value }));
    }
  };

  if (loading) {
    return (
      <Loader />
    );
  }

  const donor = info?.donor ?? user;
  const stats = publicData?.stats ?? {};
  const recentRequests = publicData?.blood_requests?.data ?? [];
  const firstName = donor?.name?.split(' ')[0] ?? 'Friend';
  const recentMyRequests = myRequests.slice(0, 3);

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ── Email verification banner ── */}
      {donor && !donor.email_verified_at && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 flex-wrap">
            <p className="text-sm text-amber-800">
              <span className="font-semibold">Verify your email</span> — Check your inbox for a verification link to secure your account.
            </p>
            <a href="/donor/verify-email" className="text-xs font-bold text-red-700 hover:underline whitespace-nowrap">
              Resend email →
            </a>
          </div>
        </div>
      )}

      {/* ── Greeting bar ── */}
      <div className="bg-white border-b border-gray-100 px-4 py-5 md:py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="hidden md:flex w-14 h-14 rounded-full bg-red-600 items-center justify-center shadow-md flex-shrink-0">
              <span className="text-white font-extrabold text-base tracking-tight">
                {donor?.blood_type ?? '—'}
              </span>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                Hello, {firstName} <span>👋</span>
              </h1>
              <p className="hidden md:block text-sm text-gray-500 mt-0.5">
                Every drop counts. Thank you for being a lifesaver!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile blood group badge */}
            <div className="md:hidden flex flex-col items-center">
              <p className="text-[10px] text-gray-400 mb-1 whitespace-nowrap">Blood Group</p>
              <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-md">
                <span className="text-white font-extrabold text-sm tracking-tight">
                  {donor?.blood_type ?? '—'}
                </span>
              </div>
            </div>

            {/* Desktop quick actions */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/find"
                className="flex items-center gap-2 border border-gray-200 text-gray-700 hover:border-red-300 hover:text-red-600 font-medium py-2 px-4 rounded-xl text-sm transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Find Donors
              </Link>
              <button
                onClick={() => { setLogForm({ donation_date: donor?.last_donation_date?.split('T')[0] ?? '', hospital_name: '', blood_type: donor?.blood_type || '', units: 1, notes: '' }); setLogError(''); setLogOpen(true); }}
                className="flex items-center gap-2 border border-green-200 text-green-700 hover:border-green-400 hover:bg-green-50 font-medium py-2 px-4 rounded-xl text-sm transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Log Last Donation
              </button>
              <Link
                to="/donor/blood-request/create"
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl text-sm transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Post Blood Request
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-5xl mx-auto px-4 py-5 md:py-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">

          {/* ── Left column ── */}
          <div className="md:col-span-2 space-y-5">

            {/* Mobile Quick Actions + Settings */}
            <div className="md:hidden space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/find"
                  className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-2.5 shadow-sm active:scale-[0.97] transition-transform"
                >
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Find Donors</p>
                    <p className="text-xs text-gray-400 mt-0.5">Search by blood type</p>
                  </div>
                </Link>

                <Link
                  to="/donor/blood-request/create"
                  className="bg-red-600 rounded-2xl p-4 flex flex-col gap-2.5 shadow-sm active:scale-[0.97] transition-transform"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">Request Blood</p>
                    <p className="text-xs text-red-200 mt-0.5">Post an urgent request</p>
                  </div>
                </Link>
              </div>

              {/* Log Last Donation — full-width quick action */}
              <button
                onClick={() => { setLogForm({ donation_date: donor?.last_donation_date?.split('T')[0] ?? '', hospital_name: '', blood_type: donor?.blood_type || '', units: 1, notes: '' }); setLogError(''); setLogOpen(true); }}
                className="w-full bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm active:scale-[0.98] transition-transform text-left"
              >
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">Log Last Donation</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Last: {donor?.last_donation_date ? formatDate(donor.last_donation_date) : 'Not set'}
                  </p>
                </div>
                <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Quick Settings inline with actions */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div
                  className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${toggles.is_available ? 'bg-green-50' : ''}`}
                  onClick={() => handleToggle('is_available', !toggles.is_available)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${toggles.is_available ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <svg className={`w-4 h-4 ${toggles.is_available ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Available to Donate</p>
                      <p className="text-xs text-gray-400">Show as available on your profile</p>
                    </div>
                  </div>
                  <Toggle checked={toggles.is_available} onChange={(v) => handleToggle('is_available', v)} />
                </div>

                <div className="h-px bg-gray-100 mx-4" />

                <div
                  className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${toggles.share_phone ? 'bg-green-50' : ''}`}
                  onClick={() => handleToggle('share_phone', !toggles.share_phone)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${toggles.share_phone ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <svg className={`w-4 h-4 ${toggles.share_phone ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Share Phone Number</p>
                      <p className="text-xs text-gray-400">Requesters can call you directly</p>
                    </div>
                  </div>
                  <Toggle checked={toggles.share_phone} onChange={(v) => handleToggle('share_phone', v)} />
                </div>
              </div>
            </div>

            {/* Overview stats */}
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-3">Overview</h2>
              <div className="grid grid-cols-3 gap-2.5">

                <div className="bg-white rounded-2xl p-3 md:p-4 shadow-sm border border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mb-2">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-2xl font-extrabold text-gray-900 leading-none">{stats.active_requests ?? 0}</p>
                  <p className="text-[11px] text-gray-500 mt-1 leading-tight">Active Requests</p>
                  <Link to="/requests" className="text-[11px] text-red-600 font-semibold mt-2 block">View all</Link>
                </div>

                <div className="bg-white rounded-2xl p-3 md:p-4 shadow-sm border border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mb-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="text-2xl font-extrabold text-gray-900 leading-none">{stats.available_donors ?? 0}</p>
                  <p className="text-[11px] text-gray-500 mt-1 leading-tight">Donors Available</p>
                  <Link to="/find" className="text-[11px] text-red-600 font-semibold mt-2 block">Find one</Link>
                </div>

                <div className="bg-white rounded-2xl p-3 md:p-4 shadow-sm border border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <p className="text-2xl font-extrabold text-gray-900 leading-none">{stats.fulfilled_requests ?? 0}</p>
                  <p className="text-[11px] text-gray-500 mt-1 leading-tight">Lives Impacted</p>
                  <Link to="/donor/history" className="text-[11px] text-red-600 font-semibold mt-2 block">History</Link>
                </div>

              </div>
            </div>

            {/* My Recent Requests */}
            {recentMyRequests.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-gray-900">My Recent Requests</h2>
                  <Link to="/donor/my-requests" className="text-xs text-red-600 font-semibold">View All</Link>
                </div>
                <div className="space-y-2.5">
                  {recentMyRequests.map(req => (
                    <Link key={req.id} to={`/requests/${req.id}`} className="block group">
                      <div className="bg-white rounded-2xl px-4 py-3.5 shadow-sm border border-gray-100 group-hover:border-red-100 transition-colors flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                          <span className="text-white font-extrabold text-[11px] leading-none">{req.blood_type}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {req.hospital_name || req.district || 'Blood Request'}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 truncate">
                            {req.district}{req.district && req.created_at ? ' · ' : ''}{timeAgo(req.created_at)}
                          </p>
                        </div>
                        <span className={`flex-shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          req.is_emergency
                            ? 'bg-red-50 text-red-600'
                            : req.status === 'fulfilled'
                            ? 'bg-green-50 text-green-600'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {req.is_emergency ? 'Urgent' : req.status === 'fulfilled' ? 'Fulfilled' : 'Active'}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Donation History */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-base font-bold text-gray-900">Donation History</h2>
                  <Link to="/donor/history" className="text-xs text-red-600 font-semibold">View All</Link>
                </div>
                <button
                  onClick={() => {
                    setLogForm({ donation_date: '', hospital_name: '', blood_type: donor?.blood_type || '', units: 1, notes: '' });
                    setLogError('');
                    setLogOpen(true);
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-full transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Log Donation
                </button>
              </div>

              {donations.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">No donations recorded yet</p>
                  <p className="text-xs text-gray-400">Log your blood donations to track your impact.</p>
                </div>
              ) : (
                <div>
                  {donations.slice(0, 5).map((don, i) => (
                    <div key={don.id} className={`flex items-center gap-3 py-3 ${i < Math.min(donations.length, 5) - 1 ? 'border-b border-gray-50' : ''}`}>
                      <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-white font-extrabold text-[11px] leading-none">{don.blood_type || donor?.blood_type || '—'}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{don.hospital_name || 'Donation'}</p>
                        <p className="text-xs text-gray-400">{don.units} unit{don.units !== 1 ? 's' : ''} · {formatDate(don.donation_date)}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteDonation(don.id)}
                        className="flex-shrink-0 p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  {donations.length > 5 && (
                    <Link to="/donor/history" className="block text-center text-xs text-red-600 font-semibold pt-2">
                      +{donations.length - 5} more — View all
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Recent Blood Requests (public) */}
            {recentRequests.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-gray-900">Recent Blood Requests</h2>
                  <Link to="/requests" className="text-xs text-red-600 font-semibold">View All</Link>
                </div>
                <div className="space-y-3">
                  {recentRequests.slice(0, 5).map(req => (
                    <Link key={req.id} to={`/requests/${req.id}`} className="block group">
                      <div className="bg-white rounded-2xl px-4 py-3.5 shadow-sm border border-gray-100 group-hover:border-red-100 transition-colors flex items-center gap-3">
                        <div className="flex-shrink-0 flex flex-col items-center w-12">
                          <div className="w-11 h-11 rounded-full bg-red-600 flex items-center justify-center shadow-sm">
                            <span className="text-white font-extrabold text-xs leading-none">{req.blood_type}</span>
                          </div>
                          <span className={`text-[9px] font-bold mt-1 ${req.is_emergency ? 'text-red-500' : 'text-gray-400'}`}>
                            {req.is_emergency ? 'Urgent' : 'Normal'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm leading-snug truncate">
                            {req.hospital_name ?? req.district}
                          </p>
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="truncate">{req.district}</span>
                          </p>
                        </div>
                        <div className="flex-shrink-0 text-[10px] text-gray-400 whitespace-nowrap">
                          {timeAgo(req.created_at)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* ── Right sidebar ── */}
          <div className="space-y-4 mt-5 md:mt-0">

            {/* Quick Settings — desktop sidebar only; mobile shows inline with actions */}
            <div className="hidden md:block bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm mb-3">Quick Settings</h3>
              <div className="space-y-0">

                <div
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${toggles.is_available ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                  onClick={() => handleToggle('is_available', !toggles.is_available)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${toggles.is_available ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <svg className={`w-4 h-4 ${toggles.is_available ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">Available to Donate</p>
                      <p className="text-xs text-gray-400 leading-snug">Show as available on your profile</p>
                    </div>
                  </div>
                  <Toggle checked={toggles.is_available} onChange={(v) => handleToggle('is_available', v)} />
                </div>

                <div className="h-px bg-gray-100 mx-3" />

                <div
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${toggles.share_phone ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                  onClick={() => handleToggle('share_phone', !toggles.share_phone)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${toggles.share_phone ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <svg className={`w-4 h-4 ${toggles.share_phone ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">Share Phone Number</p>
                      <p className="text-xs text-gray-400 leading-snug">Requesters can call you directly</p>
                    </div>
                  </div>
                  <Toggle checked={toggles.share_phone} onChange={(v) => handleToggle('share_phone', v)} />
                </div>

              </div>
            </div>

            {/* My Requests quick card */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm mb-3">My Requests</h3>
              <div className="space-y-2">
                <Link
                  to="/donor/my-requests"
                  className="flex items-center justify-between text-sm text-gray-600 hover:text-red-600 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    View all my requests
                  </span>
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  to="/donor/blood-request/create"
                  className="flex items-center justify-between text-sm text-gray-600 hover:text-red-600 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Post a new request
                  </span>
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  to="/find"
                  className="flex items-center justify-between text-sm text-gray-600 hover:text-red-600 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Find donors
                  </span>
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Become a Hero */}
            <div className="bg-red-600 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white opacity-5 rounded-full pointer-events-none" />
              <div className="absolute -right-1 -top-6 w-16 h-16 bg-white opacity-5 rounded-full pointer-events-none" />
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-base leading-snug">Become a Hero</h3>
                <p className="text-red-100 text-xs mt-1 leading-relaxed">
                  Invite your friends to join and save more lives.
                </p>
                <button
                  className="mt-3 bg-white text-red-600 font-semibold text-sm py-2 px-4 rounded-xl shadow-sm flex items-center gap-2 hover:bg-red-50 transition-colors"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: 'JnU RedDrop', text: 'Join JnU RedDrop and help save lives!', url: window.location.origin });
                    }
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share Invite
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── LOG DONATION MODAL ── */}
      {logOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Log a Donation</h2>
              <p className="text-sm text-gray-500 mt-1">Record when you donated blood.</p>
            </div>

            <form onSubmit={handleLogDonation} className="p-5 space-y-4">
              {logError && (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">{logError}</div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Donation Date<span className="text-red-500 ml-0.5">*</span></label>
                <input
                  type="date"
                  required
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-sm"
                  value={logForm.donation_date}
                  onChange={e => setLogForm(f => ({ ...f, donation_date: e.target.value }))}
                />
                <p className="text-xs text-gray-400 mt-1.5">This also updates your last donation date and availability.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hospital / Location</label>
                <input
                  type="text"
                  placeholder="e.g. Dhaka Medical College Hospital"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-sm"
                  value={logForm.hospital_name}
                  onChange={e => setLogForm(f => ({ ...f, hospital_name: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Blood Type</label>
                  <select
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-sm appearance-none"
                    value={logForm.blood_type}
                    onChange={e => setLogForm(f => ({ ...f, blood_type: e.target.value }))}
                  >
                    <option value="">Select</option>
                    {BLOOD_TYPES.map(bt => <option key={bt} value={bt}>{bt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Units</label>
                  <select
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-sm appearance-none"
                    value={logForm.units}
                    onChange={e => setLogForm(f => ({ ...f, units: parseInt(e.target.value) }))}
                  >
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Notes</label>
                <textarea
                  rows={2}
                  placeholder="Any notes about this donation..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-sm resize-none"
                  value={logForm.notes}
                  onChange={e => setLogForm(f => ({ ...f, notes: e.target.value }))}
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setLogOpen(false)} className="flex-1 bg-white border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={logSaving} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl text-sm disabled:opacity-70 transition-colors">
                  {logSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
