import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Car, Wifi, Dumbbell, Utensils, Navigation, ExternalLink, Building2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from '../components/Footer';

const BASE = 'https://kuana.org/assets/img';

const VENUES = {
  'hilton-lewisville-2025': {
    event: 'KUANA Reunion 2025',
    name: 'Hilton Garden Inn Dallas Lewisville',
    address: '785 State Hwy 121, Lewisville, TX 75067',
    phone: '(972) 459-4600',
    website: 'https://www.hilton.com/en/hotels/dallegi-hilton-garden-inn-dallas-lewisville/',
    photosUrl: 'https://www.hilton.com/en/hotels/dallegi-hilton-garden-inn-dallas-lewisville/gallery/',
    mapsUrl: 'https://maps.google.com/?q=Hilton+Garden+Inn+Dallas+Lewisville,+785+State+Hwy+121,+Lewisville,+TX+75067',
    mapEmbed: 'https://maps.google.com/maps?q=785+State+Hwy+121,+Lewisville,+TX+75067&output=embed',
    parking: 'Free self-parking & EV charging on-site',
    about: 'A full-service hotel located off I-35 in Lewisville, Texas, featuring 165 guest rooms and 17,000 square feet of divisible event space accommodating up to 840 guests. Conveniently located near restaurants, shopping, and just 9 miles from DFW International Airport.',
    photos: [
      '/assets/img/venue-gallery/dallegi-tx-lewisville-hgi-exterior-day.jpg',
      '/assets/img/venue-gallery/dallegi-tx-lewisville-hgi-lobby.jpg',
      '/assets/img/venue-gallery/dallegi-tx-lewisville-hgi-pool1.jpg',
      '/assets/img/venue-gallery/dallegi-tx-lewisville-hgi-pool2.jpg',
      '/assets/img/venue-gallery/dallegi-tx-lewisville-cy-patio.jpg',
      '/assets/img/venue-gallery/dallegi-tx-lewisville-hgi-restaurant-dinner.jpg',
      '/assets/img/venue-gallery/dallegi-tx-lewisville-hgi-restaurant-bar.jpg',
      '/assets/img/venue-gallery/dallegi-tx-lewisville-hgi-restaurant-breakfast.jpg',
      '/assets/img/venue-gallery/dallegi-tx-lewisville-hgi-restaurant-dinner-prefunc.jpg',
      '/assets/img/venue-gallery/dallegi-tx-lewisville-hgi-tuscanyballroom-banquet-black-curtain.jpg',
      '/assets/img/venue-gallery/dallegi-tx-lewisville-hgi-basilica-conf.jpg',
      '/assets/img/venue-gallery/dallegi-tx-lewisville-hgi-capania-class.jpg',
      '/assets/img/venue-gallery/dallegi-tx-lewisville-hgi-colosseum-ushape.jpg',
      '/assets/img/venue-gallery/dallegi-tx-lewisville-hgi-forum-crescent.jpg',
      '/assets/img/venue-gallery/dallegi-tx-lewisville-hgi-prefunction1.jpg',
      '/assets/img/venue-gallery/dallegi-tx-lewisville-hgi-prefunction2.jpg',
      '/assets/img/venue-gallery/dallegi-tx-lewisville-hgi-fitness1.jpg',
      '/assets/img/venue-gallery/dallegi-tx-lewisville-hgi-fitness2.jpg',
      '/assets/img/venue-gallery/dallegi-tx-lewisville-hgi-market.jpg',
      '/assets/img/venue-gallery/dallegi-tx-lewisville-hgi-roomamenity.jpg',
      '/assets/img/venue-gallery/dallegi-tx-lewisville-hgi-k1jz-520-kingjrsuite-bed.jpg',
      '/assets/img/venue-gallery/dallegi-tx-lewisville-hgi-k1jz-520-kingjrsuite-rev.jpg',
      '/assets/img/venue-gallery/dallegi-tx-lewisville-hgi-k1jz-520-kingjrsuite-wide.jpg',
      '/assets/img/venue-gallery/dallegi-tx-lewisville-hgi-k1rrx-607-king-snacks.jpg',
      '/assets/img/venue-gallery/dallegi-tx-lewisville-hgi-k1rz-609-stdking-rev.jpg',
      '/assets/img/venue-gallery/dallegi-tx-lewisville-hgi-k1rz-609-stdking-wide.jpg',
      '/assets/img/venue-gallery/dallegi-tx-lewisville-hgi-k1trc-508-adaking-wide.jpg',
      '/assets/img/venue-gallery/dallegi-tx-lewisville-hgi-q2-406-stdqq-rev.jpg',
      '/assets/img/venue-gallery/dallegi-tx-lewisville-hgi-q2-406-stdqq-wide.jpg',
      '/assets/img/venue-gallery/dallegi-tx-lewisville-hgi-q2rrd-207-adaqq-wide.jpg',
    ],
    facilities: [
      { icon: <Wifi size={18} />, label: 'Free WiFi' },
      { icon: <Dumbbell size={18} />, label: 'Fitness Center' },
      { icon: <Car size={18} />, label: 'Free Parking' },
      { icon: <Utensils size={18} />, label: 'Restaurant & Room Service' },
      { icon: <Building2 size={18} />, label: 'Outdoor Pool' },
      { icon: <Building2 size={18} />, label: 'Hot Tub' },
      { icon: <Building2 size={18} />, label: 'EV Charging' },
      { icon: <Building2 size={18} />, label: '24-hr Convenience Shop' },
      { icon: <Building2 size={18} />, label: '17,000 sq ft Event Space' },
    ],
    airport: {
      name: 'Dallas/Fort Worth International Airport (DFW)',
      distance: '~9 miles',
      noShuttle: true,
      steps: [
        'Exit north from DFW Airport',
        'Take TX-121 North for approximately 3 miles',
        'When highway splits, take TX-121 toward McKinney',
        'Take the Lake Vista exit',
        'Turn left on Lake Vista Dr — hotel will be on your right',
      ],
    },
  },
  'holiday-inn-trophy-club-2023': {
    event: 'KUANA Reunion 2023',
    name: 'Holiday Inn Trophy Club by IHG',
    address: '725 Plaza Dr, Trophy Club, TX 76262',
    phone: null,
    website: 'https://www.ihg.com/holidayinn/hotels/us/en/trophy-club/dfwtc/hoteldetail',
    photosUrl: 'https://www.ihg.com/holidayinn/hotels/us/en/trophy-club/dfwtc/hoteldetail/photos',
    mapsUrl: 'https://maps.google.com/?q=Holiday+Inn+Trophy+Club,+725+Plaza+Dr,+Trophy+Club,+TX+76262',
    mapEmbed: 'https://maps.google.com/maps?q=725+Plaza+Dr,+Trophy+Club,+TX+76262&output=embed',
    parking: 'Free on-site parking',
    about: 'A full-service hotel in Trophy Club, Texas, offering 123 rooms and suites with modern amenities. Located just 8 miles from DFW International Airport, minutes from Texas Motor Speedway and the Shops of Southlake Town Center.',
    facilities: [
      { icon: <Wifi size={18} />, label: 'Free WiFi' },
      { icon: <Dumbbell size={18} />, label: 'Fitness Center' },
      { icon: <Car size={18} />, label: 'Free Parking' },
      { icon: <Utensils size={18} />, label: 'Restaurant (Magnolia)' },
      { icon: <Building2 size={18} />, label: 'Indoor Pool' },
      { icon: <Building2 size={18} />, label: 'Hot Tub' },
      { icon: <Building2 size={18} />, label: 'Bar & Lounge' },
      { icon: <Building2 size={18} />, label: 'Coffee Shop' },
      { icon: <Building2 size={18} />, label: 'Business Center' },
      { icon: <Building2 size={18} />, label: 'Outdoor Fireplace' },
    ],
    airport: {
      name: 'Dallas/Fort Worth International Airport (DFW)',
      distance: '~8 miles',
      noShuttle: true,
      steps: [
        'Exit DFW Airport heading west on TX-114',
        'Take the Trophy Club Dr / Trophy Lake Dr exit',
        'Continue south on Trophy Club Dr',
        'Turn onto Plaza Dr — hotel will be on your left',
      ],
    },
  },
};

