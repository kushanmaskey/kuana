import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

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
    <svg viewBox="0 0 20 20" fill="none" width="18" height="18" className="flex-shrink-0 mt-0.5">
      <circle cx="10" cy="10" r="9" fill="#dc2626" fillOpacity="0.12" />
      <path d="M6 10l3 3 5-5" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Mission() {
  const navigate = useNavigate();
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <div className="bg-gradient-to-br from-[#0e1b4d] to-[#060c22] py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/mission-vision')}
            className="flex items-center gap-2 text-white/60 hover:text-[#ffc31d] text-sm mb-8 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to Mission &amp; Vision
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#dc2626] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <div>
              <p className="text-[#ffc31d] text-xs font-bold uppercase tracking-widest">KUANA</p>
              <h1 className="text-4xl md:text-5xl font-black text-white">Our Mission</h1>
            </div>
          </div>
          <div className="w-16 h-1 bg-[#ffc31d] rounded mt-4" />
        </div>
      </div>

      {/* Mission items */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <p className="text-gray-500 font-semibold mb-8">KUANA aims to:</p>

        <div className="grid lg:grid-cols-3 gap-8 items-start mb-20">
          {/* Left column */}
          <div className="space-y-5">
            {MISSION_ITEMS.slice(0, 4).map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4">
                <CheckIcon />
                <p className="text-gray-700 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {MISSION_ITEMS.slice(4).map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4">
                <CheckIcon />
                <p className="text-gray-700 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>

          {/* Quote card */}
          <div className="bg-gradient-to-br from-[#0e1b4d] to-[#060c22] rounded-2xl p-8 text-white text-center shadow-xl">
            <div className="text-[#ffc31d] text-5xl font-serif leading-none mb-3">"</div>
            <p className="text-xl font-bold leading-snug mb-3">
              One University.<br />Many Generations.<br />One Alumni Community.
            </p>
            <div className="text-[#ffc31d] text-5xl font-serif leading-none rotate-180 inline-block">"</div>
            <div className="mt-6 pt-5 border-t border-white/10">
              <img src="https://kuana.org/assets/img/KUANA.png" alt="KUANA" className="h-10 mx-auto object-contain opacity-80" />
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div>
          <h2 className="text-2xl font-black text-[#0e1b4d] uppercase tracking-wide text-center mb-10">
            Highlights of Our Past Activities
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {HIGHLIGHTS.map(({ photo, position, label }) => (
              <div key={label} className="relative rounded-2xl overflow-hidden shadow-md group h-52">
                <img
                  src={photo}
                  alt={label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ objectPosition: position }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <p className="absolute bottom-0 left-0 right-0 px-4 py-4 text-white text-sm font-semibold leading-snug">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#040919] py-10 text-center">
        <p className="text-white/50 text-sm italic mb-3">From KU to the World, Connected Forever.</p>
        <div className="flex items-center justify-center gap-4 text-[#ffc31d] font-bold text-sm">
          <span>#KUFamily</span><span className="text-white/20">•</span><span>#KUANA</span>
        </div>
        <p className="text-white/20 text-xs mt-4">&copy; {new Date().getFullYear()} KUANA &bull; kuana.org</p>
      </div>
    </div>
  );
}
