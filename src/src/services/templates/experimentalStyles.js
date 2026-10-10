// =========================================================================
// PortfolioHub AI - Experimental Styles: Blueprint, Kinetic, Card Deck
// Featuring rich CSS transforms, smooth cubic-bezier transitions, and hover FX
// =========================================================================

export function generateBlueprintTemplate(data) {
  const p = data.personal;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.name} — Blueprint Schematic</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <div class="blueprint-grid-bg"></div>
  <div class="blueprint-frame">
    <div class="drawing-border">
      <header class="schematic-header">
        <div class="schematic-title-block">
          <div class="spec-id">DWG NO: ARCH-2025-01 // REV. C</div>
          <h1 class="dwg-title">${p.name}</h1>
          <div class="dwg-sub">${p.profession}</div>
        </div>
        <div class="stamp-box">
          <div class="stamp-inner">CERTIFIED<br>ENGINEER</div>
        </div>
      </header>

      <div class="dimension-line">
        <span class="dim-tick left"></span>
        <span class="dim-label">SPECIFICATION OVERVIEW — SCALE 1:1</span>
        <span class="dim-tick right"></span>
      </div>

      <section class="schematic-section">
        <div class="tech-callout">
          <span class="callout-num">01.0</span>
          <h3>DESIGN PHILOSOPHY</h3>
          <p>${p.about || p.bio}</p>
        </div>
      </section>

      <section class="schematic-section">
        <div class="section-badge">SYSTEM SUBSYSTEMS [PROJECTS]</div>
        <div class="schematic-grid">
          ${(data.projects || []).map((proj, idx) => `
            <div class="schematic-module">
              <div class="module-corner tl"></div>
              <div class="module-corner tr"></div>
              <div class="module-corner bl"></div>
              <div class="module-corner br"></div>
              <span class="mod-id">MOD-0${idx + 1}</span>
              <h4>${proj.title}</h4>
              <p>${proj.description}</p>
              <div class="mod-specs">
                ${(proj.tags || []).map(t => `<span class="spec-tag">[${t}]</span>`).join(' ')}
              </div>
              <div class="mod-links">
                ${proj.github ? `<a href="${proj.github}" target="_blank" rel="noopener noreferrer">SCHEMATIC ↗</a>` : ''}
                ${proj.live ? `<a href="${proj.live}" target="_blank" rel="noopener noreferrer">DEPLOYMENT ↗</a>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="schematic-section">
        <div class="section-badge">STACK TOLERANCES & METRICS</div>
        <div class="specs-table">
          ${(data.skills?.technical || []).map(s => `
            <div class="spec-row">
              <span class="spec-key">${s}</span>
              <span class="spec-dots"></span>
              <span class="spec-val">OPTIMIZED</span>
            </div>
          `).join('')}
        </div>
      </section>

      <footer class="schematic-footer">
        <div class="coords-display" id="coords">COORDS: X: 000 | Y: 000</div>
        <a href="mailto:${data.contact?.email || 'eng@blueprint.com'}" class="dwg-btn">TRANSMIT INQUIRY</a>
      </footer>
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>`;

  const css = `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background-color: #002244;
  color: #e0f2fe;
  font-family: 'Share Tech Mono', monospace;
  padding: 30px 16px;
  min-height: 100vh;
  position: relative;
}

.blueprint-grid-bg {
  position: fixed;
  inset: 0;
  background-image: 
    linear-gradient(to right, rgba(0, 168, 255, 0.15) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 168, 255, 0.15) 1px, transparent 1px),
    linear-gradient(to right, rgba(0, 168, 255, 0.05) 5px, transparent 5px),
    linear-gradient(to bottom, rgba(0, 168, 255, 0.05) 5px, transparent 5px);
  background-size: 40px 40px, 40px 40px, 8px 8px, 8px 8px;
  z-index: -1;
}

.blueprint-frame {
  max-width: 960px;
  margin: 0 auto;
  border: 2px solid #38bdf8;
  padding: 24px;
  background: rgba(0, 34, 68, 0.85);
  box-shadow: 0 0 30px rgba(0, 168, 255, 0.2);
}

