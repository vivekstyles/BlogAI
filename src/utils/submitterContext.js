const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

function safe(read, fallback = null) {
  try {
    const value = read();
    return value === undefined ? fallback : value;
  } catch {
    return fallback;
  }
}

/**
 * Collects the browser context available to the page at submission time so
 * moderators can spot spam and duplicate submissions. Uses only standard,
 * low-entropy browser properties: no canvas/WebGL/audio fingerprinting, no
 * permission prompts, and no third-party lookups. The submitter's IP address
 * is not readable from the browser; the submission endpoint sees it from the
 * request itself.
 */
export function collectSubmitterContext({ formStartedAt } = {}) {
  if (typeof window === 'undefined') return {};

  const nav = window.navigator || {};
  const params = safe(() => new URLSearchParams(window.location.search), new URLSearchParams());
  const utm = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }

  const uaData = nav.userAgentData;

  return {
    page: safe(() => window.location.origin + window.location.pathname),
    referrer: safe(() => document.referrer) || '',
    utm,
    userAgent: nav.userAgent || '',
    uaBrands: safe(() => (uaData ? uaData.brands.map((b) => `${b.brand} ${b.version}`) : []), []),
    platform: safe(() => (uaData && uaData.platform) || nav.platform || ''),
    mobile: safe(() => (uaData ? uaData.mobile : null)),
    language: nav.language || '',
    languages: safe(() => Array.from(nav.languages || []), []),
    timeZone: safe(() => Intl.DateTimeFormat().resolvedOptions().timeZone) || '',
    timezoneOffsetMinutes: new Date().getTimezoneOffset(),
    screen: safe(() => ({ width: window.screen.width, height: window.screen.height })),
    viewport: safe(() => ({ width: window.innerWidth, height: window.innerHeight })),
    devicePixelRatio: safe(() => window.devicePixelRatio),
    prefersDarkScheme: safe(() => window.matchMedia('(prefers-color-scheme: dark)').matches),
    connectionType: safe(() => (nav.connection ? nav.connection.effectiveType : null)),
    cookiesEnabled: safe(() => nav.cookieEnabled),
    doNotTrack: safe(() => nav.doNotTrack === '1' || window.doNotTrack === '1', false),
    globalPrivacyControl: safe(() => nav.globalPrivacyControl === true, false),
    formDurationSeconds:
      typeof formStartedAt === 'number' ? Math.round((Date.now() - formStartedAt) / 1000) : null,
  };
}
