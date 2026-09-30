import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/* ── Illustrations ─────────────────────────────────────────── */

const IllustrationHero = () => (
  <svg viewBox="0 0 320 280" fill="none" className="w-full max-w-xs">
    {/* Background glow */}
    <ellipse cx="160" cy="200" rx="120" ry="30" fill="rgba(255,255,255,0.08)" />

    {/* City / hospital silhouette */}
    <rect x="30" y="160" width="40" height="80" rx="3" fill="rgba(255,255,255,0.12)" />
    <rect x="38" y="148" width="24" height="14" rx="2" fill="rgba(255,255,255,0.18)" />
    <rect x="48" y="138" width="4" height="12" fill="rgba(255,255,255,0.25)" />
    <rect x="250" y="170" width="35" height="70" rx="3" fill="rgba(255,255,255,0.1)" />
    <rect x="258" y="160" width="19" height="12" rx="2" fill="rgba(255,255,255,0.15)" />

    {/* Large heart */}
    <path
      d="M160 220 C160 220 90 175 90 128 C90 104 108 88 128 88 C140 88 152 95 160 106 C168 95 180 88 192 88 C212 88 230 104 230 128 C230 175 160 220 160 220Z"
      fill="white"
      opacity="0.95"
    />
    {/* Heart shine */}
    <path
      d="M120 108 C114 118 112 130 115 142"
      stroke="rgba(239,68,68,0.3)"
      strokeWidth="6"
      strokeLinecap="round"
    />

    {/* Blood drop falling into heart */}
    <ellipse cx="160" cy="52" rx="14" ry="18" fill="rgba(255,255,255,0.9)" />
    <path d="M146 56 Q160 76 174 56" fill="rgba(255,255,255,0.9)" />
    {/* Drop shine */}
    <ellipse cx="155" cy="47" rx="4" ry="5" fill="white" opacity="0.5" />

    {/* Pulse line */}
    <polyline
      points="60,155 85,155 95,130 108,175 118,140 130,160 150,155 260,155"
      stroke="rgba(255,255,255,0.5)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />

    {/* Floating sparkles */}
    <circle cx="70" cy="100" r="4" fill="rgba(255,255,255,0.4)" />
    <circle cx="80" cy="85" r="2.5" fill="rgba(255,255,255,0.3)" />
    <circle cx="58" cy="90" r="2" fill="rgba(255,255,255,0.25)" />
    <circle cx="250" cy="105" r="4" fill="rgba(255,255,255,0.4)" />
    <circle cx="262" cy="90" r="2.5" fill="rgba(255,255,255,0.3)" />
    <circle cx="240" cy="118" r="2" fill="rgba(255,255,255,0.25)" />
  </svg>
);

const IllustrationWhy = () => (
  <svg viewBox="0 0 320 280" fill="none" className="w-full max-w-xs">
    <ellipse cx="160" cy="210" rx="110" ry="25" fill="rgba(255,255,255,0.07)" />

    {/* Person silhouette */}
    <circle cx="160" cy="80" r="36" fill="rgba(255,255,255,0.2)" />
    <circle cx="160" cy="78" r="28" fill="white" opacity="0.9" />
    {/* Face */}
    <circle cx="152" cy="74" r="4" fill="rgba(239,68,68,0.5)" />
    <circle cx="168" cy="74" r="4" fill="rgba(239,68,68,0.5)" />
    <path d="M150 86 Q160 94 170 86" stroke="rgba(239,68,68,0.6)" strokeWidth="3" strokeLinecap="round" fill="none" />

    {/* Body */}
    <path d="M120 116 Q140 108 160 108 Q180 108 200 116 L210 190 H110 Z" fill="rgba(255,255,255,0.15)" />
    <path d="M120 116 Q140 108 160 108 Q180 108 200 116 L205 165 H115 Z" fill="rgba(255,255,255,0.2)" />

    {/* Cape / hero element */}
    <path d="M115 130 Q90 155 95 185 Q130 170 160 175 Q190 170 225 185 Q230 155 205 130"
      fill="rgba(255,255,255,0.15)" />

    {/* Heart badge on chest */}
    <circle cx="160" cy="145" r="18" fill="rgba(239,68,68,0.25)" />
    <path d="M160 153 C160 153 148 146 148 139 C148 134 152 131 156 131 C158 131 160 133 160 133 C160 133 162 131 164 131 C168 131 172 134 172 139 C172 146 160 153 160 153Z"
      fill="white" opacity="0.9" />

    {/* Stats pills floating */}
    <rect x="32" y="95" width="68" height="28" rx="14" fill="rgba(255,255,255,0.18)" />
    <text x="66" y="113" textAnchor="middle" fontSize="11" fill="white" fontFamily="system-ui, sans-serif" fontWeight="700">3 lives saved</text>

    <rect x="218" y="95" width="72" height="28" rx="14" fill="rgba(255,255,255,0.18)" />
    <text x="254" y="113" textAnchor="middle" fontSize="11" fill="white" fontFamily="system-ui, sans-serif" fontWeight="700">10 min only</text>

    <rect x="85" y="198" width="150" height="28" rx="14" fill="rgba(255,255,255,0.15)" />
    <text x="160" y="216" textAnchor="middle" fontSize="11" fill="white" fontFamily="system-ui, sans-serif" fontWeight="700">Every 2 sec someone needs blood</text>
  </svg>
);

