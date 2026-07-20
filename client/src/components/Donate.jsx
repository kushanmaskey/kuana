import { Heart, CheckCircle, ExternalLink } from 'lucide-react';

// TODO: Replace these with your actual donation page URLs once accounts are created
const PAYPAL_URL = 'https://www.paypal.com/donate/?hosted_button_id=XXXXXXXXX';
const ZEFFY_URL  = 'https://www.zeffy.com/donation-form/XXXXXXXXX';

function PayPalIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z" />
    </svg>
  );
}

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
    key: 'paypal',
    name: 'PayPal Giving Fund',
    icon: PayPalIcon,
    tagline: 'Donate securely via PayPal',
    description: 'Use your PayPal account, credit, or debit card. PayPal Giving Fund passes 100% of your donation to KUANA.',
    badge: 'No transaction fees',
    badgeColor: 'bg-blue-100 text-blue-700',
    btnClass: 'bg-[#003087] hover:bg-[#001f5e] text-white',
    url: PAYPAL_URL,
  },
  {
    key: 'zeffy',
    name: 'Zeffy',
    icon: ZeffyIcon,
    tagline: '100% free for nonprofits',
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
            <h3 className="text-xl font-bold text-gray-900">Choose a Platform</h3>
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
