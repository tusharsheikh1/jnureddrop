export function LogoMark({ className }) {
  return (
    <svg viewBox="0 0 100 120" className={className} fill="none">
      <path d="M50 0C50 0 5 45 5 75C5 99.8528 25.1472 120 50 120C74.8528 120 95 99.8528 95 75C95 45 50 0 50 0Z" fill="#BA1C2E" />
      <path d="M50 95C50 95 28 78 28 62C28 53 35 46 43 46C46.5 46 48.5 48 50 50C51.5 48 53.5 46 57 46C65 46 72 53 72 62C72 78 50 95 50 95Z" fill="white" />
      <path d="M22 68 C15 50 25 35 32 28" stroke="white" strokeWidth="6" strokeLinecap="round" />
      <circle cx="42" cy="22" r="5" fill="white" />
    </svg>
  );
}

export function Logo({ className }) {
  return (
    <div className={`flex items-center gap-2.5 ${className || ''}`}>
      <LogoMark className="w-9 h-9" />
      <div className="flex flex-col justify-center">
        <div className="text-xl font-bold tracking-tight leading-none mb-0.5">
          <span className="text-[#1E293B]">Jnu</span><span className="text-[#BA1C2E]">reddrop</span>
        </div>
        <p className="text-gray-500 text-[9px] uppercase tracking-[0.15em] font-bold leading-none">Find Blood &bull; Save Lives</p>
      </div>
    </div>
  );
}
