import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const TopRightShape = () => (
  <div className="absolute top-0 right-0 w-64 h-64 overflow-hidden pointer-events-none">
    <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[#F5E6E8] mix-blend-multiply" />
  </div>
);

const MailIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await api.post('/donor/forgot-password', { email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col sm:justify-center sm:items-center sm:py-12 relative font-sans">
      <div className="w-full flex-1 flex flex-col sm:flex-initial sm:max-w-md sm:rounded-3xl sm:shadow-2xl sm:overflow-hidden relative bg-white overflow-y-auto">
        <TopRightShape />

        <div className="px-6 pt-10 pb-8 z-10 relative flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <Link to="/donor/login" className="p-2 -ml-2 text-black active:opacity-70 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-[#1E293B] mb-2 tracking-tight">Forget Password?</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Enter your email address and we'll send you instructions to reset your password.
          </p>

          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-green-800 font-bold mb-1">Check Your Email</h3>
              <p className="text-green-600 text-sm">
                We've sent a password reset link to {email}.
              </p>
              <Link
                to="/donor/login"
                className="mt-6 w-full py-3.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center transition-transform active:scale-[0.98]"
                style={{ backgroundColor: '#1E293B' }}
              >
                Return to Log In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field icon={<MailIcon />} error={error}>
                <input
                  type="email"
                  className={inputCls(!!error)}
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </Field>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl text-white font-semibold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-60"
                  style={{ backgroundColor: '#BA1C2E' }}
                >
                  {loading ? <><Spinner /> Sending…</> : 'Send Reset Link →'}
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
