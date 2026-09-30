import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useGoogleAuth from '../../hooks/useGoogleAuth';

/* ── SVGs & Icons ── */
const LogoSVG = ({ className }) => (
  <svg viewBox="0 0 100 120" className={className} fill="none">
    <path
      d="M50 0C50 0 5 45 5 75C5 99.8528 25.1472 120 50 120C74.8528 120 95 99.8528 95 75C95 45 50 0 50 0Z"
      fill="#BA1C2E"
    />
    <path
      d="M50 95C50 95 28 78 28 62C28 53 35 46 43 46C46.5 46 48.5 48 50 50C51.5 48 53.5 46 57 46C65 46 72 53 72 62C72 78 50 95 50 95Z"
      fill="white"
    />
    <path
      d="M22 68 C15 50 25 35 32 28"
      stroke="white"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <circle cx="42" cy="22" r="5" fill="white" />
  </svg>
);

const MailIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const LockIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
) : (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
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

const BackIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

/* ── UI Components ── */
const Field = ({ icon, error, children }) => (
  <div className="w-full">
    <div className="relative">
      <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500">{icon}</span>
      {children}
    </div>
    {error && <p className="text-red-500 text-xs mt-1.5 ml-2 flex items-center gap-1"><span>⚠</span>{error}</p>}
  </div>
);

const inputCls = (hasError) =>
  `w-full bg-transparent border rounded-[20px] pl-12 pr-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BA1C2E] focus:border-transparent transition-all ${hasError ? 'border-red-400' : 'border-gray-300'}`;

/* ── Abstract Shapes ── */
const TopRightShape = () => (
  <div className="absolute top-0 right-0 w-64 h-64 overflow-hidden pointer-events-none">
    <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[#F5E6E8] mix-blend-multiply" />
  </div>
);

const BottomGraphic = () => (
  <div className="absolute bottom-0 left-0 right-0 h-48 overflow-hidden pointer-events-none z-0">
    <div className="absolute -bottom-24 -left-12 w-64 h-64 rounded-full bg-[#F5E6E8] mix-blend-multiply" />
    <svg viewBox="0 0 400 150" className="absolute bottom-0 left-0 w-full h-full" preserveAspectRatio="none">
      <path d="M0,130 Q150,150 250,80 T350,80" fill="none" stroke="#BA1C2E" strokeWidth="2" strokeLinecap="round" />
      <path d="M290,95 L295,85 L300,105 L305,80 L310,95" fill="none" stroke="#BA1C2E" strokeWidth="2" strokeLinejoin="round" />
    </svg>
    <div className="absolute bottom-4 right-8 transform translate-x-4">
      <LogoSVG className="w-24 h-24 opacity-90" />
    </div>
  </div>
);


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
    <div className="min-h-screen bg-gray-50 flex flex-col sm:justify-center sm:items-center sm:py-12 relative font-sans">
      <div className="w-full flex-1 flex flex-col sm:flex-initial sm:max-w-md sm:rounded-3xl sm:shadow-2xl sm:overflow-hidden relative bg-white overflow-y-auto">

        {/* LOGIN VIEW */}
        {tab === 'login' && (
          <div className="flex-1 flex flex-col relative pb-8">
            <TopRightShape />

            {/* Header */}
            <div className="flex flex-col items-center pt-16 px-6 z-10">
              <LogoSVG className="w-24 h-24 mb-2" />
              <div className="text-[28px] font-bold tracking-tight mb-1">
                <span className="text-[#1E293B]">Jnu</span><span className="text-[#BA1C2E]">reddrop</span>
              </div>
              <p className="text-gray-500 text-sm font-medium mb-6">Find Blood • Save Lives</p>

              <p className="text-gray-500 text-sm text-center px-4 leading-relaxed mb-8">
                A simple platform to find blood donors and help those in need at Jagannath University and beyond.
              </p>
            </div>

            {/* Form */}
            <div className="px-6 z-10 flex-1 relative">
              <form onSubmit={handleLogin} className="space-y-4 relative z-10">
                <Field icon={<MailIcon />} error={loginErrors.email?.[0]}>
                  <input
                    type="text"
                    className={inputCls(!!loginErrors.email)}
                    placeholder="Email or Phone Number"
                    value={loginForm.email}
                    onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                    required
                  />
                </Field>

                <Field icon={<LockIcon />} error={loginErrors.password?.[0]}>
                  <input
                    type={showLoginPw ? 'text' : 'password'}
                    className={`${inputCls(!!loginErrors.password)} pr-12`}
                    placeholder="Password"
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

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full py-3.5 rounded-xl text-white font-semibold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-60"
                    style={{ backgroundColor: '#BA1C2E' }}
                  >
                    {loginLoading ? <><Spinner /> Logging in…</> : 'Log In →'}
                  </button>
                </div>

                <div className="text-center pt-2">
                  <Link to="/donor/forgot-password" className="text-sm font-medium" style={{ color: '#BA1C2E' }}>
                    Forget Password?
                  </Link>
                </div>

                <div className="flex items-center gap-3 py-2">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400">or</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <button
                  type="button"
                  onClick={() => handleGoogleLogin()}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 border rounded-[20px] py-3.5 text-sm font-semibold bg-white/80 backdrop-blur-sm hover:bg-gray-50 active:bg-gray-100 transition-all disabled:opacity-60"
                  style={{ borderColor: '#BA1C2E', color: '#1E293B' }}
                >
                  <GoogleIcon />
                  Continue with Google
                </button>

                <div className="pt-5 pb-2">
                  <button
                    type="button"
                    onClick={() => setTab('signup')}
                    className="w-full py-3.5 rounded-[20px] font-semibold text-sm flex items-center justify-center transition-transform active:scale-[0.98] shadow-sm"
                    style={{ backgroundColor: '#1E293B', color: 'white' }}
                  >
                    Create New Account
                  </button>
                </div>
              </form>
            </div>

            {/* Bottom Background Building */}
            <div className="absolute bottom-0 left-0 w-full h-64 pointer-events-none z-0" style={{
              backgroundImage: 'url(/hero_university_building_bg_for_mobile.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              maskImage: 'linear-gradient(to bottom, transparent, black 80%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 80%)',
              opacity: 0.6
            }} />
          </div>
        )}

        {/* SIGNUP VIEW */}
        {tab === 'signup' && (
          <div className="flex-1 flex flex-col relative pb-8">
            <BottomGraphic />

            {/* Header */}
            <div className="pt-6 px-4 z-10 relative">
              <button onClick={() => setTab('login')} className="p-2 text-black active:opacity-70">
                <BackIcon />
              </button>
            </div>

            <div className="flex flex-col items-start pt-2 px-6 z-10 relative">
              <div className="flex items-center gap-3 mb-2">
                <LogoSVG className="w-12 h-12" />
                <div>
                  <div className="text-2xl font-bold tracking-tight">
                    <span className="text-[#1E293B]">Jnu</span><span className="text-[#BA1C2E]">reddrop</span>
                  </div>
                  <p className="text-gray-500 text-xs font-medium mt-0.5">Find Blood • Save Lives</p>
                </div>
              </div>
            </div>

            <div className="px-6 mt-6 mb-6 z-10 relative">
              <h2 className="text-2xl font-bold text-[#1E293B] mb-2 tracking-tight">Create Your Account</h2>
              <p className="text-gray-500 text-sm leading-relaxed pr-8">
                Join our community and be a part of saving lives.
              </p>
            </div>

            {/* Form */}
            <div className="px-6 z-10 flex-1 relative pb-24">
              <form onSubmit={handleRegister} className="space-y-3.5">
                <Field icon={<MailIcon />} error={regErrors.email?.[0]}>
                  <input
                    type="email"
                    className={inputCls(!!regErrors.email)}
                    placeholder="Email Address"
                    value={regForm.email}
                    onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))}
                    required
                  />
                </Field>

                <Field icon={<LockIcon />} error={regErrors.password?.[0]}>
                  <input
                    type={showRegPw ? 'text' : 'password'}
                    className={`${inputCls(!!regErrors.password)} pr-12`}
                    placeholder="Password"
                    value={regForm.password}
                    onChange={e => setRegForm(f => ({ ...f, password: e.target.value }))}
                    required minLength={6}
                  />
                  <button type="button" onClick={() => setShowRegPw(v => !v)}
                    className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600">
                    <EyeIcon visible={showRegPw} />
                  </button>
                </Field>

                <Field icon={<LockIcon />} error={regErrors.password_confirmation?.[0]}>
                  <input
                    type={showRegConfirm ? 'text' : 'password'}
                    className={`${inputCls(!!regErrors.password_confirmation)} pr-12`}
                    placeholder="Confirm Password"
                    value={regForm.password_confirmation}
                    onChange={e => setRegForm(f => ({ ...f, password_confirmation: e.target.value }))}
                    required
                  />
                  <button type="button" onClick={() => setShowRegConfirm(v => !v)}
                    className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600">
                    <EyeIcon visible={showRegConfirm} />
                  </button>
                </Field>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={regLoading}
                    className="w-full py-3.5 rounded-xl text-white font-semibold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-60"
                    style={{ backgroundColor: '#BA1C2E' }}
                  >
                    {regLoading ? <><Spinner /> Creating account…</> : 'Sign Up →'}
                  </button>
                </div>

                <div className="relative z-20 pt-4 pb-8">
                  <button
                    type="button"
                    onClick={() => setTab('login')}
                    className="w-full py-3.5 rounded-[20px] font-semibold text-sm flex items-center justify-center transition-transform active:scale-[0.98] shadow-sm"
                    style={{ backgroundColor: '#1E293B', color: 'white' }}
                  >
                    Already have an account? Log In
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
