import { useState, useEffect } from 'react';
import { Clock, Mic, X } from 'lucide-react';
import { getSpeakers } from '../api';

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

// Normalize DB row → component shape
function normalize(s) {
  return {
    id: s.id,
    name: s.name,
    role: s.role || '',
    org: s.org || '',
    bio: s.bio || '',
    photo: s.photo_url || null,
    tag: s.tag || 'Speaker',
    tagColor: s.tag_color || 'bg-[#0e1b4d] text-white',
    social: {
      facebook: s.facebook_url || null,
      linkedin: s.linkedin_url || null,
      instagram: s.instagram_url || null,
    },
  };
}

const YEAR_LABELS = {
  '2027': 'KUANA Reunion 2027 · Boston, MA',
  '2025': 'KUANA Reunion 2025 · Lewisville, TX',
  '2023': 'KUANA Reunion 2023 · Trophy Club, TX',
};

function SocialLinks({ social, size = 8 }) {
  return (
    <div className="flex gap-2">
      {social?.facebook && (
        <a href={social.facebook} target="_blank" rel="noopener noreferrer"
          className={`w-${size} h-${size} rounded-full bg-[#1877f2] flex items-center justify-center text-white shadow-md hover:scale-110 transition-transform`}
          title="Facebook" onClick={(e) => e.stopPropagation()}>
          <IconFacebook />
        </a>
      )}
      {social?.linkedin && (
        <a href={social.linkedin} target="_blank" rel="noopener noreferrer"
          className={`w-${size} h-${size} rounded-full bg-[#0a66c2] flex items-center justify-center text-white shadow-md hover:scale-110 transition-transform`}
          title="LinkedIn" onClick={(e) => e.stopPropagation()}>
          <IconLinkedIn />
        </a>
      )}
      {social?.instagram && (
        <a href={social.instagram} target="_blank" rel="noopener noreferrer"
          className={`w-${size} h-${size} rounded-full bg-[#e1306c] flex items-center justify-center text-white shadow-md hover:scale-110 transition-transform`}
          title="Instagram" onClick={(e) => e.stopPropagation()}>
          <IconInstagram />
        </a>
      )}
    </div>
  );
}

