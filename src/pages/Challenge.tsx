import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getUtmParams } from '../lib/utm';
import { trackEvent } from '../lib/analytics';

export default function Challenge() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    age_range: '',
    primary_identity: [] as string[],
    brand_or_project_name: '',
    instagram: '',
    linkedin: '',
    tiktok: '',
    website: '',
    what_are_you_building: '',
    why_you: '',
    current_stage: '',
    biggest_need: [] as string[],
    consent_email: false,
  });

  const handleNext = () => setStep(prev => Math.min(prev + 1, 3));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formData.primary_identity.length === 0) {
      setError('Please select at least one identity.');
      return;
    }
    if (!formData.current_stage) {
      setError('Please select your current stage.');
      return;
    }
    if (formData.biggest_need.length === 0) {
      setError('Please select at least one need.');
      return;
    }
    setSubmitting(true);
    setError('');

    const utm = getUtmParams();
    const { error: dbError } = await supabase
      .from('culturefest_challenges')
      .insert({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        city: formData.city,
        age_range: formData.age_range,
        primary_identity: formData.primary_identity,
        brand_or_project_name: formData.brand_or_project_name || null,
        instagram: formData.instagram || null,
        linkedin: formData.linkedin || null,
        tiktok: formData.tiktok || null,
        website: formData.website || null,
        what_are_you_building: formData.what_are_you_building,
        why_you: formData.why_you,
        current_stage: formData.current_stage,
        biggest_need: formData.biggest_need,
        consent_email: formData.consent_email,
        ...utm,
      });

    if (dbError) {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
      return;
    }

    trackEvent('challenge_submitted');
    navigate('/success/challenge');
  };

  const identities = [
    "Artist", "Producer", "Founder", "Creator", "Developer", "Designer", "Marketer", "Student", "Operator", "Other"
  ];

  const needs = [
    "Exposure", "Mentorship", "Systems", "Branding", "Marketing", "Product help", "Partnerships", "Funding direction"
  ];

  const toggleArrayItem = (field: 'primary_identity' | 'biggest_need', item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item) 
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen pt-40 pb-24 px-8 bg-white relative overflow-hidden"
    >
      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="text-gray-400 font-bold tracking-[0.15em] uppercase text-xs mb-6">CREATOR CHALLENGE</p>
          <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tighter mb-6 text-black">
            Apply to Enter
          </h1>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            Submit your details, tell us what you’re building, and explain why you should be contacted with next steps. This is for people with signal.
          </p>
        </motion.div>

        <div className="bg-white border border-gray-200 rounded-[2.5rem] p-8 md:p-16 shadow-xl">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-12 relative max-w-md mx-auto">
            <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-gray-200 -z-10"></div>
            {[1, 2, 3].map(num => (
              <div key={num} className={`w-12 h-12 rounded-full flex items-center justify-center font-display font-bold transition-colors ${step >= num ? 'bg-black text-white' : 'bg-white text-gray-400 border border-gray-200'}`}>
                {num}
              </div>
            ))}
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
                    <label className="text-sm font-medium text-gray-600">Age Range *</label>
                    <select 
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-black transition-colors appearance-none"
                      value={formData.age_range}
                      onChange={e => setFormData({...formData, age_range: e.target.value})}
                    >
                      <option value="" disabled>Select Age Range</option>
                      {["Under 18", "18-21", "22-25", "26-30", "31-40", "41+"].map(age => (
                        <option key={age} value={age}>{age}</option>
                      ))}
                    </select>
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
                  <label className="text-sm font-medium text-gray-600">What best describes you? *</label>
                  <div className="flex flex-wrap gap-3">
                    {identities.map(id => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => toggleArrayItem('primary_identity', id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                          formData.primary_identity.includes(id) 
                            ? 'bg-black border-black text-white' 
                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                        }`}
                      >
                        {id}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Brand / Project Name (Optional)</label>
                  <input 
                    type="text" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-black transition-colors"
                    value={formData.brand_or_project_name}
                    onChange={e => setFormData({...formData, brand_or_project_name: e.target.value})}
                  />
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">TikTok (Optional)</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-black transition-colors"
                      placeholder="@username"
                      value={formData.tiktok}
                      onChange={e => setFormData({...formData, tiktok: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Website / Portfolio (Optional)</label>
                    <input 
                      type="url" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-black transition-colors"
                      placeholder="https://..."
                      value={formData.website}
                      onChange={e => setFormData({...formData, website: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={handlePrev}
                    className="w-1/3 bg-white text-black font-medium py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors border border-gray-200"
                  >
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button 
                    type="button"
                    onClick={handleNext}
                    className="w-2/3 bg-black text-white font-medium py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                  >
                    Continue <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">What are you building or working on? *</label>
                  <textarea 
                    required
                    rows={4}
                    maxLength={1200}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-black transition-colors resize-none"
                    value={formData.what_are_you_building}
                    onChange={e => setFormData({...formData, what_are_you_building: e.target.value})}
                  />
                  <p className="text-xs text-gray-400 text-right">{formData.what_are_you_building.length}/1200</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Why should we consider you for this opportunity? *</label>
                  <textarea 
                    required
                    rows={4}
                    maxLength={1200}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-black transition-colors resize-none"
                    value={formData.why_you}
                    onChange={e => setFormData({...formData, why_you: e.target.value})}
                  />
                  <p className="text-xs text-gray-400 text-right">{formData.why_you.length}/1200</p>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-600">What stage are you at? *</label>
                  <div className="flex flex-col gap-3">
                    {['Idea', 'Early traction', 'Already operating', 'Growing fast'].map(option => (
                      <label key={option} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${formData.current_stage === option ? 'border-black bg-black' : 'border-gray-300 group-hover:border-gray-500'}`}>
                          {formData.current_stage === option && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <input 
                          type="radio" 
                          name="stage" 
                          className="hidden" 
                          checked={formData.current_stage === option}
                          onChange={() => setFormData({...formData, current_stage: option})}
                        />
                        <span className="text-black">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-600">What do you need the most right now? *</label>
                  <div className="flex flex-wrap gap-3">
                    {needs.map(need => (
                      <button
                        key={need}
                        type="button"
                        onClick={() => toggleArrayItem('biggest_need', need)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                          formData.biggest_need.includes(need) 
                            ? 'bg-black border-black text-white' 
                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                        }`}
                      >
                        {need}
                      </button>
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
                  <span className="text-sm text-gray-600 leading-relaxed">I agree to receive challenge-related communication by email.</span>
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
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </motion.div>
            )}
          </form>
        </div>
      </div>
    </motion.div>
  );
}
