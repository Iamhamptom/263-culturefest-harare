import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getUtmParams } from '../lib/utm';
import { trackEvent } from '../lib/analytics';

export default function RSVP() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    company_or_brand: '',
    role: [] as string[],
    instagram: '',
    linkedin: '',
    attendance_intent: '',
    challenge_interest: '',
    consent_email: false,
  });

  const handleNext = () => setStep(2);
  const handlePrev = () => setStep(1);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const utm = getUtmParams();
    const { error: dbError } = await supabase
      .from('culturefest_rsvps')
      .insert({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        city: formData.city,
        company_or_brand: formData.company_or_brand || null,
        role: formData.role,
        instagram: formData.instagram || null,
        linkedin: formData.linkedin || null,
        attendance_intent: formData.attendance_intent,
        challenge_interest: formData.challenge_interest,
        consent_email: formData.consent_email,
        ...utm,
      });

    if (dbError) {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
      return;
    }

    trackEvent('rsvp_submitted');
    navigate('/success/rsvp');
  };

  const roles = [
    "Artist", "Founder", "Creator", "Developer", "Investor", "Student", "Operator", "Media", "Other"
  ];

  const handleRoleToggle = (role: string) => {
    setFormData(prev => ({
      ...prev,
      role: prev.role.includes(role) 
        ? prev.role.filter(r => r !== role)
        : [...prev.role, role]
    }));
  };

  return (
    <div className="min-h-screen pt-40 pb-24 px-8 bg-white relative overflow-hidden">
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <p className="text-gray-400 font-bold tracking-[0.15em] uppercase text-xs mb-6">RSVP</p>
          <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tighter mb-6 text-black">
            Reserve Your Place
          </h1>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            Tell us who you are and where you’re coming from. We’ll keep you updated with event information and important announcements.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-[2.5rem] p-8 md:p-16 shadow-xl">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-12 relative max-w-xs mx-auto">
            <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-gray-200 -z-10"></div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-display font-bold transition-colors ${step >= 1 ? 'bg-black text-white' : 'bg-white text-gray-400 border border-gray-200'}`}>
              1
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-display font-bold transition-colors ${step >= 2 ? 'bg-black text-white' : 'bg-white text-gray-400 border border-gray-200'}`}>
              2
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Full Name *</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-black transition-colors"
                      value={formData.full_name}
                      onChange={e => setFormData({...formData, full_name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Email Address *</label>
                    <input 
                      required
                      type="email" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-black transition-colors"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Phone Number *</label>
                    <input 
                      required
                      type="tel" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-black transition-colors"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Country *</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-black transition-colors"
                      value={formData.country}
                      onChange={e => setFormData({...formData, country: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">City *</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-black transition-colors"
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Company / Brand (Optional)</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-black transition-colors"
                      value={formData.company_or_brand}
                      onChange={e => setFormData({...formData, company_or_brand: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-black text-white font-medium py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors mt-8"
                >
                  Continue <ArrowRight size={18} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-600">I am primarily a... *</label>
                  <div className="flex flex-wrap gap-3">
                    {roles.map(role => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleRoleToggle(role)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                          formData.role.includes(role) 
                            ? 'bg-black border-black text-white' 
                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Instagram (Optional)</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-black transition-colors"
                      placeholder="@username"
                      value={formData.instagram}
                      onChange={e => setFormData({...formData, instagram: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">LinkedIn (Optional)</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-black transition-colors"
                      placeholder="linkedin.com/in/..."
                      value={formData.linkedin}
                      onChange={e => setFormData({...formData, linkedin: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-600">Will you attend in person? *</label>
                  <div className="flex flex-col gap-3">
                    {['Yes', 'Maybe', 'Need more details'].map(option => (
                      <label key={option} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${formData.attendance_intent === option ? 'border-black bg-black' : 'border-gray-300 group-hover:border-gray-500'}`}>
                          {formData.attendance_intent === option && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <input 
                          type="radio" 
                          name="attendance" 
                          className="hidden" 
                          checked={formData.attendance_intent === option}
                          onChange={() => setFormData({...formData, attendance_intent: option})}
                        />
                        <span className="text-black">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-600">Interested in the Creator Challenge? *</label>
                  <div className="flex flex-col gap-3">
                    {['Yes', 'No', 'Maybe'].map(option => (
                      <label key={option} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${formData.challenge_interest === option ? 'border-black bg-black' : 'border-gray-300 group-hover:border-gray-500'}`}>
                          {formData.challenge_interest === option && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <input 
                          type="radio" 
                          name="challenge" 
                          className="hidden" 
                          checked={formData.challenge_interest === option}
                          onChange={() => setFormData({...formData, challenge_interest: option})}
                        />
                        <span className="text-black">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer group mt-6">
                  <div className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center transition-colors shrink-0 ${formData.consent_email ? 'border-black bg-black text-white' : 'border-gray-300 group-hover:border-gray-500'}`}>
                    {formData.consent_email && <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5"><path d="M3 7.5L5.5 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={formData.consent_email}
                    onChange={e => setFormData({...formData, consent_email: e.target.checked})}
                  />
                  <span className="text-sm text-gray-600 leading-relaxed">I agree to receive updates and event communication by email.</span>
                </label>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={submitting}
                    className="w-1/3 bg-white text-black font-medium py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors border border-gray-200 disabled:opacity-50"
                  >
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-2/3 bg-black hover:bg-gray-800 text-white font-medium py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Complete RSVP'}
                  </button>
                </div>
              </motion.div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