const IllustrationBenefits = () => (
  <svg viewBox="0 0 320 280" fill="none" className="w-full max-w-xs">
    <ellipse cx="160" cy="215" rx="115" ry="26" fill="rgba(255,255,255,0.07)" />

    {/* Large shield */}
    <path d="M160 40 L220 68 L220 148 C220 182 160 210 160 210 C160 210 100 182 100 148 L100 68 Z"
      fill="rgba(255,255,255,0.15)" />
    <path d="M160 52 L210 76 L210 148 C210 178 160 202 160 202 C160 202 110 178 110 148 L110 76 Z"
      fill="rgba(255,255,255,0.12)" />

    {/* Inner shield glow */}
    <path d="M160 68 L198 86 L198 144 C198 165 160 182 160 182 C160 182 122 165 122 144 L122 86 Z"
      fill="rgba(255,255,255,0.18)" />

    {/* Checkmark inside shield */}
    <path d="M140 128 L153 142 L182 110"
      stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />

    {/* Benefit icons around */}
    <circle cx="60" cy="85" r="24" fill="rgba(255,255,255,0.15)" />
    <text x="60" y="93" textAnchor="middle" fontSize="20">❤️</text>

    <circle cx="260" cy="85" r="24" fill="rgba(255,255,255,0.15)" />
    <text x="260" y="93" textAnchor="middle" fontSize="20">🔬</text>

    <circle cx="55" cy="165" r="24" fill="rgba(255,255,255,0.15)" />
    <text x="55" y="173" textAnchor="middle" fontSize="20">⚡</text>

    <circle cx="265" cy="165" r="24" fill="rgba(255,255,255,0.15)" />
    <text x="265" y="173" textAnchor="middle" fontSize="20">🌟</text>

    {/* Connecting lines */}
    <line x1="84" y1="90" x2="110" y2="102" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="4 3" />
    <line x1="236" y1="90" x2="210" y2="102" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="4 3" />
    <line x1="79" y1="155" x2="110" y2="145" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="4 3" />
    <line x1="241" y1="155" x2="210" y2="145" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="4 3" />
  </svg>
);