function SpeakerModal({ speaker, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const hasBio = !!speaker.bio;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className={`relative w-full flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl ${hasBio ? 'max-w-3xl' : 'max-w-lg'}`}
        onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors cursor-pointer z-10">
          <X size={18} />
        </button>
        <div className={`flex-shrink-0 ${hasBio ? 'md:w-64' : 'w-full'}`}>
          {speaker.photo
            ? <img src={speaker.photo} alt={speaker.name} className="w-full h-72 md:h-full object-cover" style={{ objectPosition: 'center center' }} />
            : <div className="w-full h-72 md:h-full bg-gradient-to-br from-[#0e1b4d] to-[#dc143c] flex items-center justify-center">
                <Mic size={56} className="text-white/40" />
              </div>
          }
        </div>
        {hasBio && (
          <div className="flex-1 bg-gradient-to-br from-[#0e1b4d] to-[#060c22] p-6 flex flex-col justify-between">
            <div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${speaker.tagColor} mb-4 inline-block`}>{speaker.tag}</span>
              <h3 className="text-white font-bold text-xl mb-1">{speaker.name}</h3>
              <p className="text-[#ffc31d] text-sm font-semibold mb-0.5">{speaker.role}</p>
              {speaker.org && <p className="text-white/50 text-xs mb-4">{speaker.org}</p>}
              <p className="text-white/80 text-sm leading-relaxed">{speaker.bio}</p>
            </div>
            <div className="mt-6"><SocialLinks social={speaker.social} size={8} /></div>
          </div>
        )}
        {!hasBio && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm px-4 py-3 flex items-center justify-between rounded-b-2xl">
            <p className="text-white font-semibold">{speaker.name}</p>
            <SocialLinks social={speaker.social} size={8} />
          </div>
        )}
      </div>
    </div>
  );
}

function SpeakerCard({ speaker, onClick }) {
  return (
    <div onClick={onClick}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden cursor-pointer">
      <div className="relative">
        {speaker.photo
          ? <img src={speaker.photo} alt={speaker.name} className="w-full h-48 object-contain bg-gray-100"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
          : null}
        <div className={`w-full h-48 bg-gradient-to-br from-[#0e1b4d] to-[#dc143c] items-center justify-center ${speaker.photo ? 'hidden' : 'flex'}`}>
          <Mic size={40} className="text-white/40" />
        </div>
        <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full ${speaker.tagColor}`}>{speaker.tag}</span>
      </div>
      <div className="p-5">
        <h4 className="font-bold text-gray-900 text-lg leading-tight mb-1">{speaker.name}</h4>
        <p className="text-[#dc143c] text-sm font-semibold mb-0.5">{speaker.role}</p>
        <p className="text-gray-400 text-xs mb-3">{speaker.org}</p>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{speaker.bio}</p>
      </div>
    </div>
  );
}

const YEARS = ['2027', '2025', '2023'];

export default function Speakers({ initialYear = '2025' }) {
  const [year, setYear] = useState(initialYear);
  const [selected, setSelected] = useState(null);
  const [speakersMap, setSpeakersMap] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = (e) => setYear(e.detail);
    window.addEventListener('kuana:speakers-year', handler);
    return () => window.removeEventListener('kuana:speakers-year', handler);
  }, []);

  useEffect(() => {
    if (speakersMap[year] !== undefined) return;
    setLoading(true);
    getSpeakers({ year })
      .then(r => setSpeakersMap(prev => ({ ...prev, [year]: r.data.map(normalize) })))
      .catch(() => setSpeakersMap(prev => ({ ...prev, [year]: [] })))
      .finally(() => setLoading(false));
  }, [year]);

  const speakers = speakersMap[year] ?? [];

  return (
    <>
      {selected && <SpeakerModal speaker={selected} onClose={() => setSelected(null)} />}
      <section id="speakers" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#ffc31d] text-sm font-semibold uppercase tracking-widest mb-3">Our Speakers</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Speakers</h2>
            <div className="w-16 h-1 bg-[#ffc31d] mx-auto mb-6 rounded" />
            <p className="text-gray-600 max-w-xl mx-auto">
              Inspiring KU alumni and experts sharing insights across entrepreneurship, technology, sustainability, and more.
            </p>
          </div>

          {/* Year tabs */}
          <div className="flex gap-2 justify-center mb-12">
            {YEARS.map((y) => (
              <button key={y} onClick={() => setYear(y)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  year === y ? 'bg-[#0e1b4d] text-white shadow' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#0e1b4d] hover:text-[#0e1b4d]'
                }`}>
                {y}
                {y === '2027' && (
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${year === y ? 'bg-[#ffc31d] text-[#0e1b4d]' : 'bg-green-100 text-green-700'}`}>
                    Upcoming
                  </span>
                )}
              </button>
            ))}
          </div>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                <Clock size={14} /> {YEAR_LABELS[year]}
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {loading && (
              <div className="text-center py-12 text-gray-400 text-sm">Loading speakers…</div>
            )}

            {!loading && speakers.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {speakers.map((speaker) => (
                  <SpeakerCard key={speaker.id} speaker={speaker} onClick={() => setSelected(speaker)} />
                ))}
              </div>
            )}

            {!loading && speakers.length === 0 && year === '2027' && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border-2 border-dashed border-[#ffc31d] shadow-sm overflow-hidden">
                  <div className="w-full h-52 bg-gradient-to-br from-[#0e1b4d] to-[#ffc31d]/40 flex items-center justify-center">
                    <Mic size={40} className="text-white/40" />
                  </div>
                  <div className="p-5 text-center">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#ffc31d] text-[#0e1b4d]">Coming Soon</span>
                    <h4 className="font-bold text-gray-400 text-lg mt-3">Speaker TBA</h4>
                    <p className="text-gray-400 text-sm mt-1">Boston, MA · 2027</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
