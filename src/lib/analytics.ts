type EventName =
  | 'hero_cta_click'
  | 'secondary_cta_click'
  | 'rsvp_started'
  | 'rsvp_submitted'
  | 'challenge_started'
  | 'challenge_submitted'
  | 'panel_teaser_click'
  | 'faq_expand'
  | 'email_capture_success';

export function trackEvent(name: EventName, params?: Record<string, string>) {
  // GA4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', name, params);
  }

  // Meta Pixel
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('trackCustom', name, params);
  }
}
