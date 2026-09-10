// =========================================================================
// PortfolioHub AI - Interactive Style Engines: Bento, Terminal, Neumorphic
// Featuring rich CSS transforms, smooth cubic-bezier transitions, and hover FX
// =========================================================================

export function generateBentoTemplate(data) {
  const p = data.personal;
  const primary = data.customization?.primaryColor || '#6366f1';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.name} — Bento Grid Portfolio</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
</head>
<body>
  <div class="bento-container">
    <header class="bento-card hero-card">
      <div class="glow-orb"></div>
      <div class="hero-header">
        <div class="status-pill"><span class="pulse-dot"></span> Available for projects</div>
        <span class="location-tag">📍 ${data.contact?.location || 'Global'}</span>
      </div>
      <h1 class="hero-name">${p.name}</h1>
      <p class="hero-title">${p.profession}</p>
      <p class="hero-bio">${p.bio}</p>
      <div class="hero-actions">
        <a href="#projects" class="btn btn-primary">Featured Works <span class="arrow">→</span></a>
        <a href="mailto:${data.contact?.email || 'hello@example.com'}" class="btn btn-glass">Contact Me</a>
      </div>
    </header>

    <div class="bento-card stats-card">
      <div class="stat-number">6+</div>
      <div class="stat-label">Years of Engineering Craft</div>
      <div class="stat-divider"></div>
      <div class="stat-number">${(data.projects || []).length}</div>
      <div class="stat-label">Production Applications</div>
    </div>

    <div class="bento-card stack-card">
      <h3 class="card-heading">Tech Stack & Tools</h3>
      <div class="stack-pills">
        ${(data.skills?.technical || []).map(s => `<span class="stack-pill">${s}</span>`).join('')}
      </div>
    </div>

    <section id="projects" class="bento-card wide-card projects-section">
      <h3 class="card-heading">Featured Engineering Showcases</h3>
      <div class="bento-projects-grid">
        ${(data.projects || []).map((proj, idx) => `
          <div class="bento-project-item">
            ${proj.image ? `<div class="proj-img-wrap"><img src="${proj.image}" alt="${proj.title}" class="bento-proj-img"/></div>` : ''}
            <div class="proj-body">
              <span class="proj-num">0${idx + 1}</span>
              <h4>${proj.title}</h4>
              <p>${proj.description}</p>
              <div class="proj-tags">
                ${(proj.tags || []).map(t => `<span class="proj-tag">${t}</span>`).join('')}
              </div>
              <div class="proj-links">
                ${proj.github ? `<a href="${proj.github}" target="_blank">Source Code ↗</a>` : ''}
                ${proj.live ? `<a href="${proj.live}" target="_blank">Live App ↗</a>` : ''}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <div class="bento-card quote-card">
      <p class="quote-text">"${p.about || 'Crafting resilient distributed systems and joyful micro-interactions.'}"</p>
      <div class="quote-author">— ${p.name}</div>
    </div>

    <footer class="bento-card footer-card">
      <div class="footer-left">
        <h3>Let's build something remarkable.</h3>
        <p>Drop a message for collaborations, consulting, or speaking.</p>
      </div>
      <a href="mailto:${data.contact?.email || 'hello@example.com'}" class="btn btn-primary magnetic-btn">Start a Conversation ↗</a>
    </footer>
  </div>
  <script src="script.js"></script>
</body>
</html>`;

  const css = `* { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bento-bg: #09090b;
  --bento-card: #18181b;
  --bento-card-hover: #27272a;
  --bento-border: rgba(255, 255, 255, 0.08);
  --bento-border-hover: rgba(99, 102, 241, 0.4);
  --primary: ${primary};
  --text-main: #f4f4f5;
  --text-muted: #a1a1aa;
}

body {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  background-color: var(--bento-bg);
  color: var(--text-main);
  min-height: 100vh;
  padding: 40px 20px;
  line-height: 1.6;
  background-image: radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.12) 0%, transparent 50%);
}

.bento-container {
  max-width: 1080px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;
}

.bento-card {
  background: var(--bento-card);
  border: 1px solid var(--bento-border);
  border-radius: 24px;
  padding: 32px;
  position: relative;
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
              border-color 0.4s ease, 
              box-shadow 0.4s ease,
              background-color 0.3s ease;
  will-change: transform;
}

.bento-card:hover {
  transform: translateY(-6px) scale(1.01);
  border-color: var(--bento-border-hover);
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 30px rgba(99, 102, 241, 0.15);
}

.hero-card {
  grid-column: span 8;
  position: relative;
}

.glow-orb {
  position: absolute;
  top: -100px;
  right: -100px;
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, var(--primary) 0%, transparent 70%);
  filter: blur(60px);
  opacity: 0.3;
  pointer-events: none;
  transition: opacity 0.5s ease;
}

.bento-card:hover .glow-orb {
  opacity: 0.6;
}

.hero-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(16, 185, 129, 0.12);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.25);
  font-size: 12px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 100px;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 8px #10b981;
  animation: bentoPulse 2s infinite;
}

@keyframes bentoPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.4); opacity: 0.5; }
}

.location-tag {
  font-size: 12px;
  color: var(--text-muted);
  font-family: 'JetBrains Mono', monospace;
}

.hero-name {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #ffffff 40%, #a1a1aa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-title {
  font-size: 1.15rem;
  color: #c7d2fe;
  font-weight: 500;
  margin-bottom: 16px;
}

.hero-bio {
  color: var(--text-muted);
  font-size: 0.95rem;
  max-width: 580px;
  margin-bottom: 28px;
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
}

.btn-primary {
  background: var(--primary);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.5);
}

.btn-primary .arrow {
  transition: transform 0.25s ease;
}

.btn-primary:hover .arrow {
  transform: translateX(4px);
}

.btn-glass {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-main);
  border: 1px solid var(--bento-border);
}

.btn-glass:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.stats-card {
  grid-column: span 4;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: linear-gradient(180deg, #18181b 0%, #131316 100%);
}

.stat-number {
  font-size: 3rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.04em;
  line-height: 1;
  transition: transform 0.3s ease;
}

.stats-card:hover .stat-number {
  transform: scale(1.08);
}

.stat-label {
  font-size: 12px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-top: 4px;
}

.stat-divider {
  width: 40px;
  height: 1px;
  background: var(--bento-border);
  margin: 18px 0;
}

.stack-card {
  grid-column: span 4;
}

.card-heading {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 20px;
  letter-spacing: -0.01em;
  color: #fff;
}

.stack-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.stack-pill {
  font-size: 12px;
  font-family: 'JetBrains Mono', monospace;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--bento-border);
  padding: 8px 14px;
  border-radius: 12px;
  color: #e4e4e7;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.stack-pill:hover {
  background: rgba(99, 102, 241, 0.15);
  border-color: var(--primary);
  color: #fff;
  transform: translateY(-3px) scale(1.05);
}

.wide-card {
  grid-column: span 8;
}

.bento-projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.bento-project-item {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--bento-border);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.bento-project-item:hover {
  transform: translateY(-4px);
  border-color: var(--bento-border-hover);
  background: rgba(255, 255, 255, 0.04);
}

.proj-img-wrap {
  width: 100%;
  height: 140px;
  overflow: hidden;
}

.bento-proj-img {
  width: 100%;
  height: 100%;
  object-cover: cover;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.bento-project-item:hover .bento-proj-img {
  transform: scale(1.08);
}

.proj-body {
  padding: 16px;
}

.proj-num {
  font-size: 11px;
  font-family: 'JetBrains Mono', monospace;
  color: var(--primary);
  font-weight: 700;
}

.proj-body h4 {
  font-size: 15px;
  font-weight: 700;
  margin: 4px 0 6px;
}

.proj-body p {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: 12px;
}

.proj-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.proj-tag {
  font-size: 10px;
  background: rgba(255, 255, 255, 0.05);
  padding: 3px 8px;
  border-radius: 6px;
  color: #d4d4d8;
}

.proj-links {
  display: flex;
  gap: 12px;
}

.proj-links a {
  font-size: 12px;
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.2s ease;
}

.proj-links a:hover {
  text-decoration: underline;
  transform: translateX(2px);
}

.quote-card {
  grid-column: span 12;
  text-align: center;
  padding: 40px;
  background: radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.08) 0%, #18181b 100%);
}

.quote-text {
  font-size: 1.25rem;
  font-weight: 500;
  font-style: italic;
  max-width: 720px;
  margin: 0 auto 12px;
  color: #e4e4e7;
}

.quote-author {
  font-size: 13px;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.footer-card {
  grid-column: span 12;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: gap;
  gap: 24px;
}

.footer-left h3 {
  font-size: 1.35rem;
  font-weight: 800;
  margin-bottom: 4px;
}

.footer-left p {
  color: var(--text-muted);
  font-size: 14px;
}

@media (max-width: 900px) {
  .hero-card, .stats-card, .stack-card, .wide-card {
    grid-column: span 12;
  }
}
`;

  const js = `// Bento card spotlight cursor tracking
document.querySelectorAll('.bento-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', \`\${x}px\`);
    card.style.setProperty('--mouse-y', \`\${y}px\`);
  });
});`;

  return { html, css, js };
}

export function generateTerminalTemplate(data) {
  const p = data.personal;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.name} — Terminal Shell</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
</head>
<body>
  <div class="terminal-wrapper">
    <div class="terminal-window">
      <div class="terminal-titlebar">
        <div class="window-controls">
          <span class="ctrl close"></span>
          <span class="ctrl minimize"></span>
          <span class="ctrl maximize"></span>
        </div>
        <div class="titlebar-text">bash — ${p.name.toLowerCase().replace(/\\s+/g, '-')}@kernel: ~</div>
        <div class="status-indicator">● ONLINE</div>
      </div>

      <div class="terminal-body">
        <div class="banner">
<pre>
  ___           _    __       _ _        _   _       _     
 | _ \\___ _ _ _| |_ / _|___  | (_)___   | | | |_  _| |__  
 |  _/ _ \\ '_|  _|  _| (_) | | | / -_)  | |_| | || | '_ \\ 
 |_| \\___/_|  \\__|_|  \\___/  |_|_\\___|   \\___/ \\_,_|_.__/ 
</pre>
          <div class="system-meta">Kernel 6.11.2-arch1-1 | Shell: zsh 5.9 | Up 42 days, 13:37</div>
        </div>

        <div class="prompt-group">
          <div class="command-line">
            <span class="user-host">guest@${p.name.toLowerCase().replace(/\\s+/g, '')}:~$</span>
            <span class="command">whoami --details</span>
          </div>
          <div class="command-output bio-output">
            <p><strong>Name:</strong> ${p.name}</p>
            <p><strong>Role:</strong> ${p.profession}</p>
            <p><strong>Bio:</strong> ${p.bio}</p>
            <p><strong>Location:</strong> ${data.contact?.location || 'San Francisco, CA'}</p>
          </div>
        </div>

        <div class="prompt-group">
          <div class="command-line">
            <span class="user-host">guest@${p.name.toLowerCase().replace(/\\s+/g, '')}:~$</span>
            <span class="command">cat skills.json</span>
          </div>
          <div class="command-output">
            <div class="skills-grid">
              ${(data.skills?.technical || []).map(s => `
                <div class="terminal-skill-chip">
                  <span class="skill-marker">❯</span> ${s}
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="prompt-group">
          <div class="command-line">
            <span class="user-host">guest@${p.name.toLowerCase().replace(/\\s+/g, '')}:~$</span>
            <span class="command">ls -la --sort=stars ./projects/</span>
          </div>
          <div class="command-output projects-output">
            ${(data.projects || []).map((proj, idx) => `
              <div class="term-project-row">
                <div class="term-proj-header">
                  <span class="term-perm">-rwxr-xr-x</span>
                  <span class="term-owner">alex</span>
                  <span class="term-title">${proj.title}</span>
                  <span class="term-badge">PROD</span>
                </div>
                <div class="term-proj-desc">${proj.description}</div>
                <div class="term-proj-tags">Stack: ${(proj.tags || []).join(' · ')}</div>
                <div class="term-proj-links">
                  ${proj.github ? `<a href="${proj.github}" target="_blank">[git clone repo]</a>` : ''}
                  ${proj.live ? `<a href="${proj.live}" target="_blank">[curl live instance]</a>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="prompt-group interactive-prompt">
          <div class="command-line">
            <span class="user-host">guest@${p.name.toLowerCase().replace(/\\s+/g, '')}:~$</span>
            <input type="text" id="terminal-input" placeholder="Type 'help', 'contact', 'clear'..." autofocus />
            <span class="cursor-block"></span>
          </div>
          <div id="interactive-output"></div>
        </div>
      </div>
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>`;

  const css = `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background-color: #0c0d10;
  color: #38ef7d;
  font-family: 'JetBrains Mono', monospace;
  padding: 30px 16px;
  min-height: 100vh;
  line-height: 1.6;
}

.terminal-wrapper {
  max-width: 900px;
  margin: 0 auto;
}

.terminal-window {
  background: #111317;
  border: 1px solid #1f242d;
  border-radius: 12px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(56, 239, 125, 0.05);
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
}

.terminal-window:hover {
  transform: translateY(-4px);
  box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.8), 0 0 50px rgba(56, 239, 125, 0.1);
  border-color: rgba(56, 239, 125, 0.3);
}

.terminal-titlebar {
  background: #181b22;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #1f242d;
}

.window-controls {
  display: flex;
  gap: 8px;
}

.ctrl {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.ctrl.close { background: #ff5f56; }
.ctrl.minimize { background: #ffbd2e; }
.ctrl.maximize { background: #27c93f; }

.titlebar-text {
  font-size: 12px;
  color: #8b949e;
}

.status-indicator {
  font-size: 11px;
  color: #38ef7d;
  font-weight: 700;
  letter-spacing: 0.05em;
  animation: termBlink 1.5s infinite;
}

@keyframes termBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.terminal-body {
  padding: 24px;
}

.banner pre {
  font-size: 10px;
  color: #11998e;
  line-height: 1.2;
  overflow-x: auto;
  margin-bottom: 12px;
}

.system-meta {
  font-size: 11px;
  color: #58a6ff;
  border-bottom: 1px dashed #1f242d;
  padding-bottom: 14px;
  margin-bottom: 24px;
}

.prompt-group {
  margin-bottom: 24px;
}

.command-line {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}

.user-host {
  color: #58a6ff;
  font-weight: 700;
}

.command {
  color: #f0f6fc;
  font-weight: 600;
}

.command-output {
  margin-top: 10px;
  padding-left: 14px;
  border-left: 2px solid #1f242d;
  font-size: 13px;
  color: #c9d1d9;
}

.bio-output p {
  margin-bottom: 6px;
}

.bio-output strong {
  color: #7ee787;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 8px;
  margin-top: 6px;
}

.terminal-skill-chip {
  background: #161b22;
  border: 1px solid #30363d;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  color: #e6edf3;
  transition: all 0.25s ease;
}

.terminal-skill-chip:hover {
  border-color: #38ef7d;
  color: #38ef7d;
  transform: translateX(4px);
  background: #1f242d;
}

.skill-marker {
  color: #38ef7d;
  margin-right: 4px;
}

.term-project-row {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.term-project-row:hover {
  border-color: #38ef7d;
  transform: translateX(6px);
  background: #1a202c;
}

.term-proj-header {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  margin-bottom: 6px;
}

.term-perm { color: #8b949e; }
.term-owner { color: #58a6ff; }
.term-title { color: #f0f6fc; font-weight: 700; font-size: 14px; }
.term-badge {
  margin-left: auto;
  background: rgba(56, 239, 125, 0.15);
  color: #38ef7d;
  border: 1px solid rgba(56, 239, 125, 0.3);
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
}

.term-proj-desc {
  font-size: 12px;
  color: #8b949e;
  margin-bottom: 8px;
}

.term-proj-tags {
  font-size: 11px;
  color: #11998e;
  margin-bottom: 10px;
}

.term-proj-links a {
  color: #58a6ff;
  text-decoration: none;
  font-size: 12px;
  margin-right: 14px;
  transition: color 0.2s ease;
}

.term-proj-links a:hover {
  color: #7ee787;
  text-decoration: underline;
}

#terminal-input {
  background: transparent;
  border: none;
  color: #f0f6fc;
  font-family: inherit;
  font-size: 13px;
  outline: none;
  flex: 1;
}

.cursor-block {
  display: inline-block;
  width: 8px;
  height: 16px;
  background: #38ef7d;
  animation: cursorBlink 1s infinite;
}

@keyframes cursorBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

#interactive-output {
  margin-top: 10px;
  color: #f0f6fc;
  font-size: 13px;
  white-space: pre-wrap;
}
`;

  const js = `const input = document.getElementById('terminal-input');
const output = document.getElementById('interactive-output');

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const cmd = input.value.trim().toLowerCase();
    input.value = '';

    if (cmd === 'clear') {
      output.innerHTML = '';
      return;
    }

    let response = '';
    switch(cmd) {
      case 'help':
        response = 'Available commands: whoami, projects, skills, contact, clear, date';
        break;
      case 'contact':
        response = 'Email: ${data.contact?.email || 'alex@example.com'}\\nPhone: ${data.contact?.phone || 'N/A'}\\nGitHub: ${data.social?.github || 'github.com'}';
        break;
      case 'date':
        response = new Date().toString();
        break;
      default:
        response = \`bash: command not found: \${cmd}. Type 'help' for available commands.\`;
    }

    const entry = document.createElement('div');
    entry.style.marginBottom = '10px';
    entry.innerHTML = \`<span style="color: #58a6ff">guest:~$</span> \${cmd}<br><span style="color: #7ee787">\${response}</span>\`;
    output.appendChild(entry);
  }
});`;

  return { html, css, js };
}

export function generateNeumorphicTemplate(data) {
  const p = data.personal;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.name} — Soft UI Neumorphism</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
  <div class="neu-container">
    <header class="neu-panel hero-panel">
      <div class="neu-avatar-wrap">
        <img src="${p.avatar}" alt="${p.name}" class="neu-avatar" />
      </div>
      <h1 class="neu-title">${p.name}</h1>
      <p class="neu-role">${p.profession}</p>
      <p class="neu-bio">${p.bio}</p>
      <div class="neu-actions">
        <a href="#projects" class="neu-btn active">Explore Work</a>
        <a href="mailto:${data.contact?.email || 'dev@example.com'}" class="neu-btn">Inquire</a>
      </div>
    </header>

    <section class="neu-panel skills-panel">
      <h2 class="neu-heading">Core Competencies</h2>
      <div class="neu-chips-grid">
        ${(data.skills?.technical || []).map(s => `
          <div class="neu-chip">${s}</div>
        `).join('')}
      </div>
    </section>

    <section id="projects" class="neu-panel projects-panel">
      <h2 class="neu-heading">Curated Case Studies</h2>
      <div class="neu-cards-grid">
        ${(data.projects || []).map(proj => `
          <article class="neu-card">
            ${proj.image ? `<div class="neu-img-wrap"><img src="${proj.image}" alt="${proj.title}" class="neu-img" /></div>` : ''}
            <h3>${proj.title}</h3>
            <p>${proj.description}</p>
            <div class="neu-tags">
              ${(proj.tags || []).map(t => `<span class="neu-tag">${t}</span>`).join('')}
            </div>
            <div class="neu-card-links">
              ${proj.github ? `<a href="${proj.github}" target="_blank" class="neu-icon-btn">GitHub</a>` : ''}
              ${proj.live ? `<a href="${proj.live}" target="_blank" class="neu-icon-btn highlight">Demo</a>` : ''}
            </div>
          </article>
        `).join('')}
      </div>
    </section>

    <footer class="neu-panel footer-panel">
      <p>© ${new Date().getFullYear()} ${p.name}. Crafted with tactile Neumorphic geometry.</p>
    </footer>
  </div>
</body>
</html>`;

  const css = `* { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #e8ecf2;
  --text: #2d3748;
  --text-muted: #718096;
  --neu-shadow-light: #ffffff;
  --neu-shadow-dark: #b8c1ce;
  --primary: #4f46e5;
}

body {
  background-color: var(--bg);
  color: var(--text);
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  padding: 48px 20px;
  line-height: 1.6;
}

.neu-container {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.neu-panel {
  background: var(--bg);
  border-radius: 28px;
  padding: 40px;
  box-shadow: 14px 14px 28px var(--neu-shadow-dark),
              -14px -14px 28px var(--neu-shadow-light);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
}

.neu-panel:hover {
  transform: translateY(-4px);
}

.hero-panel {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.neu-avatar-wrap {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  padding: 6px;
  background: var(--bg);
  box-shadow: inset 6px 6px 12px var(--neu-shadow-dark),
              inset -6px -6px 12px var(--neu-shadow-light);
  margin-bottom: 20px;
}

.neu-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.neu-title {
  font-size: 2.4rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text);
}

.neu-role {
  font-size: 1.1rem;
  color: var(--primary);
  font-weight: 600;
  margin-top: 4px;
}

.neu-bio {
  color: var(--text-muted);
  max-width: 600px;
  margin: 16px auto 28px;
  font-size: 0.95rem;
}

.neu-actions {
  display: flex;
  gap: 16px;
}

.neu-btn {
  padding: 12px 28px;
  border-radius: 14px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  background: var(--bg);
  box-shadow: 6px 6px 14px var(--neu-shadow-dark),
              -6px -6px 14px var(--neu-shadow-light);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.neu-btn:hover {
  transform: translateY(-2px);
  color: var(--primary);
}

.neu-btn:active {
  box-shadow: inset 4px 4px 8px var(--neu-shadow-dark),
              inset -4px -4px 8px var(--neu-shadow-light);
  transform: translateY(0);
}

.neu-btn.active {
  color: var(--primary);
}

.neu-heading {
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 24px;
  letter-spacing: -0.01em;
}

.neu-chips-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.neu-chip {
  padding: 10px 18px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  background: var(--bg);
  box-shadow: 4px 4px 8px var(--neu-shadow-dark),
              -4px -4px 8px var(--neu-shadow-light);
  transition: all 0.25s ease;
}

.neu-chip:hover {
  transform: translateY(-3px);
  color: var(--primary);
  box-shadow: 6px 6px 12px var(--neu-shadow-dark),
              -6px -6px 12px var(--neu-shadow-light);
}

.neu-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}

.neu-card {
  background: var(--bg);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 8px 8px 16px var(--neu-shadow-dark),
              -8px -8px 16px var(--neu-shadow-light);
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
}

.neu-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 12px 12px 24px var(--neu-shadow-dark),
              -12px -12px 24px var(--neu-shadow-light);
}

.neu-img-wrap {
  width: 100%;
  height: 150px;
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: inset 4px 4px 8px var(--neu-shadow-dark),
              inset -4px -4px 8px var(--neu-shadow-light);
}

.neu-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.neu-card:hover .neu-img {
  transform: scale(1.06);
}

.neu-card h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.neu-card p {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: 16px;
  flex-grow: 1;
}

.neu-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.neu-tag {
  font-size: 11px;
  color: var(--primary);
  font-weight: 600;
}

.neu-card-links {
  display: flex;
  gap: 10px;
}

.neu-icon-btn {
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 700;
  border-radius: 10px;
  text-decoration: none;
  color: var(--text);
  background: var(--bg);
  box-shadow: 4px 4px 8px var(--neu-shadow-dark),
              -4px -4px 8px var(--neu-shadow-light);
  transition: all 0.2s ease;
}

.neu-icon-btn:hover {
  transform: translateY(-2px);
  color: var(--primary);
}

.neu-icon-btn:active {
  box-shadow: inset 3px 3px 6px var(--neu-shadow-dark),
              inset -3px -3px 6px var(--neu-shadow-light);
}

.neu-icon-btn.highlight {
  color: var(--primary);
}

.footer-panel {
  text-align: center;
  font-size: 13px;
  color: var(--text-muted);
  padding: 24px;
}
`;

  const js = `// Tactile click depression
document.querySelectorAll('.neu-btn, .neu-icon-btn').forEach(btn => {
  btn.addEventListener('mousedown', () => {
    btn.style.boxShadow = 'inset 4px 4px 8px var(--neu-shadow-dark), inset -4px -4px 8px var(--neu-shadow-light)';
  });
  btn.addEventListener('mouseup', () => {
    btn.style.boxShadow = '';
  });
});`;

  return { html, css, js };
}
