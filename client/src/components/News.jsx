import { useState } from 'react';
import { X, Newspaper } from 'lucide-react';

function IconFacebook({ size = 14 }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function IconInstagram({ size = 14 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconLinkedIn({ size = 14 }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const NEWS = [
  {
    id: 1,
    date: 'August 2026',
    category: 'Felicitation',
    title: 'Congratulations to Prof. Dr. Bivek Baral on His Appointment as Vice-Chancellor of Kathmandu University',
    excerpt: 'KUANA is immensely proud to extend its heartfelt congratulations to Prof. Dr. Bivek Baral on his appointment as the Vice-Chancellor of Kathmandu University.',
    thumbnail: '/assets/img/profile/bivek_baral.png',
    person: {
      name: 'Prof. Dr. Bivek Baral',
      title: 'Vice-Chancellor, Kathmandu University',
      social: {
        facebook: 'https://www.facebook.com/bivek.baral.3',
        instagram: 'https://www.instagram.com/baralbivek/',
        linkedin: 'https://www.linkedin.com/in/bivek-baral-185b0a201/',
      },
    },
    body: [
      'Kathmandu University Alumni North America (KUANA) is immensely proud to extend its heartfelt congratulations to Prof. Dr. Bivek Baral on his appointment as the Vice-Chancellor of Kathmandu University.',
      'A distinguished alumnus of Kathmandu University himself, Prof. Dr. Baral\'s journey is a true testament to what dedication and love for one\'s institution can accomplish. Rather than pursuing opportunities abroad, he made a choice that speaks volumes about his character — he chose to stay in Nepal and dedicate his career to teaching and mentoring at his alma mater. That choice has changed countless lives.',
      'Rain or shine, he was always involved and always working for the betterment of KU. His unwavering commitment has earned him not just respect, but genuine love from the students and community he has served. His rise from KU graduate to the University\'s highest academic leadership position exemplifies the values of excellence, innovation, and service that Kathmandu University strives to instill in its students.',
      'As alumni, we are especially inspired to see one of our own entrusted with leading Kathmandu University into its next chapter. We have no doubt that under his leadership, KU will continue to strengthen its reputation as a premier institution of higher learning, driving academic excellence and positive impact both nationally and internationally.',
      'On behalf of the entire KUANA community, we wish Prof. Dr. Bivek Baral every success in this important role. Congratulations, Dr. Baral — KU is fortunate to have a leader who so fully embodies its values. We look forward to witnessing the continued growth and positive change you will bring to the university and to Nepal.',
      'Congratulations and best wishes!',
    ],
  },
];

const CATEGORY_COLORS = {
  Felicitation: 'bg-yellow-100 text-yellow-800',
  Announcement: 'bg-blue-100 text-blue-700',
  Event: 'bg-green-100 text-green-700',
};

function SocialLinks({ social }) {
  return (
    <div className="flex items-center gap-2">
      {social.facebook && (
        <a href={social.facebook} target="_blank" rel="noopener noreferrer"
          className="w-7 h-7 rounded-full bg-[#1877f2] flex items-center justify-center text-white hover:scale-110 transition-transform"
          onClick={(e) => e.stopPropagation()}>
          <IconFacebook />
        </a>
      )}
      {social.instagram && (
        <a href={social.instagram} target="_blank" rel="noopener noreferrer"
          className="w-7 h-7 rounded-full bg-[#e1306c] flex items-center justify-center text-white hover:scale-110 transition-transform"
          onClick={(e) => e.stopPropagation()}>
          <IconInstagram />
        </a>
      )}
      {social.linkedin && (
        <a href={social.linkedin} target="_blank" rel="noopener noreferrer"
          className="w-7 h-7 rounded-full bg-[#0a66c2] flex items-center justify-center text-white hover:scale-110 transition-transform"
          onClick={(e) => e.stopPropagation()}>
          <IconLinkedIn />
        </a>
      )}
    </div>
  );
}

function NewsModal({ item, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Photo */}
        {item.thumbnail && (
          <div className="flex-shrink-0 md:w-44 bg-[#060c22]">
            <img
              src={item.thumbnail}
              alt={item.person?.name ?? item.title}
              className="w-full h-52 md:h-full object-contain"
            />
          </div>
        )}

        {/* Content panel */}
        <div className="flex-1 bg-gradient-to-br from-[#0e1b4d] to-[#060c22] flex flex-col min-h-0">
          {/* Header — sticky */}
          <div className="flex items-start justify-between gap-3 p-5 border-b border-white/10 flex-shrink-0">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[item.category] ?? 'bg-gray-100 text-gray-600'}`}>
                  {item.category}
                </span>
                <span className="text-xs text-white/40">{item.date}</span>
              </div>
              {item.person && (
                <div>
                  <p className="text-[#ffc31d] text-sm font-semibold">{item.person.name}</p>
                  <p className="text-white/50 text-xs mb-2">{item.person.title}</p>
                  {item.person.social && <SocialLinks social={item.person.social} />}
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/40 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="overflow-y-auto p-5 space-y-4">
            <h3 className="text-white font-bold text-sm leading-snug">{item.title}</h3>
            {item.body.map((para, i) => (
              <p key={i} className="text-white/80 leading-relaxed text-sm">{para}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function News() {
  const [selected, setSelected] = useState(null);

  return (
    <section id="news" className="py-24 bg-white">
      {selected && <NewsModal item={selected} onClose={() => setSelected(null)} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-[#ffc31d] text-sm font-semibold uppercase tracking-widest mb-3">Latest Updates</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">News &amp; Announcements</h2>
          <div className="w-16 h-1 bg-[#ffc31d] mx-auto rounded" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {NEWS.map((item) => (
            <div
              key={item.id}
              className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[item.category] ?? 'bg-gray-100 text-gray-600'}`}>
                  {item.category}
                </span>
                <span className="text-xs text-gray-400">{item.date}</span>
              </div>

              {item.thumbnail && item.person && (
                <div className="flex items-center gap-3">
                  <img
                    src={item.thumbnail}
                    alt={item.person.name}
                    className="w-14 h-14 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{item.person.name}</p>
                    <p className="text-gray-500 text-xs">{item.person.title}</p>
                    {item.person.social && (
                      <div className="mt-1.5">
                        <SocialLinks social={item.person.social} />
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-base leading-snug mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{item.excerpt}</p>
              </div>

              <button
                onClick={() => setSelected(item)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0e1b4d] hover:text-[#ffc31d] transition-colors cursor-pointer self-start"
              >
                <Newspaper size={15} />
                Read full announcement
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
