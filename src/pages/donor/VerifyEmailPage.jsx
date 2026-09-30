import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/* ── SVGs & Icons (from LoginPage) ── */
const LogoSVG = ({ className }) => (
  <svg viewBox="0 0 100 120" className={className} fill="none">
    <path d="M50 0C50 0 5 45 5 75C5 99.8528 25.1472 120 50 120C74.8528 120 95 99.8528 95 75C95 45 50 0 50 0Z" fill="#BA1C2E" />
    <path d="M50 95C50 95 28 78 28 62C28 53 35 46 43 46C46.5 46 48.5 48 50 50C51.5 48 53.5 46 57 46C65 46 72 53 72 62C72 78 50 95 50 95Z" fill="white" />
    <path d="M22 68 C15 50 25 35 32 28" stroke="white" strokeWidth="6" strokeLinecap="round" />
    <circle cx="42" cy="22" r="5" fill="white" />
  </svg>
);

const TopRightShape = () => (
  <div className="absolute top-0 right-0 w-64 h-64 overflow-hidden pointer-events-none">
    <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[#F5E6E8] mix-blend-multiply" />
  </div>
);

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#BA1C2E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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

function ResendForm({ userEmail, onSuccess }) {
  const { resendVerification } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userEmail) {
      setError('No email found. Please log in first.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await resendVerification(userEmail);
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
      <div className="mt-6 rounded-2xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 text-center font-medium">
        Verification email sent! Please check your inbox (and spam folder).
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      {error && <p className="text-red-500 text-xs mb-3 text-center">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl text-[#BA1C2E] border border-[#BA1C2E] font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-60 bg-white"
      >
        {loading ? 'Sending…' : 'Resend Verification Email'}
      </button>
    </form>
  );
}

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const { user, isProfileComplete } = useAuth();
  const navigate = useNavigate();
  const status = searchParams.get('status');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (status !== 'verified') return;
    if (countdown === 0) {
      if (user) {
        if (isProfileComplete) {
          navigate('/donor/dashboard');
        } else {
          navigate('/donor/profile/edit', { state: { newUser: true, message: 'Please complete your profile to continue.' } });
        }
      } else {
        navigate('/donor/login');
      }
      return;
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [status, countdown, user, isProfileComplete, navigate]);

  const Header = () => (
    <div className="flex flex-col items-center pt-16 px-6 z-10 relative">
      <LogoSVG className="w-24 h-24 mb-2" />
      <div className="text-[28px] font-bold tracking-tight mb-1">
        <span className="text-[#1E293B]">Jnu</span><span className="text-[#BA1C2E]">reddrop</span>
      </div>
      <p className="text-gray-500 text-sm font-medium mb-8">Find Blood • Save Lives</p>
    </div>
  );

  const Wrapper = ({ children }) => (
    <div className="min-h-screen bg-gray-50 flex flex-col sm:justify-center sm:items-center sm:py-12 relative font-sans">
      <div className="w-full flex-1 flex flex-col sm:flex-initial sm:max-w-md sm:rounded-3xl sm:shadow-2xl sm:overflow-hidden relative bg-white overflow-y-auto">
        <TopRightShape />
        <Header />
        <div className="px-6 pb-12 z-10 relative flex-1 flex flex-col items-center text-center">
          {children}
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

  if (status === 'verified') {
    const dest = user ? (isProfileComplete ? '/donor/dashboard' : '/donor/profile/edit') : '/donor/login';
    const destLabel = user ? (isProfileComplete ? 'Go to Dashboard' : 'Complete Your Profile') : 'Go to Login';
    return (
      <Wrapper>
        <div className="flex justify-center mb-4"><CheckIcon /></div>
        <h1 className="text-2xl font-bold text-[#1E293B] mb-2 tracking-tight">Email Verified!</h1>
        <p className="text-gray-500 text-sm mb-2">
          Your email address has been successfully verified.
        </p>
        <p className="text-gray-400 text-xs mb-8">
          Redirecting you in <span className="font-bold text-[#BA1C2E]">{countdown}</span>s…
        </p>
        <Link
          to={dest}
          state={user && !isProfileComplete ? { newUser: true, message: 'Please complete your profile to continue.' } : undefined}
          className="w-full py-3.5 rounded-xl text-white font-semibold text-base flex items-center justify-center transition-transform active:scale-[0.98]"
          style={{ backgroundColor: '#BA1C2E' }}
        >
          {destLabel} →
        </Link>
      </Wrapper>
    );
  }

  if (status === 'already-verified') {
    return (
      <Wrapper>
        <div className="flex justify-center mb-4"><CheckIcon /></div>
        <h1 className="text-2xl font-bold text-[#1E293B] mb-2 tracking-tight">Already Verified</h1>
        <p className="text-gray-500 text-sm mb-8">
          Your email is already verified. You can log in to your account.
        </p>
        <Link
          to={user ? '/donor/dashboard' : '/donor/login'}
          className="w-full py-3.5 rounded-xl text-white font-semibold text-base flex items-center justify-center transition-transform active:scale-[0.98]"
          style={{ backgroundColor: '#BA1C2E' }}
        >
          {user ? 'Go to Dashboard' : 'Go to Login'} →
        </Link>
      </Wrapper>
    );
  }

  if (status === 'invalid') {
    return (
      <Wrapper>
        <div className="flex justify-center mb-4"><ExclamationIcon /></div>
        <h1 className="text-2xl font-bold text-[#1E293B] mb-2 tracking-tight">Link Invalid</h1>
        <p className="text-gray-500 text-sm mb-2">
          This verification link has expired or is invalid. Request a new one below.
        </p>
        <div className="w-full">
          <ResendForm userEmail={user?.email} />
        </div>
      </Wrapper>
    );
  }

  // Default: check-your-email state (just registered)
  return (
    <Wrapper>
      <div className="flex justify-center mb-4"><MailIcon /></div>
      <h1 className="text-2xl font-bold text-[#1E293B] mb-2 tracking-tight">Check Your Email</h1>
      <p className="text-gray-500 text-sm mb-1">
        We sent a verification link to:
      </p>
      {user?.email ? (
        <p className="font-semibold text-gray-800 text-base mb-4">{user.email}</p>
      ) : (
        <p className="text-gray-400 text-sm mb-4">your email address</p>
      )}
      <p className="text-gray-500 text-xs mb-8 leading-relaxed max-w-xs">
        Click the link in the email to verify your account. Check your spam folder if you don't see it.
      </p>

      <div className="w-full">
        <ResendForm userEmail={user?.email} />
      </div>

      {!isProfileComplete && (
        <div className="w-full mt-4">
          <Link
            to="/donor/dashboard"
            className="w-full py-3.5 rounded-xl text-white font-semibold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-md"
            style={{ backgroundColor: '#1E293B' }}
          >
            Go to Dashboard →
          </Link>
          <p className="text-xs text-gray-400 mt-3">You can verify your email later</p>
        </div>
      )}
    </Wrapper>
  );
}
