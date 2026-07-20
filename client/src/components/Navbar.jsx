import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  { label: 'Events', id: 'events', dropdown: [
    { label: '2027', filter: '2027', event: 'kuana:events-year', badge: 'Upcoming' },
    { label: '2025', filter: '2025', event: 'kuana:events-year' },
    { label: '2023', filter: '2023', event: 'kuana:events-year' },
  ]},
  { label: 'Speakers', id: 'speakers', dropdown: [
    { label: '2027', filter: '2027', event: 'kuana:speakers-year', badge: 'Upcoming' },
    { label: '2025', filter: '2025', event: 'kuana:speakers-year' },
    { label: '2023', filter: '2023', event: 'kuana:speakers-year' },
  ]},
  { label: 'Media', id: 'media', dropdown: [
    { label: 'Photos', subItems: [
      { label: '2027', filter: { type: 'photos', year: '2027' }, event: 'kuana:media-select', badge: 'Upcoming' },
      { label: '2025', filter: { type: 'photos', year: '2025' }, event: 'kuana:media-select' },
      { label: '2023', filter: { type: 'photos', year: '2023' }, event: 'kuana:media-select' },
    ]},
    { label: 'Videos', subItems: [
      { label: '2027', filter: { type: 'videos', year: '2027' }, event: 'kuana:media-select', badge: 'Upcoming' },
      { label: '2025', filter: { type: 'videos', year: '2025' }, event: 'kuana:media-select' },
      { label: '2023', filter: { type: 'videos', year: '2023' }, event: 'kuana:media-select' },
    ]},
  ]},
  { label: 'Donate', id: 'donate' },
  { label: 'Contact Us', id: 'contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openSub, setOpenSub] = useState(null);
  const [mobileOpen, setMobileOpen] = useState({});
  const [mobileSub, setMobileSub] = useState({});
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = NAV_ITEMS.map((item) => document.getElementById(item.id));
      const current = sections.findLast((el) => el && el.getBoundingClientRect().top <= 100);
      if (current) setActive(current.id);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
        setOpenSub(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  const handleDropdownItem = ({ id, filter, event }) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    window.dispatchEvent(new CustomEvent(event, { detail: filter }));
    setOpenDropdown(null);
    setOpenSub(null);
    setIsOpen(false);
    setMobileOpen({});
    setMobileSub({});
  };

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
    setOpenSub(null);
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0e1b4d] shadow-lg' : 'bg-[#0e1b4d]/95'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => scrollTo('home')} className="flex items-center gap-3 cursor-pointer">
            <img
              src="https://kuana.org/assets/img/KUANA.png"
              alt="KUANA Logo"
              className="h-10 w-auto object-contain"
            />
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) =>
              item.dropdown ? (
                <div key={item.id} className="relative">
                  <button
                    onClick={() => toggleDropdown(item.id)}
                    className={`nav-link px-4 py-2 text-sm font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                      active === item.id ? 'text-[#ffc31d] active' : 'text-white/90 hover:text-white'
                    }`}
                  >
                    {item.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${openDropdown === item.id ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {openDropdown === item.id && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                      {item.dropdown.map((dropItem) =>
                        dropItem.subItems ? (
                          <div key={dropItem.label}>
                            <button
                              onClick={() => setOpenSub(openSub === dropItem.label ? null : dropItem.label)}
                              className="flex items-center justify-between w-full text-left px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-[#0e1b4d] hover:text-white transition-colors cursor-pointer group"
                            >
                              {dropItem.label}
                              <ChevronDown
                                size={13}
                                className={`transition-transform duration-200 ${openSub === dropItem.label ? 'rotate-180' : ''}`}
                              />
                            </button>
                            {openSub === dropItem.label && (
                              <div className="bg-gray-50 border-t border-gray-100">
                                {dropItem.subItems.map((sub) => (
                                  <button
                                    key={`${sub.filter.type}-${sub.filter.year}`}
                                    onClick={() => handleDropdownItem({ id: item.id, filter: sub.filter, event: sub.event })}
                                    className="flex items-center justify-between w-full text-left pl-7 pr-4 py-2 text-sm text-gray-600 hover:bg-[#0e1b4d] hover:text-white transition-colors cursor-pointer group"
                                  >
                                    {sub.label}
                                    {sub.badge && (
                                      <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 group-hover:bg-[#ffc31d] group-hover:text-[#0e1b4d]">
                                        {sub.badge}
                                      </span>
                                    )}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <button
                            key={dropItem.filter}
                            onClick={() => handleDropdownItem({ id: item.id, filter: dropItem.filter, event: dropItem.event })}
                            className="flex items-center justify-between w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-[#0e1b4d] hover:text-white transition-colors cursor-pointer group"
                          >
                            {dropItem.label}
                            {dropItem.badge && (
                              <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 group-hover:bg-[#ffc31d] group-hover:text-[#0e1b4d]">
                                {dropItem.badge}
                              </span>
                            )}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`nav-link px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                    active === item.id ? 'text-[#ffc31d] active' : 'text-white/90 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0e1b4d] border-t border-[#060c22]">
          {NAV_ITEMS.map((item) =>
            item.dropdown ? (
              <div key={item.id}>
                <button
                  onClick={() => setMobileOpen((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                  className={`flex items-center justify-between w-full text-left px-6 py-3 text-sm font-medium transition-colors cursor-pointer ${
                    active === item.id ? 'text-[#ffc31d] bg-[#060c22]' : 'text-white/90 hover:bg-[#060c22]'
                  }`}
                >
                  {item.label}
                  <ChevronDown size={14} className={`transition-transform ${mobileOpen[item.id] ? 'rotate-180' : ''}`} />
                </button>
                {mobileOpen[item.id] && item.dropdown.map((dropItem) =>
                  dropItem.subItems ? (
                    <div key={dropItem.label}>
                      <button
                        onClick={() => setMobileSub((prev) => ({ ...prev, [dropItem.label]: !prev[dropItem.label] }))}
                        className="flex items-center justify-between w-full text-left px-10 py-2.5 text-sm font-semibold text-white/80 hover:text-[#ffc31d] hover:bg-[#060c22] transition-colors cursor-pointer"
                      >
                        {dropItem.label}
                        <ChevronDown size={13} className={`transition-transform ${mobileSub[dropItem.label] ? 'rotate-180' : ''}`} />
                      </button>
                      {mobileSub[dropItem.label] && dropItem.subItems.map((sub) => (
                        <button
                          key={`${sub.filter.type}-${sub.filter.year}`}
                          onClick={() => handleDropdownItem({ id: item.id, filter: sub.filter, event: sub.event })}
                          className="flex items-center gap-2 w-full text-left px-14 py-2 text-sm text-white/60 hover:text-[#ffc31d] hover:bg-[#060c22] transition-colors cursor-pointer"
                        >
                          {sub.label}
                          {sub.badge && (
                            <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
                              {sub.badge}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <button
                      key={dropItem.filter}
                      onClick={() => handleDropdownItem({ id: item.id, filter: dropItem.filter, event: dropItem.event })}
                      className="flex items-center gap-2 w-full text-left px-10 py-2.5 text-sm text-white/70 hover:text-[#ffc31d] hover:bg-[#060c22] transition-colors cursor-pointer"
                    >
                      {dropItem.label}
                      {dropItem.badge && (
                        <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
                          {dropItem.badge}
                        </span>
                      )}
                    </button>
                  )
                )}
              </div>
            ) : (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`block w-full text-left px-6 py-3 text-sm font-medium transition-colors cursor-pointer ${
                  active === item.id ? 'text-[#ffc31d] bg-[#060c22]' : 'text-white/90 hover:bg-[#060c22]'
                }`}
              >
                {item.label}
              </button>
            )
          )}
        </div>
      )}
    </nav>
  );
}
