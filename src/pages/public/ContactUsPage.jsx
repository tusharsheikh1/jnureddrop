import { useState, useEffect } from 'react';
import ModernHeader from '../../components/ModernHeader';
import SEO from '../../components/SEO';
import api from '../../api/axios';

export default function ContactUsPage() {
  const [form, setForm]           = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [support, setSupport]     = useState({ support_email: '', support_phone: '' });

  useEffect(() => {
    api.get('/settings').then(r => setSupport(r.data)).catch(() => {});
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, subject, message } = form;
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const mailtoLink = `mailto:tushar.mkt15@gmail.com?subject=${encodeURIComponent(subject || 'JnU RedDrop Contact')}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans">
      <SEO
        title="Contact Us — JnU RedDrop"
        description="Get in touch with the JnU RedDrop team. We're here to help with blood donation questions, technical support, and feedback."
        url="/contact"
      />
      <ModernHeader title="Contact Us" />

      <div className="max-w-2xl mx-auto px-4 py-6 md:max-w-3xl md:px-8 space-y-5">

        {/* Developer card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-red-100">
            <img
              src="/tushar_sheikh.png"
              alt="Tushar Sheikh"
              className="w-full h-full object-cover"
              onError={e => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '<span class="w-full h-full flex items-center justify-center text-red-600 font-bold text-lg">TS</span>';
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900">Tushar Sheikh</p>
            <p className="text-xs text-gray-500 mt-0.5">Developer · 15th Batch, Dept. of Marketing, JnU</p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <a
                href="mailto:tushar.mkt15@gmail.com"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </a>
              <span className="text-gray-200 text-xs">|</span>
              <a
                href="https://www.facebook.com/tusharmktjnu/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1877F2] hover:text-blue-700 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                </svg>
                Facebook
              </a>
            </div>
          </div>
        </div>

        {/* Support contact */}
        {(support.support_email || support.support_phone) && (
          <div className="bg-red-50 rounded-3xl p-5 border border-red-100">
            <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-3">Support Contact</p>
            <div className="space-y-3">
              {support.support_email && (
                <a
                  href={`mailto:${support.support_email}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[11px] text-red-400 font-semibold uppercase tracking-wide">Email</p>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors">{support.support_email}</p>
                  </div>
                </a>
              )}
              {support.support_phone && (
                <a
                  href={`tel:${support.support_phone}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[11px] text-red-400 font-semibold uppercase tracking-wide">Phone</p>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors">{support.support_phone}</p>
                  </div>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Quick contact options */}
        <div className="grid grid-cols-3 gap-3">
          <a
            href="mailto:tushar.mkt15@gmail.com"
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center gap-2 text-center hover:border-red-200 hover:bg-red-50 transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Email</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Send a direct email</p>
            </div>
          </a>

          <a
            href="mailto:tushar.mkt15@gmail.com?subject=Bug%20Report%20%E2%80%94%20JnU%20RedDrop"
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center gap-2 text-center hover:border-orange-200 hover:bg-orange-50 transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-50 group-hover:bg-orange-100 flex items-center justify-center transition-colors">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Report Bug</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Something not working?</p>
            </div>
          </a>

          <a
            href="https://www.facebook.com/tusharmktjnu/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center gap-2 text-center hover:border-blue-200 hover:bg-blue-50 transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
              <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Facebook</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Message on Facebook</p>
            </div>
          </a>
        </div>

        {/* Contact form */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-1">Send a Message</h2>
          <p className="text-xs text-gray-500 mb-4">Fill in the form and your email app will open with the message ready to send.</p>

          {submitted ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-bold text-gray-900 mb-1">Email app opened!</p>
              <p className="text-sm text-gray-500 mb-4">Send the email from your email client to reach us.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Name<span className="text-red-500 ml-0.5">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahim Uddin"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-sm"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Email<span className="text-red-500 ml-0.5">*</span></label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-sm"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Question about blood donation"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-sm"
                  value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message<span className="text-red-500 ml-0.5">*</span></label>
                <textarea
                  required
                  rows={5}
                  placeholder="Write your message here..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-sm resize-none"
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Open Email App to Send
              </button>
            </form>
          )}
        </div>

        {/* Response note */}
        <div className="flex items-start gap-3 px-1">
          <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-gray-400 leading-relaxed">
            This is a student project maintained by Tushar Sheikh. Response times may vary. For urgent blood donation needs, please use the <a href="/requests" className="text-red-500 font-semibold hover:underline">blood requests</a> feature directly.
          </p>
        </div>

      </div>
    </div>
  );
}
