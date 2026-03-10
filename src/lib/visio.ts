/**
 * Visio Workspace Integration
 * Two sync paths:
 *   1. Gateway (AI agent) — uses Anthropic API via Visio Workspace
 *   2. Direct Supabase — fallback, writes leads + product_reports directly
 * Gemini fallback: if VITE_GEMINI_API_KEY is set, AI-powered enrichment
 */

import { supabase } from './supabase';

const GATEWAY_URL = import.meta.env.VITE_VISIO_GATEWAY_URL;
const GATEWAY_KEY = import.meta.env.VITE_VISIO_GATEWAY_KEY;
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Visio Workspace IDs (shared Supabase)
const WORKSPACE_ID = 'a1d9788c-55cf-4eb0-a3eb-1697ec9763de';
const HAMPTON_MUSIC_ORG_ID = '5959f2b2-a043-4a63-93a4-1cd517eeecd3';
const PRODUCT_ID = 'bb99d0b0-a23d-4731-90d1-a2b468bf3ab4';

export const isVisioConfigured = true; // Always true — direct Supabase fallback
export const isGatewayConfigured = !!(GATEWAY_URL && GATEWAY_KEY);
export const isGeminiConfigured = !!GEMINI_KEY;

type SyncResult = { ok: boolean; data?: any; error?: string; method: 'gateway' | 'direct' | 'gemini' };

/** Try Gateway first, fall back to direct Supabase */
async function callGateway(command: string): Promise<SyncResult> {
  if (isGatewayConfigured) {
    try {
      const res = await fetch(GATEWAY_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GATEWAY_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
      });
      if (res.ok) {
        const data = await res.json();
        return { ok: true, data, method: 'gateway' };
      }
    } catch {}
  }
  return { ok: false, error: 'Gateway unavailable', method: 'gateway' };
}

/** Call Gemini for AI enrichment (lead scoring, summaries) */
async function callGemini(prompt: string): Promise<string | null> {
  if (!GEMINI_KEY) return null;
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
        }),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch {
    return null;
  }
}

/**
 * Sync RSVPs as leads into Visio Workspace CRM
 */
export async function syncRsvpsToLeads(rsvps: Array<{
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
}>): Promise<SyncResult> {
  if (!rsvps.length) return { ok: true, data: { synced: 0 }, method: 'direct' };

  // Try gateway first
  const gwResult = await callGateway(
    `Create leads in Hampton Music for these 263 CultureFest RSVPs. Source: "263_culturefest_rsvp", tag: "263-culturefest-harare".\n\n${rsvps.map(r => `${r.full_name} (${r.email}, ${r.phone}, ${r.city} ${r.country})`).join('\n')}`
  );
  if (gwResult.ok) return gwResult;

  // Fallback: direct Supabase insert
  const leads = rsvps.map(r => ({
    organization_id: HAMPTON_MUSIC_ORG_ID,
    workspace_id: WORKSPACE_ID,
    name: r.full_name,
    email: r.email,
    phone: r.phone,
    location: `${r.city}, ${r.country}`,
    company: r.company_or_brand || '',
    linkedin: r.linkedin || '',
    source: '263_culturefest_rsvp',
    status: 'raw',
    score: r.attendance_intent === 'Definitely attending' ? 60 : 40,
    tags: ['263-culturefest-harare', ...r.role],
    notes: `RSVP via 263 CultureFest. Roles: ${r.role?.join(', ')}. Intent: ${r.attendance_intent}.${r.instagram ? ` IG: ${r.instagram}` : ''}`,
  }));

  // Use Gemini for lead scoring if available
  if (isGeminiConfigured && rsvps.length > 0) {
    const scoring = await callGemini(
      `Score these event leads 1-100 based on engagement potential. Return JSON array of scores only.\n${rsvps.map(r => `${r.full_name}, ${r.role?.join('/')}, ${r.attendance_intent}, company: ${r.company_or_brand || 'none'}`).join('\n')}`
    );
    if (scoring) {
      try {
        const scores = JSON.parse(scoring);
        scores.forEach((s: number, i: number) => { if (leads[i]) leads[i].score = s; });
      } catch {}
    }
  }

  const { data, error } = await supabase.from('leads').upsert(leads, { onConflict: 'email' });
  if (error) return { ok: false, error: error.message, method: 'direct' };
  return { ok: true, data: { synced: leads.length, method: isGeminiConfigured ? 'direct+gemini' : 'direct' }, method: 'direct' };
}

