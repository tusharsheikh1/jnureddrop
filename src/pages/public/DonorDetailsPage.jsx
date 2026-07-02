import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import ModernHeader from '../../components/ModernHeader';
import Loader from '../../components/Loader';
import SEO, { SITE_URL } from '../../components/SEO';

/* ── Helpers ── */
function getInitials(name) {
  return (name || '').split(' ').slice(0, 2).map(n => n[0] || '').join('').toUpperCase() || '?';
}

function fmtDate(str) {
  if (!str) return null;
  return new Date(str).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function canDonate(lastDonationDate) {
  if (!lastDonationDate) return true;
  return (Date.now() - new Date(lastDonationDate)) > 90 * 24 * 60 * 60 * 1000;
}

function nextEligibleDate(lastDonationDate) {
  if (!lastDonationDate) return null;
  const next = new Date(new Date(lastDonationDate).getTime() + 90 * 24 * 60 * 60 * 1000);
  return next > new Date() ? next : null;
}

/* ── Canvas helpers ── */
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r); ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r); ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r); ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r); ctx.closePath();
}

function generateDonorShareImage(donor) {
  const W = 600;
  const FONT = 'Arial, Helvetica, sans-serif';
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const location = [donor.upazila, donor.district].filter(Boolean).join(', ');
  const totalDonations = donor.donations?.length || 0;
  const eligible = canDonate(donor.last_donation_date) && donor.is_available;
  const initials = getInitials(donor.name);

  const HDR    = 100;
  const AVT    = 190;  // avatar + name + location block
  const BADGE  = 56;   // available/resting pill
  const DIV1   = 18;
  const STATS  = 88;
  const DIV2   = 18;
  const ROWS   = [
    donor.last_donation_date      && { label: 'LAST DONATED',  value: fmtDate(donor.last_donation_date) },
    (donor.gender || donor.age)   && { label: 'DONOR INFO',    value: [donor.gender, donor.age ? `${donor.age} yrs` : null].filter(Boolean).join(' · ') },
    (donor.share_phone && donor.phone) && { label: 'CONTACT',  value: donor.phone, accent: true },
  ].filter(Boolean);
  const DETAIL = ROWS.length * 62;
  const FTR    = 72;

  const H = HDR + AVT + BADGE + DIV1 + STATS + DIV2 + DETAIL + 12 + FTR;
  canvas.width = W; canvas.height = H;

  /* Background */
  ctx.fillStyle = '#FFFBFB';
  ctx.fillRect(0, 0, W, H);

  /* Header */
  const hg = ctx.createLinearGradient(0, 0, W, HDR);
  hg.addColorStop(0, '#DC2626'); hg.addColorStop(1, '#9B1C1C');
  ctx.fillStyle = hg;
  ctx.fillRect(0, 0, W, HDR);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold 22px ${FONT}`;
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillText('JnU RedDrop', 28, 50);
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = `13px ${FONT}`;
  ctx.fillText('Blood Donor Profile', 28, 74);

  /* Blood type badge — top right */
  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  roundRect(ctx, W - 100, 30, 72, 32, 16); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold 17px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText(donor.blood_type, W - 64, 50);

  /* Avatar */
  const aX = W / 2, aY = HDR + 75;
  ctx.beginPath(); ctx.arc(aX, aY, 60, 0, Math.PI * 2);
  ctx.fillStyle = '#FEE2E2'; ctx.fill();
  ctx.beginPath(); ctx.arc(aX, aY, 52, 0, Math.PI * 2);
  ctx.fillStyle = '#DC2626'; ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold 28px ${FONT}`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(initials, aX, aY);

  /* Name */
  ctx.fillStyle = '#111827';
  ctx.font = `bold 22px ${FONT}`;
  ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'center';
  ctx.fillText(donor.name, W / 2, HDR + AVT - 36);

  /* Location */
  if (location) {
    ctx.fillStyle = '#6B7280';
    ctx.font = `14px ${FONT}`;
    ctx.fillText(location, W / 2, HDR + AVT - 10);
  }

  /* Available badge */
  const bY = HDR + AVT + 12;
  ctx.fillStyle = eligible ? '#F0FDF4' : '#F9FAFB';
  roundRect(ctx, W / 2 - 110, bY, 220, 36, 18); ctx.fill();
  ctx.fillStyle = eligible ? '#16A34A' : '#9CA3AF';
  ctx.font = `bold 13px ${FONT}`;
  ctx.textBaseline = 'middle';
  ctx.fillText(eligible ? '✓ Available to Donate' : '○ Currently Resting', W / 2, bY + 18);

  /* Divider 1 */
  const d1Y = HDR + AVT + BADGE + 8;
  ctx.fillStyle = '#FEE2E2'; ctx.fillRect(28, d1Y, W - 56, 2);

  /* Stats row (3 cols) */
  const sY = d1Y + 16;
  const statCols = [
    { label: 'BLOOD TYPE',  val: donor.blood_type, color: '#DC2626' },
    { label: 'DONATIONS',   val: String(totalDonations), color: '#1F2937' },
    { label: 'STATUS',      val: eligible ? 'Available' : 'Resting', color: eligible ? '#16A34A' : '#9CA3AF' },
  ];
  const cW = W / 3;
  statCols.forEach(({ label, val, color }, i) => {
    const cx = cW * i + cW / 2;
    ctx.fillStyle = '#9CA3AF'; ctx.font = `10px ${FONT}`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillText(label, cx, sY + 16);
    ctx.fillStyle = color; ctx.font = `bold 20px ${FONT}`;
    ctx.fillText(val, cx, sY + 44);
    if (i < 2) { ctx.fillStyle = '#F3F4F6'; ctx.fillRect(cW * (i + 1), sY + 4, 1, 50); }
  });

  /* Divider 2 */
  const d2Y = sY + STATS;
  ctx.fillStyle = '#FEE2E2'; ctx.fillRect(28, d2Y, W - 56, 2);

  /* Detail rows */
  let ry = d2Y + 18;
  ctx.textAlign = 'left';
  ROWS.forEach(({ label, value, accent }, i) => {
    if (i % 2 === 0) { ctx.fillStyle = '#FFF8F8'; ctx.fillRect(0, ry - 4, W, 62); }
    ctx.fillStyle = '#9CA3AF'; ctx.font = `11px ${FONT}`; ctx.textBaseline = 'alphabetic';
    ctx.fillText(label, 30, ry + 14);
    ctx.fillStyle = accent ? '#DC2626' : '#111827'; ctx.font = `bold 15px ${FONT}`;
    ctx.fillText(String(value), 30, ry + 38);
    ry += 62;
  });

  /* Footer */
  const fY = H - FTR;
  const fg = ctx.createLinearGradient(0, fY, 0, H);
  fg.addColorStop(0, '#1F2937'); fg.addColorStop(1, '#111827');
  ctx.fillStyle = fg; ctx.fillRect(0, fY, W, FTR);
  ctx.fillStyle = '#F9FAFB'; ctx.font = `bold 14px ${FONT}`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('Contact this donor to help save a life', W / 2, fY + 22);
  ctx.fillStyle = '#EF4444'; ctx.font = `12px ${FONT}`;
  const url = window.location.href;
  ctx.fillText(url.length > 72 ? url.slice(0, 69) + '…' : url, W / 2, fY + 50);

  return canvas.toDataURL('image/png');
}

