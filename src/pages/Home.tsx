import { motion, AnimatePresence, useInView } from 'motion/react';
import { ArrowRight, ArrowDown, Sparkles, ChevronDown, Music, Disc3, Award, Globe, Gift, Mail, Users, MessageCircle } from 'lucide-react';
import { useState, useEffect, useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

/* ─── Scroll-triggered animation wrapper ─── */
function Reveal({ children, className = '', delay = 0, ...rest }: { children: ReactNode; className?: string; delay?: number; [key: string]: any }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Zimbabwe Flag Transition ─── */
function ZimFlagTransition() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  const stripes = [
    { color: '#006400', delay: 0 },
    { color: '#FFD200', delay: 0.08 },
    { color: '#E30613', delay: 0.16 },
    { color: '#000000', delay: 0.24 },
    { color: '#E30613', delay: 0.32 },
    { color: '#FFD200', delay: 0.40 },
    { color: '#006400', delay: 0.48 },
  ];

  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ height: '120px' }}>
      {/* Wind particles */}
      {isInView && Array.from({ length: 18 }).map((_, i) => (
        <motion.div
          key={`p-${i}`}
          className="absolute rounded-full"
          style={{
            width: 3 + Math.random() * 4,
            height: 3 + Math.random() * 4,
            background: ['#006400', '#FFD200', '#E30613', '#000'][i % 4],
            top: `${10 + Math.random() * 80}%`,
            left: '-5%',
            opacity: 0.5,
          }}
          animate={{
            x: ['0vw', '110vw'],
            y: [0, Math.sin(i) * 20, 0],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: 0.2 + Math.random() * 1.5,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Flag stripes with wind wave effect */}
      <div className="absolute inset-0 flex flex-col">
        {stripes.map((stripe, i) => (
          <motion.div
            key={i}
            className="flex-1 origin-left"
            style={{ background: stripe.color }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
            transition={{
              duration: 1.2,
              delay: stripe.delay,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}
      </div>

      {/* Wind ripple overlay */}
      {isInView && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 30%, transparent 60%)',
          }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 2, delay: 0.6, ease: 'easeInOut' }}
        />
      )}

      {/* Zimbabwe bird silhouette center */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 64 64" className="w-10 h-10 md:w-12 md:h-12" fill="none">
              {/* Simplified Zimbabwe bird */}
              <path d="M32 8 C28 16, 20 20, 18 28 C16 36, 22 44, 28 48 L32 56 L36 48 C42 44, 48 36, 46 28 C44 20, 36 16, 32 8Z" fill="#FFD200" stroke="#000" strokeWidth="1.5"/>
              <circle cx="30" cy="22" r="2" fill="#000"/>
              <path d="M24 32 Q32 28 40 32" stroke="#E30613" strokeWidth="1.5" fill="none"/>
              <path d="M26 36 Q32 33 38 36" stroke="#006400" strokeWidth="1.5" fill="none"/>
            </svg>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Preloader ─── */
function Preloader({ onComplete }: { onComplete: () => void }) {
  const items = [
    { type: 'logo' as const },
    { type: 'text' as const, content: '263 Culture AI Fest' },
    { type: 'text' as const, content: 'Tony Duardo Live' },
    { type: 'text' as const, content: 'VisioCorp' }
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 1500);
    // Auto-dismiss after 4.5 seconds
    const timeout = setTimeout(() => onComplete(), 4500);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center cursor-pointer"
      exit={{ opacity: 0, y: "-100%" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      onClick={onComplete}
    >
      <div className="h-40 md:h-52 flex items-center justify-center overflow-hidden relative w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute flex items-center justify-center w-full"
          >
            {items[index].type === 'logo' ? (
              <img
                src="/logo.png"
                alt="263 Culture Fest"
                className="h-36 md:h-48 object-contain"
              />
            ) : (
              <span className="text-3xl md:text-5xl font-display font-extrabold tracking-[0.2em] text-black uppercase text-center">
                {items[index].content}
              </span>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        onClick={onComplete}
        className="mt-12 bg-black text-white px-8 py-3 rounded-full text-sm font-medium tracking-[0.15em] uppercase flex items-center gap-2 group hover:bg-gray-800 transition-colors"
      >
        Enter <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </motion.button>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-4 text-xs text-gray-400"
      >
        Tap anywhere to continue
      </motion.p>
    </motion.div>
  );
}

/* ─── Main Page ─── */
export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col bg-white min-h-screen"
      >
        <Hero />
        <ZimFlagTransition />
        <About />
        <SpecialGuest />
        <ZimFlagTransition />
        <EventDetails />
        <PanelTeaser />
        <ChallengeSpotlight />
        <WhyAttend />
        <Freebies />
        <GetInTouch />
        <FAQ />
        <FooterCTA />
      </motion.div>
    </>
  );
}

/* ─── Rotating Ticker ─── */
function HeroTicker() {
  const lines = [
    'HARARE, ZIMBABWE · APRIL 30 WEEK',
    'FREE RSVP · FREE WELCOME PACK',
    'TONY DUARDO LIVE · HGA RECORDS',
    '263 SUITE BETA · AI WORKSHOP',
    'VISIOCORP · AFRICAN INNOVATION',
    'CREATOR CHALLENGE · APPLY NOW',
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(p => (p + 1) % lines.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="h-5 overflow-hidden relative mb-6">
      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -16, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute text-xs font-bold tracking-[0.15em] uppercase"
          style={{
            background: 'linear-gradient(90deg, #999 0%, #e0e0e0 40%, #999 80%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {lines[idx]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

/* ─── Hero ─── */
function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-32 pb-12 overflow-hidden bg-white">
      <div className="max-w-[1400px] mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center flex-grow">

        <div className="max-w-xl z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <HeroTicker />
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tighter leading-[1.05] mb-3 text-black">
              263 Culture AI Fest
            </h1>
            <p className="text-lg md:text-xl font-display font-bold tracking-tight text-gray-400 mb-6">
              1st Edition Workshop <span className="text-gray-300">x</span> Tony Duardo Live <span className="text-gray-300">x</span> <span className="text-xs align-middle tracking-wider text-gray-400">VisioCorp</span>
            </p>
            <p className="text-lg text-gray-600 font-normal mb-4 leading-relaxed max-w-md">
              A hands-on AI workshop and premium gathering exploring how AI is reshaping African creativity, music, and business. Live demos, a curated panel, and a creator challenge with real follow-up.
            </p>
            <p className="text-sm font-medium mb-10 flex items-center gap-2" style={{ background: 'linear-gradient(90deg, #10a3a8, #FFD200)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              RSVP to receive free access + exclusive freebies on arrival
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/rsvp" className="bg-black hover:bg-gray-800 text-white font-medium px-8 py-4 rounded-full transition-all flex items-center justify-center gap-2 text-sm">
                RSVP Now <ArrowRight size={16} />
              </Link>
              <Link to="/challenge" className="bg-white hover:bg-gray-50 text-black border border-gray-200 font-medium px-8 py-4 rounded-full transition-all flex items-center justify-center gap-2 text-sm">
                Apply for the Challenge <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="relative h-[60vh] lg:h-[80vh] w-full flex justify-center lg:justify-end mt-12 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.5, delay: 2.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg h-full rounded-[2.5rem] overflow-hidden bg-black"
          >
            <img
              src="/tony-hero.jpg"
              alt="Tony Duardo"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.2, duration: 1 }}
                className="font-display font-bold text-lg text-white"
              >
                Tony Duardo
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.4, duration: 1 }}
                className="text-gray-400 text-sm"
              >
                Producer · Founder · Pan-African Artist
              </motion.p>
            </div>
          </motion.div>
        </div>

      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-gray-400 text-[10px] font-bold tracking-[0.2em] uppercase">
          SCROLL TO EXPLORE
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={16} className="text-gray-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── About ─── */
function About() {
  return (
    <section id="about" className="py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <Reveal>
          <p className="text-gray-400 font-bold tracking-[0.15em] uppercase text-xs mb-6">ABOUT THE WORKSHOP</p>
          <h2 className="text-5xl md:text-6xl font-display font-extrabold tracking-tighter mb-8 text-black">
            AI Meets African Culture
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            This isn't a lecture — it's a hands-on workshop exploring how AI is transforming music, content, and business across Africa. Led by Tony Duardo, built by VisioCorp, and powered by the 263 Suite beta platform. You'll see live demos, real tools, and walk away with systems you can use.
          </p>
          <ul className="space-y-4">
            {[
              "Live AI tools demo — the 263 Suite beta spotlight",
              "Hands-on workshop: AI for creators, artists, and founders",
              "Keynote + curated panel on African innovation",
              "Creator Challenge — apply to work closer to the movement"
            ].map((point, i) => (
              <Reveal key={i} delay={0.1 * i}>
                <li className="flex items-start gap-3 text-black font-medium">
                  <div className="w-7 h-7 rounded-lg icon-silver-bg flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                  <span>{point}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-100">
            <img
              src="/tony-fashion.png"
              alt="Tony Duardo — Culture x Systems"
              className="w-full h-full object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Special Guest: Tony Duardo ─── */
function SpecialGuest() {
  const highlights = [
    { icon: <Music size={20} />, label: 'Hit Songs', items: ['"Tanzania" with Uncle Waffles', '"SHAKE AH" with Tyla (Billboard Awards)', '"Yahyuppiyah" with Uncle Waffles & Chley', '"Turn Off The Lights" & "Yebo" with TxC', '"Bank Notification" with Ciza & DJ Maphorisa'] },
    { icon: <Disc3 size={20} />, label: 'Label: HGA Records', items: ['Al Xapo — "Snokonoko" (biggest amapiano anthem, millions of streams)', 'Chley — breakout star, featured on "Yahyuppiyah" & "Komasava (Comment Ca Va)" with Diamond Platnumz', 'Roster: Buddy Kay, Tango Supreme, Leandra.Vert, Ggoldie + more'] },
    { icon: <Award size={20} />, label: 'Career Stats', items: ['Close to 1 billion career streams', 'Ghost-produced for Major League, Gazza, Sino Msolo, Daliwonga', 'Billboard Music Awards performance (Tyla — SHAKE AH)', 'UK Official Charts placement'] },
    { icon: <Globe size={20} />, label: 'Pan-African', items: ['Lived across Nigeria, Ghana, UK, Tanzania, DRC, Angola', 'Fluent in English, French & Portuguese', 'Singer, writer, drummer, guitarist, pianist, producer, engineer, composer'] },
  ];

  return (
    <section className="py-32 bg-black text-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-8">
        <Reveal>
          <div className="text-center mb-20">
            <p className="text-gray-500 font-bold tracking-[0.15em] uppercase text-xs mb-6">SPECIAL GUEST</p>
            <h2 className="text-5xl md:text-7xl font-display font-extrabold tracking-tighter mb-6">
              Tony Duardo
            </h2>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Pan-African producer, founder of HGA Records, and the phantom hitmaker behind some of the biggest amapiano and Afrobeats records of the decade. From ghost-producing chart-toppers to stepping into the spotlight — Tony Duardo is building the infrastructure for African music's next era.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {highlights.map((section, i) => (
            <Reveal key={i} delay={0.1 * i}>
              <div className="bg-gray-900/50 border border-gray-800 rounded-[2rem] p-8 md:p-10 hover:border-gray-700 transition-colors">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full icon-silver-dark flex items-center justify-center text-gray-300">
                    {section.icon}
                  </div>
                  <h3 className="text-xl font-display font-bold">{section.label}</h3>
                </div>
                <ul className="space-y-3">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full shrink-0 mt-2" style={{ background: 'linear-gradient(135deg, #c0c0c0, #f0f0f0, #a0a0a0)', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                      <span className="text-gray-300 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Spotify-style streaming banner */}
        <Reveal delay={0.3}>
          <div className="mt-16 bg-gradient-to-r from-[#006400] via-[#FFD200] to-[#E30613] p-[1px] rounded-2xl">
            <div className="bg-black rounded-2xl px-8 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Streaming Legacy</p>
                <p className="text-3xl md:text-4xl font-display font-extrabold text-white">
                  Close to <span className="text-[#FFD200]">1 Billion</span> Career Streams
                </p>
                <p className="text-gray-500 mt-2">Across Spotify, Apple Music, and global platforms + More</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {['Tyla', 'Ciza', 'TxC'].map((name, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gray-800 border-2 border-black flex items-center justify-center text-[10px] font-bold text-white" title={name}>
                      {name}
                    </div>
                  ))}
                </div>
                <span className="text-gray-500 text-sm">+ Uncle Waffles, DJ Maphorisa, Diamond Platnumz</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Event Details ─── */
function EventDetails() {
  const cards = [
    {
      title: "The Workshop",
      text: "A hands-on AI workshop — live demos, real tools, and practical systems you can use to build, create, and grow."
    },
    {
      title: "The Keynote",
      text: "Tony Duardo presents the vision: how AI, music, and African innovation are converging into the next economy."
    },
    {
      title: "The Panel",
      text: "A curated panel of voices shaping culture, tech, and business in Southern Africa. Names dropping soon."
    },
    {
      title: "The Challenge",
      text: "A selective creator challenge — apply, get seen, and potentially work closer to the VisioCorp + HGA ecosystem."
    }
  ];

  return (
    <section id="event" className="py-32 bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-8">
        <Reveal>
          <div className="mb-16">
            <p className="text-gray-400 font-bold tracking-[0.15em] uppercase text-xs mb-6">EVENT DETAILS</p>
            <h2 className="text-5xl md:text-6xl font-display font-extrabold tracking-tighter text-black">
              What This Week Is About
            </h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <Reveal key={i} delay={0.1 * i}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="bg-white border border-gray-200 p-10 rounded-[2rem] hover:shadow-xl transition-shadow duration-300 h-full"
              >
                <div className="text-gray-300 font-display font-extrabold text-4xl mb-6">0{i + 1}</div>
                <h3 className="text-2xl font-display font-bold text-black mb-4">{card.title}</h3>
                <p className="text-gray-600 leading-relaxed">{card.text}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Panel Teaser ─── */
function PanelTeaser() {
  return (
    <section id="panel" className="py-32 bg-white text-center">
      <div className="max-w-[1400px] mx-auto px-8">
        <Reveal>
          <p className="text-gray-400 font-bold tracking-[0.15em] uppercase text-xs mb-6">PANEL</p>
          <h2 className="text-5xl md:text-6xl font-display font-extrabold tracking-tighter mb-8 text-black">
            Guests Are Being Announced
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            We're actively curating a panel of voices shaping the future of culture, AI, and African innovation. The lineup will be revealed in waves — each name a signal of what this room is about.
          </p>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-16">
            RSVP now to be first to know when names drop. The roster is being built for quality, not quantity.
          </p>
        </Reveal>
        <div className="flex justify-center gap-4 md:gap-6 mb-16">
          {['Guest 1', 'Guest 2', 'Guest 3', 'Guest 4'].map((label, i) => (
            <Reveal key={i} delay={0.15 * i}>
              <div className="group relative">
                <motion.div
                  whileHover={{ scale: 1.1, borderColor: '#000' }}
                  className="w-24 h-24 md:w-36 md:h-36 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center transition-all group-hover:shadow-lg"
                >
                  <span className="text-gray-300 font-display text-3xl md:text-4xl font-bold group-hover:text-gray-400 transition-colors">?</span>
                </motion.div>
                <p className="text-[10px] md:text-xs text-gray-400 font-medium tracking-wider uppercase mt-3">{label}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.4}>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/rsvp" className="inline-flex items-center justify-center gap-2 bg-black text-white font-medium px-8 py-4 rounded-full transition-all hover:bg-gray-800">
              Join the List <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Challenge Spotlight ─── */
function ChallengeSpotlight() {
  return (
    <section className="py-32 bg-black text-white">
      <div className="max-w-[1400px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <Reveal>
          <p className="text-gray-400 font-bold tracking-[0.15em] uppercase text-xs mb-6">CREATOR CHALLENGE</p>
          <h2 className="text-5xl md:text-6xl font-display font-extrabold tracking-tighter mb-8">
            Apply to Work Closer to the Movement
          </h2>
          <p className="text-xl text-gray-400 leading-relaxed mb-10">
            The Creator Challenge is for builders, artists, operators, and ambitious talent who want to be seen, selected, and contacted with next steps. We are not collecting names for nothing. We are looking for signal.
          </p>
          <Link to="/challenge" className="inline-flex items-center gap-2 bg-white text-black font-medium px-8 py-4 rounded-full transition-all hover:bg-gray-200">
            Apply Now <ArrowRight size={16} />
          </Link>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="bg-gray-900 border border-gray-800 p-10 md:p-16 rounded-[2.5rem]">
            <h3 className="text-2xl font-display font-bold mb-8">What you get</h3>
            <ul className="space-y-6">
              {[
                "A chance to be selected for direct follow-up",
                "Opportunity to work around Tony Duardo and the wider movement",
                "Visibility inside a premium founder-led ecosystem",
                "A real application, not a vanity form"
              ].map((benefit, i) => (
                <Reveal key={i} delay={0.1 * i}>
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full icon-silver-bg flex items-center justify-center shrink-0 mt-1">
                      <ArrowRight size={14} className="text-gray-600" />
                    </div>
                    <p className="text-gray-300 text-lg">{benefit}</p>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Why Attend ─── */
function WhyAttend() {
  const columns = [
    {
      title: "Culture x Systems",
      text: "This is not just a show. It is a statement about what creators become when systems support them."
    },
    {
      title: "Real People, Real Access",
      text: "Attendees get early proximity to ideas, people, and opportunities shaping the next phase."
    },
    {
      title: "Harare as Signal",
      text: "Position Harare as a city that belongs inside the conversation about future culture and innovation."
    }
  ];

  return (
    <section className="py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-8">
        <Reveal>
          <div className="text-center mb-20">
            <p className="text-gray-400 font-bold tracking-[0.15em] uppercase text-xs mb-6">WHY ATTEND</p>
            <h2 className="text-5xl md:text-6xl font-display font-extrabold tracking-tighter text-black">
              A Different Type of Event
            </h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {columns.map((col, i) => (
            <Reveal key={i} delay={0.15 * i}>
              <div className="text-center">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 mx-auto rounded-full icon-silver-bg flex items-center justify-center mb-8"
                >
                  <Sparkles className="text-gray-500" size={22} />
                </motion.div>
                <h3 className="text-2xl font-display font-bold text-black mb-4">{col.title}</h3>
                <p className="text-gray-600 leading-relaxed">{col.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Freebies ─── */
function Freebies() {
  const perks = [
    { icon: <Gift size={22} />, title: 'Welcome Pack', desc: 'Every RSVP gets a branded welcome pack on arrival — merch, stickers, exclusive materials.' },
    { icon: <Sparkles size={22} />, title: '263 Suite Beta Access', desc: 'Early access to the 263 Suite AI platform — be among the first to test the tools shaping African creativity.' },
    { icon: <Users size={22} />, title: 'VisioCorp Network', desc: 'Get plugged into the VisioCorp ecosystem — access to founders, creators, and opportunities across Southern Africa.' },
    { icon: <Award size={22} />, title: 'Challenge Winners', desc: 'Selected challenge applicants receive mentorship, visibility, and potential collaboration with HGA Records.' },
  ];

  return (
    <section className="py-32 bg-black text-white">
      <div className="max-w-[1400px] mx-auto px-8">
        <Reveal>
          <div className="text-center mb-20">
            <p className="text-[#FFD200] font-bold tracking-[0.15em] uppercase text-xs mb-6">FREE FOR RSVPs</p>
            <h2 className="text-5xl md:text-6xl font-display font-extrabold tracking-tighter mb-6">
              What You Get for Signing Up
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              This isn't just an event — it's an investment in your future. RSVP is free, and everyone who signs up gets real value.
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {perks.map((perk, i) => (
            <Reveal key={i} delay={0.1 * i}>
              <motion.div
                whileHover={{ y: -8 }}
                className="bg-gray-900/50 border border-gray-800 rounded-[2rem] p-8 hover:border-[#FFD200]/30 transition-colors h-full"
              >
                <div className="w-12 h-12 rounded-full icon-silver-dark flex items-center justify-center text-gray-300 mb-6">
                  {perk.icon}
                </div>
                <h3 className="text-xl font-display font-bold mb-3">{perk.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{perk.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.4}>
          <div className="text-center mt-12">
            <Link to="/rsvp" className="inline-flex items-center gap-2 bg-[#FFD200] text-black font-medium px-8 py-4 rounded-full transition-all hover:bg-[#e6be00]">
              Claim Your Free RSVP <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Get In Touch ─── */
function GetInTouch() {
  const contacts = [
    { icon: <Mail size={20} />, label: 'Partnerships & Sponsorships', value: 'partnerships@visiocorp.co', href: 'mailto:partnerships@visiocorp.co', desc: 'For brands, sponsors, and organizations wanting to be part of the event.' },
    { icon: <MessageCircle size={20} />, label: 'General Enquiries', value: '@263culturefest', href: 'https://www.instagram.com/263culturefest/', desc: 'DM us on Instagram or use the chatbot on this site for quick answers.' },
    { icon: <Users size={20} />, label: 'Media & Press', value: 'media@visiocorp.co', href: 'mailto:media@visiocorp.co', desc: 'Press accreditation, interviews, and media partnerships.' },
  ];

  return (
    <section id="contact" className="py-32 bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-8">
        <Reveal>
          <div className="text-center mb-16">
            <p className="text-gray-400 font-bold tracking-[0.15em] uppercase text-xs mb-6">GET IN TOUCH</p>
            <h2 className="text-5xl md:text-6xl font-display font-extrabold tracking-tighter text-black mb-6">
              Let's Build Together
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Whether you're a brand, media house, organization, or creative — there's a seat at this table. 263 CultureFest is produced by <strong>263 Culture Hub</strong> in partnership with <strong>VisioCorp</strong> and <strong>HGA Records</strong>.
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {contacts.map((contact, i) => (
            <Reveal key={i} delay={0.1 * i}>
              <a
                href={contact.href}
                target={contact.href.startsWith('http') ? '_blank' : undefined}
                rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="bg-white border border-gray-200 rounded-[2rem] p-8 hover:border-black hover:shadow-lg transition-all block h-full group"
              >
                <div className="w-12 h-12 rounded-full icon-silver-bg flex items-center justify-center mb-6 group-hover:shadow-lg transition-shadow text-gray-500">
                  {contact.icon}
                </div>
                <h3 className="text-lg font-display font-bold text-black mb-2">{contact.label}</h3>
                <p className="text-[#10a3a8] font-medium text-sm mb-3">{contact.value}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{contact.desc}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ─── */
function FAQ() {
  const faqs = [
    {
      question: "Where is the event happening?",
      answer: "Harare, Zimbabwe. Venue details and directions will be shared with confirmed RSVPs closer to the date. Follow @263culturefest on socials for announcements."
    },
    {
      question: "When is the event?",
      answer: "The event week runs April 27 – May 3, 2026, with April 30 as the anchor date."
    },
    {
      question: "Do I need to apply separately for the challenge?",
      answer: "Yes. RSVP and the Creator Challenge application are separate. You can do both, but each has its own form."
    },
    {
      question: "When will panel guests be announced?",
      answer: "We're actively announcing guests — the lineup will be revealed in waves leading up to the event. RSVP to be first to know when names drop."
    },
    {
      question: "What is the 263 Suite?",
      answer: "The 263 Suite is an artist-first AI platform being introduced in beta at this event. The Harare edition includes a live demo and spotlight."
    },
    {
      question: "Who is Tony Duardo?",
      answer: "Tony Duardo is a Pan-African producer, founder of HGA Records, and the creative force behind hits with Tyla, Uncle Waffles, Ciza, DJ Maphorisa, TxC, and more. Close to 1 billion career streams. He leads the keynote and overall vision for 263 CultureFest."
    },
    {
      question: "Is it free?",
      answer: "Yes — RSVP is completely free. We want the right people in the room, not a paywall. Everyone who RSVPs gets free access to the workshop, keynote, and panel, plus a branded welcome pack and 263 Suite beta access on arrival."
    },
    {
      question: "What freebies do I get?",
      answer: "RSVP attendees receive a welcome pack (branded merch, stickers, exclusive materials), early access to the 263 Suite AI platform beta, and direct access to the VisioCorp network. Creator Challenge winners get mentorship and potential collaboration opportunities with HGA Records."
    },
    {
      question: "How can I partner or sponsor the event?",
      answer: "Email partnerships@visiocorp.co for sponsorship tiers, brand activations, and media partnerships. You can also DM @263culturefest on Instagram. We're looking for brands that align with African innovation, music, and tech."
    },
    {
      question: "I have more questions — how can I ask?",
      answer: "Use the chat assistant at the bottom right of the screen. You can type your question or tap the mic to talk to our AI voice assistant. Or reach out to @263culturefest on Instagram."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-32 bg-gray-50">
      <div className="max-w-3xl mx-auto px-8">
        <Reveal>
          <div className="text-center mb-16">
            <p className="text-gray-400 font-bold tracking-[0.15em] uppercase text-xs mb-6">FAQ</p>
            <h2 className="text-5xl md:text-6xl font-display font-extrabold tracking-tighter text-black">
              Common Questions
            </h2>
          </div>
        </Reveal>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <Reveal key={i} delay={0.05 * i}>
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <button
                  className="w-full px-8 py-6 text-left flex items-center justify-between focus:outline-none"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  <span className="font-display font-bold text-lg text-black">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="text-gray-400" size={20} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="px-8 overflow-hidden"
                    >
                      <p className="text-gray-600 pb-8">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Footer CTA ─── */
function FooterCTA() {
  return (
    <section className="py-32 bg-white text-center">
      <div className="max-w-4xl mx-auto px-8">
        <Reveal>
          <h2 className="text-6xl md:text-8xl font-display font-extrabold tracking-tighter mb-8 text-black">
            Harare, Are You In?
          </h2>
          <p className="text-2xl text-gray-600 mb-12">
            RSVP for the event. Apply for the challenge. Join the signal early.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/rsvp" className="bg-black hover:bg-gray-800 text-white font-medium px-8 py-4 rounded-full transition-all">
              RSVP Now
            </Link>
            <Link to="/challenge" className="bg-white border border-gray-200 hover:bg-gray-50 text-black font-medium px-8 py-4 rounded-full transition-all">
              Apply for the Challenge
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
