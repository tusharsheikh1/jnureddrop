import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const TopRightShape = () => (
  <div className="absolute top-0 right-0 w-64 h-64 overflow-hidden pointer-events-none">
    <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[#F5E6E8] mix-blend-multiply" />
  </div>
);

const LockIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const EyeIcon = ({ visible }) => visible ? (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
) : (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

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

const Spinner = () => (
  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/donor/reset-password', {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The link might be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-sm w-full">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Invalid Link</h2>
          <p className="text-gray-500 text-sm mb-6">The password reset link is missing a valid token.</p>
          <Link to="/donor/forgot-password" className="text-white bg-[#BA1C2E] px-6 py-2.5 rounded-xl font-semibold text-sm">Request New Link</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col sm:justify-center sm:items-center sm:py-12 relative font-sans">
      <div className="w-full flex-1 flex flex-col sm:flex-initial sm:max-w-md sm:rounded-3xl sm:shadow-2xl sm:overflow-hidden relative bg-white overflow-y-auto">
        <TopRightShape />

        <div className="px-6 pt-12 pb-8 z-10 relative flex-1 flex flex-col">
          <h2 className="text-2xl font-bold text-[#1E293B] mb-2 tracking-tight">Reset Password</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Create a new strong password for your account.
          </p>

          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-green-800 font-bold mb-1">Password Updated</h3>
              <p className="text-green-600 text-sm mb-6">
                Your password has been successfully reset.
              </p>
              <Link
                to="/donor/login"
                className="w-full py-3.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center transition-transform active:scale-[0.98]"
                style={{ backgroundColor: '#1E293B' }}
              >
                Log In Now
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4">
                  {error}
                </div>
              )}

              <Field icon={<LockIcon />}>
                <input
                  type={showPw ? 'text' : 'password'}
                  className={`${inputCls(false)} pr-12`}
                  placeholder="New Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required minLength={6}
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600">
                  <EyeIcon visible={showPw} />
                </button>
              </Field>

              <Field icon={<LockIcon />}>
                <input
                  type={showConfirmPw ? 'text' : 'password'}
                  className={`${inputCls(false)} pr-12`}
                  placeholder="Confirm New Password"
                  value={passwordConfirmation}
                  onChange={e => setPasswordConfirmation(e.target.value)}
                  required minLength={6}
                />
                <button type="button" onClick={() => setShowConfirmPw(v => !v)}
                  className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600">
                  <EyeIcon visible={showConfirmPw} />
                </button>
              </Field>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl text-white font-semibold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-60"
                  style={{ backgroundColor: '#BA1C2E' }}
                >
                  {loading ? <><Spinner /> Resetting…</> : 'Reset Password →'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Bottom Background Building */}
        <div className="absolute bottom-0 left-0 w-full h-40 pointer-events-none z-0" style={{
          backgroundImage: 'url(/hero_university_building_bg_for_mobile.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
          maskImage: 'linear-gradient(to bottom, transparent, black 60%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 60%)',
          opacity: 0.6
        }} />
      </div>
    </div>
  );
}
