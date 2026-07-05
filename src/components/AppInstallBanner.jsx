import { useState } from 'react';
import { Capacitor } from '@capacitor/core';

const DISMISS_KEY = 'app_install_banner_dismissed';

export default function AppInstallBanner() {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(DISMISS_KEY) === '1'
  );

  // Never advertise the app inside the app itself.
  if (Capacitor.isNativePlatform() || dismissed) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1');
    setDismissed(true);
  };

  return (
    <div className="bg-gradient-to-r from-red-700 to-red-600 text-white">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <p className="text-xs sm:text-sm font-medium truncate">
            <span className="hidden sm:inline">Get the JnU RedDrop Android app — </span>
            <span className="sm:hidden">JnU RedDrop app — </span>
            faster access to donors &amp; requests
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href="/ReddropJNU.apk"
            download
            className="bg-white text-red-700 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap"
          >
            Download App
          </a>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss"
            className="p-1 rounded-lg hover:bg-white/15 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
