import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Navbar() {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 2 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md py-6 border-b border-gray-100"
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
      </div>
    </motion.header>
  );
}
