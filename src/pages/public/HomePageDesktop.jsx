import { Link } from 'react-router-dom';
import SEO, { SITE_URL } from '../../components/SEO';

const HOME_JSON_LD = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'JnU RedDrop',
    url: SITE_URL,
    description: 'Blood donation platform for Jagannath University students.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/find?blood_type={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'JnU RedDrop',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'A student-built blood donation platform connecting donors and recipients at Jagannath University, Dhaka, Bangladesh.',
    email: 'reddrop@jnu.ac.bd',
    foundingDate: '2024',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dhaka',
      addressCountry: 'BD',
    },
  },
];

function BloodBagIllustration() {
  return (
    <svg viewBox="0 0 220 280" className="w-56 h-72 drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="50" y="80" width="120" height="150" rx="20" fill="#DC2626" opacity="0.9" />
      <rect x="50" y="80" width="120" height="150" rx="20" fill="url(#bagGradD)" />
      <rect x="65" y="95" width="35" height="80" rx="10" fill="white" opacity="0.15" />
      <path d="M110 130 C110 130 90 155 90 168 C90 179 99 188 110 188 C121 188 130 179 130 168 C130 155 110 130 110 130Z" fill="white" opacity="0.9" />
      <line x1="110" y1="80" x2="110" y2="50" stroke="#DC2626" strokeWidth="6" strokeLinecap="round" />
      <line x1="110" y1="230" x2="110" y2="260" stroke="#DC2626" strokeWidth="4" strokeLinecap="round" strokeDasharray="4 4" />
      <path d="M90 40 C90 25 130 25 130 40 L130 50 L90 50 Z" fill="#9CA3AF" />
      <circle cx="110" cy="25" r="8" stroke="#9CA3AF" strokeWidth="3" fill="none" />
      <polyline points="60,158 75,158 83,138 92,175 100,148 110,158 130,158 140,158" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <defs>
        <linearGradient id="bagGradD" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EF4444" stopOpacity="0" />
          <stop offset="100%" stopColor="#991B1B" stopOpacity="0.3" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const features = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'AI-Powered Donor Alerts',
    desc: 'Smart system finds the nearest donors based on blood type and location instantly.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    title: 'Instant Emergency Alerts',
    desc: 'Urgent requests are broadcast to all matched donors in real-time.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Verified Donor Network',
    desc: 'All donors are authenticated students of Jagannath University.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: 'Campus & Community Focused',
    desc: 'Built for Jagannath University students and the nearby community.',
  },
];

const steps = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    title: 'Create an Account',
    desc: 'Sign up with your university email and verify details',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: 'Request or Donate',
    desc: 'Submit a request or register as a donor to help nearest donors',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Get Matched',
    desc: 'We connect you with the most compatible and nearest donors',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: 'Save Lives',
    desc: 'Your help can bring someone back to life',
  },
];

export default function HomePageDesktop({ loading, totalDonors, availableDonors, fulfilledRequests, activeRequests }) {
  return (
    <>
      <SEO
        url="/"
        description="JnU RedDrop connects verified blood donors and recipients at Jagannath University. Find O+, A+, B+ donors instantly — free, safe, and life-saving."
        jsonLd={HOME_JSON_LD}
      />
      <HomePageDesktopContent
        loading={loading}
        totalDonors={totalDonors}
        availableDonors={availableDonors}
        fulfilledRequests={fulfilledRequests}
        activeRequests={activeRequests}
      />
    </>
  );
}

