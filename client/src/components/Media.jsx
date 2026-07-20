import { useState, useRef, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Clock, MapPin, Image, ZoomIn, Video } from 'lucide-react';

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
  { id: 's3', title: 'Keynote Address', url: `${BASE}/speakers/keynote.jpg` },
  { id: 's13', title: 'Hawaiian Waters — The Colony', url: `${BASE}/speakers/hawaiian-waters-the-colony.jpg` },
  { id: 's14', title: 'Online Call — Pre-event', url: `${BASE}/Images/online_call.jpg` },
  { id: 'g1',  title: 'Reunion 2025', url: '/assets/img/gallery/2025/R6_B0009.jpg', thumb: '/assets/img/gallery/2025/thumbs/R6_B0009.jpg' },
  { id: 'g2',  title: 'Reunion 2025', url: '/assets/img/gallery/2025/R6_B0025.jpg', thumb: '/assets/img/gallery/2025/thumbs/R6_B0025.jpg' },
  { id: 'g3',  title: 'Reunion 2025', url: '/assets/img/gallery/2025/R6_B0034.jpg', thumb: '/assets/img/gallery/2025/thumbs/R6_B0034.jpg' },
  { id: 'g4',  title: 'Reunion 2025', url: '/assets/img/gallery/2025/R6_B0044.jpg', thumb: '/assets/img/gallery/2025/thumbs/R6_B0044.jpg' },
  { id: 'g5',  title: 'Reunion 2025', url: '/assets/img/gallery/2025/R6_B0047.jpg', thumb: '/assets/img/gallery/2025/thumbs/R6_B0047.jpg' },
  { id: 'g6',  title: 'Reunion 2025', url: '/assets/img/gallery/2025/R6_B0050.jpg', thumb: '/assets/img/gallery/2025/thumbs/R6_B0050.jpg' },
  { id: 'g7',  title: 'Reunion 2025', url: '/assets/img/gallery/2025/R6_B0065.jpg', thumb: '/assets/img/gallery/2025/thumbs/R6_B0065.jpg' },
  { id: 'g8',  title: 'Reunion 2025', url: '/assets/img/gallery/2025/R6_B0171.jpg', thumb: '/assets/img/gallery/2025/thumbs/R6_B0171.jpg' },
  { id: 'g9',  title: 'Reunion 2025', url: '/assets/img/gallery/2025/R6_B0191.jpg', thumb: '/assets/img/gallery/2025/thumbs/R6_B0191.jpg' },
  { id: 'g10', title: 'Reunion 2025', url: '/assets/img/gallery/2025/R6_B0218.jpg', thumb: '/assets/img/gallery/2025/thumbs/R6_B0218.jpg' },
  { id: 'g11', title: 'Reunion 2025', url: '/assets/img/gallery/2025/R6_B0386.jpg', thumb: '/assets/img/gallery/2025/thumbs/R6_B0386.jpg' },
  { id: 'g12', title: 'Reunion 2025', url: '/assets/img/gallery/2025/R6_B0509.jpg', thumb: '/assets/img/gallery/2025/thumbs/R6_B0509.jpg' },
  { id: 'g13', title: 'Reunion 2025', url: '/assets/img/gallery/2025/R6_B0510.jpg', thumb: '/assets/img/gallery/2025/thumbs/R6_B0510.jpg' },
  { id: 'g14', title: 'Reunion 2025', url: '/assets/img/gallery/2025/R6_B9783.jpg', thumb: '/assets/img/gallery/2025/thumbs/R6_B9783.jpg' },
  { id: 'g15', title: 'Reunion 2025', url: '/assets/img/gallery/2025/R6_B9786.jpg', thumb: '/assets/img/gallery/2025/thumbs/R6_B9786.jpg' },
  { id: 'g16', title: 'Reunion 2025', url: '/assets/img/gallery/2025/R6_B9787.jpg', thumb: '/assets/img/gallery/2025/thumbs/R6_B9787.jpg' },
  { id: 'g17', title: 'Reunion 2025', url: '/assets/img/gallery/2025/R6_B9793.jpg', thumb: '/assets/img/gallery/2025/thumbs/R6_B9793.jpg' },
  { id: 'g18', title: 'Reunion 2025', url: '/assets/img/gallery/2025/R6_B9829.jpg', thumb: '/assets/img/gallery/2025/thumbs/R6_B9829.jpg' },
  { id: 'g19', title: 'Reunion 2025', url: '/assets/img/gallery/2025/R6_B9847.jpg', thumb: '/assets/img/gallery/2025/thumbs/R6_B9847.jpg' },
  { id: 'g20', title: 'Reunion 2025', url: '/assets/img/gallery/2025/R6_B9900.jpg', thumb: '/assets/img/gallery/2025/thumbs/R6_B9900.jpg' },
  { id: 'g21', title: 'Reunion 2025', url: '/assets/img/gallery/2025/R6_B9902.jpg', thumb: '/assets/img/gallery/2025/thumbs/R6_B9902.jpg' },
  { id: 'g22', title: 'Reunion 2025', url: '/assets/img/gallery/2025/R6_B9911.jpg', thumb: '/assets/img/gallery/2025/thumbs/R6_B9911.jpg' },
  { id: 'g23', title: 'Reunion 2025', url: '/assets/img/gallery/2025/R6_B9922.jpg', thumb: '/assets/img/gallery/2025/thumbs/R6_B9922.jpg' },
  { id: 'g24', title: 'Reunion 2025', url: '/assets/img/gallery/2025/R6_B9969.jpg', thumb: '/assets/img/gallery/2025/thumbs/R6_B9969.jpg' },
  { id: 'g25', title: 'Reunion 2025', url: '/assets/img/gallery/2025/R6_B9972.jpg', thumb: '/assets/img/gallery/2025/thumbs/R6_B9972.jpg' },
  { id: 'g26', title: 'Reunion 2025', url: '/assets/img/gallery/2025/R6_B9980.jpg', thumb: '/assets/img/gallery/2025/thumbs/R6_B9980.jpg' },
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

