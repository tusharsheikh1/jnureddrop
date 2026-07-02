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

const quickActions = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    title: 'Find Donors',
    desc: 'Search by blood type & area',
    to: '/find',
    primary: false,
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: 'Request Blood',
    desc: 'Post an urgent request now',
    to: '/donor/blood-request/create',
    primary: true,
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    title: 'Become a Donor',
    desc: 'Register & save lives today',
    to: '/donor/register',
    primary: false,
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: 'Read Blog',
    desc: 'Stories & donor tips',
    to: '/blog',
    primary: false,
  },
];

const steps = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    title: 'Create Account',
    desc: 'Sign up with your university email and verify details',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: 'Request or Donate',
    desc: 'Submit request or register as donor to help nearest donors',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Get Matched',
    desc: 'We connect you with the most compatible nearest donors',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: 'Save Lives',
    desc: 'Your help can bring someone back to life',
  },
];

export default function HomePageMobile({ loading, totalDonors, availableDonors, fulfilledRequests, activeRequests }) {
  return (
    <>
      <SEO
        url="/"
        description="JnU RedDrop connects verified blood donors and recipients at Jagannath University. Find O+, A+, B+ donors instantly — free, safe, and life-saving."
        jsonLd={HOME_JSON_LD}
      />
      <HomePageMobileContent
        loading={loading}
        totalDonors={totalDonors}
        availableDonors={availableDonors}
        fulfilledRequests={fulfilledRequests}
        activeRequests={activeRequests}
      />
    </>
  );
}