function PhotoGrid({ photos }) {
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') setLightbox((i) => (i + 1) % photos.length);
      if (e.key === 'ArrowLeft') setLightbox((i) => (i - 1 + photos.length) % photos.length);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, photos.length]);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {photos.map((src, i) => (
          <button
            key={i}
            onClick={() => setLightbox(i)}
            className="relative overflow-hidden rounded-xl aspect-video bg-gray-100 cursor-pointer group"
          >
            <img src={src} alt={`Venue photo ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}
      </div>

      {lightbox !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white/70 hover:text-white cursor-pointer z-10" onClick={() => setLightbox(null)}>
            <X size={28} />
          </button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 cursor-pointer z-10"
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + photos.length) % photos.length); }}>
            <ChevronLeft size={24} />
          </button>
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={photos[lightbox]} alt={`Venue photo ${lightbox + 1}`} className="w-full max-h-[85vh] object-contain rounded-xl" />
            <p className="text-white/50 text-center text-xs mt-3">{lightbox + 1} / {photos.length}</p>
          </div>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 cursor-pointer z-10"
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % photos.length); }}>
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </>
  );
}

export default function Venue() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const venue = VENUES[slug];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!venue) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Venue not found.</p>
          <button onClick={() => navigate('/')} className="text-[#0e1b4d] font-semibold hover:underline cursor-pointer">
            Back to KUANA
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0e1b4d] to-[#060c22] text-white py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/60 hover:text-[#ffc31d] text-sm mb-6 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to KUANA
          </button>
          <p className="text-[#ffc31d] text-sm font-semibold uppercase tracking-widest mb-2">{venue.event}</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{venue.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm mt-3">
            <span className="flex items-center gap-1.5"><MapPin size={14} /> {venue.address}</span>
            {venue.phone && <span className="flex items-center gap-1.5"><Phone size={14} /> {venue.phone}</span>}
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <a href={venue.website} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#ffc31d] text-[#0e1b4d] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#ffd54f] transition-colors">
              <ExternalLink size={14} /> View Hotel Website
            </a>
            <a href={venue.photosUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/20 transition-colors">
              <ExternalLink size={14} /> View Photos
            </a>
            <a href={venue.mapsUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/20 transition-colors">
              <Navigation size={14} /> Get Directions
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        {/* Map + About */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">About the Venue</h2>
            <p className="text-gray-600 leading-relaxed mb-4">{venue.about}</p>
            <p className="text-gray-500 text-sm">{venue.parking}</p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 h-64">
            <iframe
              title={venue.name}
              src={venue.mapEmbed}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Photo Gallery */}
        {venue.photos?.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Venue Photos</h2>
            <PhotoGrid photos={venue.photos} />
          </div>
        )}

        {/* Facilities */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Facilities & Amenities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {venue.facilities.map((f) => (
              <div key={f.label} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                <span className="text-[#0e1b4d]">{f.icon}</span>
                <span className="text-sm font-medium text-gray-700">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Airport & Directions */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Getting There</h2>
          <div className="bg-[#0e1b4d]/5 border border-[#0e1b4d]/10 rounded-2xl p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#0e1b4d] flex items-center justify-center flex-shrink-0">
                <Navigation size={18} className="text-[#ffc31d]" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{venue.airport.name}</p>
                <p className="text-gray-500 text-sm">{venue.airport.distance} from the hotel</p>
                {venue.airport.noShuttle && (
                  <p className="text-gray-400 text-xs mt-1">No airport shuttle — rideshare or rental car recommended.</p>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Driving Directions from Airport:</p>
              <ol className="space-y-2">
                {venue.airport.steps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-600">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0e1b4d] text-white text-xs flex items-center justify-center font-bold">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
            <a href={venue.mapsUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 bg-[#0e1b4d] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#0e1b4d]/80 transition-colors">
              <Navigation size={14} /> Open in Google Maps
            </a>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
