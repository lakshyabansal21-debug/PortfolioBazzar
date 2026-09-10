// =========================================================================
// PortfolioHub AI - Futuristic Styles: Holographic Foil & Deep Space
// Featuring rich CSS transforms, smooth cubic-bezier transitions, and hover FX
// =========================================================================

export function generateHolographicTemplate(data) {
  const p = data.personal;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.name} — Holographic Prismatic</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
</head>
<body>
  <div class="holo-container">
    <header class="holo-card holo-hero">
      <div class="holo-foil-overlay"></div>
      <div class="hero-badge">PRISMATIC REFLECTION / VER. 3.0</div>
      <h1 class="holo-name">${p.name}</h1>
      <p class="holo-title">${p.profession}</p>
      <p class="holo-bio">${p.bio}</p>
      <div class="holo-actions">
        <a href="#projects" class="holo-btn primary">View Prismatic Index</a>
        <a href="mailto:${data.contact?.email || 'dev@holo.com'}" class="holo-btn secondary">Contact Signal</a>
      </div>
    </header>

    <section id="projects" class="holo-section">
      <h2 class="holo-section-title">Holographic Artifacts</h2>
      <div class="holo-grid">
        ${(data.projects || []).map(proj => `
          <div class="holo-card project-card">
            <div class="holo-foil-overlay"></div>
            ${proj.image ? `<img src="${proj.image}" alt="${proj.title}" class="holo-img" />` : ''}
            <h3>${proj.title}</h3>
            <p>${proj.description}</p>
            <div class="holo-tags">
              ${(proj.tags || []).map(t => `<span>${t}</span>`).join('')}
            </div>
            <div class="holo-links">
              ${proj.github ? `<a href="${proj.github}" target="_blank">Repository ↗</a>` : ''}
              ${proj.live ? `<a href="${proj.live}" target="_blank" class="glow-link">Deployment ↗</a>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <section class="holo-section">
      <h2 class="holo-section-title">Spectrum Capabilities</h2>
      <div class="holo-card skills-card">
        <div class="holo-foil-overlay"></div>
        <div class="holo-skills-flex">
          ${(data.skills?.technical || []).map(s => `
            <span class="holo-chip">${s}</span>
          `).join('')}
        </div>
      </div>
    </section>

    <footer class="holo-card holo-footer">
      <div class="holo-foil-overlay"></div>
      <p>© ${new Date().getFullYear()} ${p.name}. Shimmering in high-definition CSS spectrum.</p>
    </footer>
  </div>
  <script src="script.js"></script>
</body>
</html>`;

  const css = `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background: #090a0f;
  color: #f1f5f9;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  min-height: 100vh;
  padding: 40px 20px;
  line-height: 1.6;
}

.holo-container {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.holo-card {
  position: relative;
  background: rgba(18, 20, 29, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  padding: 36px;
  overflow: hidden;
  backdrop-filter: blur(16px);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease;
}

.holo-card:hover {
  transform: translateY(-6px);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.6),
    0 0 40px rgba(236, 72, 153, 0.15),
    0 0 60px rgba(6, 182, 212, 0.15);
}

.holo-foil-overlay {
  position: absolute;
  inset: -100%;
  background: linear-gradient(
    115deg,
    transparent 20%,
    rgba(255, 0, 128, 0.15) 30%,
    rgba(0, 255, 255, 0.2) 45%,
    rgba(255, 255, 0, 0.15) 60%,
    rgba(147, 51, 234, 0.2) 75%,
    transparent 90%
  );
  opacity: 0.4;
  pointer-events: none;
  mix-blend-mode: screen;
  transition: transform 0.6s ease, opacity 0.4s ease;
}

.holo-card:hover .holo-foil-overlay {
  opacity: 0.8;
  transform: translate(20%, 20%);
}

.hero-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  background: linear-gradient(90deg, #ec4899, #8b5cf6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 16px;
}

.holo-name {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.4rem, 5vw, 4rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.1;
  background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #f472b6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.holo-title {
  font-size: 1.25rem;
  color: #38bdf8;
  font-weight: 600;
  margin: 6px 0 16px;
}

.holo-bio {
  color: #94a3b8;
  max-width: 600px;
  font-size: 1rem;
  margin-bottom: 28px;
}

.holo-actions {
  display: flex;
  gap: 14px;
}

.holo-btn {
  padding: 12px 26px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 13px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: inline-block;
}

.holo-btn.primary {
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #06b6d4 100%);
  color: #fff;
  box-shadow: 0 4px 20px rgba(236, 72, 153, 0.3);
}

.holo-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(139, 92, 246, 0.5);
}

.holo-btn.secondary {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.holo-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.holo-section-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 20px;
}

.holo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.project-card {
  padding: 24px;
}

.holo-img {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 16px;
}

.project-card h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.project-card p {
  font-size: 0.85rem;
  color: #94a3b8;
  line-height: 1.5;
  margin-bottom: 14px;
}

.holo-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.holo-tags span {
  font-size: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 3px 8px;
  border-radius: 6px;
  color: #cbd5e1;
}

.holo-links {
  display: flex;
  gap: 12px;
}

.holo-links a {
  font-size: 12px;
  color: #38bdf8;
  text-decoration: none;
  font-weight: bold;
}

.holo-links .glow-link {
  color: #ec4899;
}

.holo-skills-flex {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.holo-chip {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  color: #e2e8f0;
  transition: all 0.25s ease;
}

.holo-chip:hover {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(6, 182, 212, 0.2));
  border-color: #ec4899;
  transform: translateY(-3px) scale(1.05);
  color: #fff;
}

.holo-footer {
  text-align: center;
  font-size: 13px;
  color: #64748b;
  padding: 24px;
}
`;

  const js = `// Holographic gyro tilt and prismatic shift
document.querySelectorAll('.holo-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = \`perspective(1000px) rotateY(\${x / 25}deg) rotateX(\${-y / 25}deg) translateY(-4px)\`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});`;

  return { html, css, js };
}

export function generateSpaceTemplate(data) {
  const p = data.personal;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.name} — Deep Space Celestial</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
  <canvas id="starfield"></canvas>
  <div class="space-wrapper">
    <header class="space-hero">
      <div class="orbit-badge">
        <span class="orbit-planet"></span> ORBITAL NODE // SECTOR 7
      </div>
      <h1 class="space-name">${p.name}</h1>
      <p class="space-title">${p.profession}</p>
      <p class="space-bio">${p.bio}</p>
      <div class="space-actions">
        <a href="#missions" class="space-btn cosmic-glow">Inspect Missions</a>
        <a href="mailto:${data.contact?.email || 'cosmic@deepspace.com'}" class="space-btn glass-btn">Send Transmission</a>
      </div>
    </header>

    <section id="missions" class="space-section">
      <h2 class="space-section-heading">Planetary Missions</h2>
      <div class="space-grid">
        ${(data.projects || []).map((proj, idx) => `
          <div class="space-card">
            <div class="space-card-orb"></div>
            ${proj.image ? `<img src="${proj.image}" alt="${proj.title}" class="space-img"/>` : ''}
            <div class="mission-tag">MISSION 0${idx + 1}</div>
            <h3>${proj.title}</h3>
            <p>${proj.description}</p>
            <div class="space-tags">
              ${(proj.tags || []).map(t => `<span>${t}</span>`).join('')}
            </div>
            <div class="space-links">
              ${proj.github ? `<a href="${proj.github}" target="_blank">Telemetry ↗</a>` : ''}
              ${proj.live ? `<a href="${proj.live}" target="_blank" class="accent-link">Launch Live ↗</a>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <section class="space-section">
      <h2 class="space-section-heading">Constellation Stack</h2>
      <div class="space-card constellation-card">
        <div class="constellation-grid">
          ${(data.skills?.technical || []).map(s => `
            <div class="star-node">
              <span class="star-point">✦</span>
              <span class="star-name">${s}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <footer class="space-footer">
      <p>Echoing across the cosmos. Station connection active.</p>
    </footer>
  </div>
  <script src="script.js"></script>
</body>
</html>`;

  const css = `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background-color: #030014;
  color: #e2e8f0;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  padding: 40px 20px;
  line-height: 1.6;
}

#starfield {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}

.space-wrapper {
  max-width: 960px;
  margin: 0 auto;
}

.space-hero {
  text-align: center;
  padding: 60px 0 70px;
}

.orbit-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 700;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.08);
  border: 1px solid rgba(56, 189, 248, 0.25);
  padding: 6px 14px;
  border-radius: 100px;
  margin-bottom: 20px;
}

.orbit-planet {
  width: 8px;
  height: 8px;
  background: #38bdf8;
  border-radius: 50%;
  box-shadow: 0 0 10px #38bdf8;
  animation: orbitPulse 2s infinite;
}

@keyframes orbitPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.4); opacity: 0.6; }
}

.space-name {
  font-size: clamp(2.6rem, 6vw, 4.4rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, #ffffff 0%, #c084fc 60%, #38bdf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 12px;
}

.space-title {
  font-size: 1.25rem;
  color: #c084fc;
  font-weight: 600;
  margin-bottom: 16px;
}

.space-bio {
  color: #94a3b8;
  max-width: 620px;
  margin: 0 auto 32px;
  font-size: 1rem;
}

.space-actions {
  display: flex;
  justify-content: center;
  gap: 14px;
}

.space-btn {
  padding: 12px 28px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.cosmic-glow {
  background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);
  color: #fff;
  box-shadow: 0 0 30px rgba(124, 58, 237, 0.4);
}

.cosmic-glow:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 0 50px rgba(124, 58, 237, 0.7);
}

.glass-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
}

.glass-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.space-section {
  margin-bottom: 56px;
}

.space-section-heading {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 24px;
  text-align: center;
}

.space-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.space-card {
  position: relative;
  background: rgba(15, 12, 41, 0.6);
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 20px;
  padding: 24px;
  backdrop-filter: blur(12px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.space-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(168, 85, 247, 0.5);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7), 0 0 30px rgba(168, 85, 247, 0.25);
}

.space-img {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 14px;
}

.mission-tag {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #38bdf8;
  margin-bottom: 6px;
}

.space-card h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.space-card p {
  font-size: 0.85rem;
  color: #94a3b8;
  line-height: 1.5;
  margin-bottom: 14px;
}

.space-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.space-tags span {
  font-size: 10px;
  background: rgba(168, 85, 247, 0.1);
  border: 1px solid rgba(168, 85, 247, 0.25);
  padding: 3px 8px;
  border-radius: 6px;
  color: #c084fc;
}

.space-links {
  display: flex;
  gap: 12px;
}

.space-links a {
  font-size: 12px;
  color: #38bdf8;
  text-decoration: none;
  font-weight: bold;
}

.space-links .accent-link {
  color: #c084fc;
}

.constellation-card {
  padding: 32px;
}

.constellation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.star-node {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  transition: all 0.25s ease;
}

.star-node:hover {
  background: rgba(124, 58, 237, 0.2);
  border-color: #a855f7;
  transform: translateX(4px);
}

.star-point {
  color: #38bdf8;
  font-size: 14px;
}

.star-name {
  font-size: 13px;
  font-weight: 500;
}

.space-footer {
  text-align: center;
  font-size: 12px;
  color: #64748b;
  padding: 24px;
}
`;

  const js = `// Starfield interactive animation
const canvas = document.getElementById('starfield');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width, height;
  let stars = [];

  function init() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.5,
      speed: Math.random() * 0.4 + 0.1,
      opacity: Math.random()
    }));
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);
    stars.forEach(s => {
      s.y -= s.speed;
      if (s.y < 0) s.y = height;
      ctx.fillStyle = \`rgba(255, 255, 255, \${s.opacity})\`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', init);
  init();
  loop();
}`;

  return { html, css, js };
}
