import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const TIPS = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
      </svg>
    ),
    color: 'bg-red-50 text-red-500',
    title: 'Know Your Blood Type',
    body: 'Confirm your blood type is set correctly in your profile so you receive the right alerts.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    color: 'bg-pink-50 text-pink-500',
    title: 'Mark Yourself Available',
    body: 'Toggle "Available to Donate" in your profile so requesters can find you when blood is urgently needed.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    color: 'bg-amber-50 text-amber-500',
    title: 'Wait 3 Months Between Donations',
    body: 'Your body needs at least 90 days to replenish red blood cells after each whole-blood donation.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-4v-4m0-4V8" />
        <line x1="12" y1="8" x2="12" y2="8.01" />
      </svg>
    ),
    color: 'bg-blue-50 text-blue-500',
    title: 'Eat & Hydrate First',
    body: 'Have a nutritious meal and drink at least 500 ml of water 2–3 hours before you donate.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    color: 'bg-green-50 text-green-500',
    title: 'Donate at a Certified Centre',
    body: 'Only donate blood at a licensed hospital or blood bank to ensure safety for you and the recipient.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    color: 'bg-purple-50 text-purple-500',
    title: 'Respond to Alerts Promptly',
    body: 'When you receive a blood request notification matching your type, respond quickly — every minute counts.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      </svg>
    ),
    color: 'bg-orange-50 text-orange-500',
    title: 'Keep Your Profile Updated',
    body: 'Update your phone number, location, and last donation date regularly so your information stays accurate.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    color: 'bg-teal-50 text-teal-500',
    title: 'Spread the Word',
    body: 'Encourage friends at Jagannath University to register. More donors means faster help for those in need.',
  },
];

export default function GettingStartedPage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] ?? 'Donor';

  return (
    <div className="min-h-screen bg-[#F5F5F7] font-sans pb-24 md:pb-10">

      {/* Hero banner */}
      <div className="bg-gradient-to-br from-red-600 to-red-700 text-white px-5 pt-12 pb-10 md:pt-16 md:pb-14 relative overflow-hidden">
        {/* decorative drop */}
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none translate-x-1/4 -translate-y-1/4">
          <svg width="260" height="260" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
          </svg>
        </div>
        <div className="max-w-2xl mx-auto md:max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 text-xs font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Profile Complete
          </div>
          <h1 className="text-3xl md:text-4xl font-black leading-tight mb-3">
            Welcome, {firstName}! 🎉
          </h1>
          <p className="text-red-100 text-base md:text-lg leading-relaxed max-w-lg">
            You're now part of the JnU RedDrop community. Here's everything you need to know to be a great donor.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6 md:max-w-4xl md:px-8">

        {/* Section heading */}
        <div className="mb-5">
          <h2 className="text-lg font-extrabold text-gray-900">Best Practices for Donors</h2>
          <p className="text-sm text-gray-500 mt-0.5">Follow these guidelines to donate safely and effectively.</p>
        </div>

        {/* Tips grid */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          {TIPS.map((tip, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex gap-4 items-start">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${tip.color}`}>
                {tip.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm leading-snug">{tip.title}</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{tip.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Eligibility reminder */}
        <div className="mt-5 bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3 items-start">
          <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-600">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-amber-800 text-sm">Eligibility Reminder</p>
            <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
              You must be 18–65 years old, weigh at least 45 kg, and be in good health. Always consult a healthcare provider if you have any medical conditions.
            </p>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            to="/donor/dashboard"
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-2xl transition-colors shadow-md text-sm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Go to Dashboard
          </Link>
          <Link
            to="/requests"
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-red-400 text-gray-700 hover:text-red-600 font-bold py-3.5 rounded-2xl transition-colors text-sm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
            </svg>
            View Blood Requests
          </Link>
        </div>

      </div>
    </div>
  );
}
