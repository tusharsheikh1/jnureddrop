import { Link } from 'react-router-dom';
import { LogoMark } from './Logo';

const navLinks = [
  { label: 'Home',        to: '/' },
  { label: 'Find Donors', to: '/find' },
  { label: 'Blog',        to: '/blog' },
  { label: 'FAQ',         to: '/faq' },
];

const donorLinks = [
  { label: 'Register as Donor',  to: '/donor/register' },
  { label: 'Donor Login',        to: '/donor/login' },
  { label: 'My Dashboard',       to: '/donor/dashboard' },
  { label: 'Request Blood',      to: '/donor/blood-request/create' },
  { label: 'My Requests',        to: '/donor/blood-requests' },
];

const bloodTypes = ['A+', 'A−', 'B+', 'B−', 'O+', 'O−', 'AB+', 'AB−'];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      {/* Red gradient accent line */}
      <div className="h-[3px] bg-gradient-to-r from-red-900 via-red-500 to-red-900" />

      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-14">
        <div className="grid grid-cols-4 gap-10">

          {/* ── Brand ── */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 inline-flex">
              <LogoMark className="h-8 w-8" />
              <div className="flex flex-col justify-center">
                <div className="text-xl font-bold tracking-tight leading-none mb-0.5">
                  <span className="text-white">Jnu</span><span className="text-[#BA1C2E]">reddrop</span>
                </div>
                <p className="text-gray-400 text-[9px] uppercase tracking-[0.1em] font-medium leading-none">Find Blood &bull; Save Lives</p>
              </div>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Connecting verified donors with those in need across Jagannath University and the nearby community. Every drop counts.
            </p>

            {/* Blood type badges */}
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2">Supported Blood Types</p>
            <div className="flex flex-wrap gap-1.5">
              {bloodTypes.map(t => (
                <span
                  key={t}
                  className="text-[10px] font-bold text-red-400 border border-red-800/60 rounded-md px-1.5 py-0.5 bg-red-950/20"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* ── Navigate ── */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-5">Navigate</h4>
            <ul className="space-y-3">
              {navLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors duration-150 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-red-700 group-hover:bg-red-400 transition-colors flex-shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Donor Portal ── */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-5">Donor Portal</h4>
            <ul className="space-y-3">
              {donorLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors duration-150 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-red-700 group-hover:bg-red-400 transition-colors flex-shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Emergency / Location ── */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-5">Community</h4>

            <div className="flex items-start gap-2 mb-5">
              <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm text-gray-400 leading-relaxed">
                Jagannath University,<br />Old Dhaka, Bangladesh
              </p>
            </div>

            {/* Emergency CTA card */}
            <div className="rounded-2xl border border-red-900/50 bg-red-950/20 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />
                <p className="text-red-400 text-xs font-semibold">Need Blood Urgently?</p>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed mb-3">
                Post an emergency request and we'll alert all matched donors in your area instantly.
              </p>
              <Link
                to="/donor/blood-request/create"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
              >
                Post a Request
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-gray-800 mt-12 pt-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} JnURedDrop. Built with ❤️ for Jagannath University.
          </p>
          <div className="flex items-center gap-5 text-xs text-gray-500">
            <Link to="/faq"  className="hover:text-gray-300 transition-colors">FAQ</Link>
            <Link to="/blog" className="hover:text-gray-300 transition-colors">Blog</Link>
            <Link to="/find" className="hover:text-gray-300 transition-colors">Find Donors</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
