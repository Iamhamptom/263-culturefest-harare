import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 2 }}
      className={`fixed top-0 left-0 right-0 z-50 py-6 border-b transition-colors duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md border-gray-200' : 'bg-white/80 backdrop-blur-md border-gray-100'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-8 flex items-center justify-between">
        <Link to="/" className="text-xl font-display font-extrabold tracking-[0.1em] text-black uppercase">
          263 CULTUREFEST
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {['About', 'Event', 'Panel', 'Challenge', 'FAQ'].map((item) => (
            <a
              key={item}
              href={item === 'Challenge' ? '/challenge' : `/#${item.toLowerCase()}`}
              className="text-sm font-medium text-black hover:text-gray-500 transition-colors uppercase tracking-wider"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/rsvp"
            className="bg-black text-white text-sm font-medium px-8 py-3 rounded-full hover:bg-gray-800 transition-colors"
          >
            RSVP Now
          </Link>
        </div>

        <button
          className="md:hidden p-2 -mr-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-t border-gray-100 px-8 py-6 space-y-4"
        >
          {['About', 'Event', 'Panel', 'Challenge', 'FAQ'].map((item) => (
            <a
              key={item}
              href={item === 'Challenge' ? '/challenge' : `/#${item.toLowerCase()}`}
              className="block text-sm font-medium text-black uppercase tracking-wider py-2"
              onClick={() => setMobileOpen(false)}
            >
              {item}
            </a>
          ))}
          <div className="pt-4 flex flex-col gap-3">
            <Link to="/rsvp" className="bg-black text-white text-sm font-medium px-6 py-3 rounded-full text-center">
              RSVP Now
            </Link>
            <Link to="/challenge" className="border border-gray-200 text-black text-sm font-medium px-6 py-3 rounded-full text-center">
              Apply for the Challenge
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
