import ModernHeader from '../../components/ModernHeader';
import Loader from '../../components/Loader';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const STATUS_COLORS = {
  active:    'bg-green-100 text-green-700',
  fulfilled: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-gray-100 text-gray-600',
};

export default function DonorMyRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);

  const load = () => {
    api.get('/donor/blood-requests').then(r => setRequests(r.data.data ?? [])).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/donor/blood-requests/${id}/status`, { status });
    load();
  };

  const deleteRequest = async (id) => {
    if (!window.confirm('Delete this request?')) return;
    await api.delete(`/donor/blood-requests/${id}`);
    setRequests(r => r.filter(req => req.id !== id));
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans">
      <ModernHeader title="My Requests" />
      <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Blood Requests</h1>
        <Link to="/donor/blood-request/create" className="btn-primary text-sm">+ New Request</Link>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="mb-4">You haven't posted any blood requests yet.</p>
          <Link to="/donor/blood-request/create" className="btn-primary">Post a Request</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(req => (
            <div key={req.id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xl font-bold text-red-600">{req.blood_type}</span>
                    <span className="font-semibold text-gray-800">{req.patient_name}</span>
                    {req.is_emergency && <span className="badge bg-red-100 text-red-700">🚨 Emergency</span>}
                  </div>
                  <p className="text-sm text-gray-500">{req.hospital_name} · {req.upazila}, {req.district}</p>
                  <p className="text-sm text-gray-500">Units: {req.blood_quantity} · Contact: {req.contact_number}</p>
                  {req.needed_date && (
                    <p className="text-sm text-gray-400">Needed by: {new Date(req.needed_date).toLocaleDateString()}</p>
                  )}
                </div>
                <span className={`badge ml-4 ${STATUS_COLORS[req.status] ?? ''}`}>{req.status}</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {req.status === 'active' && (
                  <>
                    <button onClick={() => updateStatus(req.id, 'fulfilled')} className="btn-secondary text-xs py-1 px-3">
                      Mark Fulfilled
                    </button>
                    <button onClick={() => updateStatus(req.id, 'cancelled')} className="btn-secondary text-xs py-1 px-3">
                      Cancel
                    </button>
                  </>
                )}
                {req.status === 'cancelled' && (
                  <button onClick={() => updateStatus(req.id, 'active')} className="btn-secondary text-xs py-1 px-3">
                    Reactivate
                  </button>
                )}
                <button onClick={() => deleteRequest(req.id)} className="text-xs py-1 px-3 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
