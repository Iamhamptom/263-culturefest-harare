import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import {
  Users, FileText, MapPin, TrendingUp, Download, Star,
  Calendar, BarChart3, Eye, Clock, Filter, Search,
  ChevronDown, ChevronUp, ExternalLink, RefreshCw, Zap
} from 'lucide-react';

const ADMIN_KEY = 'culturefest_admin_authenticated';

interface Rsvp {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  company_or_brand: string | null;
  role: string[];
  instagram: string | null;
  linkedin: string | null;
  attendance_intent: string;
  challenge_interest: string;
  consent_email: boolean;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  source: string | null;
}

interface ChallengeApp {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  age_range: string;
  primary_identity: string[];
  brand_or_project_name: string | null;
  instagram: string | null;
  linkedin: string | null;
  tiktok: string | null;
  website: string | null;
  what_are_you_building: string;
  why_you: string;
  current_stage: string;
  biggest_need: string[];
  status: string;
  review_score: number | null;
  notes: string | null;
  consent_email: boolean;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  source: string | null;
}

/* ─── Login Gate ─── */
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
      <motion.form
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        onSubmit={handleLogin}
        className="bg-white border border-gray-200 rounded-2xl p-8 max-w-sm w-full shadow-lg"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-black">263 Admin</h1>
            <p className="text-xs text-gray-400">CultureFest Command Center</p>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <input
          type="password"
          placeholder="Password"
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-black transition-colors mb-4"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-black text-white font-medium py-3 rounded-xl hover:bg-gray-800 transition-colors">
          Enter Dashboard
        </button>
      </motion.form>
    </div>
  );
}

