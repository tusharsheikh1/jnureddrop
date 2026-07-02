import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import ModernHeader from '../../components/ModernHeader';
import Loader from '../../components/Loader';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

function formatDate(str) {
  if (!str) return '—';
  return new Date(str).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function DonationHistoryPage() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [logOpen, setLogOpen] = useState(false);
  const [logForm, setLogForm] = useState({ donation_date: '', hospital_name: '', blood_type: '', units: 1, notes: '' });
  const [logSaving, setLogSaving] = useState(false);
  const [logError, setLogError] = useState('');

  const load = useCallback(() => {
    api.get('/donor/donations')
      .then(r => setDonations(r.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const totalUnits = donations.reduce((sum, d) => sum + (d.units || 1), 0);
  const lastDonation = donations[0] ?? null; // already sorted desc by date

  const openLog = () => {
    setLogForm({ donation_date: '', hospital_name: '', blood_type: user?.blood_type || '', units: 1, notes: '' });
    setLogError('');
    setLogOpen(true);
  };

  const handleLog = async (e) => {
    e.preventDefault();
    setLogError('');
    setLogSaving(true);
    try {
      await api.post('/donor/donations', logForm);
      setLogOpen(false);
      load();
    } catch (err) {
      const d = err.response?.data;
      setLogError(d?.errors ? Object.values(d.errors)[0][0] : 'Failed to save. Please try again.');
    } finally {
      setLogSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this donation record?')) return;
    await api.delete(`/donor/donations/${id}`).catch(() => {});
    load();
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans">
      <ModernHeader title="Donation History" />

      <div className="max-w-2xl mx-auto px-4 py-5 md:max-w-4xl md:px-8 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl font-extrabold text-gray-900">{donations.length}</p>
            <p className="text-[11px] text-gray-500 mt-1">Total Donations</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl font-extrabold text-red-600">{totalUnits}</p>
            <p className="text-[11px] text-gray-500 mt-1">Units Donated</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-sm font-extrabold text-gray-900 leading-tight">{lastDonation ? formatDate(lastDonation.donation_date) : '—'}</p>
            <p className="text-[11px] text-gray-500 mt-1">Last Donation</p>
          </div>
        </div>

        {/* Section header */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">My Donation Records</h2>
          <button
            onClick={openLog}
            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-full transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Log Donation
          </button>
        </div>

        {/* List */}
        {donations.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium mb-1">No donations recorded yet</p>
            <p className="text-xs text-gray-400 mb-4">Log your blood donations to track your contribution.</p>
            <button
              onClick={openLog}
              className="inline-block bg-red-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-red-700 transition-colors"
            >
              Log First Donation
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {donations.map(don => (
              <div key={don.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-sm">
                    <span className="text-white font-extrabold text-xs leading-none">
                      {don.blood_type || user?.blood_type || '—'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {don.hospital_name || 'Donation'}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {don.units} unit{don.units !== 1 ? 's' : ''} · {formatDate(don.donation_date)}
                    </p>
                    {don.notes && (
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{don.notes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(don.id)}
                    className="flex-shrink-0 p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log Donation Modal */}
      {logOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Log a Donation</h2>
              <p className="text-sm text-gray-500 mt-1">Record when you donated blood.</p>
            </div>
            <form onSubmit={handleLog} className="p-5 space-y-4">
              {logError && (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">{logError}</div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Donation Date<span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  type="date" required
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-sm"
                  value={logForm.donation_date}
                  onChange={e => setLogForm(f => ({ ...f, donation_date: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hospital / Location</label>
                <input
                  type="text" placeholder="e.g. Dhaka Medical College Hospital"
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
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Notes</label>
                <textarea
                  rows={2} placeholder="Any notes about this donation..."
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
