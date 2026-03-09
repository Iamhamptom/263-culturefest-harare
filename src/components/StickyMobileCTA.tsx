import { Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function StickyMobileCTA() {
  const location = useLocation();

  // Hide on form pages and success pages
  const hiddenPaths = ['/rsvp', '/challenge', '/success/rsvp', '/success/challenge', '/admin'];
  if (hiddenPaths.includes(location.pathname)) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 flex gap-3">
      <Link
        to="/rsvp"
        className="flex-1 bg-black text-white text-sm font-medium py-3 rounded-full text-center flex items-center justify-center gap-1.5"
      >
        RSVP <ArrowRight size={14} />
      </Link>
      <Link
        to="/challenge"
        className="flex-1 border border-gray-200 text-black text-sm font-medium py-3 rounded-full text-center"
      >
        Challenge
      </Link>
    </div>
  );
}
