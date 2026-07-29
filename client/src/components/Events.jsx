import { useState, useEffect } from 'react';
import { Calendar, MapPin, ExternalLink, ChevronDown, ChevronUp, Car, Wifi, Dumbbell, Utensils, Phone, Navigation } from 'lucide-react';
import { getEvents } from '../api';

const SAMPLE_EVENTS = [
  {
    id: 3,
    title: 'KUANA Reunion 2027',
    description: 'Join us in Boston, MA for the third biennial reunion of Kathmandu University Alumni North America. Two days of reconnecting, networking, cultural programs, and celebrating our shared KU journey.',
    event_date: '2027-09-04',
    end_date: '2027-09-04',
    city: 'Boston',
    state_province: 'MA',
    venue: null,
    venue_address: null,
    is_featured: true,
    registration_url: null,
  },
  {
    id: 1,
    title: 'KUANA Reunion 2025',
    description: 'Our second biennial reunion bringing together KU alumni from across the USA and Canada for two days of networking, cultural programs, and celebration.',
    event_date: '2025-08-30',
    end_date: '2025-08-31',
    city: 'Lewisville',
    state_province: 'TX',
    venue: 'Hilton Garden Inn Dallas Lewisville',
    venue_address: '785 State Hwy 121, Lewisville, TX 75067',
    is_featured: false,
    registration_url: null,
  },
  {
    id: 2,
    title: 'KUANA Reunion 2023',
    description: 'Inaugural KUANA reunion — the first gathering of Kathmandu University Alumni in North America. A historic milestone for our community.',
    event_date: '2023-09-01',
    city: 'Trophy Club',
    state_province: 'TX',
    venue: 'Holiday Inn Trophy Club by IHG',
    venue_address: '725 Plaza Dr, Trophy Club, TX 76262',
    is_featured: false,
    registration_url: null,
  },
];

const VENUE_DETAILS = {
  1: {
    website: 'https://www.hilton.com/en/hotels/dallegi-hilton-garden-inn-dallas-lewisville/',
    phone: '(972) 459-4600',
    mapsUrl: 'https://maps.google.com/?q=Hilton+Garden+Inn+Dallas+Lewisville,+785+State+Hwy+121,+Lewisville,+TX+75067',
    parking: 'Free self-parking & EV charging on-site',
    facilities: ['Outdoor Pool', 'Hot Tub', 'Fitness Center', 'Free WiFi', 'Free Parking', 'EV Charging', 'Restaurant & Room Service', '24-hr Shop', '17,000 sq ft Event Space'],
    airport: {
      name: 'Dallas/Fort Worth International (DFW)',
      distance: '~9 miles',
      noShuttle: true,
      directions: 'Exit north from DFW Airport → take TX-121 North for approximately 3 miles → when highway splits, take TX-121 toward McKinney → take the Lake Vista exit → turn left on Lake Vista Dr.',
    },
  },
  2: {
    website: 'https://www.ihg.com/holidayinn/hotels/us/en/trophy-club/dfwtc/hoteldetail',
    phone: null,
    mapsUrl: 'https://maps.google.com/?q=Holiday+Inn+Trophy+Club,+725+Plaza+Dr,+Trophy+Club,+TX+76262',
    parking: 'Free on-site parking',
    facilities: ['Indoor Pool', 'Hot Tub', 'Fitness Center', 'Free WiFi', 'Free Parking', 'Restaurant (Magnolia)', 'Bar & Lounge', 'Coffee Shop', 'Business Center', 'Outdoor Fireplace'],
    airport: {
      name: 'Dallas/Fort Worth International (DFW)',
      distance: '~8 miles',
      noShuttle: true,
      directions: 'From DFW Airport take TX-114 West → take the Trophy Club Dr / Trophy Lake Dr exit → continue south to Plaza Dr.',
    },
  },
};

const FACILITY_ICONS = {
  'Free WiFi': <Wifi size={13} />,
  'Fitness Center': <Dumbbell size={13} />,
  'Restaurant & Room Service': <Utensils size={13} />,
  'Restaurant (Magnolia)': <Utensils size={13} />,
  'Free Parking': <Car size={13} />,
  'Free self-parking & EV charging on-site': <Car size={13} />,
};

function VenueDetails({ details, isFeatured }) {
  return (
    <div className={`mt-6 pt-6 border-t ${isFeatured ? 'border-white/20' : 'border-gray-100'}`}>
      <div className="grid md:grid-cols-2 gap-6">

        {/* Facilities */}
        <div>
          <h4 className={`text-sm font-bold uppercase tracking-wide mb-3 ${isFeatured ? 'text-[#ffc31d]' : 'text-[#0e1b4d]'}`}>
            Facilities
          </h4>
          <div className="flex flex-wrap gap-2">
            {details.facilities.map((f) => (
              <span key={f}
                className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
                  isFeatured ? 'bg-white/10 text-white/80' : 'bg-gray-100 text-gray-700'
                }`}>
                {FACILITY_ICONS[f] || null}
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Airport & Directions */}
        <div>
          <h4 className={`text-sm font-bold uppercase tracking-wide mb-3 ${isFeatured ? 'text-[#ffc31d]' : 'text-[#0e1b4d]'}`}>
            Getting There
          </h4>
          <div className={`text-xs space-y-2 ${isFeatured ? 'text-white/80' : 'text-gray-600'}`}>
            <p className="font-semibold">{details.airport.name} · {details.airport.distance}</p>
            <p className="leading-relaxed">{details.airport.directions}</p>
            {details.airport.noShuttle && (
              <p className={`italic ${isFeatured ? 'text-white/50' : 'text-gray-400'}`}>No airport shuttle — rideshare recommended.</p>
            )}
            <p className={`mt-1 ${isFeatured ? 'text-white/70' : 'text-gray-500'}`}>{details.parking}</p>
          </div>
        </div>
      </div>

      {/* Action links */}
      <div className="flex flex-wrap gap-3 mt-5">
        <a href={details.website} target="_blank" rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
            isFeatured ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-[#0e1b4d] text-white hover:bg-[#0e1b4d]/80'
          }`}>
          <ExternalLink size={12} /> View Hotel
        </a>
        <a href={details.mapsUrl} target="_blank" rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
            isFeatured ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}>
          <Navigation size={12} /> Get Directions
        </a>
        {details.phone && (
          <a href={`tel:${details.phone}`}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
              isFeatured ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}>
            <Phone size={12} /> {details.phone}
          </a>
        )}
      </div>
    </div>
  );
}