function HomePageDesktopContent({ loading, totalDonors, availableDonors, fulfilledRequests, activeRequests }) {
  const fmt = (n) => n > 0 ? n.toLocaleString() : '—';

  const stats = [
    {
      value: loading ? '...' : (totalDonors > 0 ? `${fmt(totalDonors)}+` : '—'),
      label: 'Registered Donors',
      live: false,
      featured: false,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      value: loading ? '...' : fmt(availableDonors),
      label: 'Available Right Now',
      live: true,
      featured: true,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      value: loading ? '...' : (fulfilledRequests > 0 ? `${fmt(fulfilledRequests)}+` : '—'),
      label: 'Requests Fulfilled',
      live: false,
      featured: false,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      value: loading ? '...' : fmt(activeRequests),
      label: 'Active Requests',
      live: true,
      featured: false,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-white overflow-hidden">

      {/* ── HERO ── */}
      <section className="bg-white">
        <style>{`
          @keyframes heroFadeUp {
            from { opacity: 0; transform: translateY(28px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes heroFloat {
            0%, 100% { transform: translateY(0px); }
            50%       { transform: translateY(-10px); }
          }
          @keyframes heroHeartbeat {
            0%, 100% { transform: scale(1); }
            14%      { transform: scale(1.4); }
            28%      { transform: scale(1); }
            42%      { transform: scale(1.3); }
            70%      { transform: scale(1); }
          }
          .hero-float    { animation: heroFloat 5s ease-in-out infinite; }
          .hero-heartbeat { display: inline-block; animation: heroHeartbeat 1.6s ease infinite; }
          .hero-anim     { animation: heroFadeUp 0.75s ease both; }
          @keyframes btnShimmer {
            from { left: -100%; }
            to   { left: 160%; }
          }
          .btn-premium-primary {
            position: relative;
            overflow: hidden;
          }
          .btn-premium-primary::after {
            content: '';
            position: absolute;
            top: 0; left: -100%;
            width: 50%; height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent);
            transform: skewX(-20deg);
          }
          .btn-premium-primary:hover::after {
            animation: btnShimmer 0.55s ease forwards;
          }
        `}</style>
        <div className="relative max-w-6xl mx-auto px-8 overflow-hidden">

          {/* Building image — right portion only, fades left into white, floats gently */}
          <div className="absolute right-0 top-0 bottom-0 w-[55%] hero-float">
            <img
              src="/bg_final.png"
              alt="Jagannath University"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/30 to-transparent" />
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-12 items-center py-24 lg:py-32">

            {/* Left: text */}
            <div>
              <p className="text-red-600 font-semibold text-sm tracking-wide mb-4 hero-anim" style={{ animationDelay: '0ms' }}>
                Jagannath University Blood &amp; Heart Quest
              </p>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6 hero-anim" style={{ animationDelay: '120ms' }}>
                Donate Blood.<br />
                Save Lives.{' '}
                <span className="hero-heartbeat" role="img" aria-label="blood drop">🩸</span>
              </h1>
              <p className="text-gray-700 text-lg mb-10 max-w-md leading-relaxed hero-anim" style={{ animationDelay: '240ms' }}>
                JnURedDrop connects verified donors and people in need within Jagannath University and nearby areas. Donate blood.
              </p>
              <div className="flex items-center gap-4 mb-10 hero-anim" style={{ animationDelay: '360ms' }}>
                <Link
                  to="/donor/blood-request/create"
                  className="btn-premium-primary inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-700 text-white font-bold py-3.5 px-9 rounded-full text-sm tracking-wide shadow-[0_4px_22px_rgba(220,38,38,0.42)] hover:shadow-[0_6px_32px_rgba(220,38,38,0.58)] hover:scale-[1.04] transition-all duration-200"
                >
                  Request Blood Now
                </Link>
                <Link
                  to="/donor/register"
                  className="font-bold py-3.5 px-9 rounded-full text-sm tracking-wide text-red-700 hover:text-red-800 hover:scale-[1.04] hover:bg-red-50/60 transition-all duration-200 shadow-sm hover:shadow-md"
                  style={{ background: 'linear-gradient(white,white) padding-box, linear-gradient(135deg,#f87171,#b91c1c) border-box', border: '2px solid transparent' }}
                >
                  I Want to Donate
                </Link>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 hero-anim" style={{ animationDelay: '480ms' }}>
                <span className="text-green-500 font-bold">✓</span>
                <span>Verified Donors</span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-green-500 font-bold">✓</span>
                <span>Safe &amp; Secure</span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-green-500 font-bold">✓</span>
                <span>Save Lives</span>
              </div>
            </div>

            {/* Right: empty — building image shows through */}
            <div className="min-h-[380px]" />
          </div>
        </div>
      </section>

      {/* ── FEATURE CARDS ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <p className="text-center text-xs font-semibold text-red-500 tracking-widest uppercase mb-2">By the Numbers</p>
          <h2 className="text-2xl font-extrabold text-center text-gray-900 mb-10">Real impact, real lives</h2>
          <div className="grid grid-cols-4 gap-5">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`relative flex flex-col items-center text-center p-8 rounded-2xl border transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${
                  stat.featured
                    ? 'bg-gradient-to-br from-red-600 to-red-700 border-transparent shadow-[0_4px_20px_rgba(220,38,38,0.32)]'
                    : 'bg-red-50 border-red-100 shadow-sm'
                }`}
              >
                {stat.live && (
                  <span className={`absolute top-3 right-3 flex items-center gap-1 text-[10px] font-semibold rounded-full px-2 py-0.5 ${stat.featured ? 'bg-white/20 text-white' : 'bg-green-50 text-green-600 border border-green-200'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                    Live
                  </span>
                )}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm mb-4 ${stat.featured ? 'bg-white/20 text-white' : 'bg-white text-red-600'}`}>
                  {stat.icon}
                </div>
                <div className={`text-3xl font-extrabold mb-1 ${stat.featured ? 'text-white' : 'text-gray-900'}`}>{stat.value}</div>
                <div className={`text-sm font-medium ${stat.featured ? 'text-red-100' : 'text-gray-500'}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8">
          <p className="text-center text-xs font-semibold text-red-500 tracking-widest uppercase mb-2">The Process</p>
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
            How <span className="text-red-600">JnURed Drop</span> Works
          </h2>
          <p className="text-center text-gray-500 mb-16 text-sm">Four simple steps to save a life</p>

          <div className="flex items-start gap-2">
            {steps.map((step, i) => (
              <div key={step.title} className="flex items-start flex-1">
                <div className="group flex flex-col items-center flex-1">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-white border-2 border-red-100 flex items-center justify-center text-red-600 shadow-md group-hover:border-red-400 group-hover:shadow-xl group-hover:shadow-red-100/50 group-hover:scale-105 transition-all duration-300">
                      {step.icon}
                    </div>
                    <span className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-red-600 text-white text-[11px] font-bold flex items-center justify-center shadow-sm">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-2 text-center">{step.title}</h3>
                  <p className="text-xs text-gray-500 text-center leading-relaxed max-w-[130px]">{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex items-center pt-10 px-1 flex-shrink-0 gap-0.5">
                    <div className="w-8 border-t-2 border-dashed border-red-200" />
                    <svg className="w-4 h-4 text-red-400 flex-shrink-0 -ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-red-600">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <p className="text-red-100 text-sm font-medium mb-3">Join JnURedDrop</p>
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Be the reason someone lives today.
          </h2>
          <p className="text-red-100 mb-10 text-base">
            Join JnURedDrop – Because every drop counts.
          </p>
          <Link
            to="/donor/register"
            className="inline-block bg-white text-red-600 font-bold py-3.5 px-12 rounded-full hover:bg-red-50 transition-colors duration-200 shadow-lg"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
}
