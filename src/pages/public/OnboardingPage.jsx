import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SLIDES = [
  {
    key: 'hero',
    bg: 'from-red-600 to-red-800',
    icon: (
      <svg viewBox="0 0 100 100" className="w-40 h-40 drop-shadow-2xl" fill="none">
        <circle cx="50" cy="50" r="48" fill="rgba(255,255,255,0.12)" />
        <path
          d="M50 75 C50 75 20 57 20 38 C20 27 28 20 38 20 C43 20 48 23 50 27 C52 23 57 20 62 20 C72 20 80 27 80 38 C80 57 50 75 50 75Z"
          fill="white"
        />
        <text x="50" y="85" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.7)" fontFamily="system-ui">
          Every drop counts
        </text>
      </svg>
    ),
    title: 'Become a Hero',
    subtitle: 'One donation saves up to 3 lives',
    points: [
      { icon: '🩸', text: '1 unit of blood can save up to 3 lives' },
      { icon: '⏱️', text: 'Takes only 10–15 minutes to donate' },
      { icon: '🏥', text: 'Hospitals need blood every 2 seconds' },
      { icon: '🎓', text: 'JnU students save lives in our community' },
    ],
  },
  {
    key: 'benefits',
    bg: 'from-rose-500 to-pink-700',
    icon: (
      <svg viewBox="0 0 100 100" className="w-40 h-40 drop-shadow-2xl" fill="none">
        <circle cx="50" cy="50" r="48" fill="rgba(255,255,255,0.12)" />
        <path d="M30 50 L44 64 L70 36" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="4" />
      </svg>
    ),
    title: 'Good for You Too',
    subtitle: 'Donating blood benefits your health',
    points: [
      { icon: '❤️', text: 'Reduces risk of heart disease & stroke' },
      { icon: '🔬', text: 'Free mini health check every donation' },
      { icon: '⚡', text: 'Stimulates new red blood cell production' },
      { icon: '🌟', text: 'Burns ~650 calories per donation' },
    ],
  },
];

export default function OnboardingPage() {
  const [slide, setSlide] = useState(0);
  const navigate = useNavigate();

  const finish = () => {
    try { localStorage.setItem('onboarding_done', '1'); } catch {}
    navigate('/donor/login', { replace: true });
  };

  const next = () => {
    if (slide < SLIDES.length - 1) setSlide(slide + 1);
    else finish();
  };

  const { bg, icon, title, subtitle, points } = SLIDES[slide];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bg} flex flex-col select-none`}>
      {/* Skip */}
      <div className="flex justify-end p-5 pt-safe">
        <button
          onClick={finish}
          className="text-white/70 text-sm font-semibold tracking-wide px-3 py-1 rounded-full border border-white/20"
        >
          Skip
        </button>
      </div>

      {/* Illustration */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-4">
        <div className="mb-8">{icon}</div>

        <h1 className="text-white text-3xl font-extrabold text-center leading-tight mb-2">
          {title}
        </h1>
        <p className="text-white/75 text-base text-center mb-10">{subtitle}</p>

        {/* Points */}
        <div className="w-full max-w-sm space-y-3">
          {points.map(({ icon: ic, text }) => (
            <div key={text} className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3">
              <span className="text-xl flex-shrink-0">{ic}</span>
              <span className="text-white text-sm font-medium leading-snug">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="px-8 pb-10 pb-safe space-y-4">
        {/* Dots */}
        <div className="flex justify-center gap-2 mb-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`h-2 rounded-full transition-all ${i === slide ? 'w-6 bg-white' : 'w-2 bg-white/40'}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-full bg-white text-red-700 font-extrabold text-base py-4 rounded-2xl shadow-lg active:scale-[0.97] transition-transform"
        >
          {slide < SLIDES.length - 1 ? 'Next →' : 'Get Started'}
        </button>
      </div>
    </div>
  );
}
