import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useGoogleAuth from '../../hooks/useGoogleAuth';

/* ── Shared icons ── */
const EyeIcon = ({ visible }) => visible ? (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
) : (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const GoogleIcon = () => (
  <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const Spinner = () => (
  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

const Field = ({ label, icon, error, children }) => (
  <div>
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">{label}</label>
    <div className="relative">
      <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">{icon}</span>
      {children}
    </div>
    {error && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><span>⚠</span>{error}</p>}
  </div>
);

const inputCls = (hasError) =>
  `w-full bg-gray-50 border rounded-2xl pl-11 pr-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent focus:bg-white transition-all ${hasError ? 'border-red-400 bg-red-50' : 'border-gray-200'}`;

/* ── Email SVG icon ── */
const MailIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const LockIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

/* ── Header illustration ── */
const HeaderArt = () => (
  <svg viewBox="0 0 360 180" fill="none" className="w-full" style={{ maxHeight: 180 }}>
    {/* Soft radial glow */}
    <ellipse cx="180" cy="95" rx="140" ry="80" fill="rgba(255,255,255,0.06)" />
    {/* Pulse line */}
    <polyline points="20,110 55,110 70,75 85,130 100,90 115,110 145,110 290,110"
      stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    {/* Central heart */}
    <path d="M180 148 C180 148 130 118 130 88 C130 70 144 60 158 60 C166 60 175 65 180 73 C185 65 194 60 202 60 C216 60 230 70 230 88 C230 118 180 148 180 148Z"
      fill="white" opacity="0.92" />
    {/* Drop */}
    <ellipse cx="180" cy="32" rx="11" ry="15" fill="white" opacity="0.85" />
    <path d="M169 36 Q180 50 191 36" fill="white" opacity="0.85" />
    <ellipse cx="176" cy="28" rx="3" ry="4" fill="white" opacity="0.45" />
    {/* Sparkles left */}
    <circle cx="75" cy="65" r="4" fill="rgba(255,255,255,0.35)" />
    <circle cx="90" cy="50" r="2.5" fill="rgba(255,255,255,0.25)" />
    <circle cx="60" cy="52" r="2" fill="rgba(255,255,255,0.2)" />
    {/* Sparkles right */}
    <circle cx="285" cy="65" r="4" fill="rgba(255,255,255,0.35)" />
    <circle cx="300" cy="50" r="2.5" fill="rgba(255,255,255,0.25)" />
    <circle cx="270" cy="52" r="2" fill="rgba(255,255,255,0.2)" />
  </svg>
);

/* ════════════════════════════════════════════════════════════ */

export default function DonorLoginPage() {
  const { donorLogin, donorRegister, donorGoogleLogin } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState('login'); // 'login' | 'signup'

  /* Login state */
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({});
  const [loginLoading, setLoginLoading] = useState(false);
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [emailUnverified, setEmailUnverified] = useState(false);

  /* Register state */
  const [regForm, setRegForm] = useState({ email: '', password: '', password_confirmation: '' });
  const [regErrors, setRegErrors] = useState({});
  const [regLoading, setRegLoading] = useState(false);
  const [showRegPw, setShowRegPw] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);

  const loading = loginLoading || regLoading;

  /* ── Google ── */
  const handleGoogleLogin = useGoogleAuth({
    onSuccess: async (tokens) => {
      setLoginErrors({}); setRegErrors({});
      setLoginLoading(true);
      try {
        const data = await donorGoogleLogin(tokens);
        const donor = data?.donor;
        const incomplete = donor && (!donor.age || !donor.gender || !donor.height_cm || !donor.weight_kg || !donor.blood_type || !donor.district);
        if (data.is_new_user || incomplete) {
          navigate('/donor/profile/edit', { state: { newUser: true, message: 'Please complete your profile to continue.' } });
        } else {
          navigate('/donor/dashboard');
        }
      } catch (err) {
        const msg = err.response?.data?.message ?? 'Google login failed.';
        setLoginErrors({ email: [msg] }); setRegErrors({ email: [msg] });
      } finally { setLoginLoading(false); }
    },
    onError: () => {
      setLoginErrors({ email: ['Google login failed.'] });
      setRegErrors({ email: ['Google login failed.'] });
    },
  });

  /* ── Login submit ── */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginErrors({}); setEmailUnverified(false); setLoginLoading(true);
    try {
      const data = await donorLogin(loginForm.email, loginForm.password);
      const donor = data?.donor;
      const incomplete = donor && (!donor.age || !donor.gender || !donor.height_cm || !donor.weight_kg || !donor.blood_type || !donor.district);
      if (incomplete) {
        navigate('/donor/profile/edit', { state: { newUser: true, message: 'Please complete your profile to continue.' } });
      } else { navigate('/donor/dashboard'); }
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;
      if (data?.email_unverified) { setEmailUnverified(true); }
      else if (data?.errors) { setLoginErrors(data.errors); }
      else if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) { setLoginErrors({ email: ['Server is taking too long. Please try again.'] }); }
      else if (status === 429) { setLoginErrors({ email: ['Too many attempts. Please wait a minute.'] }); }
      else if (status === 500) { setLoginErrors({ email: ['Server error. Please try again.'] }); }
      else if (!err.response) { setLoginErrors({ email: ['Network error. Check your connection.'] }); }
      else { setLoginErrors({ email: [data?.message ?? 'Login failed.'] }); }
    } finally { setLoginLoading(false); }
  };

  /* ── Register submit ── */
  const handleRegister = async (e) => {
    e.preventDefault();
    if (regForm.password !== regForm.password_confirmation) {
      setRegErrors({ password_confirmation: ['Passwords do not match.'] }); return;
    }
    setRegErrors({}); setRegLoading(true);
    try {
      await donorRegister(regForm);
      navigate('/donor/verify-email');
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;
      if (data?.errors) { setRegErrors(data.errors); }
      else if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) { setRegErrors({ email: ['Server is taking too long. Please try again.'] }); }
      else if (status === 429) { setRegErrors({ email: ['Too many attempts. Please wait a minute.'] }); }
      else if (status === 500) { setRegErrors({ email: ['Server error. Please try again.'] }); }
      else if (!err.response) { setRegErrors({ email: ['Network error. Check your connection.'] }); }
      else { setRegErrors({ email: [data?.message ?? 'Registration failed.'] }); }
    } finally { setRegLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #C41E2A 0%, #7B0D1E 100%)' }}>

      {/* ── Top: brand + illustration ── */}
      <div className="flex flex-col items-center pt-10 px-6 pb-0">
        {/* Logo row */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
            </svg>
          </div>
          <div>
            <div className="text-white font-extrabold text-lg leading-none tracking-tight">JnU<span className="opacity-80">RedDrop</span></div>
            <div className="text-white/55 text-xs mt-0.5">Donate Blood · Save Lives</div>
          </div>
        </div>

        <HeaderArt />
      </div>

      {/* ── Bottom sheet ── */}
      <div
        className="flex-1 bg-white rounded-t-[2rem] shadow-2xl px-6 pt-6 pb-10"
        style={{ marginTop: -24 }}
      >
        {/* Tab switcher */}
        <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
          {['login', 'signup'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
              style={tab === t
                ? { background: 'linear-gradient(135deg, #C41E2A, #9B1B2A)', color: 'white', boxShadow: '0 2px 8px rgba(196,30,42,0.35)' }
                : { color: '#6B7280' }
              }
            >
              {t === 'login' ? 'Log In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Google button — shared */}
        <button
          type="button"
          onClick={() => handleGoogleLogin()}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-2xl py-3.5 text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 transition-all mb-4 disabled:opacity-60"
          style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}
        >
          <GoogleIcon />
          Continue with Google
        </button>

        {/* OR divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-semibold tracking-widest uppercase">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* ── LOGIN FORM ── */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <Field label="Email" icon={<MailIcon />} error={loginErrors.email?.[0]}>
              <input
                type="email"
                className={inputCls(!!loginErrors.email)}
                placeholder="you@example.com"
                value={loginForm.email}
                onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                required autoFocus
              />
            </Field>

            <Field label="Password" icon={<LockIcon />} error={loginErrors.password?.[0]}>
              <input
                type={showLoginPw ? 'text' : 'password'}
                className={`${inputCls(!!loginErrors.password)} pr-12`}
                placeholder="Your password"
                value={loginForm.password}
                onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                required
              />
              <button
                type="button"
                onClick={() => setShowLoginPw(v => !v)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                <EyeIcon visible={showLoginPw} />
              </button>
            </Field>

            <div className="text-right -mt-1">
              <Link to="/donor/forgot-password" className="text-xs font-semibold text-red-600 hover:text-red-700">
                Forgot password?
              </Link>
            </div>

            {emailUnverified && (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3">
                <p className="text-sm font-bold text-amber-800 mb-1">Email not verified</p>
                <p className="text-xs text-amber-700 mb-2">Check your inbox for the verification link.</p>
                <button type="button" onClick={() => navigate('/donor/verify-email')}
                  className="text-xs font-bold text-red-700 hover:underline">
                  Resend verification →
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-4 rounded-2xl text-white font-extrabold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #C41E2A, #9B1B2A)', boxShadow: '0 4px 20px rgba(196,30,42,0.4)' }}
            >
              {loginLoading ? <><Spinner /> Logging in…</> : '🩸 Log In'}
            </button>

            <p className="text-center text-xs text-gray-400 pt-1">
              No account?{' '}
              <button type="button" onClick={() => setTab('signup')} className="text-red-600 font-bold">
                Sign up free
              </button>
            </p>
          </form>
        )}

        {/* ── REGISTER FORM ── */}
        {tab === 'signup' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <Field label="Email" icon={<MailIcon />} error={regErrors.email?.[0]}>
              <input
                type="email"
                className={inputCls(!!regErrors.email)}
                placeholder="you@example.com"
                value={regForm.email}
                onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))}
                required autoFocus
              />
            </Field>

            <Field label="Password" icon={<LockIcon />} error={regErrors.password?.[0]}>
              <input
                type={showRegPw ? 'text' : 'password'}
                className={`${inputCls(!!regErrors.password)} pr-12`}
                placeholder="Min. 6 characters"
                value={regForm.password}
                onChange={e => setRegForm(f => ({ ...f, password: e.target.value }))}
                required minLength={6}
              />
              <button type="button" onClick={() => setShowRegPw(v => !v)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600">
                <EyeIcon visible={showRegPw} />
              </button>
            </Field>

            <Field label="Confirm Password" icon={<LockIcon />} error={regErrors.password_confirmation?.[0]}>
              <input
                type={showRegConfirm ? 'text' : 'password'}
                className={`${inputCls(!!regErrors.password_confirmation)} pr-12`}
                placeholder="Repeat password"
                value={regForm.password_confirmation}
                onChange={e => setRegForm(f => ({ ...f, password_confirmation: e.target.value }))}
                required
              />
              <button type="button" onClick={() => setShowRegConfirm(v => !v)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600">
                <EyeIcon visible={showRegConfirm} />
              </button>
            </Field>

            <button
              type="submit"
              disabled={regLoading}
              className="w-full py-4 rounded-2xl text-white font-extrabold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #C41E2A, #9B1B2A)', boxShadow: '0 4px 20px rgba(196,30,42,0.4)' }}
            >
              {regLoading ? <><Spinner /> Creating account…</> : '🩸 Create Account'}
            </button>

            <p className="text-center text-xs text-gray-400 pt-1">
              Already have an account?{' '}
              <button type="button" onClick={() => setTab('login')} className="text-red-600 font-bold">
                Log in
              </button>
            </p>

            <p className="text-center text-xs text-gray-400 leading-relaxed">
              By signing up you agree to our{' '}
              <Link to="/privacy-policy" className="text-gray-500 underline">Privacy Policy</Link>
            </p>
          </form>
        )}

        {/* Trust badge */}
        <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-gray-100">
          <svg className="h-4 w-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="text-xs text-gray-400">Verified JnU community · Data secure</span>
        </div>
      </div>
    </div>
  );
}
