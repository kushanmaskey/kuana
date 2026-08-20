import { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';

const MISSION_ITEMS = [
  'Connect KU alumni across North America and around the world',
  'Create opportunities for professional and personal networking',
  'Strengthen relationships among alumni from different schools, programs, batches, and generations',
  'Support and mentor fellow alumni and younger KU graduates',
  'Celebrate the achievements and contributions of KU alumni',
  'Promote collaboration and knowledge sharing',
  'Maintain a strong relationship with Kathmandu University',
  'Bring alumni and their families together through reunions, cultural programs, social activities, and community events',
];

const HIGHLIGHTS = [
  { photo: '/assets/img/gallery/2025/R6_B0009.jpg',  position: 'center top',    label: 'Successful alumni reunions and gatherings across the U.S.' },
  { photo: '/assets/img/gallery/2025/R6_B0386.jpg',  position: 'center center', label: 'Cultural programs, live music and entertainment nights' },
  { photo: '/assets/img/gallery/2025/R6_B0510.jpg',  position: 'center center', label: 'Networking events connecting professionals across industries' },
  { photo: '/assets/img/gallery/2025/R6_B0218.jpg',  position: 'center top',    label: 'Mentorship initiatives for students and young alumni' },
  { photo: '/assets/img/gallery/2025/R6_B0509.jpg',  position: 'center center', label: 'Support in times of need within our KU community' },
  { photo: '/assets/img/gallery/2025/R6_B0065.jpg',  position: 'center center', label: 'Strengthening the bond between KU alumni and Kathmandu University' },
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="17" height="17" className="flex-shrink-0 mt-0.5">
      <circle cx="10" cy="10" r="9" fill="#dc2626" fillOpacity="0.12" />
      <path d="M6 10l3 3 5-5" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VisionModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-br from-[#0e1b4d] to-[#060c22] rounded-t-2xl p-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-[#ffc31d] text-xs font-bold uppercase tracking-widest mb-1">KUANA</p>
            <h2 className="text-white text-2xl font-black">Our Vision</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/40 transition-colors cursor-pointer flex-shrink-0">
            <X size={16} />
          </button>
        </div>
        {/* Body */}
        <div className="overflow-y-auto">
          <div className="grid md:grid-cols-2 gap-0">
            <img src="/assets/img/gallery/2025/R6_B0009.jpg" alt="KUANA Alumni" className="w-full h-56 md:h-full object-cover object-top" />
            <div className="p-6 flex flex-col gap-4">
              <p className="text-gray-700 leading-relaxed text-sm">
                To build a strong, connected, and engaged Kathmandu University alumni community in North America — a community where alumni can reconnect, build friendships, expand professional networks, support one another, and remain connected with Kathmandu University.
              </p>
              <p className="text-gray-600 leading-relaxed text-sm">
                We envision a thriving alumni network that serves as a bridge between the KU community in Nepal and its graduates building careers and lives across North America.
              </p>
              <div className="bg-[#0e1b4d] rounded-xl p-5 text-white text-center mt-auto">
                <div className="text-[#ffc31d] text-3xl font-serif leading-none mb-1">"</div>
                <p className="font-bold text-base leading-snug">One University.<br />Many Generations.<br />One Alumni Community.</p>
                <div className="text-[#ffc31d] text-3xl font-serif leading-none mt-1 rotate-180 inline-block">"</div>
              </div>
            </div>
          </div>
          <div className="p-6 grid grid-cols-3 gap-4 border-t border-gray-100">
            {[
              { title: 'Reconnect', desc: 'Bringing KU graduates back together across borders and generations.' },
              { title: 'Strengthen', desc: 'Building professional networks and lasting friendships among alumni.' },
              { title: 'Grow Together', desc: 'Supporting each other and the KU community to thrive globally.' },
            ].map(({ title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-2 h-2 rounded-full bg-[#ffc31d] mx-auto mb-2" />
                <p className="font-bold text-[#0e1b4d] text-sm mb-1">{title}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MissionModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-br from-[#0e1b4d] to-[#060c22] rounded-t-2xl p-6 flex items-start justify-between gap-4 flex-shrink-0">
          <div>
            <p className="text-[#ffc31d] text-xs font-bold uppercase tracking-widest mb-1">KUANA</p>
            <h2 className="text-white text-2xl font-black">Our Mission</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/40 transition-colors cursor-pointer flex-shrink-0">
            <X size={16} />
          </button>
        </div>
        {/* Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          <p className="text-gray-500 text-sm font-semibold">KUANA aims to:</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {MISSION_ITEMS.map((item, i) => (
              <div key={i} className="flex items-start gap-2 bg-gray-50 border border-gray-100 rounded-xl p-3">
                <CheckIcon />
                <p className="text-gray-700 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          <div>
            <h3 className="font-black text-[#0e1b4d] text-base uppercase tracking-wide mb-4">Highlights of Our Past Activities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {HIGHLIGHTS.map(({ photo, position, label }) => (
                <div key={label} className="relative rounded-xl overflow-hidden h-32 group">
                  <img src={photo} alt={label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" style={{ objectPosition: position }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <p className="absolute bottom-0 left-0 right-0 px-2 py-2 text-white text-xs font-semibold leading-snug">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MissionVision() {
  const [modal, setModal] = useState(null); // 'vision' | 'mission' | null

  return (
    <section id="mission-vision" className="py-24 bg-gray-50">
      {modal === 'vision'  && <VisionModal  onClose={() => setModal(null)} />}
      {modal === 'mission' && <MissionModal onClose={() => setModal(null)} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-[#ffc31d] text-sm font-semibold uppercase tracking-widest mb-3">Who We Are</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Mission &amp; Vision</h2>
          <div className="w-16 h-1 bg-[#ffc31d] mx-auto rounded" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Vision snippet */}
          <div id="vision" className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-52">
              <img src="/assets/img/gallery/2025/R6_B0009.jpg" alt="KUANA Alumni" className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e1b4d]/80 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-full bg-[#dc2626] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <h3 className="text-white font-black text-xl uppercase tracking-wide">Our Vision</h3>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 leading-relaxed text-sm line-clamp-3 mb-5">
                To build a strong, connected, and engaged Kathmandu University alumni community in North America — a community where alumni can reconnect, build friendships, expand professional networks, support one another, and remain connected with Kathmandu University.
              </p>
              <button
                onClick={() => setModal('vision')}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#0e1b4d] hover:text-[#ffc31d] transition-colors cursor-pointer"
              >
                Read full Vision <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Mission snippet */}
          <div id="mission" className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-52">
              <img src="/assets/img/gallery/2025/R6_B0065.jpg" alt="KUANA Mission" className="w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e1b4d]/80 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-full bg-[#dc2626] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
                    </svg>
                  </div>
                  <h3 className="text-white font-black text-xl uppercase tracking-wide">Our Mission</h3>
                </div>
              </div>
            </div>
            <div className="p-6">
              <ul className="space-y-2 mb-5">
                {MISSION_ITEMS.slice(0, 3).map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckIcon />
                    <p className="text-gray-600 text-sm leading-relaxed">{item}</p>
                  </li>
                ))}
                <li className="text-gray-400 text-sm italic pl-5">...and more</li>
              </ul>
              <button
                onClick={() => setModal('mission')}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#0e1b4d] hover:text-[#ffc31d] transition-colors cursor-pointer"
              >
                Read full Mission <ArrowRight size={15} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
