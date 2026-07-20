import { useState, useEffect } from 'react';
import { Clock, MapPin, Mic, X } from 'lucide-react';

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

const SPEAKERS_2025 = [
  {
    id: 1,
    name: 'Prof. Achyut Prasad Wagle',
    role: 'Vice Chancellor',
    org: 'Kathmandu University',
    bio: 'Delivering the keynote address on Day 1 evening program. As Vice Chancellor of Kathmandu University, Prof. Wagle brings visionary leadership and deep insights into KU\'s academic future.',
    photo: 'https://kuana.org/assets/img/speakers/keynote.jpg',
    tag: 'Keynote',
    tagColor: 'bg-[#ffc31d] text-[#0e1b4d]',
    social: { facebook: 'https://www.facebook.com/kathmanduniversity', linkedin: 'https://www.linkedin.com/in/achyut-wagle-a9b1537a/', instagram: null },
  },
  {
    id: 2,
    name: 'Saurav Basnet',
    role: 'CEO & Co-Founder, Associate Professor',
    org: 'InnoSTEMLab · Wentworth Institute of Technology',
    bio: 'Entrepreneur and educator bridging the worlds of innovation, STEM education, and academia. Co-founder of InnoSTEMLab and Associate Professor at Wentworth Institute of Technology.',
    photo: 'https://kuana.org/assets/img/speakers/saurav_basnet.jpg',
    tag: 'Speaker',
    tagColor: 'bg-[#0e1b4d] text-white',
    social: { facebook: 'https://www.facebook.com/saurav.m.basnet', linkedin: 'https://www.linkedin.com/in/smsbasnet/', instagram: null },
  },
  {
    id: 3,
    name: 'Sajan Gautam',
    role: 'General Partner',
    org: 'MOMO VC',
    bio: 'Technology practitioner-turned startups advisor and investor. General Partner at MOMO VC, bringing expertise in venture capital, startup ecosystems, and investment strategy.',
    photo: 'https://kuana.org/assets/img/speakers/Sajan_momoVC.jpg',
    tag: 'Speaker',
    tagColor: 'bg-[#0e1b4d] text-white',
    social: { facebook: 'https://www.facebook.com/sajan.gautam', linkedin: 'https://www.linkedin.com/in/sajan-gautam-27a4125/', instagram: 'https://www.instagram.com/gautam.sajan/' },
  },
  {
    id: 4,
    name: 'Shubash Lohani',
    role: 'Senior Director — Global Conservation Initiatives',
    org: 'The Pew Charitable Trusts',
    bio: 'Leading global conservation efforts at The Pew Charitable Trusts, with expertise spanning sustainability, environmental stewardship, and international conservation initiatives.',
    photo: 'https://kuana.org/assets/img/speakers/Shubash_Lohani.jpg',
    tag: 'Speaker',
    tagColor: 'bg-[#0e1b4d] text-white',
    social: { facebook: 'https://www.facebook.com/sclohani', linkedin: 'https://www.linkedin.com/in/shubash-lohani-14533b1/', instagram: null },
  },
  {
    id: 5,
    name: 'Rohini Shrestha',
    role: 'Owner & CEO',
    org: 'Success on the Spectrum — Langhorne, PA',
    bio: 'Passionate autism advocate and special needs mom. As CEO of Success on the Spectrum, Rohini combines personal experience with professional dedication to support families navigating special needs.',
    photo: 'https://kuana.org/assets/img/speakers/Rohini_Shrestha.jpg',
    tag: 'Speaker',
    tagColor: 'bg-[#0e1b4d] text-white',
    social: { facebook: 'https://www.facebook.com/rohini.shrestha.9', linkedin: 'https://www.linkedin.com/in/rohini-shrestha/', instagram: null },
  },
  {
    id: 6,
    name: 'Rajan Rijal',
    role: 'Moderator',
    org: '',
    bio: '',
    photo: '/assets/img/gallery/2025/R6_B9793.jpg',
    photoPosition: 'center 30%',
    tag: 'Moderator',
    tagColor: 'bg-gray-600 text-white',
    social: { facebook: 'https://www.facebook.com/rajan.rijal.7', linkedin: 'https://www.linkedin.com/in/rajan-rijal-0715b1b4/', instagram: null },
  },
];