function HomePageMobileContent({ loading, totalDonors, availableDonors, fulfilledRequests, activeRequests }) {
  return (
    <div className="bg-white min-h-screen">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-white px-5 pt-8 pb-6">
        <style>{`
          @keyframes mHeroFadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .m-hero-anim { animation: mHeroFadeUp 0.65s ease both; }
          @keyframes mBtnShimmer {
            from { left: -100%; }
            to   { left: 160%; }
          }
          .m-btn-primary { position: relative; overflow: hidden; }
          .m-btn-primary::after {
            content: '';
            position: absolute;
            top: 0; left: -100%;
            width: 50%; height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent);
            transform: skewX(-20deg);
          }
          .m-btn-primary:hover::after { animation: mBtnShimmer 0.55s ease forwards; }
        `}</style>

        {/* University building background */}
        <div className="absolute right-0 top-0 bottom-0 w-[70%]">
          <img
            src="/hero_university_building_bg_for_mobile.png"
            alt=""
            className="w-full h-full object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent" />
        </div>

        <div className="relative">
          <h1 className="text-3xl font-extrabold leading-tight mb-3 m-hero-anim" style={{ animationDelay: '0ms' }}>
            Donate Blood.<br />
            <span className="text-red-600">Save Lives.</span>
          </h1>
          <p className="text-gray-500 text-sm mb-7 max-w-[220px] leading-relaxed m-hero-anim" style={{ animationDelay: '130ms' }}>
            Connect. Help. Save lives in the Jagannath University community.
          </p>
          <div className="flex flex-col gap-3 max-w-[210px] m-hero-anim" style={{ animationDelay: '260ms' }}>
            <Link
              to="/donor/blood-request/create"
              className="m-btn-primary inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-700 text-white font-bold py-3 px-6 rounded-full text-sm tracking-wide shadow-[0_4px_16px_rgba(220,38,38,0.42)] hover:shadow-[0_6px_24px_rgba(220,38,38,0.58)] hover:scale-[1.03] transition-all duration-200"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C10.5 4.5 4 11.5 4 15.5a8 8 0 0016 0C20 11.5 13.5 4.5 12 2z" />
              </svg>
              Request Blood
            </Link>
            <Link
              to="/donor/register"
              className="inline-flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-full text-sm tracking-wide text-red-700 hover:text-red-800 hover:scale-[1.03] transition-all duration-200 shadow-sm hover:shadow-md"
              style={{ background: 'linear-gradient(white,white) padding-box, linear-gradient(135deg,#f87171,#b91c1c) border-box', border: '2px solid transparent' }}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              I Want to Donate
            </Link>
          </div>
        </div>
      </section>

      {/* ── QUICK ACTIONS ── */}
      <section className="px-5 py-5 bg-white">
        <h2 className="text-base font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.to}
              className={`relative flex flex-col p-4 rounded-2xl border overflow-hidden active:scale-[0.97] hover:scale-[1.02] transition-all duration-200 ${
                action.primary
                  ? 'bg-gradient-to-br from-red-600 to-red-700 border-red-500/20 shadow-[0_4px_18px_rgba(220,38,38,0.32)]'
                  : 'bg-gradient-to-br from-rose-50 to-red-50 border-red-100 shadow-sm hover:shadow-md'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${
                action.primary ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'
              }`}>
                {action.icon}
              </div>
              <span className={`text-sm font-bold leading-tight mb-0.5 ${action.primary ? 'text-white' : 'text-gray-900'}`}>
                {action.title}
              </span>
              <span className={`text-xs leading-relaxed ${action.primary ? 'text-red-100' : 'text-gray-500'}`}>
                {action.desc}
              </span>
              <svg
                className={`absolute bottom-3 right-3 w-4 h-4 ${action.primary ? 'text-red-200' : 'text-red-300'}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

        {/* Verified & Safe Community banner */}
        <Link
          to="/find"
          className="flex items-center justify-between bg-red-50 border border-red-100 rounded-2xl px-4 py-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Verified &amp; Safe Community</p>
              <p className="text-xs text-gray-500">All donors are verified students of Jagannath University</p>
            </div>
          </div>
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </section>

      {/* ── STATS ── */}
      <section className="px-5 py-5 bg-white">
        <h2 className="text-base font-bold text-gray-800 mb-4">By the Numbers</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              value: loading ? '...' : (totalDonors > 0 ? `${totalDonors.toLocaleString()}+` : '—'),
              label: 'Registered Donors',
              live: false, featured: false,
              icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ),
            },
            {
              value: loading ? '...' : (availableDonors > 0 ? `${availableDonors.toLocaleString()}` : '—'),
              label: 'Available Now',
              live: true, featured: true,
              icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              ),
            },
            {
              value: loading ? '...' : (fulfilledRequests > 0 ? `${fulfilledRequests.toLocaleString()}+` : '—'),
              label: 'Requests Fulfilled',
              live: false, featured: false,
              icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              ),
            },
            {
              value: loading ? '...' : (activeRequests > 0 ? `${activeRequests.toLocaleString()}` : '—'),
              label: 'Active Requests',
              live: true, featured: false,
              icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              ),
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`relative flex flex-col p-4 rounded-2xl border ${
                stat.featured
                  ? 'bg-gradient-to-br from-red-600 to-red-700 border-transparent shadow-[0_4px_14px_rgba(220,38,38,0.28)]'
                  : 'bg-red-50 border-red-100 shadow-sm'
              }`}
            >
              {stat.live && (
                <span className={`absolute top-2.5 right-2.5 flex items-center gap-1 text-[9px] font-semibold rounded-full px-1.5 py-0.5 ${stat.featured ? 'bg-white/20 text-white' : 'bg-green-50 text-green-600 border border-green-200'}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                  Live
                </span>
              )}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${stat.featured ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'}`}>
                {stat.icon}
              </div>
              <div className={`text-2xl font-extrabold mb-0.5 ${stat.featured ? 'text-white' : 'text-gray-900'}`}>{stat.value}</div>
              <div className={`text-xs font-medium ${stat.featured ? 'text-red-100' : 'text-gray-500'}`}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="px-5 py-6 bg-gray-50">
        <p className="text-[10px] font-semibold text-red-500 tracking-widest uppercase mb-1">The Process</p>
        <h2 className="text-base font-bold text-gray-900 mb-5">How It Works</h2>

        <div className="relative">
          {/* Vertical gradient line */}
          <div className="absolute left-[19px] top-5 bottom-5 w-0.5 bg-gradient-to-b from-red-500 via-red-400 to-red-200" />

          <div className="flex flex-col gap-4">
            {steps.map((step, i) => (
              <div key={step.title} className="flex items-start gap-4">
                {/* Numbered circle on the timeline */}
                <div className="relative z-10 w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md shadow-red-200/60">
                  {i + 1}
                </div>
                {/* Content card */}
                <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 -mt-0.5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-red-600 flex-shrink-0">{step.icon}</span>
                    <h3 className="font-bold text-gray-900 text-sm leading-tight">{step.title}</h3>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mx-5 my-5 bg-red-600 rounded-2xl px-5 py-7 text-center">
        <h2 className="text-lg font-extrabold text-white mb-2">
          Be the reason someone lives today.
        </h2>
        <p className="text-red-100 text-xs mb-5">
          Join JnURedDrop – Because every drop counts.
        </p>
        <Link
          to="/donor/register"
          className="inline-block bg-white text-red-600 font-bold py-2.5 px-8 rounded-full hover:bg-red-50 transition-colors duration-200 text-sm"
        >
          Sign Up Now
        </Link>
      </section>
    </div>
  );
}