.drawing-border {
  border: 1px dashed rgba(56, 189, 248, 0.5);
  padding: 32px;
}

.schematic-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 2px solid #38bdf8;
  padding-bottom: 20px;
  margin-bottom: 24px;
}

.spec-id {
  font-size: 11px;
  color: #38bdf8;
  letter-spacing: 0.1em;
  margin-bottom: 6px;
}

.dwg-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 2.8rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #fff;
  line-height: 1.1;
}

.dwg-sub {
  color: #7dd3fc;
  font-size: 1.1rem;
  margin-top: 4px;
}

.stamp-box {
  border: 3px double #f43f5e;
  color: #f43f5e;
  padding: 8px 16px;
  text-align: center;
  font-weight: bold;
  transform: rotate(-8deg);
  box-shadow: 0 0 10px rgba(244, 63, 94, 0.3);
  transition: transform 0.3s ease;
}

.stamp-box:hover {
  transform: rotate(0deg) scale(1.05);
}

.stamp-inner {
  font-size: 11px;
  line-height: 1.2;
}

.dimension-line {
  display: flex;
  align-items: center;
  margin: 24px 0;
  color: #38bdf8;
  font-size: 11px;
}

.dimension-line::before, .dimension-line::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #38bdf8;
}

.dim-label {
  padding: 0 16px;
  letter-spacing: 0.1em;
}

.schematic-section {
  margin-bottom: 36px;
}

.tech-callout {
  background: rgba(56, 189, 248, 0.05);
  border-left: 3px solid #38bdf8;
  padding: 16px 20px;
}

.callout-num {
  font-size: 10px;
  color: #38bdf8;
}

.tech-callout h3 {
  font-size: 1.1rem;
  margin: 4px 0 8px;
  color: #fff;
}

.tech-callout p {
  font-size: 0.95rem;
  color: #bae6fd;
  line-height: 1.6;
}

.section-badge {
  display: inline-block;
  background: #38bdf8;
  color: #002244;
  font-weight: bold;
  font-size: 11px;
  padding: 4px 10px;
  margin-bottom: 16px;
  letter-spacing: 0.08em;
}

