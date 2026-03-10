import { supabase } from './supabase';

type EventName =
  | 'hero_cta_click'
  | 'secondary_cta_click'
  | 'rsvp_started'
  | 'rsvp_submitted'
  | 'challenge_started'
  | 'challenge_submitted'
  | 'panel_teaser_click'
  | 'faq_expand'
  | 'email_capture_success'
  | 'page_view'
  | 'chatbot_opened'
  | 'chatbot_message'
  | 'voice_agent_triggered'
  | 'visio_sync_action'
  | 'admin_login'
  | 'scroll_depth';

interface EventPayload {
  name: EventName;
  params?: Record<string, string>;
  timestamp: string;
  url: string;
  referrer: string;
  user_agent: string;
}

// In-memory debug log (viewable in admin)
const debugLog: Array<{ time: string; event: string; data?: any; level: 'info' | 'warn' | 'error' }> = [];
const MAX_DEBUG_ENTRIES = 200;

export function getDebugLog() {
  return debugLog;
}

function addDebugEntry(level: 'info' | 'warn' | 'error', event: string, data?: any) {
  debugLog.unshift({
    time: new Date().toISOString(),
    event,
    data,
    level,
  });
  if (debugLog.length > MAX_DEBUG_ENTRIES) debugLog.pop();
}

export function debugInfo(event: string, data?: any) { addDebugEntry('info', event, data); }
export function debugWarn(event: string, data?: any) { addDebugEntry('warn', event, data); }
export function debugError(event: string, data?: any) { addDebugEntry('error', event, data); }

/**
 * Track an event — fires to GA4, Meta Pixel, and Supabase
 */
export function trackEvent(name: EventName, params?: Record<string, string>) {
  const payload: EventPayload = {
    name,
    params,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    referrer: document.referrer || 'direct',
    user_agent: navigator.userAgent,
  };

  // GA4
  if ((window as any).gtag) {
    (window as any).gtag('event', name, params);
  }

  // Meta Pixel
  if ((window as any).fbq) {
    (window as any).fbq('trackCustom', name, params);
  }

  // Supabase event log (fire and forget)
  supabase.from('event_logs').insert({
    event_name: name,
    event_data: params || {},
    page_url: payload.url,
    referrer: payload.referrer,
    user_agent: payload.user_agent,
  }).then(({ error }) => {
    if (error) {
      // Table might not exist yet — that's ok, log locally
      addDebugEntry('warn', `Event log insert failed: ${error.message}`, { name, params });
    }
  });

  addDebugEntry('info', `Track: ${name}`, params);
}

/**
 * Track page view with session info
 */
export function trackPageView(page: string) {
  trackEvent('page_view', {
    page,
    session_id: getSessionId(),
  });
}

/**
 * Get or create a session ID for tracking
 */
function getSessionId(): string {
  let sid = sessionStorage.getItem('cf_session_id');
  if (!sid) {
    sid = `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem('cf_session_id', sid);
  }
  return sid;
}

/**
 * Performance timing report
 */
export function reportPerformance() {
  if (!window.performance) return;
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (!nav) return;

  const metrics = {
    dns: Math.round(nav.domainLookupEnd - nav.domainLookupStart),
    tcp: Math.round(nav.connectEnd - nav.connectStart),
    ttfb: Math.round(nav.responseStart - nav.requestStart),
    dom_ready: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
    load: Math.round(nav.loadEventEnd - nav.startTime),
  };

  addDebugEntry('info', 'Performance', metrics);
}