/* ── Share Modal ── */
function ShareModal({ donor, onClose }) {
  const [imgUrl, setImgUrl] = useState(null);
  const [copied, setCopied] = useState(false);
  const [dlDone, setDlDone] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setImgUrl(generateDonorShareImage(donor)));
    return () => cancelAnimationFrame(id);
  }, [donor]);

  const copyLink = async () => {
    const url = window.location.href;
    try { await navigator.clipboard.writeText(url); }
    catch {
      const ta = document.createElement('textarea');
      ta.value = url; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
    }
    setCopied(true); setTimeout(() => setCopied(false), 2500);
  };

  const downloadImage = () => {
    if (!imgUrl) return;
    const a = document.createElement('a');
    a.href = imgUrl;
    a.download = `donor-${donor.blood_type}-${donor.id}.png`;
    a.click();
    setDlDone(true); setTimeout(() => setDlDone(false), 2500);
  };

  const nativeShare = async () => {
    if (!imgUrl) return;
    try {
      const blob = await (await fetch(imgUrl)).blob();
      const file = new File([blob], `donor-${donor.blood_type}.png`, { type: 'image/png' });
      const canShareFiles = navigator.canShare?.({ files: [file] });
      await navigator.share({
        title: `${donor.blood_type} blood donor — ${donor.name}`,
        text: `${donor.name} is a ${donor.blood_type} blood donor${donor.district ? ` in ${donor.district}` : ''}. Contact them to donate!\n${window.location.href}`,
        ...(canShareFiles ? { files: [file] } : { url: window.location.href }),
      });
    } catch { /* cancelled */ }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">Share Donor Profile</h2>
            <p className="text-xs text-gray-400 mt-0.5">Help others find this donor</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="px-4 pt-4">
          <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50" style={{ maxHeight: 280, overflow: 'hidden' }}>
            {imgUrl ? (
              <img src={imgUrl} alt="Donor share card" className="w-full" style={{ display: 'block' }} />
            ) : (
              <div className="h-56 animate-pulse bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            )}
          </div>
          <p className="text-center text-[11px] text-gray-400 mt-1.5 mb-0">Preview — scroll for full card</p>
        </div>

        <div className="p-4 space-y-2.5">
          <button
            onClick={downloadImage} disabled={!imgUrl}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
          >
            {dlDone ? (
              <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>Image Saved!</>
            ) : (
              <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>Download Image</>
            )}
          </button>

          <button
            onClick={copyLink}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-xl text-sm transition-colors"
          >
            {copied ? (
              <><svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg><span className="text-green-600">Link Copied!</span></>
            ) : (
              <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>Copy Link</>
            )}
          </button>

          {typeof navigator !== 'undefined' && navigator.share && (
            <button
              onClick={nativeShare}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-xl text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
              </svg>
              Share via…
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Icons ── */
function IconDrop()     { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>; }
function IconCalendar() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function IconShield()   { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>; }
function IconLocation() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
function IconPhone()    { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>; }
function IconEmail()    { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>; }

/* ── Main Page ── */
export default function DonorDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  const [donor, setDonor]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    api.get(`/donors/${id}`)
      .then(r => setDonor(r.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!donor)  return <div className="min-h-screen flex items-center justify-center text-gray-500 font-sans">Donor not found.</div>;

  const isProfileComplete = isLoggedIn && user?.name && user?.blood_type && user?.district && user?.phone;
  const eligible          = canDonate(donor.last_donation_date) && donor.is_available;
  const nextDate          = nextEligibleDate(donor.last_donation_date);
  const location          = [donor.upazila, donor.district].filter(Boolean).join(', ');
  const totalDonations    = donor.donations?.length ?? 0;
  const thisYearDonations = donor.donations?.filter(d => new Date(d.donation_date).getFullYear() === new Date().getFullYear()).length ?? 0;

  const ShareBtn = (
    <button
      onClick={() => setShareOpen(true)}
      className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
      aria-label="Share profile"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>
    </button>
  );

  const donorBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Find Donors', item: `${SITE_URL}/find` },
      { '@type': 'ListItem', position: 3, name: donor.name, item: `${SITE_URL}/donors/${id}` },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-32 md:pb-12 md:pt-8">
      <SEO
        title={`${donor.name} — ${donor.blood_type} Donor`}
        description={`${donor.name} is a verified ${donor.blood_type} blood donor${location ? ` from ${location}` : ''} at Jagannath University. Contact them on JnU RedDrop.`}
        url={`/donors/${id}`}
        jsonLd={donorBreadcrumb}
      />
      <ModernHeader title="Donor Profile" rightNode={ShareBtn} />

      <div className="max-w-2xl mx-auto bg-white md:rounded-3xl md:shadow-sm md:border border-gray-100 overflow-hidden relative md:min-h-0">

        {/* Desktop back */}
        <div className="hidden md:flex p-6 pb-0">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-medium text-sm transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back to Search
          </button>
        </div>

        {/* Profile hero */}
        <div className="px-4 md:px-6 py-2 mt-2 md:mt-4">
          <div className="bg-[#FFF5F5] rounded-3xl p-5">

            <div className="flex gap-4 items-start mb-6">
              {/* Avatar */}
              <div className="w-20 h-20 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden relative">
                {donor.photo_url ? (
                  <img src={donor.photo_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-gray-400">{getInitials(donor.name)}</span>
                )}
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-bold text-gray-900 leading-tight">{donor.name}</h2>
                    <span className="bg-red-100 text-red-600 font-extrabold text-[11px] px-1.5 py-0.5 rounded">{donor.blood_type}</span>
                  </div>
                  <span className={`flex items-center gap-1.5 border font-semibold text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm ${
                    eligible
                      ? 'bg-white border-green-200 text-green-600'
                      : 'bg-white border-gray-200 text-gray-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${eligible ? 'bg-green-500' : 'bg-gray-300'}`} />
                    {eligible ? 'Available' : 'Resting'}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <IconLocation />
                    <span className="truncate">{location || 'Location not set'}</span>
                  </div>
                  {!isProfileComplete ? (
                    <div className="flex items-center gap-2 text-gray-400 mt-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      <span className="truncate italic font-medium">Complete profile to view contact</span>
                    </div>
                  ) : (
                    <>
                      {donor.share_phone && donor.phone && (
                        <div className="flex items-center gap-2"><IconPhone /><span className="truncate">{donor.phone}</span></div>
                      )}
                      <div className="flex items-center gap-2"><IconEmail /><span className="truncate">{donor.email}</span></div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: <IconDrop />,     value: totalDonations,    label: 'Total Donations' },
                { icon: <IconCalendar />, value: thisYearDonations, label: 'This Year' },
                { icon: <IconShield />,   value: '100%',            label: 'Verified' },
              ].map(({ icon, value, label }) => (
                <div key={label} className="bg-white rounded-2xl p-3 flex flex-col items-center justify-center shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]">
                  <div className="bg-red-50 w-8 h-8 rounded-full flex items-center justify-center mb-1">{icon}</div>
                  <span className="font-bold text-red-600 text-sm leading-tight">{value}</span>
                  <span className="text-[10px] text-gray-500 font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 md:px-6 mt-6 space-y-7 pb-4">

          {/* Blood Information */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 text-[15px]">Blood Information</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <IconDrop /><span>Blood Group</span>
                </div>
                <span className="font-bold text-red-600">{donor.blood_type}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  <span>Last Donated</span>
                </div>
                <span className="text-sm text-gray-600">{fmtDate(donor.last_donation_date) || 'Never'}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <IconCalendar /><span>Eligible to Donate</span>
                </div>
                <span className={`text-sm font-semibold ${eligible ? 'text-green-600' : 'text-gray-500'}`}>
                  {eligible ? 'Now' : nextDate ? fmtDate(nextDate.toISOString()) : 'Check back later'}
                </span>
              </div>
              {(donor.gender || donor.age) && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <span>Donor Info</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {[donor.gender, donor.age ? `${donor.age} yrs` : null].filter(Boolean).join(' · ')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Donation history */}
          {donor.donations && donor.donations.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-900 mb-3 text-[15px]">Recent Donations</h3>
              <div className="space-y-3">
                {donor.donations.slice(0, 3).map((d, i) => (
                  <div key={i} className="flex items-center gap-3 border border-gray-100 rounded-2xl p-3 shadow-sm">
                    <div className="bg-red-50 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"><IconDrop /></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-900 text-sm">{fmtDate(d.donation_date)}</div>
                      <div className="text-xs text-gray-500 truncate">{d.hospital_name || 'Unknown Hospital'}</div>
                    </div>
                    <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-1 rounded-md">Completed</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Availability status card */}
          <div className={`flex items-center justify-between border rounded-2xl p-4 shadow-sm ${eligible ? 'border-green-100 bg-green-50/30' : 'border-gray-100'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${eligible ? 'bg-green-100' : 'bg-gray-100'}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={eligible ? 'text-green-600' : 'text-gray-400'}>
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <div className="font-bold text-gray-900 text-sm">
                  {eligible ? 'Available for Donation' : 'Currently Resting'}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {eligible
                    ? 'This donor can donate blood now.'
                    : nextDate
                      ? `Eligible again on ${fmtDate(nextDate.toISOString())}.`
                      : 'Set availability off by donor.'}
                </div>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${eligible ? 'bg-green-500' : 'bg-gray-300'}`}>
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${eligible ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur border-t border-gray-100 z-50 pb-safe md:static md:border-t-0 md:bg-transparent md:backdrop-blur-none md:p-6 md:max-w-2xl md:mx-auto">
        <div className="flex gap-3">
          {!isProfileComplete ? (
            <Link to="/donor/profile/edit" className="flex-1 flex bg-red-700 rounded-2xl h-14 items-center justify-center text-white font-semibold shadow-md gap-2 text-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Complete profile to contact
            </Link>
          ) : (
            <div className="flex-1 flex bg-red-700 rounded-2xl overflow-hidden h-14 shadow-md">
              <a
                href={donor.share_phone && donor.phone ? `https://wa.me/${donor.phone.replace(/\D/g, '')}` : `mailto:${donor.email}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 text-white font-semibold hover:bg-red-800 transition-colors text-sm"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 1.7.43 3.3 1.18 4.7L2 22l5.43-1.14C8.75 21.58 10.33 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm4.33 14.15c-.21.58-1.22 1.13-1.72 1.18-.46.04-1.07.15-3.32-.78-2.7-1.12-4.44-3.89-4.57-4.06-.13-.17-1.09-1.45-1.09-2.77 0-1.31.68-1.96.93-2.22.25-.26.54-.33.72-.33s.36 0 .52.01c.17 0 .4-.06.63.49.23.57.78 1.91.85 2.04.07.13.11.28.03.45s-.13.28-.26.43c-.13.15-.28.32-.39.43-.13.13-.26.28-.11.53.15.25.68 1.12 1.47 1.83.99.88 1.84 1.16 2.09 1.29.25.13.4.11.55-.06.15-.17.65-.75.83-1.01.17-.26.35-.22.58-.13.23.09 1.48.7 1.74.83.26.13.43.2.49.31.06.11.06.65-.15 1.23z"/>
                </svg>
                Message
              </a>
              <div className="w-px bg-red-800 my-3" />
              {donor.share_phone && donor.phone ? (
                <a href={`tel:${donor.phone}`} className="flex-1 flex items-center justify-center gap-2 text-white font-semibold hover:bg-red-800 transition-colors text-sm">
                  <IconPhone />Call
                </a>
              ) : (
                <div className="flex-1 flex items-center justify-center gap-2 text-white/40 font-semibold text-sm cursor-not-allowed">
                  <IconPhone />Call
                </div>
              )}
            </div>
          )}

          {/* Share button */}
          <button
            onClick={() => setShareOpen(true)}
            className="w-14 h-14 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors flex-shrink-0"
            aria-label="Share profile"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </button>
        </div>
      </div>

      {shareOpen && <ShareModal donor={donor} onClose={() => setShareOpen(false)} />}
    </div>
  );
}
