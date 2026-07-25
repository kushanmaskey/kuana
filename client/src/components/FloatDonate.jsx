import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

export default function FloatDonate() {
  const [visible, setVisible] = useState(false);
  const [nearDonate, setNearDonate] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      setVisible(scrollY > 300);

      const donateEl = document.getElementById('donate');
      if (donateEl) {
        const rect = donateEl.getBoundingClientRect();
        setNearDonate(rect.top < window.innerHeight && rect.bottom > 0);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => {
    document.getElementById('donate')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!visible || nearDonate) return null;

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full shadow-2xl cursor-pointer
        bg-gradient-to-r from-[#ffc31d] to-[#f59e0b] text-[#0e1b4d] font-bold text-sm
        hover:scale-105 hover:shadow-[0_8px_30px_rgba(255,195,29,0.5)] transition-all duration-200
        ring-2 ring-[#ffc31d]/60"
      aria-label="Support KUANA"
    >
      <Heart size={16} className="fill-[#0e1b4d]" />
      Support KUANA
    </button>
  );
}
