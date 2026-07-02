import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import ModernHeader from '../../components/ModernHeader';
import Loader from '../../components/Loader';
import SEO, { SITE_URL } from '../../components/SEO';

/* ── Helpers ── */
function formatDate(str) {
  if (!str) return null;
  const d = new Date(str);
  const today = new Date();
  const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1);
  const sameDay = (a, b) => a.toDateString() === b.toDateString();
  const time = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  if (sameDay(d, today)) return `Today, ${time}`;
  if (sameDay(d, tomorrow)) return `Tomorrow, ${time}`;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

/* ── Canvas helpers ── */
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function wrapText(ctx, text, x, y, maxWidth, lineH, maxLines = 99) {
  const words = String(text || '').split(' ');
  let line = '';
  let count = 0;
  for (const word of words) {
    if (count >= maxLines) break;
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = word; y += lineH; count++;
    } else { line = test; }
  }
  if (line && count < maxLines) ctx.fillText(line, x, y);
}

function generateShareImage(req) {
  const W = 600;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const FONT = 'Arial, Helvetica, sans-serif';

  const location = [req.upazila, req.district].filter(Boolean).join(', ');
  const notes = req.additional_notes || req.notes;

  const rows = [
    { label: 'PATIENT',      value: req.patient_name },
    { label: 'HOSPITAL',     value: req.hospital_name },
    req.hospital_location && { label: 'ADDRESS',  value: req.hospital_location },
    location              && { label: 'LOCATION', value: location },
    req.disease           && { label: 'CONDITION', value: req.disease },
    { label: 'UNITS NEEDED', value: `${req.blood_quantity || 1} bag${(req.blood_quantity || 1) > 1 ? 's' : ''} of ${req.blood_type}` },
    req.contact_number    && { label: 'CONTACT',   value: req.contact_number },
    req.needed_date       && { label: 'NEEDED BY', value: formatDate(req.needed_date) || 'ASAP' },
  ].filter(Boolean);

  const HDR  = 108;
  const HERO = 168;
  const ROW  = 62;
  const NTS  = notes ? 86 : 0;
  const FTR  = 72;
  const H    = HDR + HERO + 28 + rows.length * ROW + NTS + FTR;

  canvas.width  = W;
  canvas.height = H;

  /* ── Background ── */
  ctx.fillStyle = '#FFFBFB';
  ctx.fillRect(0, 0, W, H);

  /* ── Header gradient ── */
  const hGrad = ctx.createLinearGradient(0, 0, W, HDR);
  hGrad.addColorStop(0, '#DC2626');
  hGrad.addColorStop(1, '#9B1C1C');
  ctx.fillStyle = hGrad;
  ctx.fillRect(0, 0, W, HDR);

  /* brand */
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold 22px ${FONT}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('JnU RedDrop', 28, 52);
  ctx.fillStyle = 'rgba(255,255,255,0.60)';
  ctx.font = `13px ${FONT}`;
  ctx.fillText('Blood Donation Platform', 28, 76);

  /* urgent badge */
  if (req.is_emergency) {
    ctx.fillStyle = 'rgba(255,255,255,0.20)';
    roundRect(ctx, W - 120, 30, 92, 32, 16);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold 13px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText('⚡ URGENT', W - 74, 50);
  }

  /* ── Hero: blood type circle ── */
  const cX = W / 2, cY = HDR + HERO / 2 - 12;

  /* outer glow */
  ctx.beginPath();
  ctx.arc(cX, cY, 72, 0, Math.PI * 2);
  ctx.fillStyle = '#FEE2E2';
  ctx.fill();

  /* main circle */
  ctx.beginPath();
  ctx.arc(cX, cY, 60, 0, Math.PI * 2);
  ctx.fillStyle = '#DC2626';
  ctx.fill();

  /* blood type */
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold 40px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(req.blood_type, cX, cY);

  /* subtitle */
  ctx.fillStyle = '#1F2937';
  ctx.font = `bold 15px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('BLOOD DONATION REQUEST', cX, HDR + HERO - 14);

  /* ── Divider ── */
  const divY = HDR + HERO + 10;
  ctx.fillStyle = '#FEE2E2';
  ctx.fillRect(28, divY, W - 56, 2);

  /* ── Rows ── */
  let ry = divY + 20;
  ctx.textAlign = 'left';

  rows.forEach(({ label, value }, i) => {
    if (i % 2 === 0) {
      ctx.fillStyle = '#FFF8F8';
      ctx.fillRect(0, ry - 6, W, ROW);
    }

    /* label */
    ctx.fillStyle = '#9CA3AF';
    ctx.font = `11px ${FONT}`;
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(label, 30, ry + 14);

    /* value — truncate if too wide */
    ctx.fillStyle = '#111827';
    ctx.font = `bold 15px ${FONT}`;
    let v = String(value || '—');
    const maxW = W - 60;
    while (ctx.measureText(v).width > maxW && v.length > 1) v = v.slice(0, -1);
    if (v !== String(value || '—')) v += '…';
    ctx.fillText(v, 30, ry + 38);

    ry += ROW;
  });

  /* ── Notes ── */
  if (notes) {
    ctx.fillStyle = '#FEF2F2';
    ctx.fillRect(0, ry, W, NTS);
    ctx.fillStyle = '#6B7280';
    ctx.font = `italic 13px ${FONT}`;
    ctx.textBaseline = 'alphabetic';
    wrapText(ctx, `"${notes}"`, 28, ry + 30, W - 56, 20, 2);
    ry += NTS;
  }

  /* ── Footer ── */
  const fGrad = ctx.createLinearGradient(0, ry, 0, ry + FTR);
  fGrad.addColorStop(0, '#1F2937');
  fGrad.addColorStop(1, '#111827');
  ctx.fillStyle = fGrad;
  ctx.fillRect(0, ry, W, FTR);

  ctx.fillStyle = '#F9FAFB';
  ctx.font = `bold 14px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Please share this to help find a blood donor', W / 2, ry + 24);

  ctx.fillStyle = '#EF4444';
  ctx.font = `12px ${FONT}`;
  const url = window.location.href;
  let urlText = url;
  while (ctx.measureText(urlText).width > W - 40 && urlText.length > 10) urlText = urlText.slice(0, -1);
  if (urlText !== url) urlText += '…';
  ctx.fillText(urlText, W / 2, ry + 52);

  return canvas.toDataURL('image/png');
}