/**
 * Sync Challenge applicants as leads (higher intent = higher score)
 */
export async function syncChallengesToLeads(challenges: Array<{
  full_name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  primary_identity: string[];
  brand_or_project_name: string | null;
  what_are_you_building: string;
  current_stage: string;
  status: string;
  review_score: number | null;
}>): Promise<SyncResult> {
  if (!challenges.length) return { ok: true, data: { synced: 0 }, method: 'direct' };

  // Try gateway first
  const gwResult = await callGateway(
    `Create leads in Hampton Music for 263 CultureFest Creator Challenge applicants. Source: "263_culturefest_challenge", tags: "263-culturefest-harare", "creator-challenge".\n\n${challenges.map(c => `${c.full_name} (${c.email}, ${c.current_stage}, building: "${c.what_are_you_building.slice(0, 80)}")`).join('\n')}`
  );
  if (gwResult.ok) return gwResult;

  // Fallback: direct Supabase insert
  const scoreMap: Record<string, number> = { selected: 80, shortlisted: 80, reviewing: 60, pending: 40, rejected: 20 };
  const leads = challenges.map(c => ({
    organization_id: HAMPTON_MUSIC_ORG_ID,
    workspace_id: WORKSPACE_ID,
    name: c.full_name,
    email: c.email,
    phone: c.phone,
    location: `${c.city}, ${c.country}`,
    company: c.brand_or_project_name || '',
    source: '263_culturefest_challenge',
    status: 'enriched',
    score: c.review_score || scoreMap[c.status] || 40,
    tags: ['263-culturefest-harare', 'creator-challenge', ...c.primary_identity],
    notes: `Challenge app. Identity: ${c.primary_identity?.join(', ')}. Stage: ${c.current_stage}. Building: "${c.what_are_you_building.slice(0, 150)}". Review: ${c.status}.`,
  }));

  const { error } = await supabase.from('leads').upsert(leads, { onConflict: 'email' });
  if (error) return { ok: false, error: error.message, method: 'direct' };
  return { ok: true, data: { synced: leads.length }, method: 'direct' };
}

/**
 * Report product metrics to Visio Workspace
 */
export async function reportProductMetrics(metrics: {
  totalRsvps: number;
  totalChallenges: number;
  shortlisted: number;
  todayCount: number;
  consentRate: number;
}): Promise<SyncResult> {
  // Try gateway first
  const gwResult = await callGateway(
    `Report metrics for "263 CultureFest Harare": active_users: ${metrics.totalRsvps + metrics.totalChallenges}, new_users: ${metrics.todayCount}, health_score: ${Math.min(100, Math.round((metrics.totalRsvps / 5) + (metrics.totalChallenges * 2) + (metrics.shortlisted * 5)))}`
  );
  if (gwResult.ok) return gwResult;

  // Fallback: direct insert into product_reports
  const healthScore = Math.min(100, Math.round((metrics.totalRsvps / 5) + (metrics.totalChallenges * 2) + (metrics.shortlisted * 5)));
  const { error } = await supabase.from('product_reports').insert({
    product_id: PRODUCT_ID,
    workspace_id: WORKSPACE_ID,
    period: 'daily',
    active_users: metrics.totalRsvps + metrics.totalChallenges,
    new_users: metrics.todayCount,
    health_score: Math.max(healthScore, 10),
    notes: `RSVPs: ${metrics.totalRsvps}, Challenges: ${metrics.totalChallenges}, Shortlisted: ${metrics.shortlisted}, Consent: ${metrics.consentRate}%. Auto-report from 263 CultureFest admin.`,
  });
  if (error) return { ok: false, error: error.message, method: 'direct' };
  return { ok: true, data: { reported: true }, method: 'direct' };
}

/**
 * Competitor intelligence scan — Gateway only (needs AI), Gemini fallback
 */
