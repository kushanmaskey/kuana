import { useState, useRef, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Clock, MapPin, Image, ZoomIn } from 'lucide-react';

const BASE = 'https://kuana.org/assets/img';

const MEDIA_2025 = [
  { id: 'v1', title: 'Venue — Hilton Garden Inn Dallas Lewisville', url: `${BASE}/venue-gallery/a.avif` },
  { id: 'v2', title: 'Venue Gallery', url: `${BASE}/venue-gallery/b.avif` },
  { id: 'v3', title: 'Venue Gallery', url: `${BASE}/venue-gallery/c.avif` },
  { id: 'v4', title: 'Venue Gallery', url: `${BASE}/venue-gallery/d.avif` },
  { id: 'v5', title: 'Venue Gallery', url: `${BASE}/venue-gallery/e.avif` },
  { id: 'v6', title: 'Venue Gallery', url: `${BASE}/venue-gallery/f.avif` },
  { id: 'v7', title: 'Venue Gallery', url: `${BASE}/venue-gallery/g.avif` },
  { id: 'v8', title: 'Venue Gallery', url: `${BASE}/venue-gallery/h.avif` },
  { id: 's1', title: 'Arrival', url: `${BASE}/speakers/arrival.jpg` },
  { id: 's2', title: 'Kickoff', url: `${BASE}/speakers/kickoff.jpg` },
  { id: 's3', title: 'Keynote Address', url: `${BASE}/speakers/keynote.jpg` },
  { id: 's4', title: 'Panel Discussion', url: `${BASE}/speakers/paneldiscussion.jpg` },
  { id: 's5', title: 'Felicitations', url: `${BASE}/speakers/felicitations.jpg` },
  { id: 's6', title: 'Cultural Program', url: `${BASE}/speakers/culture.jpg` },
  { id: 's7', title: 'Networking Session', url: `${BASE}/speakers/networking.jpg` },
  { id: 's8', title: 'Mingle & Connect', url: `${BASE}/speakers/mingle.jpg` },
  { id: 's9', title: 'Banquet Dinner', url: `${BASE}/speakers/dinner.jpg` },
  { id: 's10', title: 'DJ Night', url: `${BASE}/speakers/dj.jpg` },
  { id: 's11', title: 'Photo Booth', url: `${BASE}/speakers/photobooth.jpg` },
  { id: 's12', title: 'Farewell', url: `${BASE}/speakers/bye.jpg` },
  { id: 's13', title: 'Hawaiian Waters — The Colony', url: `${BASE}/speakers/hawaiian-waters-the-colony.jpg` },
  { id: 's14', title: 'Online Call — Pre-event', url: `${BASE}/Images/online_call.jpg` },
];

const MEDIA_2023 = [
  { id: '23_1', title: 'Reunion Moments', url: `${BASE}/Images/23_1.jpg` },
  { id: '23_2', title: 'Reunion Moments', url: `${BASE}/Images/23_2.jpg` },
  { id: '23_3', title: 'Reunion Moments', url: `${BASE}/Images/23_3.jpg` },
  { id: '23_4', title: 'Reunion Moments', url: `${BASE}/Images/23_4.jpg` },
  { id: '23_5', title: 'Reunion Moments', url: `${BASE}/Images/23_5.jpg` },
  { id: '23_6', title: 'Reunion Moments', url: `${BASE}/Images/23_6.jpg` },
  { id: '23_7', title: 'Reunion Moments', url: `${BASE}/Images/23_7.jpg` },
  { id: '23_8', title: 'Reunion Moments', url: `${BASE}/Images/23_8.jpg` },
  { id: '23_9', title: 'Reunion Moments', url: `${BASE}/Images/23_9.jpg` },
  { id: 'm1', title: 'Alumni Gathering', url: `${BASE}/Images/1_.jpeg` },
  { id: 'm3', title: 'Alumni Gathering', url: `${BASE}/Images/3_.jpg` },
  { id: 'm7', title: 'Alumni Gathering', url: `${BASE}/Images/7_.jpg` },
  { id: 'm8', title: 'Alumni Gathering', url: `${BASE}/Images/8_.jpg` },
  { id: 'm11', title: 'Alumni Gathering', url: `${BASE}/Images/11_.jpg` },
  { id: 'm20', title: 'Alumni Gathering', url: `${BASE}/Images/20_.jpg` },
  { id: 'm21', title: 'Alumni Gathering', url: `${BASE}/Images/21_.jpg` },
  { id: 'm26', title: 'Alumni Gathering', url: `${BASE}/Images/26_.jpg` },
  { id: 'm30', title: 'Alumni Gathering', url: `${BASE}/Images/30_.jpg` },
  { id: 'm37', title: 'Alumni Gathering', url: `${BASE}/Images/37_.jpg` },
  { id: 'm49', title: 'Alumni Gathering', url: `${BASE}/Images/49_.jpg` },
];

const YEARS = [
  { value: '2027', label: '2027', upcoming: true },
  { value: '2025', label: '2025' },
  { value: '2023', label: '2023' },
];

