import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';

export default function DonorLoginPage() {
  const { donorLogin, donorGoogleLogin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailUnverified, setEmailUnverified] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setErrors({});
      setLoading(true);
      try {
        const data = await donorGoogleLogin(tokenResponse.access_token);
        if (data.is_new_user) {
          navigate('/donor/profile/edit', { state: { newUser: true, message: 'Please complete your profile to continue.' } });
        } else {
          navigate('/donor/dashboard');
        }
      } catch (err) {
        const data = err.response?.data;
        setErrors({ email: [data?.message ?? 'Google Login failed.'] });
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setErrors({ email: ['Google Login Failed.'] });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setEmailUnverified(false);
    setLoading(true);
    try {
      const data = await donorLogin(form.email, form.password);
      const donor = data?.donor;
      const profileIncomplete = donor && (!donor.age || !donor.gender || !donor.height_cm || !donor.weight_kg || !donor.blood_type || !donor.district);
      
      if (profileIncomplete) {
        navigate('/donor/profile/edit', { state: { newUser: true, message: 'Please complete your profile to continue.' } });
      } else {
        navigate('/donor/dashboard');
      }
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;

      if (data?.email_unverified) {
        setEmailUnverified(true);
      } else if (data?.errors) {
        setErrors(data.errors);
      } else if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setErrors({ email: ['Server is taking too long. Please try again.'] });
      } else if (status === 429) {
        setErrors({ email: ['Too many attempts. Please wait a minute and try again.'] });
      } else if (status === 500) {
        setErrors({ email: ['Server error. Please try again in a moment.'] });
      } else if (!err.response) {
        setErrors({ email: ['Network error. Check your connection and try again.'] });
      } else {
        setErrors({ email: [data?.message ?? 'Login failed.'] });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
    <div className="max-w-md mx-auto px-5 pt-10 pb-10 md:pt-16 md:pb-16 flex flex-col">

      {/* Back button - mobile only */}
      <button
        onClick={() => navigate(-1)}
        className="self-start text-gray-700 hover:text-gray-900 mb-6 md:hidden"
        aria-label="Go back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      {/* Logo */}
      <div className="flex items-center gap-3 mb-7">
        <img src="/logo.png" alt="JnURedDrop logo" className="w-16 h-16 object-contain" />

        <div>
          <div className="text-2xl font-extrabold leading-tight tracking-tight">
            <span className="text-gray-900">JnU</span><span className="text-red-600">RedDrop</span>
          </div>
          <div className="text-sm text-gray-400 font-normal">Donate Blood, Save Lives</div>
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
      <p className="text-gray-500 text-sm leading-relaxed mb-7">
        Sign in to continue and help save lives.
      </p>

      {/* White card containing the entire form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-6">
        <div className="space-y-4">
          
          {/* Custom Google Button - Now at the Top */}
          <button
            type="button"
            onClick={() => handleGoogleLogin()}
            disabled={loading}
            className="w-full bg-white border border-gray-200 rounded-xl py-4 flex items-center justify-center gap-3 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-1 group relative overflow-hidden"
          >
            {/* Subtle highlight effect on hover */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-gray-100 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full duration-1000 ease-in-out transition-all -translate-x-full"></span>
            
            <svg className="h-5 w-5 relative z-10" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="relative z-10 text-gray-800">Continue with Google</span>
          </button>

          {/* OR divider */}
          <div className="flex items-center gap-3 py-2">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {!showEmailForm ? (
          /* Email option button — expands into the form when clicked */
          <button
            type="button"
            onClick={() => setShowEmailForm(true)}
            disabled={loading}
            className="w-full bg-white border border-gray-200 rounded-xl py-4 flex items-center justify-center gap-3 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-gray-800">Log in with Email</span>
          </button>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-4 animate-fade-slide-in">
            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  className={`w-full border rounded-xl pl-11 pr-4 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                  autoFocus
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`w-full border rounded-xl pl-11 pr-12 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute inset-y-0 right-3.5 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>}
              <div className="text-right mt-2">
                <Link to="/donor/forgot-password" className="text-sm font-medium text-red-600 hover:text-red-700">
                  Forgot Password?
                </Link>
              </div>
            </div>

            {emailUnverified && (
              <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
                <p className="font-semibold mb-1">Email not verified</p>
                <p className="text-xs text-amber-700 mb-3">
                  Please verify your email before logging in. Check your inbox for a verification link.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/donor/verify-email')}
                  className="text-xs font-bold text-red-700 hover:underline"
                >
                  Resend verification email →
                </button>
              </div>
            )}

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-700 hover:bg-red-800 disabled:bg-red-300 text-white font-bold py-4 rounded-xl transition-colors text-base tracking-wide flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>
          )}

          {/* Sign up link */}
          <p className="text-center text-sm text-gray-500 pt-3">
            Don't have an account?{' '}
            <Link to="/donor/register" className="text-red-600 font-bold hover:text-red-700">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* Security note — outside card */}
      <div className="mt-6 flex items-start gap-3 px-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <p className="text-xs text-gray-500 leading-relaxed pt-1">
          All donors are verified members of the community.<br />
          Your information is safe and secure.
        </p>
      </div>

    </div>
    </div>
  );
}
