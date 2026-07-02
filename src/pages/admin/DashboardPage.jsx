import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import api from '../../api/axios';
import Loader from '../../components/Loader';

const STAT_CARDS = (stats) => [
  {
    label: 'Total Donors',
    value: stats.total_donors,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    valueCls: 'text-blue-700',
    link: '/admin/donors',
  },
  {
    label: 'Available Donors',
    value: stats.available_donors,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    valueCls: 'text-green-700',
    link: '/admin/donors',
  },
  {
    label: 'Total Requests',
    value: stats.total_requests,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    valueCls: 'text-purple-700',
    link: '/admin/blood-requests',
  },
  {
    label: 'Active Requests',
    value: stats.active_requests,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    valueCls: 'text-red-700',
    link: '/admin/blood-requests',
  },
];

export default function AdminDashboardPage() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then(r => setStats(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout><Loader fullPage={false} /></AdminLayout>;

  const cards = STAT_CARDS(stats);
  const maxCount = Math.max(...(stats.by_blood_type?.map(r => r.count) ?? [1]));

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Overview of JnU RedDrop activity</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {cards.map(c => (
          <Link key={c.label} to={c.link} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-red-100 hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${c.iconBg} flex items-center justify-center`}>
                <span className={c.iconColor}>{c.icon}</span>
              </div>
              <svg className="w-4 h-4 text-gray-300 group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className={`text-3xl font-extrabold ${c.valueCls}`}>{c.value ?? 0}</p>
            <p className="text-sm text-gray-500 mt-1 font-medium">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By blood type */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
            </svg>
            Donors by Blood Type
          </h2>
          <div className="space-y-3">
            {stats.by_blood_type?.map(row => (
              <div key={row.blood_type} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-white font-bold text-xs leading-none">{row.blood_type}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-600">{row.count} donors</span>
                    <span className="text-xs text-gray-400">{Math.round((row.count / (stats.total_donors || 1)) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(4, (row.count / maxCount) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent donors */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-bold text-gray-900">Recent Donors</h2>
            <Link
              to="/admin/donors"
              className="text-red-600 text-sm font-semibold hover:underline flex items-center gap-1"
            >
              View all
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recent_donors?.slice(0, 7).map(d => (
              <div key={d.id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-white font-bold text-[10px] leading-none">{d.blood_type}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{d.name}</p>
                  {d.district && <p className="text-xs text-gray-400 truncate">{d.district}</p>}
                </div>
                <span className={`flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  d.is_available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {d.is_available ? 'Available' : 'Unavailable'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { to: '/admin/donors', label: 'Manage Donors', desc: 'View, search and delete donor accounts', color: 'blue' },
          { to: '/admin/blood-requests', label: 'Blood Requests', desc: 'Monitor and manage active requests', color: 'red' },
          { to: '/admin/blog', label: 'Blog Posts', desc: 'Create and publish blog content', color: 'purple' },
        ].map(q => (
          <Link
            key={q.to}
            to={q.to}
            className={`bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:border-${q.color}-200 hover:shadow-md transition-all group`}
          >
            <p className="font-bold text-gray-900 group-hover:text-red-600 transition-colors">{q.label}</p>
            <p className="text-sm text-gray-400 mt-1 leading-snug">{q.desc}</p>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}