function EventCard({ event, isFeatured }) {
  const [showVenue, setShowVenue] = useState(false);
  const date = new Date(event.event_date);
  const isPast = date < new Date();
  const venueDetails = VENUE_DETAILS[event.id];

  return (
    <div
      className={`rounded-2xl overflow-hidden border transition-all duration-200 hover:shadow-xl ${
        isFeatured
          ? 'border-[#ffc31d] bg-gradient-to-br from-[#0e1b4d] to-[#060c22] text-white col-span-full'
          : 'border-gray-200 bg-white'
      }`}
    >
      <div className="p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            {isFeatured && (
              <span className="bg-[#ffc31d] text-[#0e1b4d] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Featured
              </span>
            )}
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide ${
                isPast
                  ? isFeatured ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {isPast ? 'Past Event' : 'Upcoming'}
            </span>
          </div>
        </div>

        <div className={`flex flex-col md:flex-row md:items-start gap-6 ${isFeatured ? '' : ''}`}>
          {/* Date box */}
          <div
            className={`flex-shrink-0 w-20 h-20 rounded-2xl flex flex-col items-center justify-center font-bold ${
              isFeatured ? 'bg-white/20' : 'bg-[#0e1b4d]/10'
            }`}
          >
            <span className={`text-2xl font-bold ${isFeatured ? 'text-[#ffc31d]' : 'text-[#0e1b4d]'}`}>
              {date.getUTCDate()}
            </span>
            <span className={`text-xs uppercase ${isFeatured ? 'text-white/80' : 'text-[#0e1b4d]/80'}`}>
              {date.toLocaleString('default', { month: 'short', timeZone: 'UTC' })}
            </span>
            <span className={`text-xs ${isFeatured ? 'text-white/60' : 'text-gray-400'}`}>
              {date.getUTCFullYear()}
            </span>
          </div>

          <div className="flex-1">
            <h3 className={`text-xl md:text-2xl font-bold mb-2 ${isFeatured ? 'text-white' : 'text-gray-900'}`}>
              {event.title}
            </h3>
            <div className={`flex flex-wrap gap-4 mb-3 text-sm ${isFeatured ? 'text-white/80' : 'text-gray-500'}`}>
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {event.city}, {event.state_province}
              </span>
              {event.venue && (
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {event.venue}
                </span>
              )}
            </div>
            <p className={`leading-relaxed text-sm ${isFeatured ? 'text-white/80' : 'text-gray-600'}`}>
              {event.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-4">
              {event.registration_url && !isPast && (
                <a
                  href={event.registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all cursor-pointer ${
                    isFeatured
                      ? 'bg-[#ffc31d] text-[#0e1b4d] hover:bg-[#ffd54f]'
                      : 'bg-[#0e1b4d] text-white hover:bg-[#0e1b4d]/80'
                  }`}
                >
                  Register Now <ExternalLink size={14} />
                </a>
              )}
              {venueDetails && (
                <button
                  onClick={() => setShowVenue((v) => !v)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all cursor-pointer ${
                    isFeatured
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {showVenue ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  {showVenue ? 'Hide Venue Info' : 'Venue Info'}
                </button>
              )}
            </div>
          </div>
        </div>

        {showVenue && venueDetails && (
          <VenueDetails details={venueDetails} isFeatured={isFeatured} />
        )}
      </div>
    </div>
  );
}

const YEARS = ['2027', '2025', '2023'];

export default function Events() {
  const [events, setEvents] = useState(SAMPLE_EVENTS);
  const [year, setYear] = useState('2027');

  useEffect(() => {
    getEvents()
      .then((res) => { if (res.data?.length) setEvents(res.data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e) => setYear(e.detail);
    window.addEventListener('kuana:events-year', handler);
    return () => window.removeEventListener('kuana:events-year', handler);
  }, []);

  const eventForYear = (y) => events.find((e) => String(new Date(e.event_date).getFullYear()) === y);

  return (
    <section id="events" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-[#ffc31d] text-sm font-semibold uppercase tracking-widest mb-3">Biennial Reunions</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Events</h2>
          <div className="w-16 h-1 bg-[#ffc31d] mx-auto mb-6 rounded" />
          <p className="text-gray-600 max-w-xl mx-auto">
            KUANA hosts a reunion every two years in a different city across the USA and Canada.
          </p>
        </div>

        {/* Year tabs */}
        <div className="flex gap-2 justify-center mb-10">
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

        {/* Event for selected year */}
        {YEARS.map((y) => {
          if (year !== y) return null;
          const event = eventForYear(y);
          if (!event) return <p key={y} className="text-center text-gray-400 py-12">No event data available.</p>;
          return (
            <div key={y} className="max-w-3xl mx-auto">
              <EventCard event={event} isFeatured={event.is_featured} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