.schematic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.schematic-module {
  position: relative;
  background: rgba(0, 34, 68, 0.6);
  border: 1px solid #0284c7;
  padding: 24px;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.schematic-module:hover {
  transform: translateY(-6px);
  border-color: #38bdf8;
  box-shadow: 0 10px 25px rgba(56, 189, 248, 0.25);
  background: rgba(0, 45, 90, 0.8);
}

.module-corner {
  position: absolute;
  width: 6px;
  height: 6px;
  border-color: #38bdf8;
  border-style: solid;
}

.module-corner.tl { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
.module-corner.tr { top: -1px; right: -1px; border-width: 2px 2px 0 0; }
.module-corner.bl { bottom: -1px; left: -1px; border-width: 0 0 2px 2px; }
.module-corner.br { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }

.mod-id {
  font-size: 10px;
  color: #38bdf8;
}

.schematic-module h4 {
  font-size: 1.15rem;
  color: #fff;
  margin: 6px 0 8px;
}

.schematic-module p {
  font-size: 0.85rem;
  color: #bae6fd;
  line-height: 1.5;
  margin-bottom: 14px;
}

.mod-specs {
  font-size: 11px;
  color: #38bdf8;
  margin-bottom: 16px;
}

.mod-links a {
  color: #7dd3fc;
  text-decoration: none;
  font-size: 12px;
  font-weight: bold;
  margin-right: 14px;
  transition: color 0.2s ease;
}

.mod-links a:hover {
  color: #fff;
  text-decoration: underline;
}

.specs-table {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 10px 24px;
}

.spec-row {
  display: flex;
  align-items: baseline;
  font-size: 12px;
}

.spec-dots {
  flex-grow: 1;
  border-bottom: 1px dotted rgba(56, 189, 248, 0.4);
  margin: 0 8px;
}

.spec-val {
  color: #34d399;
}

.schematic-footer {
  border-top: 2px solid #38bdf8;
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.coords-display {
  font-size: 11px;
  color: #38bdf8;
}

.dwg-btn {
  background: #38bdf8;
  color: #002244;
  font-weight: bold;
  padding: 10px 20px;
  text-decoration: none;
  font-size: 12px;
  letter-spacing: 0.05em;
  transition: all 0.2s ease;
}

.dwg-btn:hover {
  background: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(56, 189, 248, 0.4);
}
`;

  const js = `// Hover coordinate tracker
const coords = document.getElementById('coords');
document.addEventListener('mousemove', (e) => {
  if (coords) {
    coords.innerText = \`COORDS: X: \${e.clientX.toString().padStart(3, '0')} | Y: \${e.clientY.toString().padStart(3, '0')}\`;
  }
});`;

  return { html, css, js };
}

export function generateKineticTemplate(data) {
  const p = data.personal;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.name} — Kinetic Typography</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body>
  <div class="kinetic-wrapper">
    <div class="marquee-track">
      <div class="marquee-content">
        <span>${p.name.toUpperCase()}</span>
        <span class="star">✦</span>
        <span>${p.profession.toUpperCase()}</span>
        <span class="star">✦</span>
        <span>PORTFOLIO</span>
        <span class="star">✦</span>
        <span>${p.name.toUpperCase()}</span>
        <span class="star">✦</span>
        <span>${p.profession.toUpperCase()}</span>
        <span class="star">✦</span>
      </div>
    </div>

    <header class="kinetic-hero">
      <h1 class="kinetic-headline">
        <span class="word">I</span>
        <span class="word">BUILD</span>
        <span class="word accent">EXTRAORDINARY</span>
        <span class="word">SOFTWARE</span>
        <span class="word">EXPERIENCES</span>
      </h1>
      <p class="kinetic-bio">${p.bio}</p>
    </header>

    <section class="kinetic-projects">
      <div class="section-title-wrap">
        <h2>SELECTED WORKS</h2>
      </div>
      <div class="kinetic-project-list">
        ${(data.projects || []).map((proj, idx) => `
          <div class="kinetic-item">
            <span class="item-num">0${idx + 1}</span>
            <div class="item-main">
              <h3 class="item-title">${proj.title}</h3>
              <p class="item-desc">${proj.description}</p>
              <div class="item-tags">${(proj.tags || []).join(' / ')}</div>
            </div>
            <div class="item-action">
              ${proj.live ? `<a href="${proj.live}" target="_blank" rel="noopener noreferrer" class="kinetic-arrow">↗</a>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <section class="kinetic-skills">
      <div class="skills-ticker">
        ${(data.skills?.technical || []).map(s => `
          <span class="kinetic-skill-pill">${s}</span>
        `).join('')}
      </div>
    </section>

    <footer class="kinetic-footer">
      <a href="mailto:${data.contact?.email || 'hello@kinetic.dev'}" class="giant-link">
        LET'S CONNECT <span>→</span>
      </a>
    </footer>
  </div>
</body>
</html>`;

  const css = `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background-color: #0a0a0c;
  color: #fff;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  overflow-x: hidden;
  padding-bottom: 60px;
}

.kinetic-wrapper {
  width: 100%;
}

.marquee-track {
  width: 100vw;
  background: #f59e0b;
  color: #000;
  padding: 12px 0;
  overflow: hidden;
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 14px;
  letter-spacing: 0.1em;
  white-space: nowrap;
}

.marquee-content {
  display: inline-block;
  animation: marqueeScroll 18s linear infinite;
}

@keyframes marqueeScroll {
  from { transform: translateX(0%); }
  to { transform: translateX(-50%); }
}

.star {
  margin: 0 16px;
  color: #000;
}

.kinetic-hero {
  max-width: 1000px;
  margin: 60px auto 40px;
  padding: 0 24px;
}

.kinetic-headline {
  font-family: 'Syne', sans-serif;
  font-size: clamp(2.6rem, 7vw, 5.5rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.04em;
  margin-bottom: 24px;
}

.kinetic-headline .word {
  display: inline-block;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s ease;
}

.kinetic-headline .word:hover {
  transform: scale(1.08) translateY(-4px);
  color: #f59e0b;
}

.kinetic-headline .accent {
  color: #f59e0b;
  font-style: italic;
}

.kinetic-bio {
  font-size: 1.25rem;
  color: #a1a1aa;
  max-width: 650px;
  line-height: 1.6;
}

.kinetic-projects {
  max-width: 1000px;
  margin: 60px auto;
  padding: 0 24px;
}

.section-title-wrap h2 {
  font-family: 'Syne', sans-serif;
  font-size: 1.2rem;
  color: #71717a;
  letter-spacing: 0.1em;
  margin-bottom: 20px;
}

.kinetic-project-list {
  border-top: 1px solid #27272a;
}

.kinetic-item {
  display: flex;
  align-items: center;
  padding: 28px 0;
  border-bottom: 1px solid #27272a;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
}

.kinetic-item:hover {
  padding-left: 20px;
  background: rgba(255, 255, 255, 0.02);
  border-color: #f59e0b;
}

.item-num {
  font-family: 'Syne', sans-serif;
  font-size: 1.2rem;
  font-weight: 800;
  color: #71717a;
  width: 60px;
}

.item-main {
  flex-grow: 1;
}

.item-title {
  font-family: 'Syne', sans-serif;
  font-size: clamp(1.4rem, 3vw, 2.2rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  transition: transform 0.25s ease, color 0.25s ease;
}

.kinetic-item:hover .item-title {
  transform: translateX(6px);
  color: #f59e0b;
}

.item-desc {
  font-size: 0.95rem;
  color: #71717a;
  margin: 6px 0 8px;
}

.item-tags {
  font-size: 11px;
  color: #a1a1aa;
  font-weight: 600;
}

.kinetic-arrow {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #27272a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  text-decoration: none;
  color: #fff;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.kinetic-item:hover .kinetic-arrow {
  background: #f59e0b;
  color: #000;
  transform: scale(1.15) rotate(45deg);
}

.kinetic-skills {
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 24px;
}

.skills-ticker {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.kinetic-skill-pill {
  padding: 10px 20px;
  border: 1px solid #27272a;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
  color: #e4e4e7;
  transition: all 0.25s ease;
}

.kinetic-skill-pill:hover {
  background: #f59e0b;
  color: #000;
  border-color: #f59e0b;
  transform: translateY(-3px) scale(1.05);
}

.kinetic-footer {
  max-width: 1000px;
  margin: 80px auto 0;
  padding: 0 24px;
  text-align: center;
}

.giant-link {
  font-family: 'Syne', sans-serif;
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 800;
  color: #fff;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 16px;
}

.giant-link:hover {
  color: #f59e0b;
  transform: scale(1.04);
}

.giant-link span {
  transition: transform 0.3s ease;
}

.giant-link:hover span {
  transform: translateX(12px);
}
`;

  return { html, css, js: '' };
}

export function generateCardDeckTemplate(data) {
  const p = data.personal;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.name} — Interactive Card Deck</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
  <div class="deck-stage">
    <header class="deck-header">
      <div class="deck-badge">STACK & FAN WORKSPACE</div>
      <h1 class="deck-title">${p.name}</h1>
      <p class="deck-sub">${p.profession}</p>
      <p class="deck-bio">${p.bio}</p>
    </header>

    <div class="deck-instruction">Hover over cards to fan out stack 🎴</div>

    <div class="cards-deck-container" id="deckContainer">
      ${(data.projects || []).map((proj, idx) => `
        <div class="deck-card card-${idx % 4}">
          <div class="deck-card-top">
            <span class="card-tag">PROJECT 0${idx + 1}</span>
            <span class="card-suit">♠</span>
          </div>
          ${proj.image ? `<img src="${proj.image}" alt="${proj.title}" class="deck-img"/>` : ''}
          <div class="deck-card-content">
            <h3>${proj.title}</h3>
            <p>${proj.description}</p>
            <div class="deck-card-tags">
              ${(proj.tags || []).map(t => `<span>${t}</span>`).join('')}
            </div>
            <div class="deck-card-links">
              ${proj.github ? `<a href="${proj.github}" target="_blank" rel="noopener noreferrer">Code ↗</a>` : ''}
              ${proj.live ? `<a href="${proj.live}" target="_blank" rel="noopener noreferrer" class="live-btn">Preview ↗</a>` : ''}
            </div>
          </div>
        </div>
      `).join('')}
    </div>

    <footer class="deck-footer">
      <a href="mailto:${data.contact?.email || 'alex@deck.com'}" class="deck-cta">Deal Me In / Contact Alex</a>
    </footer>
  </div>
  <script src="script.js"></script>
</body>
</html>`;

  const css = `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background: radial-gradient(circle at 50% 30%, #1e1b4b 0%, #0f172a 100%);
  color: #f8fafc;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  min-height: 100vh;
  padding: 40px 20px;
  overflow-x: hidden;
}

.deck-stage {
  max-width: 1000px;
  margin: 0 auto;
  perspective: 1200px;
}

.deck-header {
  text-align: center;
  margin-bottom: 30px;
}

.deck-badge {
  display: inline-block;
  font-size: 11px;
  letter-spacing: 0.1em;
  font-weight: 700;
  color: #a855f7;
  background: rgba(168, 85, 247, 0.1);
  border: 1px solid rgba(168, 85, 247, 0.25);
  padding: 4px 12px;
  border-radius: 100px;
  margin-bottom: 14px;
}

.deck-title {
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.deck-sub {
  color: #c084fc;
  font-size: 1.15rem;
  font-weight: 600;
  margin: 4px 0 12px;
}

.deck-bio {
  color: #94a3b8;
  max-width: 580px;
  margin: 0 auto;
  font-size: 0.95rem;
}

.deck-instruction {
  text-align: center;
  font-size: 13px;
  color: #94a3b8;
  margin: 20px 0 40px;
}

.cards-deck-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
  padding: 20px;
}

.deck-card {
  width: 300px;
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: center bottom;
  cursor: pointer;
}

.deck-card:hover {
  transform: translateY(-16px) scale(1.05) rotate(0deg) !important;
  border-color: #a855f7;
  box-shadow: 0 25px 50px rgba(168, 85, 247, 0.25);
  z-index: 10;
}

.deck-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  font-weight: 700;
  color: #a855f7;
  margin-bottom: 12px;
}

.card-suit {
  font-size: 16px;
}

.deck-img {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 14px;
}

.deck-card h3 {
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 6px;
}

.deck-card p {
  font-size: 0.85rem;
  color: #94a3b8;
  line-height: 1.5;
  margin-bottom: 12px;
}

.deck-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.deck-card-tags span {
  font-size: 10px;
  background: rgba(255, 255, 255, 0.06);
  padding: 3px 8px;
  border-radius: 6px;
  color: #cbd5e1;
}

.deck-card-links {
  display: flex;
  gap: 12px;
}

.deck-card-links a {
  font-size: 12px;
  color: #c084fc;
  text-decoration: none;
  font-weight: bold;
}

.deck-card-links a:hover {
  text-decoration: underline;
}

.deck-footer {
  text-align: center;
  margin-top: 50px;
}

.deck-cta {
  display: inline-block;
  padding: 14px 32px;
  background: linear-gradient(135deg, #a855f7, #6366f1);
  color: #fff;
  border-radius: 14px;
  text-decoration: none;
  font-weight: 700;
  font-size: 14px;
  box-shadow: 0 8px 24px rgba(168, 85, 247, 0.4);
  transition: all 0.3s ease;
}

.deck-cta:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 12px 30px rgba(168, 85, 247, 0.6);
}
`;

  const js = `// Fan out slight rotation on cards
const cards = document.querySelectorAll('.deck-card');
cards.forEach((c, idx) => {
  const angle = (idx - Math.floor(cards.length / 2)) * 3;
  c.style.transform = \`rotate(\${angle}deg)\`;
});`;

  return { html, css, js };
}
