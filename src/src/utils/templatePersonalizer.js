import { suggestFields, replaceInHtml } from './editableFields.js';

/**
 * Utility for detecting, extracting, and personalizing information (Name, Title, Bio, Email, Socials)
 * inside any uploaded or custom HTML/CSS portfolio template.
 */

/**
 * Derives uppercase initials from a full name (e.g. "Lakshya Bansal" -> "LB")
 */
export function getInitials(name) {
  if (!name || typeof name !== 'string') return 'ME';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Reads name / role / bio / email / socials from the page structure (DOM),
 * so it works even when the template uses unusual class names.
 */
function profileFromDom(html) {
  if (typeof DOMParser === 'undefined') return {};
  try {
    const byId = Object.fromEntries(suggestFields(html).map((f) => [f.id, f.old]));
    return {
      name: byId.name,
      title: byId.headline,
      bio: byId.bio,
      email: byId.email,
      github: byId.github,
      linkedin: byId.linkedin,
      twitter: byId.twitter
    };
  } catch {
    return {};
  }
}

/**
 * Extracts currently present profile information from template HTML
 */
export function extractProfileFromHtml(html, fallback = {}) {
  if (!html || typeof html !== 'string') {
    return {
      name: fallback.name || fallback.creator_name || 'Your Name',
      title: fallback.title || 'Creative Developer & Software Engineer',
      bio: fallback.bio || '',
      email: fallback.email || '',
      github: fallback.github || '',
      linkedin: fallback.linkedin || '',
      twitter: fallback.twitter || '',
      initials: 'YN'
    };
  }

  // 1. Name detection
  let name = '';
  const namePatterns = [
    /Hi,\s*I'm\s*<span[^>]*>([^<]+)<\/span>/i,
    /Hello,\s*I'm\s*<span[^>]*>([^<]+)<\/span>/i,
    /<span class=["'][^"']*highlight[^"']*["']>([^<]+)<\/span>/i,
    /<h1[^>]*class=["'][^"']*(?:name|hero-name|author)[^"']*["'][^>]*>([^<]+)<\/h1>/i,
    /<h1[^>]*>.*?Hi,\s*I'm\s+([A-Za-z0-9\s.]+?)<\/h1>/i,
    /<a[^>]*class=["'][^"']*logo[^"']*["'][^>]*>([A-Za-z0-9\s]+?)(?:<span>\.?<\/span>)?<\/a>/i
  ];

  for (const pat of namePatterns) {
    const m = html.match(pat);
    if (m && m[1] && m[1].trim().length > 1 && !m[1].toLowerCase().includes('portfolio')) {
      name = m[1].trim();
      break;
    }
  }

  const dom = profileFromDom(html);
  if (!name) name = dom.name || '';

  if (!name) {
    name = fallback.name || fallback.creator_name || 'Your Name';
  }

  // 2. Subtitle / Headline / Role
  let title = '';
  const titlePatterns = [
    /<p class=["'][^"']*(?:hero-subtitle|subtitle|hero-desc|lead)[^"']*["']>([^<]+)<\/p>/i,
    /<span class=["'][^"']*(?:role|designation|tagline)[^"']*["']>([^<]+)<\/span>/i,
    /<h2 class=["'][^"']*(?:hero-role|role)[^"']*["']>([^<]+)<\/h2>/i
  ];

  for (const pat of titlePatterns) {
    const m = html.match(pat);
    if (m && m[1] && m[1].trim().length > 3) {
      title = m[1].trim();
      break;
    }
  }

  if (!title) title = dom.title || '';

  if (!title) {
    title = fallback.title || 'Creative Developer & Software Engineer';
  }

  // 3. Bio / About
  let bio = '';
  const bioPatterns = [
    /<div class=["'][^"']*about-text[^"']*["'][^>]*>\s*<p>([^<]+)<\/p>/i,
    /<p class=["'][^"']*about-description[^"']*["']>([^<]+)<\/p>/i,
    /<section[^>]*id=["']about["'][^>]*>[\s\S]*?<p[^>]*>([^<]{30,})<\/p>/i
  ];

  for (const pat of bioPatterns) {
    const m = html.match(pat);
    if (m && m[1] && m[1].trim().length > 20) {
      bio = m[1].trim();
      break;
    }
  }

  if (!bio) bio = dom.bio || '';

  if (!bio) {
    bio = fallback.bio || '';
  }

  // 4. Email
  let email = '';
  const emailMatch = html.match(/mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
  if (emailMatch && emailMatch[1]) {
    email = emailMatch[1].trim();
  }

  // 5. Social URLs
  let github = '';
  const ghMatch = html.match(/href=["'](https?:\/\/(?:www\.)?github\.com\/[a-zA-Z0-9_-]+)["']/i);
  if (ghMatch) github = ghMatch[1];

  let linkedin = '';
  const liMatch = html.match(/href=["'](https?:\/\/(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+)["']/i);
  if (liMatch) linkedin = liMatch[1];

  let twitter = '';
  const twMatch = html.match(/href=["'](https?:\/\/(?:www\.)?(?:twitter|x)\.com\/[a-zA-Z0-9_]+)["']/i);
  if (twMatch) twitter = twMatch[1];

  return {
    name,
    title,
    bio,
    email: email || dom.email || fallback.email || '',
    github: github || dom.github || fallback.github || '',
    linkedin: linkedin || dom.linkedin || fallback.linkedin || '',
    twitter: twitter || dom.twitter || fallback.twitter || '',
    initials: getInitials(name)
  };
}

/**
 * Injects new personal details into HTML code, replacing old detected values
 */
function personalizeHtmlLegacy(html, {
  oldProfile = {},
  newProfile = {}
}) {
  if (!html || typeof html !== 'string') return html;

  let result = html;

  const oldName = oldProfile.name?.trim();
  const newName = newProfile.name?.trim();

  // 1. Replace Name if provided and changed
  if (newName && oldName && oldName !== newName) {
    // Escape regex special chars in old name
    const escOld = oldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const nameRegex = new RegExp(escOld, 'g');
    result = result.replace(nameRegex, newName);

    // Also update initials if old initials were present
    const oldInitials = getInitials(oldName);
    const newInitials = getInitials(newName);
    if (oldInitials && newInitials && oldInitials !== newInitials) {
      // Look for avatar initials: e.g. <div class="placeholder-avatar">GB</div>
      result = result.replace(
        new RegExp(`(<(?:div|span|p)[^>]*class=["'][^"']*avatar[^"']*["'][^>]*>)\\s*${oldInitials}\\s*(<\\/)`, 'gi'),
        `$1${newInitials}$2`
      );
    }

    // Update <title>
    result = result.replace(
      /<title>([\s\S]*?)<\/title>/i,
      (match, p1) => {
        if (p1.includes(oldName)) {
          return `<title>${p1.replace(new RegExp(escOld, 'g'), newName)}</title>`;
        }
        return `<title>${newName} | Creative Developer Portfolio</title>`;
      }
    );
  } else if (newName && (!oldName || !result.includes(oldName))) {
    // If old name couldn't be matched directly, replace standard placeholders
    const placeholders = [
      /<span class=["'][^"']*highlight[^"']*["']>([^<]+)<\/span>/i,
      /Hi,\s*I'm\s*<span[^>]*>([^<]+)<\/span>/i,
      /<h1[^>]*class=["'][^"']*(?:name|hero-name)[^"']*["'][^>]*>([^<]+)<\/h1>/i
    ];
    for (const pat of placeholders) {
      if (pat.test(result)) {
        result = result.replace(pat, (m, oldVal) => m.replace(oldVal, newName));
        break;
      }
    }
  }

  // 2. Replace Subtitle / Role if provided and changed
  const oldTitle = oldProfile.title?.trim();
  const newTitle = newProfile.title?.trim();
  if (newTitle && oldTitle && oldTitle !== newTitle && result.includes(oldTitle)) {
    const escOldTitle = oldTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replace(new RegExp(escOldTitle, 'g'), newTitle);
  } else if (newTitle && (!oldTitle || !result.includes(oldTitle))) {
    const subtitleRegex = /(<p class=["'][^"']*(?:hero-subtitle|subtitle|hero-desc)[^"']*["']>)([\s\S]*?)(<\/p>)/i;
    if (subtitleRegex.test(result)) {
      result = result.replace(subtitleRegex, `$1${newTitle}$3`);
    }
  }

  // 3. Replace Bio if provided
  const oldBio = oldProfile.bio?.trim();
  const newBio = newProfile.bio?.trim();
  if (newBio && oldBio && oldBio !== newBio && result.includes(oldBio)) {
    const escOldBio = oldBio.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replace(new RegExp(escOldBio, 'g'), newBio);
  } else if (newBio) {
    const bioRegex = /(<div class=["'][^"']*about-text[^"']*["'][^>]*>\s*<p>)([\s\S]*?)(<\/p>)/i;
    if (bioRegex.test(result)) {
      result = result.replace(bioRegex, `$1${newBio}$3`);
    }
  }

  // 4. Replace Email if provided
  const newEmail = newProfile.email?.trim();
  if (newEmail) {
    result = result.replace(/mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi, `mailto:${newEmail}`);
    if (oldProfile.email && oldProfile.email !== newEmail) {
      const escOldEmail = oldProfile.email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      result = result.replace(new RegExp(escOldEmail, 'g'), newEmail);
    }
  }

  // 5. Replace Social Links if provided
  if (newProfile.github && newProfile.github.trim()) {
    result = result.replace(
      /(<a[^>]*href=["'])https?:\/\/(?:www\.)?github\.com\/[^"']*?(["'][^>]*>(?:[\s\S]*?fa-github|[\s\S]*?GitHub))/gi,
      `$1${newProfile.github.trim()}$2`
    );
    // Generic replacement for href="#" or aria-label="GitHub"
    result = result.replace(
      /(<a[^>]*href=["'])#[^"']*?(["'][^>]*aria-label=["']GitHub["'])/gi,
      `$1${newProfile.github.trim()}$2`
    );
  }

  if (newProfile.linkedin && newProfile.linkedin.trim()) {
    result = result.replace(
      /(<a[^>]*href=["'])https?:\/\/(?:www\.)?linkedin\.com\/[^"']*?(["'][^>]*>(?:[\s\S]*?fa-linkedin|[\s\S]*?LinkedIn))/gi,
      `$1${newProfile.linkedin.trim()}$2`
    );
    result = result.replace(
      /(<a[^>]*href=["'])#[^"']*?(["'][^>]*aria-label=["']LinkedIn["'])/gi,
      `$1${newProfile.linkedin.trim()}$2`
    );
  }

  if (newProfile.twitter && newProfile.twitter.trim()) {
    result = result.replace(
      /(<a[^>]*href=["'])https?:\/\/(?:www\.)?(?:twitter|x)\.com\/[^"']*?(["'][^>]*>(?:[\s\S]*?fa-x-twitter|[\s\S]*?fa-twitter|[\s\S]*?Twitter))/gi,
      `$1${newProfile.twitter.trim()}$2`
    );
    result = result.replace(
      /(<a[^>]*href=["'])#[^"']*?(["'][^>]*aria-label=["'](?:Twitter|X)["'])/gi,
      `$1${newProfile.twitter.trim()}$2`
    );
  }

  return result;
}

/**
 * Injects new personal details into the HTML.
 * Replaces only visible text (and link/email attributes that match), never class names
 * or other attributes. Anything the DOM pass cannot find falls back to the older
 * pattern-based replacement.
 */
export function personalizeHtml(html, { oldProfile = {}, newProfile = {} }) {
  if (!html || typeof html !== 'string') return html;
  if (typeof DOMParser === 'undefined') return personalizeHtmlLegacy(html, { oldProfile, newProfile });

  const spec = [
    { id: 'name', type: 'text' },
    { id: 'title', type: 'text' },
    { id: 'bio', type: 'text' },
    { id: 'email', type: 'email' },
    { id: 'github', type: 'link' },
    { id: 'linkedin', type: 'link' },
    { id: 'twitter', type: 'link' }
  ];
  const defs = spec
    .filter((f) => (oldProfile[f.id] || '').trim())
    .map((f) => ({ ...f, label: f.id, old: oldProfile[f.id].trim() }));
  const values = Object.fromEntries(spec.map((f) => [f.id, newProfile[f.id] || '']));

  const r = replaceInHtml(html, defs, values);
  let result = r.html;

  // Avatar initials (e.g. <div class="avatar">AR</div>)
  const oldName = oldProfile.name?.trim();
  const newName = newProfile.name?.trim();
  if (r.applied.includes('name') && oldName && newName) {
    const oi = getInitials(oldName);
    const ni = getInitials(newName);
    if (oi !== ni) {
      result = result.replace(
        new RegExp(`(<(?:div|span|p)[^>]*class=["'][^"']*avatar[^"']*["'][^>]*>)\\s*${oi}\\s*(<\\/)`, 'gi'),
        `$1${ni}$2`
      );
    }
  }

  // Fields the DOM pass could not locate: try the older pattern-based approach for just those
  const unresolved = spec.filter((f) => {
    const wanted = (newProfile[f.id] || '').trim();
    return wanted && wanted !== (oldProfile[f.id] || '').trim() && !r.applied.includes(f.id);
  });
  if (unresolved.length > 0) {
    const only = Object.fromEntries(unresolved.map((f) => [f.id, newProfile[f.id]]));
    result = personalizeHtmlLegacy(result, { oldProfile, newProfile: only });
  }
  return result;
}
