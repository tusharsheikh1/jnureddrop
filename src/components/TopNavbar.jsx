import { useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { LogoMark } from './Logo';

const DISMISS_KEY = 'app_install_banner_dismissed';

export default function TopNavbar() {
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
    <div className="bg-red-50 border-b border-red-100 px-4 py-2 flex items-center justify-between sm:hidden">
      <div className="flex items-center gap-3 overflow-hidden">
        <LogoMark className="h-6 w-6 flex-shrink-0" />
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-gray-900 truncate">JnU RedDrop App</span>
          <span className="text-[10px] font-medium text-gray-600 truncate">Faster & easier on the app</span>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <a
          href="/ReddropJNU.apk"
          download
          className="bg-red-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-full shadow-sm hover:bg-red-700 transition-colors"
        >
          Get App
        </a>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="p-1 -mr-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
