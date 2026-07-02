import { useState } from 'react';
import ModernHeader from '../../components/ModernHeader';
import SEO from '../../components/SEO';

const FAQS = [
  {
    category: 'Eligibility',
    items: [
      { q: 'Who can donate blood?', a: 'Generally, healthy adults between 18–65 years old weighing at least 45 kg and with no significant medical conditions can donate blood. Some conditions (recent illness, certain medications, travel history) may temporarily disqualify you.' },
      { q: 'Can I donate if I have a cold or flu?', a: 'No. You should wait until you have fully recovered and been symptom-free for at least 7 days before donating blood.' },
      { q: 'Can diabetics donate blood?', a: 'Diabetics who are well-controlled with diet or oral medication can usually donate. Those on insulin need to consult their physician before donating.' },
    ],
  },
  {
    category: 'The Process',
    items: [
      { q: 'How often can I donate?', a: 'Whole blood can be donated every 3 months (90 days). Platelets can be donated every 2 weeks. Your body replenishes lost blood within 24–48 hours, but iron takes longer to restore.' },
      { q: 'How long does donation take?', a: 'The actual blood draw takes about 8–10 minutes. The whole process, including registration, health screening, and recovery, typically takes 45–60 minutes.' },
      { q: 'Does donating blood hurt?', a: 'You may feel a small pinch when the needle is inserted, but the process itself is usually painless. Most donors describe it as a brief, mild discomfort.' },
    ],
  },
  {
    category: 'Before & After',
    items: [
      { q: 'What should I do before donating?', a: 'Drink plenty of water (at least 500ml extra), eat a healthy iron-rich meal, avoid fatty foods, and refrain from alcohol for 24 hours before donation. Get a good night\'s sleep.' },
      { q: 'Is it safe to donate blood?', a: 'Yes, donating blood is very safe. New, sterile equipment is used for each donor and discarded afterwards, so there is absolutely no risk of infection from donating.' },
      { q: 'What should I do after donating?', a: 'Rest for 10–15 minutes, drink plenty of fluids, avoid strenuous activity for 24 hours, keep your bandage on for at least 4 hours, and eat iron-rich foods over the next few days.' },
    ],
  },
  {
    category: 'Blood Types',
    items: [
      { q: 'What blood types are most needed?', a: 'O- (universal donor) and O+ are always in high demand. AB+ is the universal plasma donor. However, all blood types are needed — donors with rare types like B- or AB- are especially valuable.' },
      { q: 'Can I donate to anyone with my blood type?', a: 'O- can donate red blood cells to anyone. A+ can donate to A+ and AB+. B+ to B+ and AB+. Your blood bank will ensure proper cross-matching before any transfusion.' },
    ],
  },
];

function AccordionItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`bg-white rounded-2xl shadow-sm border transition-colors ${open ? 'border-red-200' : 'border-gray-100'}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-3 p-4 text-left"
      >
        <span className="font-semibold text-gray-900 text-sm leading-snug">{question}</span>
        <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${open ? 'bg-red-600' : 'bg-gray-100'}`}>
          <svg
            className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180 text-white' : 'text-gray-500'}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="px-4 pb-4">
          <p className="text-sm text-gray-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.flatMap(group =>
    group.items.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    }))
  ),
};

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState(FAQS[0].category);

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans">
      <SEO
        title="FAQ — Blood Donation Questions Answered"
        description="Answers to common questions about blood donation eligibility, the donation process, blood types, and using JnU RedDrop."
        url="/faq"
        jsonLd={FAQ_JSON_LD}
      />
      <ModernHeader title="FAQs" />

      {/* Desktop hero banner */}
      <div className="hidden md:block bg-red-600 py-12">
        <div className="max-w-5xl mx-auto px-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h1>
              <p className="text-red-100 text-base mt-1">Everything you need to know about blood donation.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 md:max-w-5xl md:px-8">

        {/* Mobile hero */}
        <div className="bg-red-600 rounded-3xl p-5 mb-6 relative overflow-hidden md:hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-white opacity-5 rounded-full" />
          <div className="absolute -right-2 bottom-0 w-16 h-16 bg-white opacity-5 rounded-full" />
          <div className="relative z-10">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-white font-bold text-lg">Frequently Asked Questions</h1>
            <p className="text-red-100 text-sm mt-1">Everything you need to know about blood donation.</p>
          </div>
        </div>

        {/* Desktop: 2-col layout */}
        <div className="md:flex md:gap-8 md:items-start">

          {/* Category sidebar (desktop only) */}
          <div className="hidden md:block md:w-52 md:flex-shrink-0 md:sticky md:top-24">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Categories</p>
            <nav className="space-y-1">
              {FAQS.map(group => (
                <button
                  key={group.category}
                  onClick={() => setActiveCategory(group.category)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeCategory === group.category
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {group.category}
                </button>
              ))}
            </nav>
            <div className="mt-6 bg-red-50 rounded-2xl p-4">
              <p className="text-sm font-semibold text-gray-800 mb-1">Still have questions?</p>
              <a href="mailto:reddrop@jnu.ac.bd" className="text-xs text-red-600 hover:underline font-medium">
                reddrop@jnu.ac.bd
              </a>
            </div>
          </div>

          {/* FAQ content */}
          <div className="md:flex-1 md:min-w-0">
            {/* Mobile: all categories */}
            <div className="md:hidden space-y-6">
              {FAQS.map(group => (
                <div key={group.category}>
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    {group.category}
                  </h2>
                  <div className="space-y-2">
                    {group.items.map(item => (
                      <AccordionItem key={item.q} question={item.q} answer={item.a} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: filtered by active category */}
            <div className="hidden md:block">
              {FAQS.filter(g => g.category === activeCategory).map(group => (
                <div key={group.category}>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">{group.category}</h2>
                  <div className="space-y-3">
                    {group.items.map(item => (
                      <AccordionItem key={item.q} question={item.q} answer={item.a} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Mobile footer CTA */}
        <div className="mt-8 text-center md:hidden">
          <p className="text-sm text-gray-500">Still have questions?</p>
          <a href="mailto:reddrop@jnu.ac.bd" className="mt-2 inline-block text-red-600 font-semibold text-sm hover:underline">
            Contact us at reddrop@jnu.ac.bd
          </a>
        </div>
      </div>
    </div>
  );
}
