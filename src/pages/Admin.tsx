import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Users, FileText, MapPin, TrendingUp, Download, Star } from 'lucide-react';

const ADMIN_KEY = 'culturefest_admin_authenticated';

interface Rsvp {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  city: string;
  country: string;
  role: string[];
  attendance_intent: string;
  challenge_interest: string;
  utm_source: string | null;
}

interface ChallengeApp {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  city: string;
  country: string;
  primary_identity: string[];
  what_are_you_building: string;
  why_you: string;
  current_stage: string;
  biggest_need: string[];
  status: string;
  review_score: number | null;
  notes: string | null;
  utm_source: string | null;
}

function LoginGate({ onAuth }: { onAuth: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPass = import.meta.env.VITE_ADMIN_PASSWORD;
    if (password === adminPass) {
      sessionStorage.setItem(ADMIN_KEY, 'true');
      onAuth();
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-8">
      <form onSubmit={handleLogin} className="bg-white border border-gray-200 rounded-2xl p-8 max-w-sm w-full shadow-lg">
        <h1 className="text-2xl font-display font-bold mb-6 text-black">Admin Access</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <input
          type="password"
          placeholder="Password"
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-black transition-colors mb-4"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-black text-white font-medium py-3 rounded-xl hover:bg-gray-800 transition-colors">
          Enter
        </button>
      </form>
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(sessionStorage.getItem(ADMIN_KEY) === 'true');
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [challenges, setChallenges] = useState<ChallengeApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'overview' | 'rsvps' | 'challenges'>('overview');

  useEffect(() => {
    if (!authed) return;
    loadData();
  }, [authed]);

  async function loadData() {
    setLoading(true);
    const [rsvpRes, challengeRes] = await Promise.all([
      supabase.from('culturefest_rsvps').select('*').order('created_at', { ascending: false }),
      supabase.from('culturefest_challenges').select('*').order('created_at', { ascending: false }),
    ]);
    if (rsvpRes.data) setRsvps(rsvpRes.data);
    if (challengeRes.data) setChallenges(challengeRes.data);
    setLoading(false);
  }

  async function updateChallengeStatus(id: string, status: string) {
    await supabase.from('culturefest_challenges').update({ status }).eq('id', id);
    setChallenges(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  }

  async function updateReviewScore(id: string, score: number) {
    await supabase.from('culturefest_challenges').update({ review_score: score }).eq('id', id);
    setChallenges(prev => prev.map(c => c.id === id ? { ...c, review_score: score } : c));
  }

  function exportCSV(type: 'rsvps' | 'challenges') {
    const data = type === 'rsvps' ? rsvps : challenges;
    if (data.length === 0) return;
    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(h => {
      const val = (row as any)[h];
      const str = Array.isArray(val) ? val.join('; ') : String(val ?? '');
      return `"${str.replace(/"/g, '""')}"`;
    }).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `culturefest_${type}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!authed) return <LoginGate onAuth={() => setAuthed(true)} />;

  // Stats
  const topCities = Object.entries(
    [...rsvps, ...challenges].reduce<Record<string, number>>((acc, r) => {
      const city = r.city || 'Unknown';
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const topSources = Object.entries(
    [...rsvps, ...challenges].reduce<Record<string, number>>((acc, r) => {
      const src = r.utm_source || 'direct';
      acc[src] = (acc[src] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const shortlisted = challenges.filter(c => c.status === 'shortlisted').length;

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display font-extrabold tracking-tight text-black">Admin Dashboard</h1>
          <button onClick={loadData} className="text-sm text-gray-500 hover:text-black transition-colors">
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard icon={<Users size={20} />} label="Total RSVPs" value={rsvps.length} />
              <StatCard icon={<FileText size={20} />} label="Challenge Apps" value={challenges.length} />
              <StatCard icon={<Star size={20} />} label="Shortlisted" value={shortlisted} />
              <StatCard icon={<TrendingUp size={20} />} label="Today" value={
                [...rsvps, ...challenges].filter(r => new Date(r.created_at).toDateString() === new Date().toDateString()).length
              } />
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              {(['overview', 'rsvps', 'challenges'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    tab === t ? 'bg-black text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {t === 'overview' ? 'Overview' : t === 'rsvps' ? 'RSVPs' : 'Challenges'}
                </button>
              ))}
            </div>

            {tab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin size={16} className="text-gray-400" />
                    <h3 className="font-display font-bold text-black">Top Cities</h3>
                  </div>
                  {topCities.length === 0 ? (
                    <p className="text-gray-400 text-sm">No data yet</p>
                  ) : (
                    <div className="space-y-3">
                      {topCities.map(([city, count]) => (
                        <div key={city} className="flex items-center justify-between">
                          <span className="text-sm text-black">{city}</span>
                          <span className="text-sm font-medium text-gray-500">{count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={16} className="text-gray-400" />
                    <h3 className="font-display font-bold text-black">Top Sources</h3>
                  </div>
                  {topSources.length === 0 ? (
                    <p className="text-gray-400 text-sm">No data yet</p>
                  ) : (
                    <div className="space-y-3">
                      {topSources.map(([src, count]) => (
                        <div key={src} className="flex items-center justify-between">
                          <span className="text-sm text-black">{src}</span>
                          <span className="text-sm font-medium text-gray-500">{count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {tab === 'rsvps' && (
              <div>
                <div className="flex justify-end mb-4">
                  <button onClick={() => exportCSV('rsvps')} className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors">
                    <Download size={16} /> Export CSV
                  </button>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left p-4 font-medium text-gray-500">Name</th>
                        <th className="text-left p-4 font-medium text-gray-500">Email</th>
                        <th className="text-left p-4 font-medium text-gray-500">City</th>
                        <th className="text-left p-4 font-medium text-gray-500">Role</th>
                        <th className="text-left p-4 font-medium text-gray-500">Attendance</th>
                        <th className="text-left p-4 font-medium text-gray-500">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rsvps.map(r => (
                        <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="p-4 text-black font-medium">{r.full_name}</td>
                          <td className="p-4 text-gray-600">{r.email}</td>
                          <td className="p-4 text-gray-600">{r.city}, {r.country}</td>
                          <td className="p-4 text-gray-600">{r.role?.join(', ')}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              r.attendance_intent === 'Yes' ? 'bg-green-50 text-green-700' :
                              r.attendance_intent === 'Maybe' ? 'bg-yellow-50 text-yellow-700' :
                              'bg-gray-50 text-gray-600'
                            }`}>{r.attendance_intent}</span>
                          </td>
                          <td className="p-4 text-gray-400">{new Date(r.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {rsvps.length === 0 && <p className="text-center py-12 text-gray-400">No RSVPs yet</p>}
                </div>
              </div>
            )}

            {tab === 'challenges' && (
              <div>
                <div className="flex justify-end mb-4">
                  <button onClick={() => exportCSV('challenges')} className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors">
                    <Download size={16} /> Export CSV
                  </button>
                </div>
                <div className="space-y-4">
                  {challenges.map(c => (
                    <div key={c.id} className="bg-white border border-gray-200 rounded-2xl p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                        <div>
                          <h3 className="font-display font-bold text-black text-lg">{c.full_name}</h3>
                          <p className="text-gray-500 text-sm">{c.email} · {c.city}, {c.country}</p>
                          <p className="text-gray-400 text-xs mt-1">{c.primary_identity?.join(', ')} · {c.current_stage}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={c.status || 'pending'}
                            onChange={e => updateChallengeStatus(c.id, e.target.value)}
                            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-black"
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewing">Reviewing</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="rejected">Rejected</option>
                            <option value="selected">Selected</option>
                          </select>
                          <select
                            value={c.review_score ?? ''}
                            onChange={e => updateReviewScore(c.id, Number(e.target.value))}
                            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-black"
                          >
                            <option value="" disabled>Score</option>
                            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}/5</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-gray-400 font-medium mb-1">What they're building</p>
                          <p className="text-gray-700">{c.what_are_you_building}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 font-medium mb-1">Why them</p>
                          <p className="text-gray-700">{c.why_you}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 font-medium mb-1">Biggest needs</p>
                          <div className="flex flex-wrap gap-2">
                            {c.biggest_need?.map(n => (
                              <span key={n} className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">{n}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {challenges.length === 0 && <p className="text-center py-12 text-gray-400">No applications yet</p>}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-3 text-gray-400">{icon}<span className="text-xs font-medium uppercase tracking-wider">{label}</span></div>
      <p className="text-3xl font-display font-extrabold text-black">{value}</p>
    </div>
  );
}
