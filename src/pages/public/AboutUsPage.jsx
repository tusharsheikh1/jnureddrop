import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import ModernHeader from '../../components/ModernHeader';
import SEO from '../../components/SEO';

const TEAM = [
  { name: 'Tushar Sheikh', role: 'Founder & Developer · 15th Batch, Dept. of Marketing', initials: 'TS', photo: '/tushar_sheikh.png', email: 'tushar.mkt15@gmail.com', facebook: 'https://www.facebook.com/tusharmktjnu/' },
  { name: 'Department of Marketing, JnU', role: 'Supported by',                                          initials: 'MK' },
];

const VALUES = [
  {
    icon: (
      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: 'Save Lives',
    desc:  'Every connection we facilitate could mean the difference between life and death.',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Community First',
    desc:  'Built by a JnU Marketing student, supported by the Department of Marketing — for the entire JnU community.',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Trust & Safety',
    desc:  'Verified donors, transparent profiles, and secure communication.',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Fast Response',
    desc:  'Real-time blood requests to connect donors and recipients quickly.',
  },
];

export default function AboutUsPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/home').then(r => setStats(r.data.stats)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans">
      <SEO
        title="About JnU RedDrop — Our Mission & Team"
        description="JnU RedDrop is a student-built blood donation platform at Jagannath University. Learn about our mission to connect donors and save lives across JnU and beyond."
        url="/about"
      />
      <ModernHeader title="About Us" />

      {/* Desktop hero */}
      <div className="hidden md:block bg-red-600 py-12">
        <div className="max-w-5xl mx-auto px-8 flex items-center gap-5">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-white">JnU RedDrop</h1>
            <p className="text-red-100 text-base mt-1">A blood donation platform built by a JnU Marketing student, supported by the Department of Marketing.</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 md:max-w-5xl md:px-8">

        {/* Mobile Hero Card */}
        <div className="bg-red-600 rounded-3xl p-6 relative overflow-hidden mb-6 md:hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white opacity-5 rounded-full" />
          <div className="absolute right-4 -bottom-4 w-20 h-20 bg-white opacity-5 rounded-full" />
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h1 className="text-white font-extrabold text-2xl leading-tight">JnU RedDrop</h1>
            <p className="text-red-100 text-sm mt-2 leading-relaxed">
              A blood donation platform connecting donors and recipients across Jagannath University and beyond — built by a Marketing student, supported by the Department of Marketing.
            </p>
          </div>
        </div>

        {/* Desktop 2-col layout */}
        <div className="md:grid md:grid-cols-2 md:gap-8 space-y-6 md:space-y-0 mt-6 md:mt-8">

          {/* Left column */}
          <div className="space-y-6">
            {/* Mission */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-3 text-lg">Our Mission</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                JnU RedDrop was created to eliminate the critical gap between blood donors and people in urgent need.
                Too often, patients and families spend precious hours searching for matching blood donors. We built this
                platform to make that search instant — connecting willing donors with those who need them most, when
                every minute counts.
              </p>
            </div>

            {/* Values */}
            <div>
              <h2 className="font-bold text-gray-900 mb-3 text-lg">What We Stand For</h2>
              <div className="grid grid-cols-2 gap-3">
                {VALUES.map(v => (
                  <div key={v.title} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center mb-3">
                      {v.icon}
                    </div>
                    <p className="font-semibold text-gray-900 text-sm mb-1">{v.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Live Stats */}
            {stats && (
              <div>
                <h2 className="font-bold text-gray-900 mb-3 text-lg">Our Impact</h2>
                <div className="grid grid-cols-3 gap-3">
                  <StatCard value={stats.total_donors ?? 0}        label="Registered Donors"  color="text-red-600"   />
                  <StatCard value={stats.fulfilled_requests ?? 0}  label="Lives Impacted"      color="text-green-600" />
                  <StatCard value={stats.active_requests ?? 0}     label="Active Requests"     color="text-blue-600"  />
                </div>
              </div>
            )}

            {/* Team */}
            <div>
              <h2 className="font-bold text-gray-900 mb-3 text-lg">The Team</h2>
              <div className="space-y-3">
                {TEAM.map(member => (
                  <div key={member.name} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {member.photo
                        ? <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                        : <span className="text-red-600 font-bold text-sm">{member.initials}</span>
                      }
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{member.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{member.role}</p>
                      {member.email && (
                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                          <a href={`mailto:${member.email}`} className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 transition-colors">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Email
                          </a>
                          {member.facebook && (
                            <>
                              <span className="text-gray-200 text-xs">|</span>
                              <a href={member.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-[#1877F2] hover:text-blue-700 transition-colors">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                                </svg>
                                Facebook
                              </a>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact + Links */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-3">
              <h2 className="font-bold text-gray-900 text-lg">Get In Touch</h2>

              <a href="mailto:reddrop@jnu.ac.bd" className="flex items-center gap-3 text-sm text-gray-600 hover:text-red-600 transition-colors">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                reddrop@jnu.ac.bd
              </a>

              <Link to="/contact" className="flex items-center gap-3 text-sm text-gray-600 hover:text-red-600 transition-colors">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                Contact Us
              </Link>

              <Link to="/faq" className="flex items-center gap-3 text-sm text-gray-600 hover:text-red-600 transition-colors">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                FAQs
              </Link>

              <Link to="/privacy-policy" className="flex items-center gap-3 text-sm text-gray-600 hover:text-red-600 transition-colors">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-300 mt-8 pb-2">JnU RedDrop v1.0 · Built by Tushar Sheikh, Dept. of Marketing · 15th Batch</p>
      </div>
    </div>
  );
}

function StatCard({ value, label, color }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
      <p className={`text-2xl font-extrabold leading-none ${color}`}>{value}</p>
      <p className="text-[11px] text-gray-500 mt-1 leading-tight">{label}</p>
    </div>
  );
}
