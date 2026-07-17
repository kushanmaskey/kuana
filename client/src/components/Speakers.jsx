import { useState, useEffect } from 'react';
import { Clock, MapPin, Mic } from 'lucide-react';

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
  },
];

function SpeakerCard({ speaker }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="relative">
        <img
          src={speaker.photo}
          alt={speaker.name}
          className="w-full h-52 object-cover object-top"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div
          className="w-full h-52 bg-gradient-to-br from-[#0e1b4d] to-[#dc143c] items-center justify-center hidden"
        >
          <Mic size={40} className="text-white/40" />
        </div>
        <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full ${speaker.tagColor}`}>
          {speaker.tag}
        </span>
      </div>
      <div className="p-5">
        <h4 className="font-bold text-gray-900 text-lg leading-tight mb-1">{speaker.name}</h4>
        <p className="text-[#dc143c] text-sm font-semibold mb-0.5">{speaker.role}</p>
        <p className="text-gray-400 text-xs mb-3">{speaker.org}</p>
        <p className="text-gray-600 text-sm leading-relaxed">{speaker.bio}</p>
      </div>
    </div>
  );
}

const YEARS = ['2027', '2025', '2023'];

export default function Speakers({ initialYear = '2025' }) {
  const [year, setYear] = useState(initialYear);

  useEffect(() => {
    const handler = (e) => setYear(e.detail);
    window.addEventListener('kuana:speakers-year', handler);
    return () => window.removeEventListener('kuana:speakers-year', handler);
  }, []);

  return (
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

        {/* 2027 — TBD */}
        {year === '2027' && (
          <div className="rounded-2xl border-2 border-dashed border-[#ffc31d] bg-[#0e1b4d]/5 p-12 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#0e1b4d]/10 flex items-center justify-center mx-auto mb-5">
              <Mic size={28} className="text-[#0e1b4d]" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Speakers — KUANA 2027</h3>
            <p className="text-gray-500 leading-relaxed mb-5">
              Speakers for the 2027 reunion in Boston, MA will be announced once the venue is confirmed.
              Stay tuned for an exciting lineup!
            </p>
            <div className="inline-flex items-center gap-2 text-[#0e1b4d] font-semibold text-sm bg-[#ffc31d]/20 px-5 py-2.5 rounded-full">
              <MapPin size={14} />
              Boston, MA &bull; Aug 30–31, 2027 &bull; Venue TBD
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
                <SpeakerCard key={speaker.id} speaker={speaker} />
              ))}
            </div>
          </div>
        )}

        {/* 2023 — TBD placeholder until data is added */}
        {year === '2023' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                <Clock size={14} /> KUANA Reunion 2023 · Trophy Club, TX
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center max-w-xl mx-auto">
              <Mic size={36} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-700 mb-2">Speaker info coming soon</h3>
              <p className="text-gray-400 text-sm">
                Details about the 2023 reunion speakers will be added here.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
