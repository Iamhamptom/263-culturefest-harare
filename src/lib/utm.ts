export function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    source: document.referrer || 'direct',
    utm_source: params.get('utm_source') || null,
    utm_medium: params.get('utm_medium') || null,
    utm_campaign: params.get('utm_campaign') || null,
  };
}
