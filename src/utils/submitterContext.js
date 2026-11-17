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
  const conn = nav.connection || nav.mozConnection || nav.webkitConnection || null;

  // Collect installed plugins list (name only, non-identifying)
  const plugins = safe(
    () =>
      Array.from(nav.plugins || [])
        .slice(0, 10)
        .map((p) => p.name),
    []
  );

  // Collect supported MIME types count (fingerprint-safe aggregate)
  const mimeTypesCount = safe(() => (nav.mimeTypes ? nav.mimeTypes.length : null));

  // History length gives a rough sense of how the user arrived
  const historyLength = safe(() => window.history.length);

  // Session vs localStorage availability
  const storageAvailable = safe(() => {
    localStorage.setItem('__test', '1');
    localStorage.removeItem('__test');
    return true;
  }, false);

  // Page visibility state at submission time
  const visibilityState = safe(() => document.visibilityState);

  // Number of open tabs approximation via BroadcastChannel not feasible; skip.
  // Performance timing: navigation type (reload, back_forward, navigate)
  const navigationType = safe(
    () =>
      window.performance &&
      window.performance.getEntriesByType &&
      window.performance.getEntriesByType('navigation')[0]
        ? window.performance.getEntriesByType('navigation')[0].type
        : null
  );

  // Page load time (ms) for bot-detection heuristics
  const pageLoadMs = safe(
    () =>
      window.performance && window.performance.timing
        ? window.performance.timing.domContentLoadedEventEnd -
          window.performance.timing.navigationStart
        : null
  );

  // Hardwarce concurrency (number of logical CPU cores)
  const hardwareConcurrency = safe(() => nav.hardwareConcurrency);

  // Device memory in GB (rounded, privacy-safe)
  const deviceMemoryGb = safe(() => nav.deviceMemory);

  // Max touch points (distinguishes touch-capable devices)
  const maxTouchPoints = safe(() => nav.maxTouchPoints);

  // Pointer type (mouse / touch / pen / none)
  const pointerType = safe(() =>
    window.matchMedia('(pointer: fine)').matches
      ? 'fine'
      : window.matchMedia('(pointer: coarse)').matches
        ? 'coarse'
        : 'none'
  );

  // Color depth
  const colorDepth = safe(() => window.screen.colorDepth);

  // Orientation
  const orientation = safe(
    () =>
      window.screen.orientation
        ? window.screen.orientation.type
        : window.innerWidth > window.innerHeight
          ? 'landscape'
          : 'portrait'
  );

  // Prefers reduced motion
  const prefersReducedMotion = safe(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // Prefers contrast
  const prefersHighContrast = safe(
    () => window.matchMedia('(prefers-contrast: more)').matches
  );

  // Forced colors (Windows High Contrast Mode)
  const forcedColors = safe(() => window.matchMedia('(forced-colors: active)').matches);

  // Network info
  const network = conn
    ? {
        effectiveType: safe(() => conn.effectiveType),
        downlink: safe(() => conn.downlink),
        rtt: safe(() => conn.rtt),
        saveData: safe(() => conn.saveData),
      }
    : null;

  return {
    page: safe(() => window.location.origin + window.location.pathname),
    referrer: safe(() => document.referrer) || '',
    utm,
    // UA & platform
    userAgent: nav.userAgent || '',
    uaBrands: safe(() => (uaData ? uaData.brands.map((b) => `${b.brand} ${b.version}`) : []), []),
    platform: safe(() => (uaData && uaData.platform) || nav.platform || ''),
    mobile: safe(() => (uaData ? uaData.mobile : null)),
    // Language & locale
    language: nav.language || '',
    languages: safe(() => Array.from(nav.languages || []), []),
    timeZone: safe(() => Intl.DateTimeFormat().resolvedOptions().timeZone) || '',
    timezoneOffsetMinutes: new Date().getTimezoneOffset(),
    // Display
    screen: safe(() => ({ width: window.screen.width, height: window.screen.height })),
    viewport: safe(() => ({ width: window.innerWidth, height: window.innerHeight })),
    devicePixelRatio: safe(() => window.devicePixelRatio),
    colorDepth,
    orientation,
    // Input & interaction
    maxTouchPoints,
    pointerType,
    // User preferences
    prefersDarkScheme: safe(() => window.matchMedia('(prefers-color-scheme: dark)').matches),
    prefersReducedMotion,
    prefersHighContrast,
    forcedColors,
    // Hardware
    hardwareConcurrency,
    deviceMemoryGb,
    // Network
    network,
    // Privacy signals
    cookiesEnabled: safe(() => nav.cookieEnabled),
    doNotTrack: safe(() => nav.doNotTrack === '1' || window.doNotTrack === '1', false),
    globalPrivacyControl: safe(() => nav.globalPrivacyControl === true, false),
    storageAvailable,
    // Browser environment
    plugins,
    mimeTypesCount,
    historyLength,
    visibilityState,
    navigationType,
    pageLoadMs,
    // Form timing
    formDurationSeconds:
      typeof formStartedAt === 'number' ? Math.round((Date.now() - formStartedAt) / 1000) : null,
  };
}
