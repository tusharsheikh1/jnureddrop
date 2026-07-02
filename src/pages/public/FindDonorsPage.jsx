import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import ModernHeader from '../../components/ModernHeader';
import SEO from '../../components/SEO';

/* ─────────────────────────────────────────
   Constants
───────────────────────────────────────── */
const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
function timeAgo(dateStr) {
  if (!dateStr) return null;
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  const days = Math.floor(diff / 86400);
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  return `${Math.floor(months / 12)} year${Math.floor(months / 12) > 1 ? 's' : ''} ago`;
}

function canDonate(lastDonationDate) {
  if (!lastDonationDate) return true;
  const daysSince = (Date.now() - new Date(lastDonationDate)) / (1000 * 60 * 60 * 24);
  return daysSince >= 120;
}

function getInitials(name) {
  return (name || '').split(' ').slice(0, 2).map(n => n[0] || '').join('').toUpperCase() || '?';
}

/* ─────────────────────────────────────────
   PhoneIcon
───────────────────────────────────────── */
function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
    </svg>
  );
}

/* ─────────────────────────────────────────
   ChatIcon
───────────────────────────────────────── */
function ChatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
    </svg>
  );
}

/* ─────────────────────────────────────────
   LocationIcon
───────────────────────────────────────── */
function LocationIcon({ size = 14, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  );
}

/* ─────────────────────────────────────────
   ClockIcon
───────────────────────────────────────── */
function ClockIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

/* ─────────────────────────────────────────
   Verified checkmark badge
───────────────────────────────────────── */
function VerifiedBadge() {
  return (
    <span className="absolute bottom-0 left-0 w-5 h-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center shadow-sm">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </span>
  );
}

