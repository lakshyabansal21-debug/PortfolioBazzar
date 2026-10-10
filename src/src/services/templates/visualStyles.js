// =========================================================================
// PortfolioHub AI - Visual Style Engines: Retro Arcade, Editorial, Aurora
// Featuring rich CSS transforms, smooth cubic-bezier transitions, and hover FX
// =========================================================================

export function generateRetroArcadeTemplate(data) {
  const p = data.personal;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.name} — Retro 8-Bit Arcade</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
</head>
<body>
  <div class="crt-scanlines"></div>
  <div class="arcade-container">
    <div class="arcade-cabinet">
      <header class="marquee-header">
        <div class="coin-slot">INSERT COIN [CREDIT 99]</div>
        <h1 class="arcade-title">${p.name}</h1>
        <div class="arcade-subtitle">${p.profession}</div>
        <div class="high-score-banner">★ HIGH SCORE: 999,990 ★</div>
      </header>

      <section class="pixel-box intro-box">
        <h2 class="box-title">PLAYER STATS</h2>
        <p class="pixel-text">${p.bio}</p>
        <div class="level-indicator">LEVEL: 99 ARCHITECT</div>
      </section>

      <section class="pixel-box skills-box">
        <h2 class="box-title">INVENTORY & WEAPONS</h2>
        <div class="pixel-badges">
          ${(data.skills?.technical || []).map(s => `
            <div class="pixel-chip">▶ ${s}</div>
          `).join('')}
        </div>
      </section>

      <section class="pixel-box quests-box">
        <h2 class="box-title">COMPLETED BOSS QUESTS</h2>
        <div class="quests-grid">
          ${(data.projects || []).map(proj => `
            <div class="quest-card">
              <h3>[STAGE CLEAR] ${proj.title}</h3>
              <p>${proj.description}</p>
              <div class="quest-stack">STACK: ${(proj.tags || []).join(' + ')}</div>
              <div class="quest-actions">
                ${proj.github ? `<a href="${proj.github}" target="_blank" rel="noopener noreferrer" class="pixel-btn">GIT REPO</a>` : ''}
                ${proj.live ? `<a href="${proj.live}" target="_blank" rel="noopener noreferrer" class="pixel-btn highlight">PLAY DEMO</a>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <footer class="arcade-footer">
        <div class="press-start">PRESS [CONTACT] TO CONTINUE</div>
        <a href="mailto:${data.contact?.email || 'dev@arcade.com'}" class="pixel-cta">SEND SIGNAL ✉</a>
      </footer>
    </div>
  </div>
</body>
</html>`;

  const css = `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background-color: #0d0221;
  color: #00f0ff;
  font-family: 'Press Start 2P', monospace;
  padding: 30px 16px;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.crt-scanlines {
  position: fixed;
  inset: 0;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%);
  background-size: 100% 4px;
  z-index: 99;
  pointer-events: none;
  opacity: 0.6;
}

.arcade-container {
  max-width: 900px;
  margin: 0 auto;
}

.arcade-cabinet {
  background: #19053b;
  border: 4px solid #ff007f;
  box-shadow: 0 0 25px #ff007f, 8px 8px 0px #00f0ff;
  padding: 32px 24px;
  border-radius: 4px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.arcade-cabinet:hover {
  transform: translateY(-4px);
  box-shadow: 0 0 35px #ff007f, 12px 12px 0px #00f0ff;
}

.marquee-header {
  text-align: center;
  border-bottom: 4px dashed #ff007f;
  padding-bottom: 24px;
  margin-bottom: 28px;
}

.coin-slot {
  font-size: 10px;
  color: #ffe600;
  margin-bottom: 12px;
  letter-spacing: 2px;
  animation: arcadeBlink 1.2s infinite;
}

@keyframes arcadeBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}

.arcade-title {
  font-size: clamp(1.4rem, 4vw, 2.2rem);
  color: #ffe600;
  text-shadow: 4px 4px 0px #ff007f, 8px 8px 0px #0d0221;
  margin-bottom: 12px;
  letter-spacing: -1px;
}

.arcade-subtitle {
  font-size: 11px;
  color: #00f0ff;
  line-height: 1.5;
  margin-bottom: 16px;
}

.high-score-banner {
  background: #ff007f;
  color: #fff;
  font-size: 11px;
  display: inline-block;
  padding: 6px 16px;
  box-shadow: 4px 4px 0px #00f0ff;
}

.pixel-box {
  background: #110226;
  border: 3px solid #00f0ff;
  box-shadow: 6px 6px 0px #ff007f;
  padding: 20px;
  margin-bottom: 28px;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.pixel-box:hover {
  transform: translateY(-4px);
  box-shadow: 8px 8px 0px #ffe600;
}

.box-title {
  font-size: 13px;
  color: #ffe600;
  margin-bottom: 14px;
  text-shadow: 2px 2px 0px #ff007f;
}

.pixel-text {
  font-family: 'VT323', monospace;
  font-size: 1.35rem;
  color: #e0f7fa;
  line-height: 1.4;
  margin-bottom: 14px;
}

.level-indicator {
  font-size: 10px;
  color: #ff007f;
}

.pixel-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pixel-chip {
  background: #0d0221;
  border: 2px solid #ff007f;
  color: #fff;
  font-size: 10px;
  padding: 8px 12px;
  box-shadow: 3px 3px 0px #00f0ff;
  transition: all 0.2s ease;
}

.pixel-chip:hover {
  background: #ff007f;
  color: #ffe600;
  transform: translateY(-3px) scale(1.05);
  box-shadow: 4px 4px 0px #ffe600;
}

.quests-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.quest-card {
  background: #1a033b;
  border: 2px solid #ffe600;
  padding: 16px;
  box-shadow: 4px 4px 0px #00f0ff;
  transition: all 0.25s ease;
}

.quest-card:hover {
  transform: translateX(6px) translateY(-3px);
  box-shadow: 8px 8px 0px #ff007f;
}

.quest-card h3 {
  font-size: 12px;
  color: #ffe600;
  margin-bottom: 10px;
}

.quest-card p {
  font-family: 'VT323', monospace;
  font-size: 1.25rem;
  color: #c7f9cc;
  margin-bottom: 10px;
  line-height: 1.3;
}

.quest-stack {
  font-size: 9px;
  color: #ff007f;
  margin-bottom: 14px;
}

.quest-actions {
  display: flex;
  gap: 12px;
}

.pixel-btn {
  font-size: 10px;
  padding: 8px 14px;
  background: #00f0ff;
  color: #0d0221;
  text-decoration: none;
  font-weight: 700;
  box-shadow: 3px 3px 0px #ff007f;
  transition: all 0.2s ease;
  display: inline-block;
}

.pixel-btn:hover {
  background: #ffe600;
  transform: translateY(-2px);
  box-shadow: 5px 5px 0px #ff007f;
}

.pixel-btn.highlight {
  background: #ff007f;
  color: #fff;
}

.pixel-btn.highlight:hover {
  background: #ffe600;
  color: #0d0221;
}

.arcade-footer {
  text-align: center;
  padding-top: 10px;
}

.press-start {
  font-size: 10px;
  color: #00f0ff;
  margin-bottom: 16px;
  animation: arcadeBlink 1s infinite;
}

.pixel-cta {
  display: inline-block;
  padding: 12px 24px;
  background: #ffe600;
  color: #0d0221;
  font-size: 11px;
  text-decoration: none;
  font-weight: bold;
  border: 3px solid #ff007f;
  box-shadow: 5px 5px 0px #00f0ff;
  transition: all 0.2s ease;
}

.pixel-cta:hover {
  background: #00f0ff;
  color: #0d0221;
  transform: translateY(-3px) scale(1.03);
  box-shadow: 8px 8px 0px #ff007f;
}
`;

  const js = `// Arcade audio beep synthesizer on click
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function playBeep(freq = 440) {
  try {
    if (!audioCtx) audioCtx = new AudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
  } catch(e) {}
}

document.querySelectorAll('.pixel-btn, .pixel-chip, .pixel-cta').forEach(el => {
  el.addEventListener('mouseenter', () => playBeep(520));
  el.addEventListener('click', () => playBeep(880));
});`;

  return { html, css, js };
}

export function generateEditorialTemplate(data) {
  const p = data.personal;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.name} — Editorial Monograph</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,800;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
</head>
<body>
  <div class="paper-container">
    <header class="issue-header">
      <div class="issue-meta">
        <span>VOL. 04 / ISSUE 09</span>
        <span>FOLIO ARCHIVE</span>
        <span>EDITION 2025</span>
      </div>
      <div class="headline-wrap">
        <h1 class="main-headline">${p.name}</h1>
        <p class="sub-headline">${p.profession}</p>
      </div>
    </header>

    <div class="hero-split">
      <div class="lead-column">
        <p class="dropcap-lead">${p.about || p.bio}</p>
        <div class="pull-quote">
          "${p.bio}"
        </div>
      </div>
      <div class="portrait-column">
        <div class="portrait-frame">
          <img src="${p.avatar}" alt="${p.name}" class="portrait-img" />
          <div class="caption">PORTRAIT / ${p.name.toUpperCase()}</div>
        </div>
      </div>
    </div>

    <section class="editorial-section">
      <div class="section-rule"><span>INDEX OF RECENT WORKS</span></div>
      <div class="editorial-projects">
        ${(data.projects || []).map((proj, idx) => `
          <article class="editorial-row">
            <div class="row-index">N° 0${idx + 1}</div>
            <div class="row-details">
              <h3 class="row-title">${proj.title}</h3>
              <p class="row-desc">${proj.description}</p>
              <div class="row-tags">${(proj.tags || []).join(' &nbsp;·&nbsp; ')}</div>
            </div>
            <div class="row-actions">
              ${proj.github ? `<a href="${proj.github}" target="_blank" rel="noopener noreferrer" class="editorial-link">Source ↗</a>` : ''}
              ${proj.live ? `<a href="${proj.live}" target="_blank" rel="noopener noreferrer" class="editorial-link">Exhibit ↗</a>` : ''}
            </div>
          </article>
        `).join('')}
      </div>
    </section>

    <section class="editorial-section">
      <div class="section-rule"><span>DISCIPLINE & EXPERTISE</span></div>
      <div class="columns-skills">
        ${(data.skills?.technical || []).map(s => `
          <div class="skill-entry">
            <span class="skill-name">${s}</span>
            <span class="skill-line"></span>
          </div>
        `).join('')}
      </div>
    </section>

    <footer class="editorial-footer">
      <div class="colophon">
        <h4>COLOPHON</h4>
        <p>Inquiries and commissions: <a href="mailto:${data.contact?.email || 'studio@example.com'}">${data.contact?.email || 'studio@example.com'}</a></p>
      </div>
    </footer>
  </div>
</body>
</html>`;

  const css = `* { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --ink: #111111;
  --paper: #faf8f5;
  --accent: #b45309;
  --border: #e2ded7;
  --muted: #666059;
}

body {
  background-color: var(--paper);
  color: var(--ink);
  font-family: 'Inter', sans-serif;
  padding: 48px 20px;
  line-height: 1.7;
}

.paper-container {
  max-width: 980px;
  margin: 0 auto;
}

.issue-header {
  border-bottom: 2px solid var(--ink);
  padding-bottom: 24px;
  margin-bottom: 40px;
}

.issue-meta {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  letter-spacing: 0.15em;
  font-weight: 600;
  border-bottom: 1px solid var(--border);
  padding-bottom: 10px;
  margin-bottom: 28px;
  color: var(--muted);
}

.main-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(2.8rem, 6vw, 4.8rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.05;
}

.sub-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-style: italic;
  font-size: 1.35rem;
  color: var(--accent);
  margin-top: 8px;
}

.hero-split {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 48px;
  margin-bottom: 56px;
}

.dropcap-lead {
  font-size: 1.15rem;
  color: #262626;
  margin-bottom: 24px;
}

.dropcap-lead::first-letter {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 3.8rem;
  float: left;
  line-height: 0.8;
  margin-right: 12px;
  font-weight: 800;
  color: var(--ink);
}

.pull-quote {
  border-left: 2px solid var(--accent);
  padding-left: 20px;
  font-family: 'Playfair Display', Georgia, serif;
  font-style: italic;
  font-size: 1.2rem;
  color: var(--muted);
  line-height: 1.5;
}

.portrait-frame {
  background: #fff;
  padding: 12px;
  border: 1px solid var(--border);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
}

.portrait-frame:hover {
  transform: translateY(-6px) rotate(-1deg);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.portrait-img {
  width: 100%;
  height: 280px;
  object-fit: cover;
  filter: grayscale(80%);
  transition: filter 0.4s ease;
}

.portrait-frame:hover .portrait-img {
  filter: grayscale(0%);
}

.caption {
  font-size: 10px;
  letter-spacing: 0.1em;
  font-weight: 600;
  color: var(--muted);
  margin-top: 8px;
  text-align: center;
}

.editorial-section {
  margin-bottom: 56px;
}

.section-rule {
  display: flex;
  align-items: center;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: var(--muted);
  margin-bottom: 24px;
}

.section-rule::after {
  content: '';
  flex-grow: 1;
  height: 1px;
  background: var(--border);
  margin-left: 16px;
}

.editorial-row {
  display: grid;
  grid-template-columns: 80px 1fr 140px;
  align-items: baseline;
  padding: 24px 0;
  border-bottom: 1px solid var(--border);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.editorial-row:hover {
  padding-left: 12px;
  background: rgba(180, 83, 9, 0.03);
  border-color: var(--accent);
}

.row-index {
  font-family: 'Playfair Display', Georgia, serif;
  font-style: italic;
  color: var(--accent);
  font-size: 1.1rem;
}

.row-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 6px;
}

.row-desc {
  font-size: 0.95rem;
  color: var(--muted);
  margin-bottom: 8px;
}

.row-tags {
  font-size: 11px;
  font-weight: 500;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.row-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.editorial-link {
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  color: var(--ink);
  position: relative;
  transition: color 0.2s ease;
}

.editorial-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 0%;
  height: 1px;
  background: var(--accent);
  transition: width 0.3s ease;
}

.editorial-link:hover {
  color: var(--accent);
}

.editorial-link:hover::after {
  width: 100%;
}

.columns-skills {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px 32px;
}

.skill-entry {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--border);
  font-size: 13px;
  font-weight: 500;
  transition: transform 0.2s ease, color 0.2s ease;
}

.skill-entry:hover {
  transform: translateX(6px);
  color: var(--accent);
}

.editorial-footer {
  border-top: 2px solid var(--ink);
  padding-top: 28px;
}

.colophon h4 {
  font-size: 11px;
  letter-spacing: 0.15em;
  font-weight: 700;
  margin-bottom: 6px;
}

.colophon p {
  font-size: 13px;
  color: var(--muted);
}

.colophon a {
  color: var(--ink);
  font-weight: 600;
}

@media (max-width: 768px) {
  .hero-split { grid-template-columns: 1fr; }
  .editorial-row { grid-template-columns: 1fr; gap: 12px; }
  .row-actions { justify-content: flex-start; }
}
`;

  return { html, css, js: '' };
}

export function generateAuroraTemplate(data) {
  const p = data.personal;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.name} — Aurora Borealis</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
  <div class="aurora-glow-canvas"></div>
  <div class="aurora-wrapper">
    <header class="aurora-hero">
      <div class="hero-chip"><span>✨</span> ILLUMINATED PORTFOLIO</div>
      <h1 class="aurora-name">${p.name}</h1>
      <p class="aurora-tagline">${p.profession}</p>
      <p class="aurora-desc">${p.bio}</p>
      <div class="aurora-buttons">
        <a href="#showcase" class="aurora-btn-glow">Explore Works</a>
        <a href="mailto:${data.contact?.email || 'hello@example.com'}" class="aurora-btn-glass">Get in Touch</a>
      </div>
    </header>

    <section id="showcase" class="aurora-showcase">
      <h2 class="aurora-section-title">Selected Projects</h2>
      <div class="aurora-grid">
        ${(data.projects || []).map(proj => `
          <div class="aurora-card">
            <div class="card-border-glow"></div>
            <div class="card-content">
              ${proj.image ? `<img src="${proj.image}" alt="${proj.title}" class="aurora-img"/>` : ''}
              <h3>${proj.title}</h3>
              <p>${proj.description}</p>
              <div class="aurora-tags">
                ${(proj.tags || []).map(t => `<span>${t}</span>`).join('')}
              </div>
              <div class="aurora-links">
                ${proj.github ? `<a href="${proj.github}" target="_blank" rel="noopener noreferrer">Code ↗</a>` : ''}
                ${proj.live ? `<a href="${proj.live}" target="_blank" rel="noopener noreferrer" class="live-link">Demo ↗</a>` : ''}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <section class="aurora-skills">
      <h2 class="aurora-section-title">Technology Aura</h2>
      <div class="skills-cluster">
        ${(data.skills?.technical || []).map(s => `
          <span class="skill-orb">${s}</span>
        `).join('')}
      </div>
    </section>
  </div>
  <script src="script.js"></script>
</body>
</html>`;

  const css = `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background-color: #05060b;
  color: #f8fafc;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  min-height: 100vh;
  padding: 40px 20px;
  line-height: 1.6;
  position: relative;
  overflow-x: hidden;
}

.aurora-glow-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.3), transparent),
    radial-gradient(ellipse 60% 40% at 20% 30%, rgba(56, 189, 248, 0.25), transparent),
    radial-gradient(ellipse 70% 50% at 80% 40%, rgba(168, 85, 247, 0.25), transparent),
    radial-gradient(ellipse 60% 50% at 50% 80%, rgba(34, 197, 94, 0.15), transparent);
  filter: blur(80px);
  z-index: -1;
  animation: auroraFlow 15s ease infinite alternate;
}

@keyframes auroraFlow {
  0% { transform: scale(1) translateY(0); }
  50% { transform: scale(1.1) translateY(-20px); }
  100% { transform: scale(1) translateY(10px); }
}

.aurora-wrapper {
  max-width: 960px;
  margin: 0 auto;
}

.aurora-hero {
  text-align: center;
  padding: 60px 0 80px;
}

.hero-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 100px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin-bottom: 24px;
  backdrop-filter: blur(8px);
}

.aurora-name {
  font-size: clamp(2.5rem, 6vw, 4.2rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, #ffffff 0%, #38bdf8 50%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 12px;
}

.aurora-tagline {
  font-size: 1.25rem;
  color: #94a3b8;
  font-weight: 500;
  margin-bottom: 16px;
}

.aurora-desc {
  font-size: 1rem;
  color: #cbd5e1;
  max-width: 620px;
  margin: 0 auto 32px;
}

.aurora-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.aurora-btn-glow {
  padding: 12px 28px;
  background: linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%);
  color: #fff;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 14px;
  box-shadow: 0 0 25px rgba(56, 189, 248, 0.4);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.aurora-btn-glow:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 0 40px rgba(129, 140, 248, 0.6);
}

.aurora-btn-glass {
  padding: 12px 28px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.aurora-btn-glass:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.aurora-showcase {
  margin-bottom: 60px;
}

.aurora-section-title {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 28px;
  text-align: center;
}

.aurora-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.aurora-card {
  position: relative;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease;
  overflow: hidden;
}

.aurora-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(56, 189, 248, 0.4);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5), 0 0 30px rgba(56, 189, 248, 0.2);
}

.aurora-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 16px;
}

.aurora-card h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.aurora-card p {
  font-size: 0.9rem;
  color: #94a3b8;
  margin-bottom: 16px;
  line-height: 1.5;
}

.aurora-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.aurora-tags span {
  font-size: 11px;
  background: rgba(56, 189, 248, 0.1);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.2);
  padding: 4px 10px;
  border-radius: 8px;
}

.aurora-links {
  display: flex;
  gap: 14px;
}

.aurora-links a {
  color: #94a3b8;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  transition: color 0.2s ease;
}

.aurora-links a:hover {
  color: #38bdf8;
}

.aurora-links .live-link {
  color: #38bdf8;
}

.aurora-skills {
  text-align: center;
}

.skills-cluster {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  max-width: 700px;
  margin: 0 auto;
}

.skill-orb {
  padding: 8px 18px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 100px;
  font-size: 13px;
  font-weight: 500;
  backdrop-filter: blur(8px);
  transition: all 0.25s ease;
}

.skill-orb:hover {
  background: rgba(56, 189, 248, 0.15);
  border-color: #38bdf8;
  color: #fff;
  transform: translateY(-3px) scale(1.06);
  box-shadow: 0 0 15px rgba(56, 189, 248, 0.3);
}
`;

  const js = `// Tilt hover micro-interaction for cards
document.querySelectorAll('.aurora-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = \`translateY(-8px) scale(1.02) rotateY(\${x / 20}deg) rotateX(\${-y / 20}deg)\`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});`;

  return { html, css, js };
}