/* ─── Main Admin ─── */
export default function Admin() {
  const [authed, setAuthed] = useState(sessionStorage.getItem(ADMIN_KEY) === 'true');
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [challenges, setChallenges] = useState<ChallengeApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'overview' | 'analytics' | 'rsvps' | 'challenges'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [rsvpFilter, setRsvpFilter] = useState<'all' | 'Yes' | 'Maybe' | 'Need more details'>('all');
  const [challengeFilter, setChallengeFilter] = useState<'all' | 'pending' | 'reviewing' | 'shortlisted' | 'selected' | 'rejected'>('all');
  const [expandedChallenge, setExpandedChallenge] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

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

  async function handleRefresh() {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  async function updateChallengeStatus(id: string, status: string) {
    await supabase.from('culturefest_challenges').update({ status }).eq('id', id);
    setChallenges(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  }

  async function updateReviewScore(id: string, score: number) {
    await supabase.from('culturefest_challenges').update({ review_score: score }).eq('id', id);
    setChallenges(prev => prev.map(c => c.id === id ? { ...c, review_score: score } : c));
  }

  async function updateNotes(id: string, notes: string) {
    await supabase.from('culturefest_challenges').update({ notes }).eq('id', id);
    setChallenges(prev => prev.map(c => c.id === id ? { ...c, notes } : c));
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

  /* ─── Computed Analytics ─── */
  const analytics = useMemo(() => {
    const all = [...rsvps, ...challenges] as any[];
    const now = new Date();
    const today = now.toDateString();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Time-series: last 14 days
    const dailyCounts: Record<string, { rsvps: number; challenges: number }> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(5, 10);
      dailyCounts[key] = { rsvps: 0, challenges: 0 };
    }
    rsvps.forEach(r => {
      const key = new Date(r.created_at).toISOString().slice(5, 10);
      if (dailyCounts[key]) dailyCounts[key].rsvps++;
    });
    challenges.forEach(c => {
      const key = new Date(c.created_at).toISOString().slice(5, 10);
      if (dailyCounts[key]) dailyCounts[key].challenges++;
    });

    // Role distribution
    const roleMap: Record<string, number> = {};
    rsvps.forEach(r => r.role?.forEach((role: string) => { roleMap[role] = (roleMap[role] || 0) + 1; }));
    challenges.forEach(c => c.primary_identity?.forEach((id: string) => { roleMap[id] = (roleMap[id] || 0) + 1; }));

    // Country distribution
    const countryMap: Record<string, number> = {};
    all.forEach(r => { const c = r.country || 'Unknown'; countryMap[c] = (countryMap[c] || 0) + 1; });

    // City distribution
    const cityMap: Record<string, number> = {};
    all.forEach(r => { const c = r.city || 'Unknown'; cityMap[c] = (cityMap[c] || 0) + 1; });

    // UTM sources
    const sourceMap: Record<string, number> = {};
    all.forEach(r => { const s = r.utm_source || r.source || 'direct'; sourceMap[s] = (sourceMap[s] || 0) + 1; });

    // UTM campaigns
    const campaignMap: Record<string, number> = {};
    all.forEach(r => { if (r.utm_campaign) campaignMap[r.utm_campaign] = (campaignMap[r.utm_campaign] || 0) + 1; });

    // Attendance intent
    const intentMap: Record<string, number> = {};
    rsvps.forEach(r => { intentMap[r.attendance_intent] = (intentMap[r.attendance_intent] || 0) + 1; });

    // Challenge stage distribution
    const stageMap: Record<string, number> = {};
    challenges.forEach(c => { const s = c.current_stage || 'Unknown'; stageMap[s] = (stageMap[s] || 0) + 1; });

    // Challenge status pipeline
    const statusMap: Record<string, number> = { pending: 0, reviewing: 0, shortlisted: 0, selected: 0, rejected: 0 };
    challenges.forEach(c => { const s = c.status || 'pending'; statusMap[s] = (statusMap[s] || 0) + 1; });

    // This week count
    const thisWeek = all.filter(r => new Date(r.created_at) >= weekAgo).length;
    const todayCount = all.filter(r => new Date(r.created_at).toDateString() === today).length;

    // Consent rate
    const consentCount = all.filter(r => r.consent_email).length;

    return {
      dailyCounts,
      roleMap: Object.entries(roleMap).sort((a, b) => b[1] - a[1]),
      countryMap: Object.entries(countryMap).sort((a, b) => b[1] - a[1]).slice(0, 10),
      cityMap: Object.entries(cityMap).sort((a, b) => b[1] - a[1]).slice(0, 10),
      sourceMap: Object.entries(sourceMap).sort((a, b) => b[1] - a[1]),
      campaignMap: Object.entries(campaignMap).sort((a, b) => b[1] - a[1]),
      intentMap,
      stageMap: Object.entries(stageMap).sort((a, b) => b[1] - a[1]),
      statusMap,
      thisWeek,
      todayCount,
      consentRate: all.length > 0 ? Math.round((consentCount / all.length) * 100) : 0,
    };
  }, [rsvps, challenges]);

  /* ─── Filtered Data ─── */
  const filteredRsvps = useMemo(() => {
    let data = rsvps;
    if (rsvpFilter !== 'all') data = data.filter(r => r.attendance_intent === rsvpFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(r =>
        r.full_name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q)
      );
    }
    return data;
  }, [rsvps, rsvpFilter, searchQuery]);

  const filteredChallenges = useMemo(() => {
    let data = challenges;
    if (challengeFilter !== 'all') data = data.filter(c => (c.status || 'pending') === challengeFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(c =>
        c.full_name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.what_are_you_building.toLowerCase().includes(q)
      );
    }
    return data;
  }, [challenges, challengeFilter, searchQuery]);

  if (!authed) return <LoginGate onAuth={() => setAuthed(true)} />;

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: <Eye size={16} /> },
    { id: 'analytics' as const, label: 'Analytics', icon: <BarChart3 size={16} /> },
    { id: 'rsvps' as const, label: `RSVPs (${rsvps.length})`, icon: <Users size={16} /> },
    { id: 'challenges' as const, label: `Challenges (${challenges.length})`, icon: <FileText size={16} /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-50 pt-28 pb-16 px-4 md:px-8"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-extrabold tracking-tight text-black">Command Center</h1>
            <p className="text-gray-400 text-sm mt-1">263 CultureFest Harare — Admin Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://visioworkspace-corpo1.vercel.app/products"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors border border-gray-200 rounded-full px-4 py-2 bg-white"
            >
              <ExternalLink size={14} /> Visio Workspace
            </a>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors border border-gray-200 rounded-full px-4 py-2 bg-white disabled:opacity-50"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">
            <RefreshCw size={24} className="animate-spin mx-auto mb-4" />
            Loading data...
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
              <StatCard icon={<Users size={18} />} label="RSVPs" value={rsvps.length} color="bg-black" />
              <StatCard icon={<FileText size={18} />} label="Challenges" value={challenges.length} color="bg-black" />
              <StatCard icon={<Star size={18} />} label="Shortlisted" value={analytics.statusMap.shortlisted + analytics.statusMap.selected} color="bg-[#10a3a8]" />
              <StatCard icon={<TrendingUp size={18} />} label="This Week" value={analytics.thisWeek} color="bg-[#e63833]" />
              <StatCard icon={<Calendar size={18} />} label="Today" value={analytics.todayCount} color="bg-black" />
              <StatCard icon={<Zap size={18} />} label="Consent %" value={analytics.consentRate} suffix="%" color="bg-[#10a3a8]" />
            </div>

            {/* Search + Tabs */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, city..."
                  className="w-full bg-white border border-gray-200 rounded-full pl-10 pr-4 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {tabs.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                      tab === t.id ? 'bg-black text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ─── Overview Tab ─── */}
            {tab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 14-Day Trend */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:col-span-2">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={16} className="text-gray-400" />
                    <h3 className="font-display font-bold text-black">14-Day Registration Trend</h3>
                  </div>
                  <div className="flex items-end gap-1 h-32">
                    {Object.entries(analytics.dailyCounts).map(([date, counts]) => {
                      const total = counts.rsvps + counts.challenges;
                      const maxTotal = Math.max(...Object.values(analytics.dailyCounts).map(c => c.rsvps + c.challenges), 1);
                      const height = (total / maxTotal) * 100;
                      return (
                        <div key={date} className="flex-1 flex flex-col items-center gap-1" title={`${date}: ${counts.rsvps} RSVPs, ${counts.challenges} challenges`}>
                          <div className="w-full flex flex-col justify-end" style={{ height: '100px' }}>
                            <div className="bg-[#10a3a8] rounded-t-sm" style={{ height: `${(counts.challenges / maxTotal) * 100}%`, minHeight: counts.challenges > 0 ? 2 : 0 }} />
                            <div className="bg-black rounded-t-sm" style={{ height: `${(counts.rsvps / maxTotal) * 100}%`, minHeight: counts.rsvps > 0 ? 2 : 0 }} />
                          </div>
                          <span className="text-[9px] text-gray-400 -rotate-45 origin-center">{date}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex gap-4 mt-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-black" /> RSVPs</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#10a3a8]" /> Challenges</span>
                  </div>
                </div>

                {/* Challenge Pipeline */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Filter size={16} className="text-gray-400" />
                    <h3 className="font-display font-bold text-black">Challenge Pipeline</h3>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(analytics.statusMap).map(([status, count]) => {
                      const maxCount = Math.max(...Object.values(analytics.statusMap), 1);
                      const colors: Record<string, string> = {
                        pending: 'bg-gray-300',
                        reviewing: 'bg-yellow-400',
                        shortlisted: 'bg-[#10a3a8]',
                        selected: 'bg-green-500',
                        rejected: 'bg-red-400',
                      };
                      return (
                        <div key={status}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 capitalize">{status}</span>
                            <span className="font-medium text-black">{count}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${colors[status] || 'bg-gray-400'} transition-all`} style={{ width: `${(count / maxCount) * 100}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Top Cities */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin size={16} className="text-gray-400" />
                    <h3 className="font-display font-bold text-black">Top Cities</h3>
                  </div>
                  {analytics.cityMap.length === 0 ? (
                    <p className="text-gray-400 text-sm">No data yet</p>
                  ) : (
                    <div className="space-y-2">
                      {analytics.cityMap.slice(0, 8).map(([city, count]) => (
                        <div key={city} className="flex items-center justify-between">
                          <span className="text-sm text-black truncate">{city}</span>
                          <span className="text-sm font-medium text-gray-500 ml-2">{count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Attendance Intent */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock size={16} className="text-gray-400" />
                    <h3 className="font-display font-bold text-black">Attendance Intent</h3>
                  </div>
                  <div className="space-y-3">
                    {['Yes', 'Maybe', 'Need more details'].map(intent => {
                      const count = analytics.intentMap[intent] || 0;
                      const pct = rsvps.length > 0 ? Math.round((count / rsvps.length) * 100) : 0;
                      const colors: Record<string, string> = { Yes: 'bg-green-500', Maybe: 'bg-yellow-400', 'Need more details': 'bg-gray-300' };
                      return (
                        <div key={intent}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">{intent}</span>
                            <span className="font-medium text-black">{count} ({pct}%)</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${colors[intent]} transition-all`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* UTM Sources */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={16} className="text-gray-400" />
                    <h3 className="font-display font-bold text-black">Traffic Sources</h3>
                  </div>
                  {analytics.sourceMap.length === 0 ? (
                    <p className="text-gray-400 text-sm">No data yet</p>
                  ) : (
                    <div className="space-y-2">
                      {analytics.sourceMap.map(([src, count]) => (
                        <div key={src} className="flex items-center justify-between">
                          <span className="text-sm text-black truncate">{src}</span>
                          <span className="text-sm font-medium text-gray-500 ml-2">{count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ─── Analytics Tab ─── */}
            {tab === 'analytics' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Role Distribution */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="font-display font-bold text-black mb-4">Role Distribution</h3>
                  <div className="space-y-2">
                    {analytics.roleMap.map(([role, count]) => {
                      const maxCount = analytics.roleMap[0]?.[1] || 1;
                      return (
                        <div key={role}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">{role}</span>
                            <span className="font-medium text-black">{count}</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-black transition-all" style={{ width: `${(count / maxCount) * 100}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Country Distribution */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="font-display font-bold text-black mb-4">Countries</h3>
                  <div className="space-y-2">
                    {analytics.countryMap.map(([country, count]) => (
                      <div key={country} className="flex items-center justify-between">
                        <span className="text-sm text-black">{country}</span>
                        <span className="text-sm font-medium text-gray-500">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Challenge Stages */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="font-display font-bold text-black mb-4">Applicant Stages</h3>
                  <div className="space-y-2">
                    {analytics.stageMap.map(([stage, count]) => (
                      <div key={stage} className="flex items-center justify-between">
                        <span className="text-sm text-black">{stage}</span>
                        <span className="text-sm font-medium text-gray-500">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* UTM Campaigns */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="font-display font-bold text-black mb-4">Campaign Performance</h3>
                  {analytics.campaignMap.length === 0 ? (
                    <p className="text-gray-400 text-sm">No campaign data yet. Use ?utm_campaign=xxx in URLs.</p>
                  ) : (
                    <div className="space-y-2">
                      {analytics.campaignMap.map(([campaign, count]) => (
                        <div key={campaign} className="flex items-center justify-between">
                          <span className="text-sm text-black truncate">{campaign}</span>
                          <span className="text-sm font-medium text-gray-500 ml-2">{count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Biggest Needs */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:col-span-2">
                  <h3 className="font-display font-bold text-black mb-4">What Applicants Need Most</h3>
                  <div className="flex flex-wrap gap-3">
                    {(() => {
                      const needMap: Record<string, number> = {};
                      challenges.forEach(c => c.biggest_need?.forEach(n => { needMap[n] = (needMap[n] || 0) + 1; }));
                      return Object.entries(needMap).sort((a, b) => b[1] - a[1]).map(([need, count]) => (
                        <div key={need} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2">
                          <span className="text-sm text-black">{need}</span>
                          <span className="text-xs font-bold text-gray-400">{count}</span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* ─── RSVPs Tab ─── */}
            {tab === 'rsvps' && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                  <div className="flex gap-2 overflow-x-auto">
                    {(['all', 'Yes', 'Maybe', 'Need more details'] as const).map(f => (
                      <button
                        key={f}
                        onClick={() => setRsvpFilter(f)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                          rsvpFilter === f ? 'bg-black text-white' : 'bg-white text-gray-500 border border-gray-200'
                        }`}
                      >
                        {f === 'all' ? `All (${rsvps.length})` : f}
                      </button>
                    ))}
                  </div>
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
                        <th className="text-left p-4 font-medium text-gray-500">Phone</th>
                        <th className="text-left p-4 font-medium text-gray-500">City</th>
                        <th className="text-left p-4 font-medium text-gray-500">Role</th>
                        <th className="text-left p-4 font-medium text-gray-500">Attendance</th>
                        <th className="text-left p-4 font-medium text-gray-500">Source</th>
                        <th className="text-left p-4 font-medium text-gray-500">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRsvps.map(r => (
                        <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="p-4 text-black font-medium">{r.full_name}</td>
                          <td className="p-4 text-gray-600">{r.email}</td>
                          <td className="p-4 text-gray-600">{r.phone}</td>
                          <td className="p-4 text-gray-600">{r.city}, {r.country}</td>
                          <td className="p-4 text-gray-600">{r.role?.join(', ')}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              r.attendance_intent === 'Yes' ? 'bg-green-50 text-green-700' :
                              r.attendance_intent === 'Maybe' ? 'bg-yellow-50 text-yellow-700' :
                              'bg-gray-50 text-gray-600'
                            }`}>{r.attendance_intent}</span>
                          </td>
                          <td className="p-4 text-gray-400 text-xs">{r.utm_source || 'direct'}</td>
                          <td className="p-4 text-gray-400">{new Date(r.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredRsvps.length === 0 && <p className="text-center py-12 text-gray-400">{searchQuery ? 'No results found' : 'No RSVPs yet'}</p>}
                </div>
              </div>
            )}

            {/* ─── Challenges Tab ─── */}
            {tab === 'challenges' && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                  <div className="flex gap-2 overflow-x-auto">
                    {(['all', 'pending', 'reviewing', 'shortlisted', 'selected', 'rejected'] as const).map(f => (
                      <button
                        key={f}
                        onClick={() => setChallengeFilter(f)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize whitespace-nowrap ${
                          challengeFilter === f ? 'bg-black text-white' : 'bg-white text-gray-500 border border-gray-200'
                        }`}
                      >
                        {f === 'all' ? `All (${challenges.length})` : `${f} (${analytics.statusMap[f] || 0})`}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => exportCSV('challenges')} className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors">
                    <Download size={16} /> Export CSV
                  </button>
                </div>
                <div className="space-y-4">
                  {filteredChallenges.map(c => {
                    const isExpanded = expandedChallenge === c.id;
                    return (
                      <motion.div
                        key={c.id}
                        layout
                        className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
                      >
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <h3 className="font-display font-bold text-black text-lg">{c.full_name}</h3>
                                {c.review_score && (
                                  <span className="flex items-center gap-1 text-xs font-medium text-[#e63833]">
                                    <Star size={12} fill="currentColor" /> {c.review_score}/5
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-500 text-sm">{c.email} · {c.phone}</p>
                              <p className="text-gray-400 text-xs mt-1">
                                {c.city}, {c.country} · {c.age_range} · {c.primary_identity?.join(', ')} · {c.current_stage}
                              </p>
                              {c.brand_or_project_name && (
                                <p className="text-[#10a3a8] text-xs mt-1 font-medium">{c.brand_or_project_name}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <select
                                value={c.status || 'pending'}
                                onChange={e => updateChallengeStatus(c.id, e.target.value)}
                                className={`text-sm border rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-black ${
                                  c.status === 'selected' ? 'border-green-400 text-green-700' :
                                  c.status === 'shortlisted' ? 'border-[#10a3a8] text-[#10a3a8]' :
                                  c.status === 'rejected' ? 'border-red-300 text-red-500' :
                                  'border-gray-200'
                                }`}
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
                              <button
                                onClick={() => setExpandedChallenge(isExpanded ? null : c.id)}
                                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </button>
                            </div>
                          </div>

                          {/* Social links */}
                          <div className="flex gap-3 mt-2">
                            {c.instagram && <a href={`https://instagram.com/${c.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-black">IG: {c.instagram}</a>}
                            {c.linkedin && <a href={c.linkedin.startsWith('http') ? c.linkedin : `https://${c.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-black">LinkedIn</a>}
                            {c.tiktok && <span className="text-xs text-gray-400">TikTok: {c.tiktok}</span>}
                            {c.website && <a href={c.website} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-black">Website</a>}
                          </div>
                        </div>

                        {/* Expanded detail */}
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="border-t border-gray-100 p-6 bg-gray-50/50 space-y-4"
                          >
                            <div>
                              <p className="text-gray-400 font-medium text-xs uppercase tracking-wider mb-2">What they're building</p>
                              <p className="text-gray-700 text-sm leading-relaxed">{c.what_are_you_building}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 font-medium text-xs uppercase tracking-wider mb-2">Why them</p>
                              <p className="text-gray-700 text-sm leading-relaxed">{c.why_you}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 font-medium text-xs uppercase tracking-wider mb-2">Biggest needs</p>
                              <div className="flex flex-wrap gap-2">
                                {c.biggest_need?.map(n => (
                                  <span key={n} className="px-3 py-1 rounded-full text-xs bg-white border border-gray-200 text-gray-600">{n}</span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-gray-400 font-medium text-xs uppercase tracking-wider mb-2">Admin Notes</p>
                              <textarea
                                rows={3}
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-black transition-colors resize-none"
                                placeholder="Add notes about this applicant..."
                                value={c.notes || ''}
                                onChange={e => updateNotes(c.id, e.target.value)}
                              />
                            </div>
                            <div className="text-xs text-gray-400">
                              Submitted {new Date(c.created_at).toLocaleString()} · Source: {c.utm_source || c.source || 'direct'}
                              {c.utm_campaign && ` · Campaign: ${c.utm_campaign}`}
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                  {filteredChallenges.length === 0 && <p className="text-center py-12 text-gray-400">{searchQuery ? 'No results found' : 'No applications yet'}</p>}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

function StatCard({ icon, label, value, suffix = '', color = 'bg-black' }: { icon: React.ReactNode; label: string; value: number; suffix?: string; color?: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-7 h-7 rounded-full ${color} flex items-center justify-center text-white`}>{icon}</div>
        <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">{label}</span>
      </div>
      <p className="text-2xl font-display font-extrabold text-black">{value}{suffix}</p>
    </div>
  );
}
