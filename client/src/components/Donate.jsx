import { Heart, CheckCircle, ExternalLink } from 'lucide-react';

const ZEFFY_URL  = 'https://www.zeffy.com/en-US/donation-form/donate-to-change-lives-19745';

function ZeffyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H8l5-8H9.5l1-2H15l-5 8h3.5l-2.5 2z"/>
    </svg>
  );
}

const WHY_DONATE = [
  'Fund the biennial KUANA reunion events',
  'Support scholarships for KU students',
  'Build mentorship programs for KU graduates',
  'Strengthen the KU alumni network in North America',
  'Contribute to KU campus development initiatives',
];

const PLATFORMS = [
  {
    key: 'zeffy',
    name: 'Zeffy',
    icon: ZeffyIcon,
    tagline: '100% free for nonprofits — accessible from the US and Canada. Alumni from Mexico, please contact us directly.',
    description: 'Zeffy charges zero platform fees — every dollar you give goes directly to KUANA with no deductions.',
    badge: '0% platform fees',
    badgeColor: 'bg-green-100 text-green-700',
    btnClass: 'bg-[#0e1b4d] hover:bg-[#060c22] text-white',
    url: ZEFFY_URL,
  },
];

export default function Donate() {
  return (
    <section id="donate" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-[#ffc31d] text-sm font-semibold uppercase tracking-widest mb-3">Give Back</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Support KUANA</h2>
          <div className="w-16 h-1 bg-[#ffc31d] mx-auto mb-6 rounded" />
          <p className="text-gray-600 max-w-xl mx-auto">
            Your donations fund reunions, scholarships, and support for Kathmandu University's mission.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-[#ffc31d] to-[#f59e0b] text-[#0e1b4d] font-black text-sm px-4 py-2 rounded-full shadow-lg shadow-[#ffc31d]/40 ring-2 ring-[#ffc31d]/60 tracking-wide">
            <span>★</span>
            <span>IRS Recognized 501(c)(3) Non-Profit</span>
            <span>★</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Why Donate panel */}
          <div>
            <div className="bg-gradient-to-br from-[#0e1b4d] to-[#060c22] rounded-2xl p-8 text-white mb-6">
              <Heart size={32} className="text-[#ffc31d] mb-4" />
              <h3 className="text-2xl font-bold mb-3">Why Donate?</h3>
              <ul className="space-y-3 text-white/80 text-sm">
                {WHY_DONATE.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-[#ffc31d] flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 text-sm text-gray-500 text-center">
              KUANA is a registered non-profit organization. Your donation may be tax-deductible.
              Please consult your tax advisor.
            </div>
          </div>

          {/* Donation platform cards */}
          <div className="space-y-5">
            <h3 className="text-xl font-bold text-gray-900">Donate via Zeffy</h3>
            {PLATFORMS.map(({ key, name, icon: Icon, tagline, description, badge, badgeColor, btnClass, url }) => (
              <div key={key} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[#0e1b4d]">
                      <Icon />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{name}</div>
                      <div className="text-sm text-gray-500">{tagline}</div>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${badgeColor}`}>
                    {badge}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{description}</p>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm transition-colors ${btnClass}`}
                >
                  <Heart size={16} />
                  Donate via {name}
                  <ExternalLink size={14} className="opacity-70" />
                </a>
              </div>
            ))}

            <p className="text-center text-gray-400 text-xs pt-2">
              You will be redirected to a secure external page to complete your donation.
              KUANA does not collect or store any payment information.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
