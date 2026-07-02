import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function ExclamationIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function ResendForm({ initialEmail, onSuccess }) {
  const { resendVerification } = useAuth();
  const [email, setEmail] = useState(initialEmail ?? '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await resendVerification(email);
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="mt-4 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 text-center">
        Verification email sent! Please check your inbox (and spam folder).
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Your email address</label>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition"
        />
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-red-700 hover:bg-red-800 disabled:bg-red-300 text-white font-bold py-3 rounded-xl transition-colors text-sm"
      >
        {loading ? 'Sending…' : 'Resend Verification Email'}
      </button>
    </form>
  );
}

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const status = searchParams.get('status');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (status !== 'verified') return;
    if (countdown === 0) {
      if (user) {
        navigate('/donor/profile/edit', { state: { newUser: true, message: 'Please complete your profile to continue.' } });
      } else {
        navigate('/donor/login');
      }
      return;
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [status, countdown, user, navigate]);

  const Logo = () => (
    <div className="flex items-center gap-3 mb-8">
      <img src="/logo.png" alt="JnURedDrop logo" className="w-14 h-14 object-contain" />
      <div>
        <div className="text-2xl font-extrabold leading-tight tracking-tight">
          <span className="text-gray-900">JnU</span><span className="text-red-600">RedDrop</span>
        </div>
        <div className="text-sm text-gray-400 font-normal">Donate Blood, Save Lives</div>
      </div>
    </div>
  );

  const Wrapper = ({ children }) => (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-5 pt-10 pb-10 md:pt-16 flex flex-col">
        <Logo />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-8 text-center">
          {children}
        </div>
      </div>
    </div>
  );

  if (status === 'verified') {
    const dest = user ? '/donor/profile/edit' : '/donor/login';
    const destLabel = user ? 'Complete Your Profile' : 'Go to Login';
    return (
      <Wrapper>
        <div className="flex justify-center mb-4"><CheckIcon /></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h1>
        <p className="text-gray-500 text-sm mb-2">
          Your email address has been successfully verified.
        </p>
        <p className="text-gray-400 text-xs mb-6">
          Redirecting you in <span className="font-bold text-red-600">{countdown}</span>s…
        </p>
        <Link
          to={dest}
          state={user ? { newUser: true, message: 'Please complete your profile to continue.' } : undefined}
          className="inline-block w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
        >
          {destLabel}
        </Link>
      </Wrapper>
    );
  }

  if (status === 'already-verified') {
    return (
      <Wrapper>
        <div className="flex justify-center mb-4"><CheckIcon /></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Already Verified</h1>
        <p className="text-gray-500 text-sm mb-6">
          Your email is already verified. You can log in to your account.
        </p>
        <Link
          to={user ? '/donor/dashboard' : '/donor/login'}
          className="inline-block w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
        >
          {user ? 'Go to Dashboard' : 'Go to Login'}
        </Link>
      </Wrapper>
    );
  }

  if (status === 'invalid') {
    return (
      <Wrapper>
        <div className="flex justify-center mb-4"><ExclamationIcon /></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Expired or Invalid</h1>
        <p className="text-gray-500 text-sm mb-6">
          This verification link has expired or is invalid. Request a new one below.
        </p>
        <ResendForm initialEmail={user?.email ?? ''} />
      </Wrapper>
    );
  }

  // Default: check-your-email state (just registered)
  return (
    <Wrapper>
      <div className="flex justify-center mb-4"><MailIcon /></div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
      <p className="text-gray-500 text-sm mb-1">
        We sent a verification link to:
      </p>
      {user?.email && (
        <p className="font-semibold text-gray-800 text-sm mb-4">{user.email}</p>
      )}
      <p className="text-gray-400 text-xs mb-6">
        Click the link in the email to verify your account. Check your spam folder if you don't see it within a few minutes.
      </p>

      <div className="border-t border-gray-100 pt-5">
        <p className="text-xs text-gray-500 mb-3">Didn't receive the email?</p>
        <ResendForm initialEmail={user?.email ?? ''} />
      </div>

      <p className="text-xs text-gray-400 mt-5">
        Want to explore first?{' '}
        <Link to="/donor/dashboard" className="text-red-600 font-semibold hover:underline">
          Go to dashboard
        </Link>
      </p>
    </Wrapper>
  );
}
