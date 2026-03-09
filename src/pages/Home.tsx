import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowDown, Sparkles, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Preloader({ onComplete }: { onComplete: () => void }) {
  const items = [
    { type: 'image', content: '263' },
    { type: 'text', content: 'VisioCorp' },
    { type: 'text', content: 'Tony Duardo' }
  ];
  const [index, setIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center"
      exit={{ opacity: 0, y: "-100%" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="h-32 md:h-40 flex items-center justify-center overflow-hidden relative w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute flex items-center justify-center w-full"
          >
            {items[index].type === 'image' && !imageError ? (
              <img 
                src="/logo.png" 
                alt="263 CultureFest" 
                className="h-24 md:h-32 object-contain grayscale contrast-200"
                onError={() => setImageError(true)}
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
        transition={{ delay: 1, duration: 1 }}
        onClick={onComplete}
        className="mt-12 text-sm font-medium tracking-[0.2em] text-gray-400 hover:text-black transition-colors uppercase flex items-center gap-2 group"
      >
        Enter <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </motion.div>
  );
}

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
        <About />
        <EventDetails />
        <PanelTeaser />
        <ChallengeSpotlight />
        <WhyAttend />
        <FAQ />
        <FooterCTA />
      </motion.div>
    </>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-32 pb-12 overflow-hidden bg-white">
      <div className="max-w-[1400px] mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center flex-grow">
        
        {/* Left Content */}
        <div className="max-w-xl z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-gray-400 font-bold tracking-[0.15em] uppercase text-xs mb-6">
              HARARE, ZIMBABWE · APRIL 30 WEEK
            </p>
            <h1 className="text-6xl md:text-7xl lg:text-[5.5rem] font-display font-extrabold tracking-tighter leading-[1.05] mb-6 text-black">
              263 CultureFest.<br />
              Harare Edition
            </h1>
            <p className="text-2xl text-black font-medium mb-6 tracking-tight">
              Artists. AI. African Innovation Leadership.
            </p>
            <p className="text-lg text-gray-600 font-normal mb-10 leading-relaxed max-w-md">
              A premium gathering built around culture, systems, and the future. Join Tony Duardo in Harare for the 263 Suite beta spotlight, keynote energy, powerful conversations, and the launch of a creator opportunity designed for the next wave.
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

        {/* Right Image */}
        <div className="relative h-[60vh] lg:h-[80vh] w-full flex justify-center lg:justify-end mt-12 lg:mt-0">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.5, delay: 2.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg h-full rounded-[2.5rem] overflow-hidden bg-gray-100"
          >
            <img 
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop" 
              alt="Tony Duardo" 
              className="w-full h-full object-cover grayscale contrast-125 brightness-90"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
          </motion.div>
        </div>

      </div>

      {/* Scroll Indicator */}
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

function About() {
  return (
    <section id="about" className="py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-gray-400 font-bold tracking-[0.15em] uppercase text-xs mb-6">ABOUT THE EXPERIENCE</p>
          <h2 className="text-5xl md:text-6xl font-display font-extrabold tracking-tighter mb-8 text-black">
            From Studio to Systems
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            This Harare edition is built as a statement: artists are not just talent, they are infrastructure. The experience is designed around the 263 Suite beta story, founder-led momentum, and the belief that African creativity, when paired with systems and AI, can build the next economy.
          </p>
          <ul className="space-y-4">
            {[
              "Founder-led vision and energy",
              "AI, culture, and real opportunity",
              "Premium atmosphere and community value",
              "A selective challenge tied to real follow-up"
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-black font-medium">
                <Sparkles className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-100">
           <img 
             src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop" 
             alt="Studio to Systems"
             className="w-full h-full object-cover grayscale opacity-80 mix-blend-multiply" 
             referrerPolicy="no-referrer"
           />
        </div>
      </div>
    </section>
  );
}

function EventDetails() {
  const cards = [
    {
      title: "The Show",
      text: "A premium Harare event experience built around vision, conversation, and launch momentum."
    },
    {
      title: "The Keynote",
      text: "Tony Duardo presents the vision behind artists, AI, and African innovation leadership."
    },
    {
      title: "The Panel",
      text: "A curated panel will be announced. Position this as high-value, future-facing, and worth waiting for."
    },
    {
      title: "The Opportunity",
      text: "A creator challenge for selected applicants who want to build, work, and grow closer to the movement."
    }
  ];

  return (
    <section id="event" className="py-32 bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="mb-16">
          <p className="text-gray-400 font-bold tracking-[0.15em] uppercase text-xs mb-6">EVENT DETAILS</p>
          <h2 className="text-5xl md:text-6xl font-display font-extrabold tracking-tighter text-black">
            What This Week Is About
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <div key={i} className="bg-white border border-gray-200 p-10 rounded-[2rem] hover:shadow-xl transition-shadow duration-300">
              <div className="text-gray-300 font-display font-extrabold text-4xl mb-6">0{i + 1}</div>
              <h3 className="text-2xl font-display font-bold text-black mb-4">{card.title}</h3>
              <p className="text-gray-600 leading-relaxed">{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PanelTeaser() {
  return (
    <section id="panel" className="py-32 bg-white text-center">
      <div className="max-w-[1400px] mx-auto px-8">
        <p className="text-gray-400 font-bold tracking-[0.15em] uppercase text-xs mb-6">PANEL</p>
        <h2 className="text-5xl md:text-6xl font-display font-extrabold tracking-tighter mb-8 text-black">
          Panel Announcement Coming Soon
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-16">
          The panel will be revealed in waves. Until then, tease the room, not the roster.
        </p>
        <div className="flex justify-center gap-6 mb-16">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center">
              <span className="text-gray-300 font-display text-4xl font-bold">?</span>
            </div>
          ))}
        </div>
        <Link to="/rsvp" className="inline-flex items-center gap-2 bg-black text-white font-medium px-8 py-4 rounded-full transition-all hover:bg-gray-800">
          Join the List <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

function ChallengeSpotlight() {
  return (
    <section className="py-32 bg-black text-white">
      <div className="max-w-[1400px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
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
        </div>
        <div className="bg-gray-900 border border-gray-800 p-10 md:p-16 rounded-[2.5rem]">
          <h3 className="text-2xl font-display font-bold mb-8">What you get</h3>
          <ul className="space-y-6">
            {[
              "A chance to be selected for direct follow-up",
              "Opportunity to work around Tony Duardo and the wider movement",
              "Visibility inside a premium founder-led ecosystem",
              "A real application, not a vanity form"
            ].map((benefit, i) => (
              <li key={i} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shrink-0 mt-1">
                  <ArrowRight size={14} />
                </div>
                <p className="text-gray-300 text-lg">{benefit}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

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
        <div className="text-center mb-20">
          <p className="text-gray-400 font-bold tracking-[0.15em] uppercase text-xs mb-6">WHY ATTEND</p>
          <h2 className="text-5xl md:text-6xl font-display font-extrabold tracking-tighter text-black">
            A Different Type of Event
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {columns.map((col, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center mb-8">
                <Sparkles className="text-black" size={24} />
              </div>
              <h3 className="text-2xl font-display font-bold text-black mb-4">{col.title}</h3>
              <p className="text-gray-600 leading-relaxed">{col.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    {
      question: "Where is the event happening?",
      answer: "Harare, Zimbabwe. Final venue details can be sent to registrants."
    },
    {
      question: "When is the event?",
      answer: "The event is positioned around the week of April 30, 2026, with April 30 as the anchor date."
    },
    {
      question: "Do I need to apply separately for the challenge?",
      answer: "Yes. RSVP and challenge application should be separate flows, even if one person does both."
    },
    {
      question: "Will the panel be announced later?",
      answer: "Yes. Keep this as a teaser until the reveal campaign is ready."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-32 bg-gray-50">
      <div className="max-w-3xl mx-auto px-8">
        <div className="text-center mb-16">
          <p className="text-gray-400 font-bold tracking-[0.15em] uppercase text-xs mb-6">FAQ</p>
          <h2 className="text-5xl md:text-6xl font-display font-extrabold tracking-tighter text-black">
            Common Questions
          </h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <button 
                className="w-full px-8 py-6 text-left flex items-center justify-between focus:outline-none"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-display font-bold text-lg text-black">{faq.question}</span>
                <ChevronDown className={`text-gray-400 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} size={20} />
              </button>
              <div className={`px-8 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === i ? 'max-h-40 pb-8 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FooterCTA() {
  return (
    <section className="py-32 bg-white text-center">
      <div className="max-w-4xl mx-auto px-8">
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
      </div>
    </section>
  );
}
