import { Link } from 'react-router-dom';

const socials = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/263culturefest/',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/263culturefest/',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    name: 'X / Twitter',
    href: 'https://x.com/263culturefest',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8132L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
      </svg>
    ),
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@263.culture.fest',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
  {
    name: 'Threads',
    href: 'https://www.threads.com/@263culturefest',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.044.58c-1.076-3.877-3.608-5.846-7.522-5.852h-.006c-2.756.016-4.89.928-6.344 2.71C5.187 6.773 4.49 9.202 4.472 12c.018 2.797.715 5.224 2.073 7.215 1.376 2.017 4.099 2.77 6.396 2.77l.164-.001c1.859-.033 3.543-.554 4.847-1.505 1.202-.878 2.063-2.11 2.405-3.454l1.958.569C21.853 19.9 20.738 21.43 19.2 22.527c-1.636 1.167-3.664 1.8-5.865 1.83L12.186 24zm2.768-8.462c-.26-.108-.543-.206-.847-.296-.107-1.89-.997-3.09-2.556-3.453.8-.258 1.397-.68 1.775-1.258.395-.607.547-1.354.445-2.184-.17-1.37-.913-2.333-2.149-2.784-.714-.261-1.544-.375-2.533-.35l-.115.002c-1.3.04-2.358.363-3.15.962-.836.633-1.37 1.564-1.548 2.69l2.01.342c.21-1.3 1.01-2.011 2.637-2.06l.086-.002c.754-.014 1.345.11 1.758.368.452.282.697.705.75 1.295.048.524-.082.93-.396 1.24-.356.352-.942.551-1.742.592-.15.008-.312.011-.487.008l-.064-.002v1.94l.1-.001c.577-.003 1.06.039 1.434.126 1.025.236 1.634.855 1.762 1.79.082.597-.037 1.14-.353 1.613-.347.52-.892.863-1.62 1.02-.383.083-.806.119-1.263.107-.913-.026-1.659-.264-2.215-.707-.518-.413-.83-.993-.93-1.726l-2.02.276c.15 1.192.65 2.132 1.487 2.799.87.693 2.03 1.066 3.444 1.107l.236.003c.695 0 1.342-.075 1.935-.227 1.113-.285 1.992-.842 2.611-1.656.574-.753.858-1.64.82-2.567-.04-.99-.443-1.798-1.164-2.344z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 relative overflow-hidden">
      {/* 263 Culture Fest accent lines */}
      <div className="absolute top-0 left-0 right-0 h-[3px] flex">
        <div className="flex-1 bg-[#10a3a8]" />
        <div className="flex-1 bg-[#e63833]" />
        <div className="flex-1 bg-[#FFD200]" />
        <div className="flex-1 bg-[#006400]" />
      </div>

      <div className="py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img src="/logo.png" alt="263 Culture Fest" className="h-12 object-contain" />
              <span className="text-xl font-display font-extrabold tracking-[0.05em] text-black uppercase">263 CultureFest</span>
            </Link>
            <p className="text-gray-600 max-w-sm mb-4">
              The Rhythm of the Nation. The Soul of the Streets.
            </p>
            <p className="text-gray-500 text-sm max-w-sm mb-8">
              The ultimate intersection of Zimbabwean pride and Southern African creative excellence. A world-class platform where local icons and regional superstars share the same stage.
            </p>
            <div className="flex gap-3">
              {socials.map(s => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-black hover:border-black transition-all"
                  title={s.name}
                >
                  <span className="sr-only">{s.name}</span>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-6">Event</h3>
            <ul className="space-y-4">
              <li><Link to="/#about" className="text-black hover:text-gray-500 font-medium transition-colors">About</Link></li>
              <li><Link to="/#panel" className="text-black hover:text-gray-500 font-medium transition-colors">Panel</Link></li>
              <li><Link to="/#faq" className="text-black hover:text-gray-500 font-medium transition-colors">FAQ</Link></li>
              <li><a href="https://263culturefestival.com" target="_blank" rel="noopener noreferrer" className="text-[#10a3a8] hover:text-[#0d8a8e] font-medium transition-colors">263culturefestival.com</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-6">Action</h3>
            <ul className="space-y-4">
              <li><Link to="/rsvp" className="text-black hover:text-gray-500 font-medium transition-colors">RSVP Now</Link></li>
              <li><Link to="/challenge" className="text-black hover:text-gray-500 font-medium transition-colors">Creator Challenge</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-8 mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; 2026 Visio Research Lab / 263 Culture Hub. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs">
            Powered by VisioCorp &middot; HGA Records
          </p>
        </div>
      </div>
    </footer>
  );
}