// YouTube video IDs — add IDs here as videos become available
const VIDEOS_2025 = [
  // { id: 'v1', title: 'Highlights', youtubeId: 'YOUTUBE_ID_HERE' },
];
const VIDEOS_2023 = [
  // { id: 'v1', title: 'Highlights', youtubeId: 'YOUTUBE_ID_HERE' },
];
const VIDEOS_2027 = [];

const VIDEOS = { '2025': VIDEOS_2025, '2023': VIDEOS_2023, '2027': VIDEOS_2027 };
const PHOTOS = { '2025': MEDIA_2025, '2023': MEDIA_2023, '2027': [] };

function LazyThumb({ src, alt }) {
  const ref = useRef(null);
  const [activeSrc, setActiveSrc] = useState(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActiveSrc(src); obs.disconnect(); } },
      { rootMargin: '300px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [src]);

  return (
    <div ref={ref} className="w-full h-full bg-gray-800">
      {activeSrc && <img src={activeSrc} alt={alt} className="w-full h-full object-cover" decoding="async" />}
    </div>
  );
}

function Carousel({ items, city, year }) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const thumbsRef = useRef(null);

  const scrollThumbs = (dir) => {
    thumbsRef.current?.scrollBy({ left: dir * 200, behavior: 'smooth' });
  };

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
      <div className="relative rounded-2xl overflow-hidden bg-gray-900 mb-3 group flex items-center justify-center" style={{ minHeight: '400px', maxHeight: '70vh' }}>
        <img
          src={item.url}
          alt={item.title}
          className="w-full h-full object-contain transition-opacity duration-300"
          style={{ maxHeight: '70vh' }}
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
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors cursor-pointer"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => go(current + 1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors cursor-pointer"
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
      <div className="relative flex items-center gap-1">
        <button
          onClick={() => scrollThumbs(-1)}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors cursor-pointer"
        >
          <ChevronLeft size={16} />
        </button>
        <div
          ref={thumbsRef}
          className="flex gap-2 overflow-x-auto pb-2 scroll-smooth flex-1"
          style={{ scrollbarWidth: 'none' }}
        >
          {items.map((img, i) => (
            <button
              key={img.id}
              onClick={() => go(i)}
              className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                i === current ? 'border-[#0e1b4d] opacity-100 scale-105' : 'border-transparent opacity-60 hover:opacity-90'
              }`}
            >
              <LazyThumb src={img.thumb || img.url} alt={img.title} />
            </button>
          ))}
        </div>
        <button
          onClick={() => scrollThumbs(1)}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>
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

const CITY = { '2027': 'Boston, MA', '2025': 'Lewisville, TX', '2023': 'Trophy Club, TX' };

function VideoGallery({ videos, year }) {
  if (videos.length === 0) {
    return (
      <div className="rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-16" style={{ minHeight: '300px' }}>
        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Video size={26} className="text-gray-400" />
        </div>
        <h4 className="font-semibold text-gray-500 mb-2">No videos yet for {year}</h4>
        <p className="text-gray-400 text-sm">Videos will appear here once they are available.</p>
      </div>
    );
  }
  return (
    <div className="grid sm:grid-cols-2 gap-6">
      {videos.map((v) => (
        <div key={v.id} className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${v.youtubeId}`}
              title={v.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
          <div className="p-3 bg-white">
            <p className="text-sm font-semibold text-gray-800">{v.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Media() {
  const [activeYear, setActiveYear] = useState('2025');
  const [activeType, setActiveType] = useState('photos');

  useEffect(() => {
    const handler = (e) => {
      if (typeof e.detail === 'object') {
        setActiveType(e.detail.type);
        setActiveYear(e.detail.year);
      } else {
        setActiveYear(e.detail);
      }
    };
    window.addEventListener('kuana:media-select', handler);
    window.addEventListener('kuana:media-year', handler);
    return () => {
      window.removeEventListener('kuana:media-select', handler);
      window.removeEventListener('kuana:media-year', handler);
    };
  }, []);

  const is2027 = activeYear === '2027';
  const photos = PHOTOS[activeYear] || [];
  const videos = VIDEOS[activeYear] || [];
  const city = CITY[activeYear];

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

        {/* Type tabs — Photos / Videos */}
        <div className="flex gap-2 justify-center mb-6">
          {[
            { value: 'photos', label: 'Photos', Icon: Image },
            { value: 'videos', label: 'Videos', Icon: Video },
          ].map(({ value, label, Icon }) => (
            <button
              key={value}
              onClick={() => setActiveType(value)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeType === value
                  ? 'bg-[#dc143c] text-white shadow'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
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

        {/* 2027 — Coming soon */}
        {is2027 && (
          <div className="rounded-2xl overflow-hidden relative bg-gray-900" style={{ minHeight: '400px', maxHeight: '70vh' }}>
            <img
              src={`${BASE}/venue-gallery/a.avif`}
              alt="Coming soon placeholder"
              className="w-full h-full object-cover absolute inset-0"
              style={{ filter: 'blur(6px) brightness(0.35)', transform: 'scale(1.05)' }}
            />
            <div className="relative z-10 flex flex-col items-center justify-center text-center p-12 h-full" style={{ minHeight: '400px' }}>
              <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-5">
                <Clock size={26} className="text-[#ffc31d]" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-3">KUANA Reunion 2027 — Boston, MA</h4>
              <p className="text-white/60 text-sm mb-6 max-w-md mx-auto">
                {activeType === 'photos' ? 'Photos' : 'Videos'} will be available after the reunion. Stay tuned!
              </p>
              <div className="inline-flex items-center gap-2 text-[#0e1b4d] font-semibold text-sm bg-[#ffc31d] px-4 py-2 rounded-full">
                <MapPin size={14} />
                Venue TBD &bull; Aug 30–31, 2027
              </div>
            </div>
          </div>
        )}

        {/* Photos */}
        {!is2027 && activeType === 'photos' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                <Image size={14} /> {photos.length} photos · {city}
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
            <Carousel items={photos} city={city} year={activeYear} />
          </div>
        )}

        {/* Videos */}
        {!is2027 && activeType === 'videos' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                <Video size={14} /> {videos.length} videos · {city}
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
            <VideoGallery videos={videos} year={activeYear} />
          </div>
        )}
      </div>
    </section>
  );
}
