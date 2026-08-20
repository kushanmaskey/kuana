import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Target, Users, Music, Network, GraduationCap, Heart, Building } from 'lucide-react';

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
  { icon: Users,       label: 'Successful alumni reunions and gatherings across the U.S.' },
  { icon: Music,       label: 'Cultural programs, live music and entertainment nights' },
  { icon: Network,     label: 'Networking events connecting professionals across industries' },
  { icon: GraduationCap, label: 'Mentorship initiatives for students and young alumni' },
  { icon: Heart,       label: 'Support in times of need within our KU community' },
  { icon: Building,    label: 'Strengthening the bond between KU alumni and Kathmandu University' },
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18" className="flex-shrink-0 mt-0.5">
      <circle cx="12" cy="12" r="10" fill="#ffc31d" fillOpacity="0.15" />
      <path d="M8 12l3 3 5-5" stroke="#ffc31d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function MissionVision() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <div className="bg-gradient-to-br from-[#0e1b4d] to-[#060c22] text-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/60 hover:text-[#ffc31d] text-sm mb-8 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to KUANA
          </button>
          <div className="flex items-center gap-3 mb-4">
            <img src="https://kuana.org/assets/img/KUANA.png" alt="KUANA Logo" className="h-14 w-auto object-contain" />
          </div>
          <p className="text-[#ffc31d] text-sm font-semibold uppercase tracking-widest mb-3">Kathmandu University Alumni North America</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Mission &amp; Vision</h1>
          <div className="w-16 h-1 bg-[#ffc31d] rounded mb-6" />
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
            Connecting KU Alumni. Strengthening Our Community. Growing Together.
          </p>
        </div>
      </div>

      {/* Vision + Mission */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* Vision */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-[#0e1b4d]/10 flex items-center justify-center">
                <Eye size={24} className="text-[#0e1b4d]" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
            </div>
            <div className="w-12 h-1 bg-[#ffc31d] rounded mb-6" />
            <p className="text-gray-600 leading-relaxed text-lg">
              To build a strong, connected, and engaged Kathmandu University alumni community in North America — a community where alumni can reconnect, build friendships, expand professional networks, support one another, and remain connected with Kathmandu University.
            </p>
          </div>

          {/* Quote card */}
          <div className="bg-gradient-to-br from-[#0e1b4d] to-[#060c22] rounded-2xl p-10 text-white text-center">
            <div className="text-[#ffc31d] text-6xl font-serif leading-none mb-4">"</div>
            <p className="text-2xl font-bold leading-snug mb-4">
              One University.<br />Many Generations.<br />One Alumni Community.
            </p>
            <div className="text-[#ffc31d] text-6xl font-serif leading-none rotate-180 inline-block">"</div>
          </div>
        </div>

        {/* Mission */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-xl bg-[#0e1b4d]/10 flex items-center justify-center">
              <Target size={24} className="text-[#0e1b4d]" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
          </div>
          <div className="w-12 h-1 bg-[#ffc31d] rounded mb-2" />
          <p className="text-gray-500 mb-8">KUANA aims to:</p>

          <div className="grid sm:grid-cols-2 gap-4">
            {MISSION_ITEMS.map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4">
                <CheckIcon />
                <p className="text-gray-700 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Highlights */}
        <div>
          <div className="text-center mb-12">
            <p className="text-[#ffc31d] text-sm font-semibold uppercase tracking-widest mb-3">What We've Done</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Highlights of Our Past Activities</h2>
            <div className="w-16 h-1 bg-[#ffc31d] mx-auto rounded" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <div key={label} className="bg-gradient-to-br from-[#0e1b4d] to-[#060c22] rounded-2xl p-6 text-white flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#ffc31d]/15 flex items-center justify-center">
                  <Icon size={26} className="text-[#ffc31d]" />
                </div>
                <p className="text-white/85 text-sm leading-relaxed">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer tagline */}
      <div className="bg-[#040919] text-white py-12 text-center">
        <p className="text-white/60 text-sm italic mb-3">From KU to the World, Connected Forever.</p>
        <div className="flex items-center justify-center gap-4 text-[#ffc31d] font-bold text-sm">
          <span>#KUFamily</span>
          <span className="text-white/20">•</span>
          <span>#KUANA</span>
        </div>
        <p className="text-white/20 text-xs mt-6">&copy; {new Date().getFullYear()} KUANA &bull; kuana.org &bull; Non-Profit Organization</p>
      </div>

    </div>
  );
}
