import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';

const DISMISS_KEY = 'app_install_banner_dismissed';

export default function AppInstallBanner() {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(DISMISS_KEY) === '1'
  );
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const t = setTimeout(() => setShow(true), 400);
    return () => clearTimeout(t);
  }, [dismissed]);

  // Never advertise the app inside the app itself.
  if (Capacitor.isNativePlatform() || dismissed) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1');
    setShow(false);
    setTimeout(() => setDismissed(true), 300);
  };

  return (
    <div className="sm:hidden fixed top-[4.5rem] inset-x-2 z-40 pointer-events-none">
      <div
        className={`pointer-events-auto bg-white/60 backdrop-blur-xl backdrop-saturate-150 shadow-xl shadow-black/10 rounded-2xl border border-white/40 ring-1 ring-black/5 p-3 flex items-center gap-3 transition-all duration-300 ease-out ${
          show ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0'
        }`}
      >
        <img
          src="/logo.png"
          alt="JnU RedDrop"
          className="h-11 w-11 rounded-xl object-cover flex-shrink-0"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-gray-900 truncate">JnU RedDrop App</p>
          <p className="text-xs text-gray-500 truncate">Faster & easier on the app</p>
        </div>
        <a
          href="/ReddropJNU.apk"
          download
          className="bg-red-700/90 backdrop-blur text-white text-xs font-bold px-3.5 py-2 rounded-full hover:bg-red-800/90 transition-colors whitespace-nowrap flex-shrink-0"
        >
          Get App
        </a>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
