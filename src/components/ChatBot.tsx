import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Mic } from 'lucide-react';

interface Message {
  id: number;
  role: 'user' | 'bot';
  text: string;
}

const EVENT_KNOWLEDGE: { patterns: string[]; answer: string }[] = [
  {
    patterns: ['when', 'date', 'time', 'when is', 'what day', 'schedule'],
    answer: 'The event is positioned around the week of April 30, 2026 — with April 27 to May 3 as the full event week, and April 30 as the anchor date. Final timing details will be shared with registered attendees.',
  },
  {
    patterns: ['where', 'location', 'venue', 'place', 'address', 'city'],
    answer: 'The event takes place in Harare, Zimbabwe. The final venue details will be sent directly to registered attendees closer to the date. RSVP to make sure you receive the information.',
  },
  {
    patterns: ['rsvp', 'register', 'sign up', 'reserve', 'attend', 'ticket', 'how to join'],
    answer: 'You can RSVP right here on the site! Head to the RSVP page (/rsvp) and fill in your details. It takes less than 2 minutes. We\'ll keep you updated with all event information and announcements.',
  },
  {
    patterns: ['challenge', 'apply', 'competition', 'application', 'creator challenge', 'enter'],
    answer: 'The Creator Challenge is a selective opportunity for builders, artists, operators, and ambitious talent. Apply through the challenge page (/challenge). This is a real application — we\'re looking for signal, not just names. Selected applicants will be contacted with next steps.',
  },
  {
    patterns: ['tony', 'duardo', 'tony duardo', 'founder', 'who is behind'],
    answer: 'Tony Duardo is the founder-led energy behind 263 CultureFest. He\'s not just presenting as an artist or producer — he\'s a system builder introducing the 263 Suite beta and inviting creators into the next economy. He leads the keynote and overall vision.',
  },
  {
    patterns: ['panel', 'speaker', 'speakers', 'guest', 'guests', 'who is speaking', 'panelist', 'panelists', 'announcement'],
    answer: 'We\'re actively announcing guests for the panel — the lineup will be revealed in waves leading up to the event. Stay tuned to our socials and make sure you\'ve RSVPed so you don\'t miss the reveal. The panel is being curated to be high-value and future-facing.',
  },
  {
    patterns: ['263 suite', 'suite', 'beta', 'product', 'app', 'platform'],
    answer: 'The 263 Suite is an artist-first AI platform being introduced in beta at this event. The Harare edition includes a live beta spotlight and demonstration. It represents the belief that African creativity, paired with systems and AI, can build the next economy.',
  },
  {
    patterns: ['ai', 'artificial intelligence', 'technology', 'tech', 'workshop'],
    answer: 'This event sits at the intersection of artists, AI, and African innovation leadership. The keynote covers how AI systems can empower creators. The 263 Suite beta demo showcases real AI tools built for artists and builders. It\'s not a typical tech conference — it\'s culture meets systems.',
  },
  {
    patterns: ['free', 'cost', 'price', 'pay', 'money', 'how much', 'ticket'],
    answer: 'RSVP is completely FREE! Everyone who signs up gets free access to the workshop, keynote, and panel, plus a branded welcome pack and early access to the 263 Suite AI platform beta on arrival. Head to /rsvp to claim your spot.',
  },
  {
    patterns: ['freebie', 'freebies', 'welcome pack', 'merch', 'swag', 'get for signing up', 'what do i get'],
    answer: 'RSVP attendees receive: a branded welcome pack (merch, stickers, exclusive materials), early access to the 263 Suite AI platform beta, and direct access to the VisioCorp network. Creator Challenge winners get mentorship and potential collaboration with HGA Records.',
  },
  {
    patterns: ['sponsor', 'partner', 'partnership', 'brand', 'collaborate', 'work together'],
    answer: 'For sponsorship and partnership enquiries, email partnerships@visiocorp.co. We offer brand activations, media partnerships, and sponsor tiers. You can also DM @263culturefest on Instagram. The event is produced by 263 Culture Hub in partnership with VisioCorp and HGA Records.',
  },
  {
    patterns: ['workshop', 'ai workshop', 'what will i learn', 'hands on', 'demo'],
    answer: 'This is a hands-on AI workshop led by Tony Duardo exploring how AI is transforming music, content, and business across Africa. You\'ll see live demos of the 263 Suite beta platform, hear from a curated panel on African innovation, and connect with founders and creators building the next wave.',
  },
  {
    patterns: ['what is', 'about', 'tell me', 'explain', 'what\'s this'],
    answer: '263 CultureFest Harare is a premium gathering built around culture, systems, and the future. It features a keynote by Tony Duardo, a curated panel (guests being announced soon), the 263 Suite beta spotlight, and a Creator Challenge for ambitious builders and artists. The theme: Artists. AI. African Innovation Leadership.',
  },
  {
    patterns: ['zimbabwe', 'harare', 'africa', 'african'],
    answer: 'Harare is positioned as a city that belongs inside the conversation about future culture and innovation. This event is a statement about African creativity and what happens when it\'s paired with systems, AI, and real infrastructure.',
  },
  {
    patterns: ['contact', 'email', 'reach', 'support', 'help'],
    answer: 'The best way to stay connected is to RSVP through the site. All updates, announcements, and event communication will go to registered attendees via email. You can also follow the movement on social media.',
  },
  {
    patterns: ['hi', 'hello', 'hey', 'yo', 'sup', 'good morning', 'good evening'],
    answer: 'Hey! Welcome to 263 CultureFest Harare. I\'m here to answer any questions about the event, the Creator Challenge, or the 263 Suite. What would you like to know?',
  },
];

function findAnswer(input: string): string {
  const lower = input.toLowerCase().trim();

  let bestMatch = { score: 0, answer: '' };
  for (const entry of EVENT_KNOWLEDGE) {
    let score = 0;
    for (const pattern of entry.patterns) {
      if (lower.includes(pattern)) {
        score += pattern.split(' ').length;
      }
    }
    if (score > bestMatch.score) {
      bestMatch = { score, answer: entry.answer };
    }
  }

  if (bestMatch.score > 0) return bestMatch.answer;

  return 'Great question! For specific details, I\'d recommend RSVPing at /rsvp so you receive all updates directly. You can also check the FAQ section on the homepage, or ask me about the event, the Creator Challenge, the panel, Tony Duardo, or the 263 Suite.';
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: 'bot', text: 'Hey! I\'m the 263 CultureFest assistant. Ask me anything about the event, the Creator Challenge, the panel, or the 263 Suite.' },
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = { id: Date.now(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const answer = findAnswer(text);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: answer }]);
    }, 400);
  };

  const handleVoice = () => {
    const el = document.querySelector('elevenlabs-convai') as any;
    if (el?.show) {
      el.show();
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-20 md:bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors"
            aria-label="Open chat"
          >
            <MessageCircle size={22} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] md:w-96 h-[28rem] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h3 className="font-display font-bold text-black text-sm">263 CultureFest</h3>
                <p className="text-xs text-gray-400">Ask anything about the event</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-black text-white rounded-br-md'
                      : 'bg-gray-100 text-black rounded-bl-md'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleVoice}
                  className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors shrink-0"
                  aria-label="Voice assistant"
                  title="Talk to voice assistant"
                >
                  <Mic size={16} />
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask about the event..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="p-2.5 rounded-xl bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-30 shrink-0"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
