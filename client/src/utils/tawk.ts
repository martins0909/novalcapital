// Lightweight Tawk.to loader/unloader
export function loadTawk(widgetPath: string) {
  if (!widgetPath) return;
  if (typeof window === 'undefined') return;

  // Avoid loading twice
  if ((window as any).Tawk_API) return;

  // Create script element
  const s = document.createElement('script');
  s.type = 'text/javascript';
  s.async = true;
  s.src = `https://embed.tawk.to/${widgetPath}`;
  s.charset = 'UTF-8';
  s.setAttribute('crossorigin', '*');
  s.id = 'tawk-script';
  document.head.appendChild(s);
}

export function unloadTawk() {
  if (typeof window === 'undefined') return;

  try {
    // Hide widget if API present
    if ((window as any).Tawk_API && typeof (window as any).Tawk_API.hideWidget === 'function') {
      (window as any).Tawk_API.hideWidget();
    }
  } catch (e) {
    // ignore
  }

  // Remove script element we added
  const script = document.getElementById('tawk-script');
  if (script && script.parentNode) script.parentNode.removeChild(script);

  // Remove any iframes or elements added by Tawk
  const iframes = Array.from(document.querySelectorAll('iframe'));
  for (const iframe of iframes) {
    const src = iframe.getAttribute('src') || '';
    if (src.includes('tawk.to') || src.includes('tawkcdn.com')) {
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
    }
  }

  // Remove global objects
  try {
    delete (window as any).Tawk_API;
    delete (window as any).Tawk_LoadStart;
  } catch (e) {
    // ignore
  }
}