const IllustrationCommunity = () => (
  <svg viewBox="0 0 320 280" fill="none" className="w-full max-w-xs">
    <ellipse cx="160" cy="220" rx="120" ry="28" fill="rgba(255,255,255,0.07)" />

    {/* Map pin / location */}
    <path d="M160 30 C138 30 120 48 120 70 C120 100 160 140 160 140 C160 140 200 100 200 70 C200 48 182 30 160 30Z"
      fill="rgba(255,255,255,0.25)" />
    <circle cx="160" cy="70" r="20" fill="white" opacity="0.9" />
    <path d="M160 63 C160 63 150 69 150 76 C150 80 152 83 156 83 C158 83 160 81 160 81 C160 81 162 83 164 83 C168 83 170 80 170 76 C170 69 160 63 160 63Z"
      fill="rgba(239,68,68,0.7)" />

    {/* Person 1 - left */}
    <circle cx="72" cy="155" r="22" fill="rgba(255,255,255,0.2)" />
    <circle cx="72" cy="152" r="14" fill="white" opacity="0.85" />
    <rect x="52" y="168" width="40" height="38" rx="8" fill="rgba(255,255,255,0.18)" />
    <circle cx="72" cy="147" r="6" fill="rgba(239,68,68,0.4)" />

    {/* Person 2 - right */}
    <circle cx="248" cy="155" r="22" fill="rgba(255,255,255,0.2)" />
    <circle cx="248" cy="152" r="14" fill="white" opacity="0.85" />
    <rect x="228" y="168" width="40" height="38" rx="8" fill="rgba(255,255,255,0.18)" />
    <circle cx="248" cy="147" r="6" fill="rgba(239,68,68,0.4)" />

    {/* Person 3 - center bottom */}
    <circle cx="160" cy="175" r="24" fill="rgba(255,255,255,0.22)" />
    <circle cx="160" cy="172" r="16" fill="white" opacity="0.9" />
    <rect x="136" y="190" width="48" height="40" rx="8" fill="rgba(255,255,255,0.2)" />
    <circle cx="160" cy="166" r="7" fill="rgba(239,68,68,0.5)" />

    {/* Connection lines */}
    <line x1="94" y1="162" x2="136" y2="178" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="5 4" />
    <line x1="226" y1="162" x2="184" y2="178" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="5 4" />

    {/* JnU label */}
    <rect x="105" y="52" width="110" height="30" rx="15" fill="rgba(255,255,255,0.2)" />
    <text x="160" y="72" textAnchor="middle" fontSize="13" fill="white" fontFamily="system-ui, sans-serif" fontWeight="800">JnU RedDrop</text>

    {/* Floating hearts */}
    <text x="42" y="120" fontSize="16" opacity="0.6">♥</text>
    <text x="272" y="120" fontSize="16" opacity="0.6">♥</text>
    <text x="154" y="238" fontSize="14" opacity="0.5">♥</text>
  </svg>
);

/* ── Slide data ────────────────────────────────────────────── */

const SLIDES = [
  {
    gradient: ['#C41E2A', '#7B0D1E'],
    accentLight: 'rgba(255,100,100,0.15)',
    illustration: <IllustrationHero />,
    tag: 'Save Lives',
    title: 'Become a\nBlood Hero',
    body: 'One donation from you can save up to 3 lives. Be the reason someone gets to go home.',
    stats: [
      { value: '3', label: 'Lives per donation' },
      { value: '10m', label: 'Time it takes' },
    ],
  },
  {
    gradient: ['#B91C1C', '#6B21A8'],
    accentLight: 'rgba(180,100,255,0.15)',
    illustration: <IllustrationWhy />,
    tag: 'Why Donate',
    title: 'Every 2\nSeconds…',
    body: 'Someone in Bangladesh needs blood. Hospitals run low daily. Your blood type could be the only match.',
    stats: [
      { value: '108M', label: 'Units needed/year' },
      { value: '40%', label: 'Shortage in BD' },
    ],
  },
  {
    gradient: ['#9D174D', '#BE185D'],
    accentLight: 'rgba(255,100,180,0.15)',
    illustration: <IllustrationBenefits />,
    tag: 'Your Health',
    title: 'Good for\nYou Too',
    body: 'Regular donors enjoy real health perks — your body regenerates stronger blood after each donation.',
    bullets: [
      { emoji: '❤️', text: 'Lowers risk of heart disease & stroke' },
      { emoji: '🔬', text: 'Free blood pressure & iron check' },
      { emoji: '⚡', text: 'Boosts new red blood cell production' },
      { emoji: '🔥', text: 'Burns ~650 calories per session' },
    ],
  },
  {
    gradient: ['#991B1B', '#DC2626'],
    accentLight: 'rgba(255,160,100,0.12)',
    illustration: <IllustrationCommunity />,
    tag: 'JnU Community',
    title: 'Join Our\nHero Network',
    body: 'Connect with fellow JnU donors. Be found instantly when someone nearby needs your blood type.',
    bullets: [
      { emoji: '🎓', text: 'Exclusive to Jagannath University' },
      { emoji: '📍', text: 'Location-aware donor matching' },
      { emoji: '🔔', text: 'Instant alerts when you\'re needed' },
      { emoji: '🏆', text: 'Earn recognition as a top donor' },
    ],
  },
];

/* ── Component ─────────────────────────────────────────────── */