/* ─────────────────────────────────────────
   SearchableSelect
   Dropdown rendered via portal – escapes overflow:hidden
───────────────────────────────────────── */
function SearchableSelect({ value, onChange, options = [], placeholder = 'All', label, icon, disabled = false }) {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState('');
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef(null);
  const searchRef  = useRef(null);

  const filtered = query.trim()
    ? options.filter(o => o.toLowerCase().includes(query.toLowerCase()))
    : options;

  /* Compute dropdown position from trigger rect */
  const openDropdown = () => {
    if (disabled) return;
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      let left = rect.left + window.scrollX;
      let width = Math.max(rect.width, 180);
      if (rect.left + width > window.innerWidth) {
        left = window.innerWidth - width - 16 + window.scrollX;
      }
      setDropPos({
        top:   rect.bottom + window.scrollY + 6,
        left:  left,
        width: rect.width,
      });
    }
    setOpen(o => !o);
  };

  /* Reposition on scroll/resize while open */
  useEffect(() => {
    if (!open) return;
    const update = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        let left = rect.left + window.scrollX;
        let width = Math.max(rect.width, 180);
        if (rect.left + width > window.innerWidth) {
          left = window.innerWidth - width - 16 + window.scrollX;
        }
        setDropPos({
          top:   rect.bottom + window.scrollY + 6,
          left:  left,
          width: rect.width,
        });
      }
    };
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open]);

  /* Close on outside click */
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        !document.getElementById('searchable-select-portal')?.contains(e.target)
      ) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  /* Focus search on open */
  useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus();
  }, [open]);

  const select = (opt) => { onChange(opt); setOpen(false); setQuery(''); };
  const clear  = (e)   => { e.stopPropagation(); onChange(''); setQuery(''); };

  /* Portal element — shared singleton */
  const portalRoot = document.body;

  const dropdownPanel = (
    <div
      id="searchable-select-portal"
      style={{
        position: 'absolute',
        top:      dropPos.top,
        left:     dropPos.left,
        width:    dropPos.width,
        zIndex:   9999,
        minWidth: 180,
      }}
      className="bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden"
    >
      {/* Search */}
      <div className="p-2 border-b border-gray-100">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5">
          <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search…"
            className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none min-w-0"
          />
          {query && (
            <button type="button" onMouseDown={e => { e.preventDefault(); setQuery(''); }} className="text-gray-400 hover:text-gray-600">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <ul className="max-h-52 overflow-y-auto py-1">
        <li>
          <button
            type="button"
            onMouseDown={e => { e.preventDefault(); select(''); }}
            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
              !value ? 'bg-red-50 text-red-600 font-semibold' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {placeholder}
          </button>
        </li>
        {filtered.length === 0 ? (
          <li className="px-4 py-3 text-sm text-gray-400 text-center">No results found</li>
        ) : (
          filtered.map(opt => (
            <li key={opt}>
              <button
                type="button"
                onMouseDown={e => { e.preventDefault(); select(opt); }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  value === opt ? 'bg-red-50 text-red-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {query.trim() ? <HighlightText text={opt} query={query} /> : opt}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );

  return (
    <div className="relative">
      {label && <p className="text-xs font-semibold text-gray-500 mb-1.5">{label}</p>}

      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={openDropdown}
        className={`w-full flex items-center gap-2 px-3 py-2 text-sm border rounded-xl transition-all duration-150 bg-white
          ${ open  ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200 hover:border-gray-300' }
          ${ disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer' }`}
      >
        {icon && <span className="text-gray-400 flex-shrink-0">{icon}</span>}
        <span className={`flex-1 truncate text-left ${ value ? 'text-gray-900 font-medium' : 'text-gray-400' }`}>
          {value || placeholder}
        </span>
        {value ? (
          <span onClick={clear} className="flex-shrink-0 text-gray-400 hover:text-red-500 p-0.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </span>
        ) : (
          <span className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </span>
        )}
      </button>

      {/* Portal-rendered dropdown */}
      {open && createPortal(dropdownPanel, portalRoot)}
    </div>
  );
}

/* Highlight matching query inside option text */
function HighlightText({ text, query }) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <mark className="bg-red-100 text-red-700 rounded px-0.5 font-semibold not-italic">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </span>
  );
}

/* ─────────────────────────────────────────
   Donor Card  — matches reference exactly
───────────────────────────────────────── */
function DonorCard({ donor }) {
  const { isLoggedIn, user } = useAuth();
  const isProfileComplete = isLoggedIn && user && user.name && user.blood_type && user.district && user.phone;
  const eligible = canDonate(donor.last_donation_date);
  const ago = timeAgo(donor.last_donation_date);
  const location = [donor.upazila, donor.district].filter(Boolean).join(', ');

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-3">

      {/* ── Col 1 & 2 Wrapped in Link ── */}
      <Link to={`/donors/${donor.id}`} className="flex flex-1 gap-3 min-w-0 group cursor-pointer">
        {/* ── Col 1: Avatar ── */}
        <div className="flex-shrink-0 relative self-start mt-1">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg font-bold overflow-hidden select-none group-hover:ring-2 group-hover:ring-red-200 transition-all">
            {donor.photo_url ? (
              <img src={donor.photo_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              getInitials(donor.name)
            )}
          </div>
          <VerifiedBadge />
        </div>

        {/* ── Col 2: Info ── */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-gray-900 text-base leading-tight group-hover:text-red-600 transition-colors">
              {donor.name}
            </span>
            <span className="flex-shrink-0 bg-red-100 text-red-600 text-[11px] font-bold px-2 py-0.5 rounded-md leading-tight">
              {donor.blood_type}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            Registered Donor
          </p>
          {location && (
            <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
              <LocationIcon size={13} className="text-gray-400 flex-shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          )}
          {ago ? (
            <div className="flex items-center gap-1 text-xs mt-1">
              <ClockIcon size={13} className="flex-shrink-0" />
              <span className="text-gray-500">Last donated </span>
              <span className="text-green-600 font-medium">{ago}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-xs mt-1 text-blue-500">
              <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20" className="flex-shrink-0">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <span>First time donor</span>
            </div>
          )}
        </div>
      </Link>

      {/* ── Col 3: Vertical actions (right side) ── */}
      <div className="flex-shrink-0 flex flex-col items-stretch gap-2" style={{ minWidth: '90px' }}>

        {/* Available / Waiting badge — top */}
        {eligible ? (
          <span className="inline-flex items-center justify-center gap-1 border border-green-400 text-green-600 text-[11px] font-semibold px-2 py-0.5 rounded-lg whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Available
          </span>
        ) : (
          <span className="inline-flex items-center justify-center gap-1 border border-amber-400 text-amber-600 text-[11px] font-semibold px-2 py-0.5 rounded-lg whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
            Waiting
          </span>
        )}

        {isLoggedIn ? (
          isProfileComplete ? (
            <>
              {/* Call — outlined */}
              {donor.share_phone && donor.phone ? (
                <a
                  href={`tel:${donor.phone}`}
                  className="inline-flex items-center justify-center gap-1.5 border border-red-500 text-red-600 bg-white hover:bg-red-50 font-semibold text-sm py-1.5 rounded-xl transition-colors duration-150"
                >
                  <PhoneIcon />
                  Call
                </a>
              ) : (
                <a
                  href={`mailto:${donor.email}`}
                  className="inline-flex items-center justify-center gap-1.5 border border-red-500 text-red-600 bg-white hover:bg-red-50 font-semibold text-sm py-1.5 rounded-xl transition-colors duration-150"
                >
                  <PhoneIcon />
                  Email
                </a>
              )}

              {/* Message — filled red */}
              <a
                href={
                  donor.share_phone && donor.phone
                    ? `https://wa.me/${donor.phone.replace(/\D/g, '')}`
                    : `mailto:${donor.email}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm py-1.5 rounded-xl transition-colors duration-150"
              >
                <ChatIcon />
                Message
              </a>
            </>
          ) : (
            <Link
              to="/donor/profile/edit"
              className="inline-flex flex-col items-center justify-center bg-gray-50 border border-gray-200 text-gray-500 font-semibold text-[10px] py-2 rounded-xl transition-colors duration-150 text-center px-1 h-full"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mb-1"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              Complete
              <br/>Profile
            </Link>
          )
        ) : (
          <Link
            to="/donor/login"
            className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-semibold text-xs py-2 rounded-xl transition-colors duration-150 text-center"
          >
            Sign in
          </Link>
        )}
      </div>

    </div>
  );
}


/* ─────────────────────────────────────────
   Skeleton Card
───────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-3 animate-pulse">
      <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-2/5" />
        <div className="flex gap-2 pt-1">
          <div className="flex-1 h-9 bg-gray-100 rounded-xl" />
          <div className="flex-1 h-9 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Empty State
───────────────────────────────────────── */
function EmptyState({ hasFilters, onClear }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <svg className="w-10 h-10 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-1">No Donors Found</h3>
      <p className="text-gray-500 text-sm max-w-xs mb-5">
        {hasFilters
          ? 'No donors match your filters. Try adjusting your search.'
          : 'No donors are currently registered.'}
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        {hasFilters && (
          <button onClick={onClear} className="btn-secondary text-sm">Clear Filters</button>
        )}
        <Link to="/donor/register" className="btn-primary text-sm">Register as Donor</Link>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Page
───────────────────────────────────────── */
export default function FindDonorsPage() {
  const { isDonor } = useAuth();
  const { unreadCount } = useNotifications() ?? { unreadCount: 0 };

  const [donors, setDonors]       = useState([]);
  const [meta, setMeta]           = useState(null);
  const [allDistricts, setAllDistricts] = useState([]);
  const [upazilas, setUpazilas]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing]   = useState(false);

  const [filters, setFilters] = useState({
    blood_type: '', district: '', upazila: '', page: 1,
  });

  const hasFilters = !!(filters.blood_type || filters.district || filters.upazila);

  /* ── fetch ── */
  const fetchDonors = async (f = filters, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(f).filter(([, v]) => v !== ''));
      const { data } = await api.get('/donors', { params });
      setDonors(prev => append ? [...prev, ...data.donors.data] : data.donors.data);
      setMeta(data.donors);
    } finally {
      append ? setLoadingMore(false) : setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
    api.get('/locations/districts')
      .then(({ data }) => setAllDistricts([...data].sort()))
      .catch(() => {});
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDonors({ ...filters, page: 1 });
    setRefreshing(false);
  };

  /* ── location cascades ── */
  const onDistrictChange = async (district) => {
    const next = { ...filters, district, upazila: '', page: 1 };
    setFilters(next);
    setUpazilas([]);
    if (district) {
      const { data } = await api.get(`/locations/upazilas/${district}`);
      setUpazilas(data);
    }
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    const next = { ...filters, page: 1 };
    setFilters(next);
    fetchDonors(next);
  };

  const handleClear = () => {
    const next = { blood_type: '', district: '', upazila: '', page: 1 };
    setFilters(next);
    setUpazilas([]);
    fetchDonors(next);
  };

  const handleLoadMore = () => {
    const next = { ...filters, page: (meta?.current_page ?? 1) + 1 };
    setFilters(next);
    fetchDonors(next, true);
  };

  /* ────────────────────────────────────────
     Render
  ──────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Find Blood Donors"
        description="Search for verified A+, B+, O+, AB+ blood donors near Jagannath University. Filter by blood group, district, and availability — free and instant."
        url="/find"
      />

      <ModernHeader title="Find Donors" />

      {/* ══ DESKTOP PAGE TITLE ══ */}
      <div className="hidden md:block bg-white border-b border-gray-100 py-6">
        <div className="max-w-6xl mx-auto px-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Find Blood Donors</h1>
            <p className="text-sm text-gray-500 mt-1">Search for verified donors at Jagannath University</p>
          </div>
          {isDonor && (
            <Link
              to="/notifications"
              className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
              aria-label="Notifications"
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

      <div className="max-w-2xl mx-auto px-4 py-5 md:max-w-6xl md:px-8 md:py-8">

        {/* ══ DESKTOP: 2-COL LAYOUT ══ */}
        <div className="md:flex md:gap-8 md:items-start">

        {/* Left column: filters (sidebar on desktop) */}
        <div className="md:w-80 md:flex-shrink-0 md:sticky md:top-20">

        {/* ══ FILTER CARD ══ */}
        <form onSubmit={handleSearch} className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-3">

          {/* Row 1: Blood Group + District */}
          <div className="grid grid-cols-2 divide-x divide-gray-100 px-4 pt-4 pb-3 gap-3">
            {/* Blood Group */}
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1.5">Blood Group</p>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 8.48 2 14a10 10 0 0020 0C22 8.48 17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-4.41 4.48-9 8-13 3.52 4 8 8.59 8 13 0 4.41-3.59 8-8 8z"/>
                  </svg>
                </span>
                <select
                  className="w-full pl-7 pr-2 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300 appearance-none bg-white"
                  value={filters.blood_type}
                  onChange={e => setFilters(f => ({ ...f, blood_type: e.target.value }))}
                >
                  <option value="">All Types</option>
                  {BLOOD_TYPES.map(bt => <option key={bt} value={bt}>{bt}</option>)}
                </select>
              </div>
            </div>

            {/* District — searchable */}
            <div>
              <SearchableSelect
                label="Location"
                placeholder="All Districts"
                value={filters.district}
                options={allDistricts}
                onChange={val => onDistrictChange(val)}
                icon={<LocationIcon size={14} />}
              />
            </div>
          </div>

          {/* Row 2: Upazila — searchable, only when district selected */}
          {filters.district && (
            <div className="px-4 pb-3">
              <SearchableSelect
                label="Upazila"
                placeholder="All Upazilas"
                value={filters.upazila}
                options={upazilas}
                onChange={val => setFilters(f => ({ ...f, upazila: val }))}
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    <circle cx="12" cy="9" r="1.5" fill="white"/>
                  </svg>
                }
              />
            </div>
          )}

          {/* Row 3: Filters pill + Search button */}
          <div className="bg-red-50 border-t border-red-100 px-4 py-2.5 flex items-center justify-between">
            <button
              type="button"
              onClick={() => hasFilters ? handleClear() : undefined}
              className="inline-flex items-center gap-1.5 text-red-600 font-semibold text-sm"
            >
              {/* filter lines icon */}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="4" y1="6" x2="20" y2="6"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
                <line x1="11" y1="18" x2="13" y2="18"/>
              </svg>
              {hasFilters ? 'Clear Filters' : 'Filters'}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-1.5 rounded-xl transition-colors"
            >
              {loading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
              ) : (
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              )}
              Search
            </button>
          </div>
        </form>

        {/* ══ TRUST NOTICE ══ */}
        <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl px-4 py-3 mb-3 md:mb-0">
          <span className="text-red-500 mt-0.5 flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <polyline points="9 12 11 14 15 10"/>
            </svg>
          </span>
          <div>
            <p className="text-sm font-bold text-gray-800">Only verified donors are shown</p>
            <p className="text-xs text-gray-500 mt-0.5">All donors are Jagannath University students.</p>
          </div>
        </div>

        </div>{/* end left column */}

        {/* Right column: donor list */}
        <div className="md:flex-1 md:min-w-0 mt-5 md:mt-0">

        {/* ══ SECTION HEADER ══ */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-gray-900">
              {hasFilters ? 'Search Results' : 'Available Donors'}
            </h2>
            {meta && !loading && (
              <span className="text-sm text-gray-500 font-medium">({meta.total})</span>
            )}
          </div>
          {/* Refreshing indicator */}
          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            <svg
              width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              className={refreshing ? 'animate-spin' : ''}
            >
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
            </svg>
          </button>
        </div>

        {/* ══ DONOR LIST ══ */}
        <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : donors.length === 0 ? (
            <EmptyState hasFilters={hasFilters} onClear={handleClear} />
          ) : (
            donors.map(d => <DonorCard key={d.id} donor={d} />)
          )}
        </div>

        {/* ══ LOAD MORE ══ */}
        {!loading && meta && meta.current_page < meta.last_page && (
          <div className="mt-5 text-center">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-red-400 text-gray-600 hover:text-red-600 font-semibold text-sm px-8 py-2.5 rounded-xl shadow-sm transition-all duration-150 disabled:opacity-60"
            >
              {loadingMore ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Loading…
                </>
              ) : (
                <>
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                  Load More Donors
                </>
              )}
            </button>
          </div>
        )}

        {/* ══ CAN'T FIND A DONOR? CTA ══ */}
        {!loading && (
          <div className="mt-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
            {/* Red people icon group */}
            <div className="flex-shrink-0">
              <svg width="48" height="40" viewBox="0 0 60 48" fill="none">
                {/* back person */}
                <circle cx="18" cy="14" r="8" fill="#fca5a5"/>
                <path d="M2 42c0-8.84 7.16-16 16-16s16 7.16 16 16" fill="#fca5a5"/>
                {/* front person (slightly larger, darker) */}
                <circle cx="36" cy="16" r="9" fill="#ef4444"/>
                <path d="M18 44c0-9.94 8.06-18 18-18s18 8.06 18 18" fill="#ef4444"/>
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm">Can't find a donor?</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                Create a blood request and notify verified donors near you.
              </p>
            </div>

            <Link
              to="/donor/blood-request/create"
              className="flex-shrink-0 inline-flex items-center gap-1.5 border border-red-500 text-red-600 hover:bg-red-50 font-semibold text-sm px-3 py-2 rounded-xl transition-colors whitespace-nowrap"
            >
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
              </svg>
              Request Blood
            </Link>
          </div>
        )}

        </div>{/* end right column */}
        </div>{/* end md:flex */}
      </div>
    </div>
  );
}