const SPEAKERS_2023 = [
  {
    id: 1,
    name: 'Bhola Thapa',
    role: 'Keynote Speaker',
    org: '',
    bio: '',
    photo: '/assets/img/speakers/bhola_thapa.jpg',
    tag: 'Keynote',
    tagColor: 'bg-[#ffc31d] text-[#0e1b4d]',
    social: { facebook: 'https://www.facebook.com/bhola.thapa.399', linkedin: 'https://www.linkedin.com/in/bhola-thapa-51666221/', instagram: null },
  },
  {
    id: 2,
    name: 'Deepesh Shrestha',
    role: 'Speaker',
    org: '',
    bio: '',
    photo: '/assets/img/gallery/2025/R6_B0034.jpg',
    photoPosition: 'center 20%',
    tag: 'Speaker',
    tagColor: 'bg-[#0e1b4d] text-white',
    social: { facebook: null, linkedin: null, instagram: null },
  },
];

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}>
      <div className="relative max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors cursor-pointer z-10">
          <X size={18} />
        </button>
        {speaker.photo
          ? <img src={speaker.photo} alt={speaker.name}
              className="w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
              style={{ objectPosition: speaker.photoPosition || 'center top' }} />
          : <div className="w-full h-96 bg-gradient-to-br from-[#0e1b4d] to-[#dc143c] rounded-2xl flex items-center justify-center">
              <Mic size={56} className="text-white/40" />
            </div>
        }
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
          ? <img
              src={speaker.photo}
              alt={speaker.name}
              className="w-full h-52 object-cover"
              style={{ objectPosition: speaker.photoPosition || 'center top' }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          : null}
        <div className={`w-full h-52 bg-gradient-to-br from-[#0e1b4d] to-[#dc143c] items-center justify-center ${speaker.photo ? 'hidden' : 'flex'}`}>
          <Mic size={40} className="text-white/40" />
        </div>
        <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full ${speaker.tagColor}`}>
          {speaker.tag}
        </span>
        <div className="absolute bottom-3 right-3 z-10">
          <SocialLinks social={speaker.social} size={8} />
        </div>
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

  useEffect(() => {
    const handler = (e) => setYear(e.detail);
    window.addEventListener('kuana:speakers-year', handler);
    return () => window.removeEventListener('kuana:speakers-year', handler);
  }, []);

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
            <button
              key={y}
              onClick={() => setYear(y)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                year === y
                  ? 'bg-[#0e1b4d] text-white shadow'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-[#0e1b4d] hover:text-[#0e1b4d]'
              }`}
            >
              {y}
              {y === '2027' && (
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${year === y ? 'bg-[#ffc31d] text-[#0e1b4d]' : 'bg-green-100 text-green-700'}`}>
                  Upcoming
                </span>
              )}
            </button>
          ))}
        </div>

        {/* 2027 — Speakers */}
        {year === '2027' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                <Clock size={14} /> KUANA Reunion 2027 · Boston, MA
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
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
          </div>
        )}

        {/* 2025 — Speakers */}
        {year === '2025' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                <Clock size={14} /> KUANA Reunion 2025 · Lewisville, TX
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {SPEAKERS_2025.map((speaker) => (
                <SpeakerCard key={speaker.id} speaker={speaker} onClick={() => setSelected(speaker)} />
              ))}
            </div>
          </div>
        )}

        {/* 2023 — Speakers */}
        {year === '2023' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                <Clock size={14} /> KUANA Reunion 2023 · Trophy Club, TX
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {SPEAKERS_2023.map((speaker) => (
                <SpeakerCard key={speaker.id} speaker={speaker} onClick={() => setSelected(speaker)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
    </>
  );
}
