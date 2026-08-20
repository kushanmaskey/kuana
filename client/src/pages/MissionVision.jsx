import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="16" height="16" className="flex-shrink-0 mt-0.5">
      <circle cx="10" cy="10" r="9" fill="#dc2626" fillOpacity="0.12" />
      <path d="M6 10l3 3 5-5" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const MISSION_SNIPPET = [
  'Connect KU alumni across North America and around the world',
  'Create opportunities for professional and personal networking',
  'Strengthen relationships among alumni from different schools, programs, batches, and generations',
  'Support and mentor fellow alumni and younger KU graduates',
];

export default function MissionVision() {
  const navigate = useNavigate();
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <div className="relative bg-gradient-to-br from-[#0e1b4d] to-[#060c22] overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/60 hover:text-[#ffc31d] text-sm transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to KUANA
          </button>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <img src="https://kuana.org/assets/img/KUANA.png" alt="KUANA" className="h-16 mb-6 object-contain" />
            <p className="text-[#ffc31d] text-xs font-bold uppercase tracking-widest mb-2">Kathmandu University Alumni North America</p>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-2 leading-tight">KUANA</h1>
            <div className="w-16 h-1 bg-[#ffc31d] rounded mb-5" />
            <p className="text-white/70 text-base leading-relaxed max-w-md">
              Connecting KU Alumni. Strengthening Our Community. Growing Together.
            </p>
          </div>

          <div className="relative hidden lg:block">
            <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 h-64">
              <img
                src="/assets/img/gallery/2025/R6_B0009.jpg"
                alt="KUANA Alumni"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-[#ffc31d] text-[#0e1b4d] font-black text-xs px-4 py-2 rounded-full shadow-lg">
              ESTD. 2023 · IRS 501(c)(3)
            </div>
          </div>
        </div>
      </div>

      {/* Two snippet cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-8">

          {/* Vision snippet */}
          <div className="bg-[#f0f4ff] border border-[#0e1b4d]/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-[#dc2626] flex items-center justify-center flex-shrink-0">
                  <EyeIcon />
                </div>
                <h2 className="text-2xl font-black text-[#0e1b4d] uppercase tracking-wide">Our Vision</h2>
              </div>
              <div className="w-10 h-1 bg-[#dc2626] rounded mb-5" />

              <div className="rounded-xl overflow-hidden mb-5 h-44">
                <img
                  src="/assets/img/gallery/2025/R6_B0009.jpg"
                  alt="KUANA Alumni"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <p className="text-gray-700 text-sm leading-relaxed line-clamp-4 mb-6">
                To build a strong, connected, and engaged Kathmandu University alumni community in North America — a community where alumni can reconnect, build friendships, expand professional networks, support one another, and remain connected with Kathmandu University.
              </p>

              <button
                onClick={() => navigate('/vision')}
                className="inline-flex items-center gap-2 bg-[#0e1b4d] hover:bg-[#060c22] text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors cursor-pointer"
              >
                Read more about our Vision
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Mission snippet */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-[#dc2626] flex items-center justify-center flex-shrink-0">
                  <TargetIcon />
                </div>
                <h2 className="text-2xl font-black text-[#0e1b4d] uppercase tracking-wide">Our Mission</h2>
              </div>
              <div className="w-10 h-1 bg-[#dc2626] rounded mb-5" />

              <p className="text-gray-500 text-xs font-semibold mb-4">KUANA aims to:</p>
              <div className="space-y-3 mb-6">
                {MISSION_SNIPPET.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckIcon />
                    <p className="text-gray-700 text-sm leading-relaxed">{item}</p>
                  </div>
                ))}
                <p className="text-gray-400 text-sm italic pl-6">...and more</p>
              </div>

              <button
                onClick={() => navigate('/mission')}
                className="inline-flex items-center gap-2 bg-[#0e1b4d] hover:bg-[#060c22] text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors cursor-pointer"
              >
                Read more about our Mission
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Quote banner */}
      <div className="bg-gradient-to-r from-[#0e1b4d] to-[#060c22] py-16 text-center">
        <div className="text-[#ffc31d] text-5xl font-serif leading-none mb-3">"</div>
        <p className="text-white text-3xl font-black leading-snug">
          One University. Many Generations.<br />One Alumni Community.
        </p>
        <div className="text-[#ffc31d] text-5xl font-serif leading-none mt-3 rotate-180 inline-block">"</div>
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
