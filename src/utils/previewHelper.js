import { generatePortfolioCode, DEFAULT_USER_DATA } from '../services/templateEngines.js';

/**
 * Assembles a fully styled, robust, and self-contained HTML document for preview iframes.
 * Works seamlessly with full HTML documents, partial snippets, or stub comments.
 *
 * @param {string} rawHtml - HTML code
 * @param {string} rawCss - CSS code
 * @param {string} rawJs - JavaScript code
 * @param {object} options - Options { fallbackCategory, accentColor, customFont }
 * @returns {string} Fully compiled HTML string ready for srcDoc
 */
export function assemblePreviewHtml(rawHtml = '', rawCss = '', rawJs = '', options = {}) {
  let html = (rawHtml || '').trim();
  let css = (rawCss || '').trim();
  let js = (rawJs || '').trim();

  // Detect if HTML is empty, whitespace, or just an HTML comment stub (e.g., <!-- Minimal Clean Slate -->)
  const isStubOrEmpty = !html || 
    html.length < 35 || 
    (html.startsWith('<!--') && html.endsWith('-->') && !html.includes('<div') && !html.includes('<section'));

  if (isStubOrEmpty) {
    const fallbackCategory = options.fallbackCategory || 'Minimal';
    const fallbackCode = generatePortfolioCode(fallbackCategory, options.userData || DEFAULT_USER_DATA);
    html = fallbackCode.html;
    if (!css) css = fallbackCode.css;
    if (!js) js = fallbackCode.js;
  }

  // Handle custom accent color and font overrides
  if (options.accentColor) {
    css += `\n:root { --accent-primary: ${options.accentColor}; }\n`;
  }
  if (options.customFont) {
    css += `\nbody { font-family: '${options.customFont}', system-ui, -apple-system, sans-serif !important; }\n`;
  }

  // Safe storage shim, script wrapper & link interceptor so sandboxed iframes never navigate to parent app
  const safeScript = `
    <script>
      (function() {
        try {
          var memStore = {};
          var dummyStorage = {
            getItem: function(k) { return memStore[k] !== undefined ? memStore[k] : null; },
            setItem: function(k, v) { memStore[k] = String(v); },
            removeItem: function(k) { delete memStore[k]; },
            clear: function() { memStore = {}; },
            key: function(i) { return Object.keys(memStore)[i] || null; },
            get length() { return Object.keys(memStore).length; }
          };
          try {
            window.localStorage.getItem('__test');
          } catch (e) {
            Object.defineProperty(window, 'localStorage', { value: dummyStorage, configurable: true, writable: true });
          }
          try {
            window.sessionStorage.getItem('__test');
          } catch (e) {
            Object.defineProperty(window, 'sessionStorage', { value: dummyStorage, configurable: true, writable: true });
          }
        } catch (e) {}

        // Anchor & link navigation interceptor:
        // In iframe srcdoc documents, clicking hash links (e.g. #about) or placeholder links (#)
        // by default navigates the frame relative to document.baseURI (which is the parent PortfolioHub URL).
        // This interceptor prevents unwanted cross-document navigation, smoothly scrolling to the in-page section instead.
        document.addEventListener('click', function(e) {
          try {
            var el = e.target;
            while (el && el.nodeName !== 'A' && el !== document.body) {
              el = el.parentElement;
            }
            if (!el || el.nodeName !== 'A') return;

            var rawHref = el.getAttribute('href');
            if (!rawHref) return;
            var href = rawHref.trim();

            // 1. Hash & In-page Section Links (#about, #hero, #skills, #projects, #contact, #)
            if (href.charAt(0) === '#') {
              e.preventDefault();

              if (href === '#' || href === '') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
              }

              var targetId = href.slice(1);
              var targetEl = document.getElementById(targetId) || 
                             document.querySelector('[name="' + targetId + '"]') ||
                             document.querySelector(href);

              if (targetEl) {
                // Calculate sticky/fixed navbar offset
                var navbar = document.querySelector('header, nav, .navbar, #navbar');
                var navHeight = navbar ? navbar.getBoundingClientRect().height : 0;
                var targetTop = targetEl.getBoundingClientRect().top + (window.pageYOffset || window.scrollY || document.documentElement.scrollTop || 0);
                var scrollOffset = targetTop - (navHeight > 10 && navHeight < 250 ? navHeight : 70);

                window.scrollTo({
                  top: Math.max(0, scrollOffset),
                  behavior: 'smooth'
                });
              }
              return;
            }

            // 2. JavaScript protocols
            if (href.indexOf('javascript:') === 0) {
              return;
            }

            // 3. Email & Telephone links
            if (href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) {
              return;
            }

            // 4. External links
            if (href.indexOf('http://') === 0 || href.indexOf('https://') === 0 || href.indexOf('//') === 0) {
              e.preventDefault();
              window.open(href, '_blank', 'noopener,noreferrer');
              return;
            }

            // 5. Relative file links (e.g. "index.html", "/", "about.html")
            // Prevent them from attempting to navigate the iframe to the parent web app
            e.preventDefault();
          } catch (err) {
            console.warn('Navigation interceptor notice:', err);
          }
        }, true);
      })();
    </script>
    ${js ? `
    <script>
      (function() {
        try {
          ${js}
        } catch (e) {
          console.warn('Portfolio template script notice:', e);
        }
      })();
    </script>
    ` : ''}
  `;

  const hasHtml = /<html[\s>]/i.test(html);
  const hasHead = /<head[\s>]/i.test(html);
  const hasBody = /<body[\s>]/i.test(html);

  // If already a complete HTML5 document
  if (hasHtml && hasHead && hasBody) {
    let combined = html;

    // Ensure responsive viewport meta tag is present
    if (!/<meta[^>]+viewport/i.test(combined)) {
      if (combined.includes('<head>')) {
        combined = combined.replace('<head>', '<head>\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />');
      } else if (/<head[\s>]/i.test(combined)) {
        combined = combined.replace(/(<head[^>]*>)/i, '$1\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />');
      }
    }

    const responsiveSafetyCss = `
      html, body {
        max-width: 100% !important;
        overflow-x: hidden !important;
      }
      img, video, canvas {
        max-width: 100% !important;
        height: auto;
      }
      * {
        box-sizing: border-box;
      }
    `;

    if (css) {
      if (combined.includes('</head>')) {
        combined = combined.replace('</head>', `<style>\n${responsiveSafetyCss}\n${css}\n</style></head>`);
      } else {
        combined = `<style>\n${responsiveSafetyCss}\n${css}\n</style>` + combined;
      }
    } else {
      if (combined.includes('</head>')) {
        combined = combined.replace('</head>', `<style>\n${responsiveSafetyCss}\n</style></head>`);
      }
    }

    if (safeScript) {
      if (combined.includes('</body>')) {
        combined = combined.replace('</body>', `${safeScript}\n</body>`);
      } else {
        combined = combined + safeScript;
      }
    }
    return combined;
  }

  // If HTML is a body fragment or snippet without full page structure
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Portfolio Preview</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.5;
      background: #FFFFFF;
      color: #18181B;
    }
    ${css}
  </style>
</head>
<body>
  ${html}
  ${safeScript}
</body>
</html>`;
}
