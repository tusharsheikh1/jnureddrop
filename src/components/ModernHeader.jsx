import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export default function ModernHeader({ title, rightNode }) {
  const navigate = useNavigate();
  const { isDonor } = useAuth();
  const { unreadCount } = useNotifications();

  const notifBell = (
    <Link
      to="/notifications"
      className="relative w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      {unreadCount > 0 && (
        <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );

  return (
    <div className="sticky top-0 z-40 bg-[#FDFDFD] pt-4 pb-2 px-4 flex items-center justify-between border-b border-gray-100 md:hidden">
      <button
        onClick={() => {
          if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
          } else {
            navigate('/');
          }
        }}
        className="w-10 h-10 flex items-center justify-center text-gray-800 -ml-2 transition-colors hover:bg-gray-100 rounded-full"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>
      <h1 className="text-lg font-bold text-gray-900 absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
        {title}
      </h1>
      <div className="w-10 h-10 flex items-center justify-end">
        {rightNode !== undefined ? rightNode : isDonor ? notifBell : null}
      </div>
    </div>
  );
}
