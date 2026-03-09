import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function SuccessChallenge() {
  return (
    <div className="min-h-screen flex items-center justify-center px-8 bg-white relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl w-full bg-white border border-gray-200 rounded-[2.5rem] p-12 text-center relative z-10 shadow-xl"
      >
        <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-8 border border-gray-200">
          <CheckCircle className="text-black w-10 h-10" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tighter mb-6 text-black">
          Application Received
        </h1>
        
        <p className="text-lg text-gray-600 leading-relaxed mb-10">
          Your application is in. Watch your inbox for the next steps and challenge-related communication.
        </p>
        
        <Link 
          to="/" 
          className="inline-flex items-center justify-center w-full gap-2 bg-black text-white font-medium px-8 py-4 rounded-xl transition-all hover:bg-gray-800"
        >
          Return to Home <ArrowRight size={18} />
        </Link>
      </motion.div>
    </div>
  );
}