function Carousel({ items, city, year }) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const thumbsRef = useRef(null);

  const go = (idx) => {
    const next = (idx + items.length) % items.length;
    setCurrent(next);
    // Scroll thumbnail into view
    const thumb = thumbsRef.current?.children[next];
    thumb?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  // Keyboard navigation
  useEffect(() => {
    if (!lightbox) return;
    const handler = (e) => {
      if (e.key === 'ArrowLeft') go(current - 1);
      if (e.key === 'ArrowRight') go(current + 1);
      if (e.key === 'Escape') setLightbox(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [current, lightbox]);

  const item = items[current];

  return (
    <div>
      {/* Main image */}
      <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-video mb-3 group">
        <img
          src={item.url}
          alt={item.title}
          className="w-full h-full object-cover transition-opacity duration-300"
          loading="lazy"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Caption */}
        <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
          <div>
            <p className="text-white font-semibold text-sm">{item.title}</p>
            <p className="text-white/60 text-xs mt-0.5">{city} · {year} · {current + 1} / {items.length}</p>
          </div>
          <button
            onClick={() => setLightbox(true)}
            className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors cursor-pointer"
            title="View full screen"
          >
            <ZoomIn size={16} />
          </button>
        </div>

        {/* Prev / Next arrows */}
        <button
          onClick={() => go(current - 1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => go(current + 1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Dot indicator */}
      <div className="flex justify-center gap-1 mb-3">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className={`rounded-full transition-all cursor-pointer ${
              i === current ? 'w-5 h-1.5 bg-[#0e1b4d]' : 'w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Thumbnail strip */}
      <div
        ref={thumbsRef}
        className="flex gap-2 overflow-x-auto pb-2 scroll-smooth"
        style={{ scrollbarWidth: 'thin' }}
      >
        {items.map((img, i) => (
          <button
            key={img.id}
            onClick={() => go(i)}
            className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
              i === current ? 'border-[#0e1b4d] opacity-100 scale-105' : 'border-transparent opacity-60 hover:opacity-90'
            }`}
          >
            <img src={img.url} alt={img.title} className="w-full h-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white cursor-pointer z-10"
            onClick={() => setLightbox(false)}
          >
            <X size={28} />
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 cursor-pointer z-10"
            onClick={(e) => { e.stopPropagation(); go(current - 1); }}
          >
            <ChevronLeft size={24} />
          </button>
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={item.url}
              alt={item.title}
              className="w-full max-h-[82vh] object-contain rounded-xl"
            />
            <p className="text-white/70 text-center mt-3 text-sm">{item.title}</p>
            <p className="text-white/40 text-center text-xs mt-1">{current + 1} / {items.length}</p>
          </div>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 cursor-pointer z-10"
            onClick={(e) => { e.stopPropagation(); go(current + 1); }}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function Media() {
  const [activeYear, setActiveYear] = useState('2025');

  return (
    <section id="media" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-[#ffc31d] text-sm font-semibold uppercase tracking-widest mb-3">Photos & Videos</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Media Gallery</h2>
          <div className="w-16 h-1 bg-[#ffc31d] mx-auto mb-6 rounded" />
          <p className="text-gray-600 max-w-xl mx-auto">
            Memories from our reunions across North America.
          </p>
        </div>

        {/* Year tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {YEARS.map(({ label, value, upcoming }) => (
            <button
              key={value}
              onClick={() => setActiveYear(value)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeYear === value
                  ? 'bg-[#0e1b4d] text-white shadow'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
              {upcoming && (
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                  activeYear === value ? 'bg-[#ffc31d] text-[#0e1b4d]' : 'bg-green-100 text-green-700'
                }`}>
                  Upcoming
                </span>
              )}
            </button>
          ))}
        </div>

        {/* 2027 — TBD */}
        {activeYear === '2027' && (
          <div className="rounded-2xl border-2 border-dashed border-[#ffc31d] bg-[#0e1b4d]/5 p-12 text-center max-w-2xl mx-auto">
            <div className="w-14 h-14 rounded-full bg-[#0e1b4d]/10 flex items-center justify-center mx-auto mb-4">
              <Clock size={26} className="text-[#0e1b4d]" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">KUANA Reunion 2027 — Boston, MA</h4>
            <p className="text-gray-500 text-sm mb-4 max-w-md mx-auto">
              Photos and videos will be available once the venue is confirmed. Stay tuned!
            </p>
            <div className="inline-flex items-center gap-2 text-[#0e1b4d] font-semibold text-sm bg-[#ffc31d]/20 px-4 py-2 rounded-full">
              <MapPin size={14} />
              Venue TBD &bull; Aug 30–31, 2027
            </div>
          </div>
        )}

        {/* 2025 carousel */}
        {activeYear === '2025' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                <Image size={14} /> {MEDIA_2025.length} photos · Lewisville, TX
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
            <Carousel items={MEDIA_2025} city="Lewisville, TX" year="2025" />
          </div>
        )}

        {/* 2023 carousel */}
        {activeYear === '2023' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                <Image size={14} /> {MEDIA_2023.length} photos · Trophy Club, TX
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
            <Carousel items={MEDIA_2023} city="Trophy Club, TX" year="2023" />
          </div>
        )}
      </div>
    </section>
  );
}
