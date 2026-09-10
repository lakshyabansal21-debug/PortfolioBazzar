// =========================================================================
// PortfolioHub AI - Craft Style: Origami Papercraft
// Featuring realistic paper textures, folded corners, and 3D origami unfold transforms
// =========================================================================

export function generateOrigamiTemplate(data) {
  const p = data.personal;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.name} — Origami Papercraft</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Serif+JP:wght@600;900&display=swap" rel="stylesheet">
</head>
<body>
  <div class="origami-container">
    <header class="paper-sheet hero-sheet">
      <div class="folded-corner"></div>
      <div class="sheet-stamp">折り紙 / CRAFT</div>
      <h1 class="paper-title">${p.name}</h1>
      <p class="paper-role">${p.profession}</p>
      <p class="paper-desc">${p.bio}</p>
      <div class="sheet-actions">
        <a href="#work" class="paper-btn primary">Folded Artifacts</a>
        <a href="mailto:${data.contact?.email || 'origami@craft.com'}" class="paper-btn">Send Letter</a>
      </div>
    </header>

    <section id="work" class="origami-section">
      <h2 class="section-seal">HAND-CRAFTED EDITIONS</h2>
      <div class="origami-grid">
        ${(data.projects || []).map(proj => `
          <div class="paper-card">
            <div class="card-dogear"></div>
            ${proj.image ? `<img src="${proj.image}" alt="${proj.title}" class="paper-img"/>` : ''}
            <h3>${proj.title}</h3>
            <p>${proj.description}</p>
            <div class="paper-tags">
              ${(proj.tags || []).map(t => `<span class="paper-tag">${t}</span>`).join('')}
            </div>
            <div class="paper-links">
              ${proj.github ? `<a href="${proj.github}" target="_blank">Repository ↗</a>` : ''}
              ${proj.live ? `<a href="${proj.live}" target="_blank" class="accent-link">Exhibition ↗</a>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <section class="origami-section">
      <h2 class="section-seal">DISCIPLINE STACK</h2>
      <div class="paper-sheet skills-sheet">
        <div class="skills-wrap">
          ${(data.skills?.technical || []).map(s => `
            <div class="paper-skill-strip">${s}</div>
          `).join('')}
        </div>
      </div>
    </section>

    <footer class="origami-footer">
      <p>Creased with precision and calculated geometric folds. Tokyo · San Francisco.</p>
    </footer>
  </div>
</body>
</html>`;

  const css = `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background-color: #f4eee1;
  color: #2b2520;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  min-height: 100vh;
  padding: 40px 20px;
  line-height: 1.6;
}

.origami-container {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 36px;
}

.paper-sheet {
  background: #fbf8f1;
  border: 1px solid #e2dac8;
  padding: 40px;
  border-radius: 4px;
  position: relative;
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.05),
    0 10px 20px -5px rgba(43, 37, 32, 0.08);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
}

.paper-sheet:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px -8px rgba(43, 37, 32, 0.12);
}

.folded-corner {
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 40px 40px 0;
  border-color: transparent #e5dcc7 transparent transparent;
  box-shadow: -3px 3px 6px rgba(0, 0, 0, 0.08);
}

.sheet-stamp {
  display: inline-block;
  font-family: 'Noto Serif JP', serif;
  font-size: 11px;
  font-weight: 700;
  color: #c2410c;
  border: 1.5px solid #c2410c;
  padding: 4px 10px;
  margin-bottom: 20px;
  letter-spacing: 0.1em;
}

.paper-title {
  font-family: 'Noto Serif JP', serif;
  font-size: clamp(2.4rem, 5vw, 3.8rem);
  font-weight: 900;
  letter-spacing: -0.02em;
  color: #1c1917;
  line-height: 1.1;
}

.paper-role {
  font-size: 1.2rem;
  color: #c2410c;
  font-weight: 600;
  margin: 6px 0 16px;
}

.paper-desc {
  font-size: 1rem;
  color: #57534e;
  max-width: 620px;
  margin-bottom: 28px;
}

.sheet-actions {
  display: flex;
  gap: 14px;
}

.paper-btn {
  padding: 12px 24px;
  border: 1.5px solid #2b2520;
  border-radius: 2px;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  color: #2b2520;
  background: #fbf8f1;
  box-shadow: 3px 3px 0px #2b2520;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.paper-btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0px #2b2520;
}

.paper-btn.primary {
  background: #2b2520;
  color: #fbf8f1;
}

.paper-btn.primary:hover {
  background: #c2410c;
  border-color: #c2410c;
}

.section-seal {
  font-family: 'Noto Serif JP', serif;
  font-size: 1.1rem;
  letter-spacing: 0.15em;
  color: #78716c;
  margin-bottom: 20px;
  text-align: center;
}

.origami-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.paper-card {
  background: #fbf8f1;
  border: 1px solid #e2dac8;
  padding: 24px;
  position: relative;
  box-shadow: 0 4px 12px rgba(43, 37, 32, 0.05);
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.paper-card:hover {
  transform: translateY(-8px) rotate(-0.5deg);
  box-shadow: 0 14px 28px rgba(43, 37, 32, 0.1);
  border-color: #c2410c;
}

.card-dogear {
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 24px 24px 0;
  border-color: transparent #e2dac8 transparent transparent;
}

.paper-img {
  width: 100%;
  height: 140px;
  object-fit: cover;
  margin-bottom: 14px;
  border: 1px solid #e2dac8;
}

.paper-card h3 {
  font-family: 'Noto Serif JP', serif;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 6px;
}

.paper-card p {
  font-size: 0.85rem;
  color: #57534e;
  line-height: 1.5;
  margin-bottom: 14px;
}

.paper-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.paper-tag {
  font-size: 10px;
  background: #f4eee1;
  border: 1px solid #e2dac8;
  padding: 3px 8px;
  color: #78716c;
}

.paper-links a {
  font-size: 12px;
  color: #2b2520;
  text-decoration: none;
  font-weight: bold;
  margin-right: 12px;
  transition: color 0.2s ease;
}

.paper-links a:hover {
  color: #c2410c;
}

.skills-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.paper-skill-strip {
  padding: 8px 16px;
  background: #f4eee1;
  border: 1px solid #e2dac8;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.paper-skill-strip:hover {
  background: #2b2520;
  color: #fbf8f1;
  transform: translateY(-2px);
}

.origami-footer {
  text-align: center;
  font-size: 12px;
  color: #a8a29e;
  padding: 20px;
}
`;

  return { html, css, js: '' };
}