export async function runCompetitorScan(): Promise<SyncResult> {
  const gwResult = await callGateway(
    `Launch a competitor scan for Hampton Music. Focus: Southern African culture festivals. Analyze Afro Nation, DStv Delicious, Rocking the Daisies, Blankets & Wine. Compare ticket pricing, sponsor models, digital marketing, artist booking trends.`
  );
  if (gwResult.ok) return gwResult;

  // Gemini fallback
  if (isGeminiConfigured) {
    const analysis = await callGemini(
      `You are a competitive intelligence analyst for 263 CultureFest, a premium AI x culture workshop in Harare, Zimbabwe (April 2026). Analyze the Southern African festival landscape:\n\n1. Top 10 festivals by attendance (Afro Nation Africa, DStv Delicious, Rocking the Daisies, Blankets & Wine, Oppikoppi, Lake of Stars, Bushfire, Vic Falls Carnival, HIFA, Shoko)\n2. Ticket pricing ranges\n3. Sponsor tier models\n4. Digital marketing channels used\n5. How 263 CultureFest can differentiate (AI workshop + creator challenge + free entry)\n\nReturn as a structured brief.`
    );
    if (analysis) {
      // Store as research report
      await supabase.from('research_reports').insert({
        workspace_id: WORKSPACE_ID,
        organization_id: HAMPTON_MUSIC_ORG_ID,
        title: '263 CultureFest Competitor Scan',
        content: analysis,
        status: 'completed',
      }).then(() => {});
      return { ok: true, data: { analysis, source: 'gemini' }, method: 'gemini' };
    }
  }

  return { ok: false, error: 'Both Gateway and Gemini unavailable. Add VITE_GEMINI_API_KEY for AI fallback.', method: 'direct' };
}

/**
 * Create email campaign — Gateway preferred, direct fallback
 */
export async function createRsvpCampaign(): Promise<SyncResult> {
  const gwResult = await callGateway(
    `Create campaign "263 CultureFest — RSVP Drip" in Hampton Music. Channel: email. 6 steps: confirm RSVP, meet Tony Duardo, Creator Challenge open, panel reveal, 263 Suite beta preview, 2 weeks to go.`
  );
  if (gwResult.ok) return gwResult;

  // Fallback: create campaign directly
  const { data: campaign, error: campErr } = await supabase.from('campaigns').insert({
    organization_id: HAMPTON_MUSIC_ORG_ID,
    name: '263 CultureFest — RSVP Drip Sequence',
    channel: 'email',
    status: 'draft',
  }).select('id').single();

  if (campErr) return { ok: false, error: campErr.message, method: 'direct' };

  const steps = [
    { delay_days: 0, subject: "You're on the list — 263 CultureFest Harare", body: 'Welcome! Your RSVP is confirmed for 263 Culture AI Fest. April 30 week, Harare. Free welcome pack + 263 Suite beta access on arrival.' },
    { delay_days: 3, subject: 'Meet the keynote: Tony Duardo', body: 'Tony Duardo — producer behind hits with Tyla, Uncle Waffles, Young Stunna. Close to 1B streams. Leading the AI workshop keynote.' },
    { delay_days: 7, subject: 'The Creator Challenge is open', body: 'Apply for the Creator Challenge — mentorship, potential HGA Records collab, and direct access to the VisioCorp network.' },
    { delay_days: 14, subject: 'Panel guest announcement', body: 'The curated panel lineup is dropping soon. Stay tuned for reveals.' },
    { delay_days: 21, subject: '263 Suite beta — first look', body: 'The artist-first AI platform. You get early beta access at the event.' },
    { delay_days: 28, subject: '2 weeks to go — Harare, are you ready?', body: 'Final logistics, what to bring, and a share-with-friends CTA.' },
  ];

  // Use Gemini to enhance email copy if available
  let enhancedSteps = steps;
  if (isGeminiConfigured) {
    const enhanced = await callGemini(
      `Enhance these 6 event email subjects and bodies for a premium African culture x AI festival. Keep them concise, bold, and culturally resonant. Return JSON array with {subject, body} for each:\n${JSON.stringify(steps)}`
    );
    if (enhanced) {
      try { enhancedSteps = JSON.parse(enhanced); } catch {}
    }
  }

  const sequences = enhancedSteps.map((s, i) => ({
    campaign_id: campaign.id,
    step_number: i + 1,
    delay_days: steps[i].delay_days,
    subject: s.subject,
    body: s.body,
    purpose: ['RSVP confirm', 'Keynote intro', 'Challenge CTA', 'Panel teaser', 'Product preview', 'Final push'][i],
  }));

  const { error: seqErr } = await supabase.from('campaign_sequences').insert(sequences);
  if (seqErr) return { ok: false, error: seqErr.message, method: 'direct' };
  return { ok: true, data: { campaign_id: campaign.id, steps: sequences.length }, method: isGeminiConfigured ? 'direct+gemini' : 'direct' };
}