/* ── Share Modal ── */
function ShareModal({ req, onClose }) {
  const [imgUrl, setImgUrl]   = useState(null);
  const [copied, setCopied]   = useState(false);
  const [dlDone, setDlDone]   = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setImgUrl(generateShareImage(req)));
    return () => cancelAnimationFrame(id);
  }, [req]);

  const copyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadImage = () => {
    if (!imgUrl) return;
    const a = document.createElement('a');
    a.href = imgUrl;
    a.download = `blood-request-${req.blood_type}-${req.id}.png`;
    a.click();
    setDlDone(true);
    setTimeout(() => setDlDone(false), 2500);
  };

  const nativeShare = async () => {
    if (!imgUrl) return;
    try {
      const blob = await (await fetch(imgUrl)).blob();
      const file = new File([blob], `blood-request-${req.blood_type}.png`, { type: 'image/png' });
      const canShareFiles = navigator.canShare && navigator.canShare({ files: [file] });
      await navigator.share({
        title: `Urgent: ${req.blood_type} blood needed`,
        text: `${req.blood_type} blood urgently needed at ${req.hospital_name}. Please help!\n${window.location.href}`,
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

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">Share Request</h2>
            <p className="text-xs text-gray-400 mt-0.5">Help spread the word to save a life</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Image preview */}
        <div className="px-4 pt-4">
          <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50" style={{ maxHeight: 260, overflow: 'hidden' }}>
            {imgUrl ? (
              <img src={imgUrl} alt="Share card preview" className="w-full" style={{ display: 'block' }} />
            ) : (
              <div className="h-52 animate-pulse bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          <p className="text-center text-[11px] text-gray-400 mt-1.5">Preview — scroll down for full card</p>
        </div>

        {/* Action buttons */}
        <div className="p-4 space-y-2.5">
          {/* Download */}
          <button
            onClick={downloadImage}
            disabled={!imgUrl}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
          >
            {dlDone ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                </svg>
                Image Saved!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                Download Image
              </>
            )}
          </button>

          {/* Copy link */}
          <button
            onClick={copyLink}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-xl text-sm transition-colors"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                </svg>
                <span className="text-green-600">Link Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                Copy Link
              </>
            )}
          </button>

          {/* Native share (if supported) */}
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
function Row({ icon, label, value, accent }) {
  return (
    <div className="flex items-start gap-3">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${accent ? 'bg-red-50' : 'bg-gray-50'}`}>
        {icon}
      </div>
      <div>
        <div className="text-xs font-semibold text-gray-400 mb-0.5">{label}</div>
        <div className={`font-semibold text-[15px] ${accent ? 'text-red-600' : 'text-gray-900'}`}>{value}</div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function RequestDetailsPage() {
  const { id } = useParams();
  const [req, setReq]           = useState(null);
  const [loading, setLoading]   = useState(true);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    api.get(`/requests/${id}`)
      .then(r => setReq(r.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!req) return (
    <div className="min-h-screen flex items-center justify-center text-gray-500 font-sans">
      Request not found.
    </div>
  );

  const location = [req.upazila, req.district].filter(Boolean).join(', ');
  const notes    = req.additional_notes || req.notes;

  const ShareBtn = (
    <button
      onClick={() => setShareOpen(true)}
      className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
      aria-label="Share"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>
    </button>
  );

  const requestBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blood Requests', item: `${SITE_URL}/requests` },
      { '@type': 'ListItem', position: 3, name: `${req.blood_type} Blood Request`, item: `${SITE_URL}/requests/${id}` },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <SEO
        title={`${req.blood_type} Blood Needed${location ? ` — ${location}` : ''}`}
        description={`Urgent ${req.blood_type} blood needed${location ? ` in ${location}` : ''}. Help save a life — respond to this blood request on JnU RedDrop.`}
        url={`/requests/${id}`}
        jsonLd={requestBreadcrumb}
      />
      <ModernHeader title="Request Details" rightNode={ShareBtn} />

      <div className="px-4 py-5 max-w-2xl mx-auto space-y-3 pb-32 md:pb-8">

        {/* Main card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Colored top strip */}
          {req.is_emergency && <div className="h-1 bg-gradient-to-r from-red-500 to-red-400" />}

          <div className="p-5 pb-6">
            {/* Blood type hero */}
            <div className="flex items-start justify-between mb-6 pb-5 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-4xl font-black text-gray-900 leading-none mb-2">{req.blood_type}</h2>
                  <div className="flex items-center gap-2 flex-wrap">
                    {req.is_emergency ? (
                      <span className="inline-flex items-center gap-1 bg-red-100 text-red-600 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        Urgent
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-500 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase">
                        Normal
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400 mb-1">Status</div>
                <div className={`inline-flex items-center gap-1.5 font-bold px-3 py-1 rounded-lg text-sm ${
                  req.status === 'active' ? 'bg-green-50 text-green-600' :
                  req.status === 'fulfilled' ? 'bg-blue-50 text-blue-600' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${req.status === 'active' ? 'bg-green-500' : req.status === 'fulfilled' ? 'bg-blue-500' : 'bg-gray-400'}`} />
                  {req.status ? req.status.charAt(0).toUpperCase() + req.status.slice(1) : 'Active'}
                </div>
              </div>
            </div>

            {/* Details grid */}
            <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-4">Request Details</h3>

            <div className="space-y-4">
              <Row
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
                label="Patient Name"
                value={req.patient_name}
              />

              {req.disease && (
                <Row
                  icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>}
                  label="Disease / Condition"
                  value={req.disease}
                />
              )}

              <Row
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>}
                label="Hospital Name"
                value={req.hospital_name}
              />

              {req.hospital_location && (
                <Row
                  icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>}
                  label="Hospital Address"
                  value={req.hospital_location}
                />
              )}

              {location && (
                <Row
                  icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>}
                  label="Area / District"
                  value={location}
                />
              )}

              <Row
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>}
                label="Units Needed"
                value={`${req.blood_quantity || 1} bag${(req.blood_quantity || 1) > 1 ? 's' : ''}`}
                accent
              />

              {req.needed_date && (
                <Row
                  icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
                  label="Needed By"
                  value={formatDate(req.needed_date) || 'ASAP'}
                />
              )}

              {req.contact_number && (
                <Row
                  icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>}
                  label="Contact Number"
                  value={req.contact_number}
                />
              )}
            </div>
          </div>
        </div>

        {/* Notes card */}
        {notes && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-3">Additional Notes</h3>
            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl">{notes}</p>
          </div>
        )}

        {/* Requester card */}
        {req.donor && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-3">Requested By</h3>
            <Link
              to={`/donors/${req.donor.id}`}
              className="flex items-center gap-3 bg-gray-50 hover:bg-red-50 p-3 rounded-2xl group transition-colors"
            >
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
                {req.donor.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-900 text-sm group-hover:text-red-600 transition-colors truncate">{req.donor.name}</div>
                {req.donor.phone && <div className="text-xs text-gray-500">{req.donor.phone}</div>}
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300 group-hover:text-red-400 transition-colors">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </Link>
          </div>
        )}
      </div>

      {/* Bottom action bar */}
      <div className="fixed bottom-16 left-0 right-0 px-4 py-3 bg-white/90 backdrop-blur border-t border-gray-100 z-40 md:static md:bottom-auto md:left-auto md:right-auto md:border-0 md:bg-transparent md:backdrop-blur-none md:px-0 md:pb-6 md:pt-0 md:max-w-2xl md:mx-auto md:px-4">
        <div className="flex gap-3">
          {req.contact_number ? (
            <a
              href={`tel:${req.contact_number}`}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm py-3.5 rounded-2xl transition-colors shadow-md shadow-red-100"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
              </svg>
              Contact to Donate
            </a>
          ) : (
            <div className="flex-1" />
          )}
          <button
            onClick={() => setShareOpen(true)}
            className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-sm px-5 py-3.5 rounded-2xl transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            Share
          </button>
        </div>
      </div>

      {/* Share modal */}
      {shareOpen && <ShareModal req={req} onClose={() => setShareOpen(false)} />}
    </div>
  );
}
