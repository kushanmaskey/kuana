import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Vision() {
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
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div>
              <p className="text-[#ffc31d] text-xs font-bold uppercase tracking-widest">KUANA</p>
              <h1 className="text-4xl md:text-5xl font-black text-white">Our Vision</h1>
            </div>
          </div>
          <div className="w-16 h-1 bg-[#ffc31d] rounded mt-4" />
        </div>
      </div>

      {/* Vision content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-14 items-center mb-16">
          {/* Text */}
          <div>
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              To build a strong, connected, and engaged Kathmandu University alumni community in North America — a community where alumni can reconnect, build friendships, expand professional networks, support one another, and remain connected with Kathmandu University.
            </p>
            <div className="bg-[#0e1b4d]/5 border-l-4 border-[#ffc31d] rounded-r-xl p-5">
              <p className="text-[#0e1b4d] font-semibold text-sm leading-relaxed">
                We envision a thriving alumni network that serves as a bridge between the KU community in Nepal and its graduates building careers and lives across North America.
              </p>
            </div>
          </div>

          {/* Circular photo + quote */}
          <div className="flex flex-col items-center gap-8">
            <div className="w-72 h-72 rounded-full overflow-hidden border-4 border-[#0e1b4d] shadow-2xl">
              <img
                src="/assets/img/gallery/2025/R6_B0009.jpg"
                alt="KUANA Alumni Community"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="bg-gradient-to-br from-[#0e1b4d] to-[#060c22] rounded-2xl px-8 py-6 text-white text-center w-full max-w-sm shadow-xl">
              <div className="text-[#ffc31d] text-5xl font-serif leading-none mb-2">"</div>
              <p className="text-xl font-bold leading-snug">
                One University.<br />Many Generations.<br />One Alumni Community.
              </p>
              <div className="text-[#ffc31d] text-5xl font-serif leading-none mt-2 rotate-180 inline-block">"</div>
            </div>
          </div>
        </div>

        {/* 3 value pillars */}
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { title: 'Reconnect', desc: 'Bringing KU graduates back together across borders and generations.' },
            { title: 'Strengthen', desc: 'Building professional networks and lasting friendships among alumni.' },
            { title: 'Grow Together', desc: 'Supporting each other and the KU community to thrive globally.' },
          ].map(({ title, desc }) => (
            <div key={title} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-3 h-3 rounded-full bg-[#ffc31d] mx-auto mb-4" />
              <h3 className="font-black text-[#0e1b4d] text-lg mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
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
