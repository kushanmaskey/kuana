import { ChevronDown } from 'lucide-react';

export default function Hero() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: 'url(https://kuana.org/assets/img/Images/ku-birdeye.jpg)',
        backgroundPosition: 'top center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-[#060c22]/75" />

      {/* Gold accent line at top */}
      <div className="absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#ffc31d] to-transparent opacity-50" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* KUANA Logo */}
        <div className="mx-auto mb-8">
          <img
            src="https://kuana.org/assets/img/KUANA.png"
            alt="KUANA Logo"
            className="h-28 w-auto object-contain mx-auto drop-shadow-2xl"
          />
        </div>

        <div className="animate-fade-in-up">
          <p className="text-[#ffc31d] text-sm font-semibold uppercase tracking-[0.3em] mb-4">
            Kathmandu University Alumni
          </p>
          <h1 className="text-white font-bold leading-tight mb-6" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
            North America
          </h1>
          <div className="w-24 h-1 bg-[#ffc31d] mx-auto mb-8 rounded" />
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-4">
            Connecting KU graduates across the United States, Canada, and Mexico.
            One community. One mission. Reuniting every two years.
          </p>
          <p className="text-[#ffc31d]/90 text-3xl md:text-4xl font-bold mb-12">
            Reunion 2027<br />Boston, MA
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => scrollTo('events')}
              className="px-8 py-3.5 bg-[#ffc31d] text-[#0e1b4d] font-bold rounded-lg hover:bg-[#ffd54f] transition-all duration-200 text-sm uppercase tracking-wide shadow-lg cursor-pointer"
            >
              View Events
            </button>
            <button
              onClick={() => scrollTo('donate')}
              className="px-8 py-3.5 border-2 border-white/50 text-white font-bold rounded-lg hover:border-[#ffc31d] hover:text-[#ffc31d] transition-all duration-200 text-sm uppercase tracking-wide cursor-pointer"
            >
              Support KUANA
            </button>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-5 grid grid-cols-3 gap-4 text-center">
          {[
            { value: '500+', label: 'Alumni Members' },
            { value: '2', label: 'Reunions Held' },
            { value: '2027', label: 'Reunion 2027' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-[#ffc31d] font-bold text-xl md:text-2xl">{stat.value}</div>
              <div className="text-white/60 text-xs md:text-sm mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => scrollTo('about')}
        className="absolute bottom-28 right-8 text-white/40 hover:text-[#ffc31d] transition-colors cursor-pointer"
        aria-label="Scroll down"
      >
        <ChevronDown size={28} className="animate-bounce" />
      </button>
    </section>
  );
}