export default function OnboardingPage() {
  const [slide, setSlide] = useState(0);
  const [dir, setDir] = useState(1);
  const [animating, setAnimating] = useState(false);
  const touchStart = useRef(null);
  const navigate = useNavigate();

  const total = SLIDES.length;
  const current = SLIDES[slide];

  const goTo = (next) => {
    if (animating || next === slide) return;
    setDir(next > slide ? 1 : -1);
    setAnimating(true);
    setTimeout(() => { setSlide(next); setAnimating(false); }, 200);
  };

  const finish = () => {
    try { localStorage.setItem('onboarding_done', '1'); } catch {}
    navigate('/donor/login', { replace: true });
  };

  const next = () => { if (slide < total - 1) goTo(slide + 1); else finish(); };
  const prev = () => { if (slide > 0) goTo(slide - 1); };

  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStart.current === null) return;
    const dx = touchStart.current - e.changedTouches[0].clientX;
    touchStart.current = null;
    if (Math.abs(dx) < 40) return;
    if (dx > 0) next(); else prev();
  };

  const [g1, g2] = current.gradient;

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{
        position: 'fixed', inset: 0,
        background: `linear-gradient(160deg, ${g1} 0%, ${g2} 100%)`,
        display: 'flex', flexDirection: 'column',
        userSelect: 'none', overflow: 'hidden',
      }}
    >
      {/* ── Top bar: logo + skip ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '48px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
            </svg>
          </div>
          <span style={{ color: 'white', fontWeight: 700, fontSize: 13, letterSpacing: 0.4 }}>JnU RedDrop</span>
        </div>
        {slide < total - 1 && (
          <button onClick={finish} style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.2)', background: 'none', cursor: 'pointer' }}>
            Skip
          </button>
        )}
      </div>

      {/* ── Progress bar ── */}
      <div style={{ display: 'flex', gap: 6, padding: '12px 24px 0' }}>
        {SLIDES.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= slide ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)', transition: 'background 0.4s' }} />
        ))}
      </div>

      {/* ── Tag + Title ── */}
      <div style={{ padding: '14px 24px 0' }}>
        <span style={{
          display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)',
          background: current.accentLight, border: '1px solid rgba(255,255,255,0.15)',
          padding: '3px 10px', borderRadius: 20,
        }}>
          {current.tag}
        </span>
        <h1 style={{
          color: 'white', fontWeight: 900, lineHeight: 1.05, marginTop: 8,
          fontSize: 'clamp(1.7rem, 7vw, 2.4rem)', whiteSpace: 'pre-line',
        }}>
          {current.title}
        </h1>
      </div>

      {/* ── Illustration — fixed height, no flex-1 ── */}
      <div style={{
        height: '28%', minHeight: 130, maxHeight: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 16px',
        opacity: animating ? 0 : 1,
        transform: animating ? `translateX(${dir * 36}px)` : 'translateX(0)',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
      }}>
        {current.illustration}
      </div>

      {/* ── Content card ── */}
      <div style={{
        margin: '0 16px',
        background: 'rgba(0,0,0,0.22)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 24, padding: '14px 16px',
        opacity: animating ? 0 : 1,
        transform: animating ? `translateY(${dir * 16}px)` : 'translateY(0)',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
      }}>
        <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 13, lineHeight: 1.55, marginBottom: 12 }}>
          {current.body}
        </p>

        {current.stats && (
          <div style={{ display: 'flex', gap: 10 }}>
            {current.stats.map(({ value, label }) => (
              <div key={label} style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: '10px 8px', textAlign: 'center' }}>
                <div style={{ color: 'white', fontWeight: 900, fontSize: 22, lineHeight: 1 }}>{value}</div>
                <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, marginTop: 4, fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {current.bullets && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {current.bullets.map(({ emoji, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: '10px 10px' }}>
                <span style={{ fontSize: 15, flexShrink: 0 }}>{emoji}</span>
                <span style={{ color: 'rgba(255,255,255,0.78)', fontSize: 11, fontWeight: 500, lineHeight: 1.4 }}>{text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Bottom nav ── */}
      <div style={{ padding: '12px 24px 32px' }}>
        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 12 }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: i === slide ? 22 : 7, height: 7, borderRadius: 4,
                background: i === slide ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'width 0.3s, background 0.3s',
              }}
            />
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={next}
          style={{
            width: '100%', padding: '15px 0', borderRadius: 18,
            background: 'white', color: g1,
            fontWeight: 800, fontSize: 15, border: 'none', cursor: 'pointer',
            boxShadow: '0 6px 24px rgba(0,0,0,0.22)',
            transition: 'transform 0.1s',
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onTouchStart={e => e.currentTarget.style.transform = 'scale(0.97)'}
          onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          {slide < total - 1 ? 'Continue →' : '🩸 Get Started'}
        </button>
      </div>
    </div>
  );
}