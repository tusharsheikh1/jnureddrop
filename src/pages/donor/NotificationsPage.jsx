import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import ModernHeader from '../../components/ModernHeader';
import api from '../../api/axios';

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const SYSTEM_UPDATES = [
  {
    id: 's1',
    icon: '🩸',
    title: 'Welcome to JnU RedDrop',
    body: 'Thank you for joining. Keep your profile updated so donors can reach you when needed.',
    time: 'Account',
    action: null,
  },
  {
    id: 's2',
    icon: '📋',
    title: 'Post a Blood Request',
    body: 'If you or someone you know needs blood, post a request and our community will help.',
    time: 'Tip',
    action: { label: 'Post Request', to: '/donor/blood-request/create' },
  },
  {
    id: 's3',
    icon: '✅',
    title: 'Keep availability updated',
    body: 'Mark yourself as available so people in need can contact you quickly.',
    time: 'Reminder',
    action: { label: 'Update Profile', to: '/donor/profile' },
  },
];

export default function NotificationsPage() {
  const { user } = useAuth();
  const { markAllRead, unreadCount } = useNotifications();
  const [tab, setTab] = useState('alerts');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [justRead, setJustRead] = useState(false);

  const fetchNotifications = useCallback(() => {
    api.get('/donor/notifications')
      .then(res => setNotifications(res.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const t = setTimeout(() => {
      markAllRead();
      setJustRead(true);
    }, 1500);
    return () => clearTimeout(t);
  }, [markAllRead]);

  const activeNotifs = notifications.filter(n => n.blood_request?.status === 'active');
  const emergencyNotifs = activeNotifs.filter(n => n.blood_request?.is_emergency);
  const normalNotifs = activeNotifs.filter(n => !n.blood_request?.is_emergency);
  const hasUnread = unreadCount > 0 && !justRead;

  return (
    <div className="min-h-screen bg-[#F5F5F7] font-sans">
      <ModernHeader
        title="Notifications"
        rightNode={
          hasUnread ? (
            <button
              onClick={() => { markAllRead(); setJustRead(true); }}
              className="text-xs font-semibold text-red-600"
            >
              Mark read
            </button>
          ) : null
        }
      />

      {/* Desktop header */}
      <div className="hidden md:block max-w-4xl mx-auto px-8 pt-8 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Blood alerts compatible with{' '}
              <span className="font-semibold text-red-600">{user?.blood_type || 'your blood type'}</span>
            </p>
          </div>
          {hasUnread && (
            <button
              onClick={() => { markAllRead(); setJustRead(true); }}
              className="text-sm font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-4 pb-6 md:max-w-4xl md:px-8 md:pb-10">

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setTab('alerts')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
              tab === 'alerts'
                ? 'bg-red-600 text-white border-red-600 shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'
            }`}
          >
            Alerts
            {activeNotifs.length > 0 && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                tab === 'alerts'
                  ? 'bg-white/20 text-white'
                  : 'bg-red-100 text-red-600'
              }`}>
                {activeNotifs.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab('updates')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
              tab === 'updates'
                ? 'bg-red-600 text-white border-red-600 shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'
            }`}
          >
            Updates
          </button>
        </div>

        {tab === 'alerts' && (
          <div className="space-y-4">
            {/* Blood type info banner */}
            {user?.blood_type && (
              <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
                <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-white font-extrabold text-[11px]">{user.blood_type}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">
                    Showing alerts for <span className="text-red-600">{user.blood_type}</span> donors
                  </p>
                  <p className="text-xs text-gray-400">Requests that need your blood type</p>
                </div>
                {hasUnread && (
                  <span className="flex-shrink-0 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto" />
              </div>
            )}

            {/* Emergency section */}
            {!loading && emergencyNotifs.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2 px-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                  </span>
                  <h3 className="text-xs font-bold text-red-500 uppercase tracking-wider">Emergency</h3>
                </div>
                <div className="space-y-2">
                  {emergencyNotifs.map(notif => (
                    <NotificationCard
                      key={notif.id}
                      req={notif.blood_request}
                      isEmergency
                      fresh={!notif.read_at && !justRead}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Normal section */}
            {!loading && normalNotifs.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
                  {emergencyNotifs.length > 0 ? 'Other Requests' : 'Blood Requests'}
                </h3>
                <div className="space-y-2">
                  {normalNotifs.map(notif => (
                    <NotificationCard
                      key={notif.id}
                      req={notif.blood_request}
                      fresh={!notif.read_at && !justRead}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty */}
            {!loading && activeNotifs.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <p className="font-semibold text-gray-700 mb-1">No alerts right now</p>
                <p className="text-sm text-gray-400 max-w-xs mx-auto">
                  {user?.blood_type
                    ? `No active requests need ${user.blood_type} blood right now.`
                    : 'Set your blood type in your profile to see alerts.'}
                </p>
                {!user?.blood_type && (
                  <Link
                    to="/donor/profile/edit"
                    className="mt-4 inline-block bg-red-600 text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-red-700 transition-colors"
                  >
                    Update Profile
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        {tab === 'updates' && (
          <div className="space-y-3">
            {SYSTEM_UPDATES.map(note => (
              <SystemNote key={note.id} {...note} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NotificationCard({ req, isEmergency, fresh }) {
  if (!req) return null;
  const location = [req.hospital_name, req.district].filter(Boolean).join(' · ');

  return (
    <Link to={`/requests/${req.id}`} className="block group">
      <div className={`relative bg-white rounded-2xl p-4 border transition-all group-hover:shadow-md ${
        fresh
          ? 'border-gray-200 shadow-sm'
          : 'border-gray-100'
      }`}>
        {fresh && (
          <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
        )}

        <div className="flex items-center gap-3 pr-5">
          <div className={`relative w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${
            isEmergency ? 'bg-red-600' : 'bg-red-500'
          }`}>
            <span className="text-white font-extrabold text-xs leading-none">{req.blood_type}</span>
            {isEmergency && fresh && (
              <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              {isEmergency && (
                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded uppercase tracking-wide">
                  Urgent
                </span>
              )}
              <p className={`text-sm font-semibold truncate ${fresh ? 'text-gray-900' : 'text-gray-700'}`}>
                {req.blood_type} blood needed
              </p>
            </div>
            {location && (
              <p className="text-xs text-gray-400 truncate">{location}</p>
            )}
          </div>

          <span className="flex-shrink-0 text-[10px] text-gray-400 whitespace-nowrap">{timeAgo(req.created_at)}</span>
        </div>
      </div>
    </Link>
  );
}

function SystemNote({ icon, title, body, time, action }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
      <div className="flex gap-3 items-start">
        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 text-lg">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm">{title}</p>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{body}</p>
          {action && (
            <Link
              to={action.to}
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700"
            >
              {action.label}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
        <span className="flex-shrink-0 text-[10px] text-gray-400 whitespace-nowrap">{time}</span>
      </div>
    </div>
  );
}
