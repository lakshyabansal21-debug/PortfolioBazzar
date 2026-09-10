// =========================================================================
// PortfolioHub AI - 24 Unique Production Portfolio Template Engines
// Each generator accepts user portfolio data and customization parameters,
// returning distinct HTML, CSS, and JavaScript with rich CSS transforms.
// =========================================================================

import { 
  generateBentoTemplate, 
  generateTerminalTemplate, 
  generateNeumorphicTemplate 
} from './templates/interactiveStyles.js';

import { 
  generateRetroArcadeTemplate, 
  generateEditorialTemplate, 
  generateAuroraTemplate 
} from './templates/visualStyles.js';

import { 
  generateBlueprintTemplate, 
  generateKineticTemplate, 
  generateCardDeckTemplate 
} from './templates/experimentalStyles.js';

import { 
  generateHolographicTemplate, 
  generateSpaceTemplate 
} from './templates/futuristicStyles.js';

import { 
  generateOrigamiTemplate 
} from './templates/craftStyles.js';

export const TEMPLATE_CATEGORIES = [
  'Minimal',
  'Developer',
  'Bento',
  'Terminal',
  'Neumorphic',
  'Retro Arcade',
  'Editorial',
  'Aurora',
  'Blueprint',
  'Kinetic',
  'Card Deck',
  'Holographic',
  'Deep Space',
  'Origami',
  'Student',
  'Corporate',
  'Designer',
  'Luxury',
  'Cyberpunk',
  'Glassmorphism',
  'Creative',
  'Photographer',
  'Dark',
  '3D'
];

export const DEFAULT_USER_DATA = {
  personal: {
    name: 'Alex Vance',
    profession: 'Senior Full Stack & AI Engineer',
    bio: 'Architecting ultra-performant modern web applications, scalable distributed systems, and intelligent human-centric experiences.',
    about: 'I am a passionate software craftsman with 6+ years of experience building products that span modern frontends to high-throughput backend services. Obsessed with clean abstractions, micro-interactions, and accessible web standards.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    resumeUrl: '#'
  },
  education: [
    {
      college: 'Stanford University',
      degree: 'B.S. in Computer Science',
      year: '2018 - 2022',
      cgpa: '3.92 / 4.0'
    }
  ],
  experience: [
    {
      company: 'Vanguard Labs',
      role: 'Lead Systems Architect',
      duration: '2023 - Present',
      description: 'Scaled core real-time telemetry processing 10x, authored distributed sync protocols, and led an 8-person engineering pod.'
    },
    {
      company: 'Aether Technologies',
      role: 'Full Stack Engineer',
      duration: '2022 - 2023',
      description: 'Shipped high-velocity client features in React, Node.js, and Postgres serving 250,000+ daily active users.'
    }
  ],
  projects: [
    {
      title: 'HyperScale Database Orchestrator',
      description: 'Distributed cache and query router optimizing edge execution latency down to sub-10ms.',
      tags: ['Rust', 'PostgreSQL', 'Docker', 'WebSockets'],
      github: 'https://github.com/example/hyperscale',
      live: 'https://hyperscale.example.com',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'NeuroCanvas Studio',
      description: 'Real-time collaborative generative canvas engine powered by WebGPU and local neural models.',
      tags: ['React', 'TypeScript', 'WebGPU', 'Tailwind'],
      github: 'https://github.com/example/neurocanvas',
      live: 'https://neurocanvas.example.com',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Pulse Analytics Engine',
      description: 'Privacy-first telemetry collector processing over 45M daily metrics with zero cookie reliance.',
      tags: ['Go', 'ClickHouse', 'GraphQL', 'Next.js'],
      github: 'https://github.com/example/pulse-analytics',
      live: 'https://pulse.example.com',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
    }
  ],
  skills: {
    technical: ['JavaScript / TypeScript', 'React & Next.js', 'Node.js & Express', 'PostgreSQL & Supabase', 'Python / PyTorch', 'Tailwind CSS', 'Docker & Kubernetes'],
    soft: ['Technical Leadership', 'System Architecture', 'Agile Delivery', 'Product Intuition', 'Mentorship']
  },
  achievements: [
    {
      title: 'ACM ICPC Regional Silver Medalist',
      issuer: 'ACM Competitive Programming',
      year: '2021'
    },
    {
      title: 'Global Hackathon Grand Champion',
      issuer: 'Devpost & Open Source Alliance',
      year: '2023'
    }
  ],
  contact: {
    email: 'alex.vance.dev@gmail.com',
    phone: '+1 (555) 382-9104',
    location: 'San Francisco, California'
  },
  social: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    portfolio: 'https://portfoliohub.ai'
  },
  customization: {
    primaryColor: '#a855f7',
    accentColor: '#06b6d4',
    font: 'Plus Jakarta Sans',
    borderRadius: '12px',
    theme: 'dark',
    sectionOrder: ['hero', 'about', 'experience', 'projects', 'education', 'skills', 'achievements', 'contact'],
    visibleSections: {
      hero: true,
      about: true,
      experience: true,
      projects: true,
      education: true,
      skills: true,
      achievements: true,
      contact: true
    }
  }
};

// 1. MINIMAL TEMPLATE ENGINE
export function generateMinimalTemplate(data = DEFAULT_USER_DATA) {
  const p = data.personal || DEFAULT_USER_DATA.personal;
  const primary = data.customization?.primaryColor || '#18181b';
  const font = data.customization?.font || 'Plus Jakarta Sans, sans-serif';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.name} — Portfolio</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <nav class="nav">
    <div class="container nav-content">
      <a href="#" class="logo">${p.name}</a>
      <div class="nav-links">
        <a href="#about">About</a>
        <a href="#projects">Work</a>
        <a href="#experience">Experience</a>
        <a href="#contact">Contact</a>
      </div>
    </div>
  </nav>

  <main class="container">
    <header class="hero">
      <div class="hero-badge">Available for opportunities</div>
      <h1 class="hero-title">${p.profession}</h1>
      <p class="hero-bio">${p.bio}</p>
      <div class="hero-actions">
        <a href="#projects" class="btn btn-primary">View Projects</a>
        <a href="#contact" class="btn btn-outline">Get in Touch</a>
      </div>
    </header>

    <section id="about" class="section">
      <h2 class="section-title">About Me</h2>
      <p class="about-text">${p.about}</p>
      <div class="skills-wrapper">
        <h3>Technical Expertise</h3>
        <div class="tag-cloud">
          ${(data.skills?.technical || []).map(s => `<span class="tag">${s}</span>`).join('')}
        </div>
      </div>
    </section>

    <section id="projects" class="section">
      <h2 class="section-title">Selected Works</h2>
      <div class="projects-grid">
        ${(data.projects || []).map(proj => `
          <article class="project-card">
            ${proj.image ? `<div class="proj-img-wrap"><img src="${proj.image}" alt="${proj.title}" class="project-img"/></div>` : ''}
            <div class="project-info">
              <h3>${proj.title}</h3>
              <p>${proj.description}</p>
              <div class="project-tags">
                ${(proj.tags || []).map(t => `<span>${t}</span>`).join('')}
              </div>
              <div class="project-links">
                ${proj.github ? `<a href="${proj.github}" target="_blank" rel="noreferrer">GitHub &rarr;</a>` : ''}
                ${proj.live ? `<a href="${proj.live}" target="_blank" rel="noreferrer">Live Demo &rarr;</a>` : ''}
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    </section>

    <section id="experience" class="section">
      <h2 class="section-title">Experience & Education</h2>
      <div class="timeline">
        ${(data.experience || []).map(exp => `
          <div class="timeline-item">
            <div class="timeline-year">${exp.duration}</div>
            <div class="timeline-body">
              <h4>${exp.role} <span>@ ${exp.company}</span></h4>
              <p>${exp.description}</p>
            </div>
          </div>
        `).join('')}
        ${(data.education || []).map(edu => `
          <div class="timeline-item">
            <div class="timeline-year">${edu.year}</div>
            <div class="timeline-body">
              <h4>${edu.degree} <span>@ ${edu.college}</span></h4>
              <p>CGPA: ${edu.cgpa}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <section id="contact" class="section contact-section">
      <h2 class="section-title">Let's Connect</h2>
      <p>Interested in collaboration, contracts, or just exchanging ideas?</p>
      <div class="contact-box">
        <a href="mailto:${data.contact?.email}" class="contact-email">${data.contact?.email}</a>
        <div class="social-links">
          ${data.social?.github ? `<a href="${data.social.github}" target="_blank">GitHub</a>` : ''}
          ${data.social?.linkedin ? `<a href="${data.social.linkedin}" target="_blank">LinkedIn</a>` : ''}
          ${data.social?.instagram ? `<a href="${data.social.instagram}" target="_blank">Instagram</a>` : ''}
        </div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container footer-content">
      <p>&copy; ${new Date().getFullYear()} ${p.name}. Crafted with PortfolioHub AI.</p>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>`;

  const css = `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: ${font};
  background-color: #fcfcfc;
  color: #1a1a1a;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px;
}

.nav {
  position: sticky;
  top: 0;
  background: rgba(252, 252, 252, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #eaeaea;
  z-index: 100;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 72px;
}

.logo {
  font-weight: 700;
  font-size: 1.15rem;
  color: #111;
  text-decoration: none;
  letter-spacing: -0.5px;
}

.nav-links a {
  margin-left: 24px;
  color: #666;
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s ease;
}

.nav-links a:hover {
  color: #000;
}

.hero {
  padding: 100px 0 60px;
}

.hero-badge {
  display: inline-block;
  font-size: 0.85rem;
  padding: 6px 14px;
  background: #f0f0f0;
  border-radius: 20px;
  color: #555;
  margin-bottom: 24px;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -1.5px;
  margin-bottom: 20px;
  color: #111;
}

.hero-bio {
  font-size: 1.25rem;
  color: #555;
  max-width: 720px;
  margin-bottom: 36px;
  line-height: 1.5;
}

.hero-actions {
  display: flex;
  gap: 16px;
}

.btn {
  display: inline-flex;
  align-items: center;
  padding: 12px 26px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #111;
  color: #fff;
}

.btn-primary:hover {
  background: #333;
}

.btn-outline {
  border: 1px solid #ccc;
  color: #111;
}

.btn-outline:hover {
  background: #f4f4f4;
}

.section {
  padding: 70px 0;
  border-top: 1px solid #eee;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-bottom: 30px;
}

.about-text {
  font-size: 1.15rem;
  color: #444;
  margin-bottom: 40px;
}

.skills-wrapper h3 {
  font-size: 1rem;
  margin-bottom: 16px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  background: #f0f0f0;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #222;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
}

.project-card {
  border: 1px solid #eee;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0,0,0,0.06);
}

.proj-img-wrap {
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.project-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-info {
  padding: 24px;
}

.project-info h3 {
  font-size: 1.25rem;
  margin-bottom: 10px;
}

.project-info p {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 16px;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 18px;
}

.project-tags span {
  font-size: 0.8rem;
  background: #f4f4f5;
  color: #555;
  padding: 4px 8px;
  border-radius: 4px;
}

.project-links a {
  margin-right: 16px;
  color: #111;
  font-weight: 600;
  text-decoration: none;
  font-size: 0.9rem;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.timeline-item {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 24px;
  padding-bottom: 24px;
  border-bottom: 1px dashed #eee;
}

.timeline-year {
  font-weight: 600;
  color: #888;
  font-size: 0.95rem;
}

.timeline-body h4 {
  font-size: 1.1rem;
  margin-bottom: 6px;
}

.timeline-body h4 span {
  font-weight: 400;
  color: #666;
}

.timeline-body p {
  color: #555;
  font-size: 0.95rem;
}

.contact-box {
  background: #fafafa;
  border: 1px solid #eee;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  margin-top: 20px;
}

.contact-email {
  font-size: 1.75rem;
  font-weight: 700;
  color: #111;
  text-decoration: none;
  display: inline-block;
  margin-bottom: 24px;
}

.contact-email:hover {
  text-decoration: underline;
}

.social-links a {
  margin: 0 12px;
  color: #666;
  text-decoration: none;
  font-weight: 500;
}

.social-links a:hover {
  color: #000;
}

.footer {
  padding: 40px 0;
  border-top: 1px solid #eee;
  text-align: center;
  font-size: 0.85rem;
  color: #888;
}

@media (max-width: 640px) {
  .hero-title { font-size: 2.25rem; }
  .timeline-item { grid-template-columns: 1fr; gap: 6px; }
  .contact-email { font-size: 1.25rem; }
}`;

  const js = `// Minimal Theme JS
document.addEventListener('DOMContentLoaded', () => {
  // Smooth anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  console.log('Portfolio initialized successfully with PortfolioHub AI.');
});`;

  return { html, css, js };
}

// 2. DEVELOPER TEMPLATE ENGINE (Terminal & IDE Inspired Dark Theme)
export function generateDeveloperTemplate(data = DEFAULT_USER_DATA) {
  const p = data.personal || DEFAULT_USER_DATA.personal;
  const primary = data.customization?.primaryColor || '#10b981';
  const font = data.customization?.font || 'JetBrains Mono, monospace';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.name} ~/dev-terminal</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Plus+Jakarta+Sans:wght@400;600&display=swap" rel="stylesheet">
</head>
<body class="theme-terminal">
  <div class="ide-container">
    <div class="window-bar">
      <div class="window-buttons">
        <span class="btn-dot close"></span>
        <span class="btn-dot min"></span>
        <span class="btn-dot max"></span>
      </div>
      <div class="window-title">bash — ${p.name.toLowerCase().replace(/\\s+/g, '_')}@workstation:~</div>
      <div class="status-pill">● online</div>
    </div>

    <header class="terminal-hero">
      <p class="prompt-line"><span class="cmd-user">developer@host</span>:<span class="cmd-path">~</span>$ whoami</p>
      <h1 class="dev-name">${p.name}</h1>
      <p class="dev-role">> ${p.profession}</p>

      <div class="terminal-card about-block">
        <p class="comment">// SUMMARY</p>
        <p class="summary-code">
          const engineer = {<br>
          &nbsp;&nbsp;name: "${p.name}",<br>
          &nbsp;&nbsp;status: "Building the future of software",<br>
          &nbsp;&nbsp;bio: "${p.bio.replace(/"/g, '\\"')}"<br>
          };
        </p>
      </div>
    </header>

    <section class="section">
      <p class="prompt-line"><span class="cmd-user">developer@host</span>:<span class="cmd-path">~/skills</span>$ ls -la</p>
      <div class="terminal-skills">
        ${(data.skills?.technical || []).map(s => `
          <div class="skill-pill">
            <span class="dot">#</span> ${s}
          </div>
        `).join('')}
      </div>
    </section>

    <section class="section">
      <p class="prompt-line"><span class="cmd-user">developer@host</span>:<span class="cmd-path">~/projects</span>$ git log --oneline</p>
      <div class="git-projects">
        ${(data.projects || []).map((proj, idx) => `
          <div class="commit-card">
            <div class="commit-header">
              <span class="commit-hash">commit #${(idx + 1).toString(16).padStart(4, '0')}</span>
              <span class="commit-branch">main</span>
            </div>
            <h3>${proj.title}</h3>
            <p class="commit-desc">${proj.description}</p>
            <div class="tech-stack">
              ${(proj.tags || []).map(t => `<span class="badge">[${t}]</span>`).join('')}
            </div>
            <div class="commit-links">
              ${proj.github ? `<a href="${proj.github}" target="_blank">&lt;source /&gt;</a>` : ''}
              ${proj.live ? `<a href="${proj.live}" target="_blank">&lt;deploy /&gt;</a>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <section class="section">
      <p class="prompt-line"><span class="cmd-user">developer@host</span>:<span class="cmd-path">~/history</span>$ cat career.log</p>
      <div class="career-terminal">
        ${(data.experience || []).map(exp => `
          <div class="log-entry">
            <span class="log-time">[${exp.duration}]</span>
            <span class="log-role">${exp.role}</span> @ <span class="log-comp">${exp.company}</span>
            <p class="log-detail">${exp.description}</p>
          </div>
        `).join('')}
      </div>
    </section>

    <section class="section contact-terminal">
      <p class="prompt-line"><span class="cmd-user">developer@host</span>:<span class="cmd-path">~/contact</span>$ ./ping.sh</p>
      <div class="ping-card">
        <p>PING ${data.contact?.email || 'user'} (56 bytes):</p>
        <p class="ping-reply">64 bytes from mail: icmp_seq=1 ttl=64 time=0.042 ms</p>
        <div class="term-contact-links">
          <a href="mailto:${data.contact?.email}" class="term-btn">Send Email</a>
          ${data.social?.github ? `<a href="${data.social.github}" target="_blank" class="term-btn">GitHub</a>` : ''}
          ${data.social?.linkedin ? `<a href="${data.social.linkedin}" target="_blank" class="term-btn">LinkedIn</a>` : ''}
        </div>
      </div>
    </section>

    <footer class="terminal-footer">
      <p>// End of stream. Ready for new connections.</p>
    </footer>
  </div>

  <script src="script.js"></script>
</body>
</html>`;

  const css = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body.theme-terminal {
  background-color: #0d1117;
  color: #c9d1d9;
  font-family: 'JetBrains Mono', monospace;
  padding: 30px 16px;
  line-height: 1.6;
}

.ide-container {
  max-width: 920px;
  margin: 0 auto;
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
  overflow: hidden;
}

.window-bar {
  background: #090d13;
  padding: 12px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #30363d;
}

.window-buttons {
  display: flex;
  gap: 8px;
}

.btn-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.btn-dot.close { background: #ff5f56; }
.btn-dot.min { background: #ffbd2e; }
.btn-dot.max { background: #27c93f; }

.window-title {
  font-size: 0.85rem;
  color: #8b949e;
}

.status-pill {
  font-size: 0.75rem;
  color: #3fb950;
  background: rgba(63, 185, 80, 0.15);
  padding: 3px 8px;
  border-radius: 10px;
}

.terminal-hero {
  padding: 36px 30px 24px;
}

.prompt-line {
  color: #8b949e;
  font-size: 0.95rem;
  margin-bottom: 12px;
}

.cmd-user { color: #58a6ff; }
.cmd-path { color: #f0883e; }

.dev-name {
  font-size: 2.5rem;
  font-weight: 700;
  color: #f0f6fc;
  margin-bottom: 6px;
}

.dev-role {
  font-size: 1.15rem;
  color: #3fb950;
  margin-bottom: 24px;
}

.terminal-card {
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 20px;
}

.comment { color: #8b949e; font-size: 0.85rem; margin-bottom: 8px; }
.summary-code { color: #79c0ff; font-size: 0.95rem; }

.section {
  padding: 24px 30px;
  border-top: 1px solid #21262d;
}

.terminal-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-pill {
  background: #21262d;
  border: 1px solid #30363d;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #e6edf3;
}

.skill-pill .dot { color: #58a6ff; font-weight: bold; }

.git-projects {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.commit-card {
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 20px;
  transition: border-color 0.2s;
}

.commit-card:hover {
  border-color: #58a6ff;
}

.commit-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.8rem;
}

.commit-hash { color: #d29922; }
.commit-branch { color: #3fb950; }

.commit-card h3 {
  font-size: 1.1rem;
  color: #f0f6fc;
  margin-bottom: 8px;
}

.commit-desc {
  font-size: 0.85rem;
  color: #8b949e;
  margin-bottom: 14px;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.tech-stack .badge {
  color: #a5d6ff;
  font-size: 0.75rem;
}

.commit-links a {
  color: #58a6ff;
  text-decoration: none;
  margin-right: 14px;
  font-size: 0.85rem;
}

.career-terminal {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.log-entry {
  background: #0d1117;
  border-left: 3px solid #58a6ff;
  padding: 12px 16px;
}

.log-time { color: #8b949e; font-size: 0.85rem; margin-right: 8px; }
.log-role { color: #f0f6fc; font-weight: 600; }
.log-comp { color: #3fb950; }
.log-detail { color: #8b949e; font-size: 0.85rem; margin-top: 4px; }

.ping-card {
  background: #0d1117;
  padding: 20px;
  border-radius: 8px;
}

.ping-reply { color: #3fb950; margin: 8px 0 16px; }

.term-contact-links {
  display: flex;
  gap: 12px;
}

.term-btn {
  background: #21262d;
  color: #58a6ff;
  border: 1px solid #30363d;
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.9rem;
}

.term-btn:hover {
  background: #30363d;
  color: #fff;
}

.terminal-footer {
  padding: 20px 30px;
  border-top: 1px solid #21262d;
  text-align: center;
  font-size: 0.8rem;
  color: #8b949e;
}

@media (max-width: 640px) {
  body.theme-terminal {
    padding: 14px 8px;
  }
  .terminal-hero {
    padding: 20px 14px;
  }
  .dev-name {
    font-size: 1.75rem;
  }
  .section {
    padding: 16px 14px;
  }
  .window-bar {
    padding: 10px 12px;
  }
  .git-projects {
    grid-template-columns: 1fr;
  }
  .term-contact-links {
    flex-direction: column;
  }
  .terminal-card, .commit-card, .ping-card {
    padding: 14px;
  }
}`;

  const js = `// Developer Terminal JS
console.log('Terminal session initiated: welcome developer!');
`;

  return { html, css, js };
}

// 3. STUDENT TEMPLATE ENGINE (Vibrant, Academic, Coursework, Roadmap)
export function generateStudentTemplate(data = DEFAULT_USER_DATA) {
  const p = data.personal || DEFAULT_USER_DATA.personal;
  const primary = data.customization?.primaryColor || '#3b82f6';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.name} | Student & Junior Dev</title>
  <link rel="stylesheet" href="style.css">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
</head>
<body class="theme-student">
  <header class="student-header">
    <div class="hero-box">
      <span class="grad-cap">🎓 Aspiring Innovator</span>
      <h1>${p.name}</h1>
      <p class="subtitle">${p.profession}</p>
      <p class="intro-p">${p.bio}</p>
      <div class="header-badges">
        ${(data.education || []).map(e => `
          <div class="edu-chip">
            <strong>${e.college}</strong> • ${e.degree} (${e.year}) | GPA: ${e.cgpa}
          </div>
        `).join('')}
      </div>
    </div>
  </header>

  <main class="content-wrap">
    <section class="student-section">
      <h2 class="title-with-bar">🚀 Technical Stack & Skills</h2>
      <div class="skill-grid">
        ${(data.skills?.technical || []).map(s => `<div class="skill-box">${s}</div>`).join('')}
      </div>
    </section>

    <section class="student-section">
      <h2 class="title-with-bar">💻 Featured Academic & Personal Projects</h2>
      <div class="project-cards-student">
        ${(data.projects || []).map(proj => `
          <div class="card-student">
            <h3>${proj.title}</h3>
            <p>${proj.description}</p>
            <div class="tags-student">
              ${(proj.tags || []).map(t => `<span>${t}</span>`).join('')}
            </div>
            <div class="card-footer-btns">
              ${proj.github ? `<a href="${proj.github}" target="_blank">View Code</a>` : ''}
              ${proj.live ? `<a href="${proj.live}" target="_blank">Launch App</a>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <section class="student-section">
      <h2 class="title-with-bar">🏆 Honors & Certifications</h2>
      <div class="achieve-list">
        ${(data.achievements || []).map(a => `
          <div class="achieve-item">
            <span class="star">★</span>
            <div>
              <strong>${a.title}</strong>
              <p>${a.issuer} (${a.year})</p>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <section class="student-section contact-card">
      <h2>📬 Let's Connect For Internships & Roles</h2>
      <p>Reach out to me at <a href="mailto:${data.contact?.email}">${data.contact?.email}</a></p>
    </section>
  </main>
  <script src="script.js"></script>
</body>
</html>`;

  const css = `* { margin:0; padding:0; box-sizing:border-box; }
body.theme-student {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: #f8fafc;
  color: #1e293b;
  padding-bottom: 60px;
}
.student-header {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: #fff;
  padding: 80px 20px;
  text-align: center;
}
.hero-box { max-width: 800px; margin: 0 auto; }
.grad-cap { background: rgba(255,255,255,0.2); padding: 6px 14px; border-radius: 20px; font-size: 0.9rem; }
.student-header h1 { font-size: 2.75rem; font-weight: 800; margin: 16px 0 8px; }
.subtitle { font-size: 1.25rem; opacity: 0.9; margin-bottom: 16px; }
.intro-p { font-size: 1.05rem; opacity: 0.85; max-width: 640px; margin: 0 auto 24px; }
.edu-chip { background: #fff; color: #1e3a8a; padding: 10px 18px; border-radius: 8px; font-size: 0.95rem; font-weight: 500; display: inline-block; }
.content-wrap { max-width: 900px; margin: -40px auto 0; padding: 0 20px; }
.student-section { background: #fff; padding: 32px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); margin-bottom: 24px; }
.title-with-bar { font-size: 1.35rem; margin-bottom: 20px; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
.skill-grid { display: flex; flex-wrap: wrap; gap: 10px; }
.skill-box { background: #eff6ff; color: #1d4ed8; padding: 8px 16px; border-radius: 8px; font-weight: 600; font-size: 0.9rem; }
.project-cards-student { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; }
.card-student { border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; background: #fafafa; }
.card-student h3 { font-size: 1.15rem; margin-bottom: 8px; }
.card-student p { color: #64748b; font-size: 0.9rem; margin-bottom: 14px; }
.tags-student span { background: #e2e8f0; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; margin-right: 6px; }
.card-footer-btns { margin-top: 16px; }
.card-footer-btns a { color: #2563eb; font-weight: 600; text-decoration: none; margin-right: 14px; font-size: 0.85rem; }
.achieve-list { display: flex; flex-direction: column; gap: 12px; }
.achieve-item { display: flex; align-items: center; gap: 12px; }
.star { color: #f59e0b; font-size: 1.25rem; }
.contact-card { text-align: center; background: #eff6ff; border: 1px solid #bfdbfe; }
.contact-card a { color: #1d4ed8; font-weight: bold; }`;

  const js = `console.log('Student portfolio loaded');`;
  return { html, css, js };
}

// 4. CORPORATE TEMPLATE ENGINE (Executive, Crisp, Metric-Driven)
export function generateCorporateTemplate(data = DEFAULT_USER_DATA) {
  const p = data.personal || DEFAULT_USER_DATA.personal;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.name} — Executive Profile</title>
  <link rel="stylesheet" href="style.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body class="theme-corp">
  <div class="corp-shell">
    <header class="corp-header">
      <div class="corp-brand">${p.name}</div>
      <div class="corp-contacts">
        <span>${data.contact?.location || 'San Francisco, CA'}</span> |
        <span>${data.contact?.email || 'contact@corp.com'}</span>
      </div>
    </header>
    <section class="corp-hero">
      <h1 class="corp-title">${p.profession}</h1>
      <p class="corp-lead">${p.bio}</p>
    </section>

    <div class="corp-grid">
      <aside class="corp-sidebar">
        <div class="corp-card">
          <h3>Core Competencies</h3>
          <ul class="corp-list">
            ${(data.skills?.technical || []).map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>
        <div class="corp-card">
          <h3>Leadership & Soft Skills</h3>
          <ul class="corp-list">
            ${(data.skills?.soft || []).map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>
      </aside>

      <section class="corp-main">
        <div class="corp-card">
          <h2>Professional Summary</h2>
          <p class="corp-text">${p.about}</p>
        </div>

        <div class="corp-card">
          <h2>Executive Experience</h2>
          ${(data.experience || []).map(e => `
            <div class="corp-exp-item">
              <div class="corp-exp-header">
                <strong>${e.role} — ${e.company}</strong>
                <span>${e.duration}</span>
              </div>
              <p>${e.description}</p>
            </div>
          `).join('')}
        </div>

        <div class="corp-card">
          <h2>Strategic Projects & Initiatives</h2>
          ${(data.projects || []).map(pr => `
            <div class="corp-project-item">
              <h4>${pr.title}</h4>
              <p>${pr.description}</p>
              <div class="corp-proj-links">
                ${pr.live ? `<a href="${pr.live}" target="_blank">Enterprise Case Study &rarr;</a>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>`;

  const css = `* { margin:0; padding:0; box-sizing:border-box; }
body.theme-corp { font-family: 'Inter', sans-serif; background: #f1f5f9; color: #0f172a; padding: 40px 16px; }
.corp-shell { max-width: 1000px; margin: 0 auto; background: #fff; border-radius: 8px; box-shadow: 0 4px 30px rgba(0,0,0,0.06); overflow: hidden; border: 1px solid #cbd5e1; }
.corp-header { display: flex; justify-content: space-between; align-items: center; padding: 24px 36px; border-bottom: 2px solid #0f172a; background: #f8fafc; }
.corp-brand { font-size: 1.5rem; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
.corp-contacts { color: #64748b; font-size: 0.9rem; }
.corp-hero { padding: 40px 36px; background: #0f172a; color: #fff; }
.corp-title { font-size: 2.25rem; font-weight: 700; margin-bottom: 12px; }
.corp-lead { font-size: 1.15rem; color: #94a3b8; line-height: 1.5; }
.corp-grid { display: grid; grid-template-columns: 280px 1fr; gap: 30px; padding: 36px; }
.corp-card { margin-bottom: 28px; }
.corp-card h2, .corp-card h3 { font-size: 1.2rem; font-weight: 700; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px; color: #1e293b; }
.corp-list { list-style: none; }
.corp-list li { padding: 6px 0; border-bottom: 1px dashed #e2e8f0; font-size: 0.9rem; color: #334155; }
.corp-text { line-height: 1.7; color: #334155; }
.corp-exp-item { margin-bottom: 20px; }
.corp-exp-header { display: flex; justify-content: space-between; margin-bottom: 6px; }
.corp-exp-header strong { color: #0f172a; }
.corp-exp-header span { color: #64748b; font-size: 0.85rem; }
.corp-project-item { padding: 14px 0; border-bottom: 1px solid #f1f5f9; }
.corp-project-item h4 { font-size: 1.05rem; margin-bottom: 4px; }
.corp-proj-links a { color: #0284c7; text-decoration: none; font-weight: 600; font-size: 0.85rem; }
@media(max-width: 768px) { .corp-grid { grid-template-columns: 1fr; } }`;

  const js = `console.log('Corporate view initialized');`;
  return { html, css, js };
}

// 5. DESIGNER TEMPLATE ENGINE (Visual-First, Magnetic Cards, Expressive)
export function generateDesignerTemplate(data = DEFAULT_USER_DATA) {
  const p = data.personal || DEFAULT_USER_DATA.personal;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.name} — Product & Visual Designer</title>
  <link rel="stylesheet" href="style.css">
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@400;600&display=swap" rel="stylesheet">
</head>
<body class="theme-designer">
  <header class="designer-nav">
    <div class="brand">${p.name}*</div>
    <a href="mailto:${data.contact?.email}" class="talk-btn">Let's Talk</a>
  </header>

  <section class="designer-hero">
    <h1 class="hero-display">Design.<br>Create.<br>Transform.</h1>
    <p class="designer-bio">${p.bio}</p>
  </section>

  <section class="portfolio-masonry">
    ${(data.projects || []).map(pr => `
      <div class="masonry-card">
        <div class="masonry-thumb" style="background-image: url('${pr.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe'}')"></div>
        <div class="masonry-overlay">
          <h3>${pr.title}</h3>
          <p>${pr.description}</p>
          <div class="tags">${(pr.tags || []).map(t => `<span>${t}</span>`).join(' • ')}</div>
        </div>
      </div>
    `).join('')}
  </section>

  <section class="designer-about">
    <h2>Philosophy & Craft</h2>
    <p>${p.about}</p>
    <div class="designer-skills">
      ${(data.skills?.technical || []).map(s => `<span class="pill-badge">${s}</span>`).join('')}
    </div>
  </section>

  <footer class="designer-footer">
    <p>${p.name} © ${new Date().getFullYear()} — Made with PortfolioHub AI</p>
  </footer>
  <script src="script.js"></script>
</body>
</html>`;

  const css = `* { margin:0; padding:0; box-sizing:border-box; }
body.theme-designer { font-family: 'Plus Jakarta Sans', sans-serif; background: #0e0e11; color: #f5f5f7; padding: 24px; }
.designer-nav { display: flex; justify-content: space-between; align-items: center; padding: 20px 0; }
.brand { font-family: 'Syne', sans-serif; font-size: 1.8rem; font-weight: 800; color: #fff; }
.talk-btn { background: #fff; color: #000; padding: 10px 24px; border-radius: 40px; font-weight: 700; text-decoration: none; }
.designer-hero { padding: 80px 0 60px; max-width: 900px; }
.hero-display { font-family: 'Syne', sans-serif; font-size: 4.5rem; line-height: 1; font-weight: 800; text-transform: uppercase; margin-bottom: 24px; }
.designer-bio { font-size: 1.35rem; color: #a1a1aa; max-width: 700px; }
.portfolio-masonry { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; margin: 40px 0 80px; }
.masonry-card { position: relative; border-radius: 20px; overflow: hidden; height: 380px; background: #18181b; }
.masonry-thumb { width: 100%; height: 100%; background-size: cover; background-position: center; transition: transform 0.5s ease; }
.masonry-card:hover .masonry-thumb { transform: scale(1.06); }
.masonry-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 70%); display: flex; flex-direction: column; justify-content: flex-end; padding: 24px; }
.masonry-overlay h3 { font-size: 1.4rem; font-weight: 700; color: #fff; margin-bottom: 6px; }
.masonry-overlay p { font-size: 0.9rem; color: #d4d4d8; margin-bottom: 8px; }
.masonry-overlay .tags { font-size: 0.8rem; color: #a1a1aa; }
.designer-about { max-width: 800px; margin: 0 auto 80px; text-align: center; }
.designer-about h2 { font-family: 'Syne', sans-serif; font-size: 2.2rem; margin-bottom: 20px; }
.designer-about p { font-size: 1.2rem; color: #a1a1aa; line-height: 1.6; margin-bottom: 30px; }
.designer-skills { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; }
.pill-badge { background: #27272a; padding: 8px 18px; border-radius: 30px; font-size: 0.9rem; }
.designer-footer { text-align: center; color: #71717a; padding: 40px 0; border-top: 1px solid #27272a; }`;

  const js = `console.log('Designer portfolio active');`;
  return { html, css, js };
}

// 6. LUXURY TEMPLATE ENGINE (Obsidian, Champagne Gold, High-End Editorial)
export function generateLuxuryTemplate(data = DEFAULT_USER_DATA) {
  const p = data.personal || DEFAULT_USER_DATA.personal;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.name} — Haute Portfolio</title>
  <link rel="stylesheet" href="style.css">
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,700;1,400&family=Montserrat:wght@300;400;600&display=swap" rel="stylesheet">
</head>
<body class="theme-luxury">
  <div class="lux-frame">
    <header class="lux-header">
      <div class="lux-monogram">${p.name.split(' ').map(n=>n[0]).join('')}</div>
      <p class="lux-sub">${p.profession}</p>
      <h1 class="lux-title">${p.name}</h1>
      <div class="lux-divider"></div>
      <p class="lux-bio">“${p.bio}”</p>
    </header>

    <section class="lux-section">
      <h2 class="lux-sec-title">The Oeuvre</h2>
      <div class="lux-works">
        ${(data.projects || []).map(pr => `
          <div class="lux-work-row">
            <div class="lux-work-meta">
              <h3>${pr.title}</h3>
              <span class="lux-tags">${(pr.tags || []).join(' / ')}</span>
            </div>
            <p class="lux-work-desc">${pr.description}</p>
            ${pr.live ? `<a href="${pr.live}" target="_blank" class="lux-link">Discover &rarr;</a>` : ''}
          </div>
        `).join('')}
      </div>
    </section>

    <section class="lux-section">
      <h2 class="lux-sec-title">Provenance</h2>
      <div class="lux-timeline">
        ${(data.experience || []).map(e => `
          <div class="lux-time-node">
            <span class="gold-dot"></span>
            <h4>${e.role}</h4>
            <em>${e.company} (${e.duration})</em>
            <p>${e.description}</p>
          </div>
        `).join('')}
      </div>
    </section>

    <footer class="lux-footer">
      <p>PRIVATE INQUIRIES</p>
      <a href="mailto:${data.contact?.email}">${data.contact?.email}</a>
    </footer>
  </div>
  <script src="script.js"></script>
</body>
</html>`;

  const css = `* { margin:0; padding:0; box-sizing:border-box; }
body.theme-luxury { background-color: #07080a; color: #e5e5e5; font-family: 'Montserrat', sans-serif; padding: 60px 20px; }
.lux-frame { max-width: 860px; margin: 0 auto; border: 1px solid rgba(212, 175, 55, 0.25); padding: 60px 50px; background: #0c0e12; }
.lux-header { text-align: center; margin-bottom: 60px; }
.lux-monogram { font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; color: #d4af37; border: 1px solid #d4af37; width: 60px; height: 60px; line-height: 58px; margin: 0 auto 20px; border-radius: 50%; }
.lux-sub { text-transform: uppercase; letter-spacing: 4px; font-size: 0.75rem; color: #a1a1aa; margin-bottom: 12px; }
.lux-title { font-family: 'Cormorant Garamond', serif; font-size: 3.5rem; font-weight: 500; color: #fdfbf7; letter-spacing: 1px; }
.lux-divider { width: 60px; height: 1px; background: #d4af37; margin: 24px auto; }
.lux-bio { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-style: italic; color: #d4af37; max-width: 600px; margin: 0 auto; line-height: 1.6; }
.lux-sec-title { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; color: #d4af37; border-bottom: 1px solid rgba(212,175,55,0.2); padding-bottom: 10px; margin-bottom: 30px; letter-spacing: 1px; }
.lux-works { display: flex; flex-direction: column; gap: 32px; margin-bottom: 60px; }
.lux-work-row { padding-bottom: 24px; border-bottom: 1px solid #1c1f26; }
.lux-work-meta h3 { font-size: 1.25rem; font-weight: 600; color: #fff; margin-bottom: 4px; }
.lux-tags { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px; color: #8a8f98; }
.lux-work-desc { font-size: 0.95rem; color: #9ca3af; margin: 12px 0; line-height: 1.6; }
.lux-link { color: #d4af37; text-decoration: none; font-size: 0.85rem; letter-spacing: 1px; text-transform: uppercase; }
.lux-timeline { display: flex; flex-direction: column; gap: 24px; margin-bottom: 60px; }
.lux-time-node h4 { font-size: 1.1rem; color: #fff; }
.lux-time-node em { font-size: 0.85rem; color: #d4af37; display: block; margin-bottom: 6px; }
.lux-time-node p { font-size: 0.9rem; color: #9ca3af; }
.lux-footer { text-align: center; border-top: 1px solid rgba(212,175,55,0.2); padding-top: 40px; }
.lux-footer p { font-size: 0.75rem; letter-spacing: 3px; color: #8a8f98; margin-bottom: 10px; }
.lux-footer a { font-family: 'Cormorant Garamond', serif; font-size: 1.75rem; color: #d4af37; text-decoration: none; }`;

  const js = `console.log('Luxury edition loaded');`;
  return { html, css, js };
}

// 7. CYBERPUNK TEMPLATE ENGINE (Neon Cyan, Glitch, Scanlines, HUD)
export function generateCyberpunkTemplate(data = DEFAULT_USER_DATA) {
  const p = data.personal || DEFAULT_USER_DATA.personal;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.name} // CYBER_MATRIX</title>
  <link rel="stylesheet" href="style.css">
  <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700;900&display=swap" rel="stylesheet">
</head>
<body class="theme-cyberpunk">
  <div class="scanlines"></div>
  <div class="cyber-container">
    <header class="hud-header">
      <div class="hud-top">SYS_STATUS: NEURAL_LINK_STABLE // SECTOR_07</div>
      <h1 class="cyber-glitch" data-text="${p.name}">${p.name}</h1>
      <p class="cyber-sub">&gt;&gt; [CLASS: ${p.profession.toUpperCase()}]</p>
      <div class="cyber-box bio-hud">
        <span class="hud-corner tl"></span><span class="hud-corner tr"></span>
        <p>${p.bio}</p>
        <span class="hud-corner bl"></span><span class="hud-corner br"></span>
      </div>
    </header>

    <section class="cyber-section">
      <h2 class="cyber-heading">&lt;CYBERNETIC_SKILLS /&gt;</h2>
      <div class="cyber-tags">
        ${(data.skills?.technical || []).map(s => `<span class="neon-pill">[ ${s} ]</span>`).join('')}
      </div>
    </section>

    <section class="cyber-section">
      <h2 class="cyber-heading">&lt;EXECUTABLE_MISSIONS /&gt;</h2>
      <div class="cyber-grid">
        ${(data.projects || []).map(pr => `
          <div class="cyber-card">
            <div class="cyber-card-header">TARGET: ${pr.title}</div>
            <p>${pr.description}</p>
            <div class="cyber-stack">${(pr.tags || []).map(t => `#${t}`).join(' ')}</div>
            ${pr.live ? `<a href="${pr.live}" target="_blank" class="cyber-btn">&gt; EXECUTE LINK</a>` : ''}
          </div>
        `).join('')}
      </div>
    </section>

    <footer class="cyber-footer">
      <p>TRANSMISSION_TERMINAL: <a href="mailto:${data.contact?.email}">${data.contact?.email}</a></p>
    </footer>
  </div>
  <script src="script.js"></script>
</body>
</html>`;

  const css = `* { margin:0; padding:0; box-sizing:border-box; }
body.theme-cyberpunk {
  background: #050508;
  color: #00ffcc;
  font-family: 'Share Tech Mono', monospace;
  padding: 40px 16px;
  position: relative;
  overflow-x: hidden;
}
.scanlines {
  position: fixed; inset: 0;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%);
  background-size: 100% 4px;
  pointer-events: none;
  z-index: 99;
}
.cyber-container { max-width: 900px; margin: 0 auto; position: relative; z-index: 10; }
.hud-header { margin-bottom: 50px; }
.hud-top { font-size: 0.8rem; color: #ff0055; letter-spacing: 2px; margin-bottom: 12px; }
.cyber-glitch { font-family: 'Orbitron', sans-serif; font-size: 3.5rem; color: #fff; text-shadow: 2px 2px #ff0055, -2px -2px #00ffcc; }
.cyber-sub { color: #ffe600; font-size: 1.1rem; margin-bottom: 20px; }
.cyber-box { background: rgba(0, 255, 204, 0.04); border: 1px solid #00ffcc; padding: 20px; position: relative; }
.hud-corner { position: absolute; width: 8px; height: 8px; border: 2px solid #ff0055; }
.hud-corner.tl { top: -2px; left: -2px; border-right: none; border-bottom: none; }
.hud-corner.tr { top: -2px; right: -2px; border-left: none; border-bottom: none; }
.hud-corner.bl { bottom: -2px; left: -2px; border-right: none; border-top: none; }
.hud-corner.br { bottom: -2px; right: -2px; border-left: none; border-top: none; }
.cyber-section { margin-bottom: 40px; }
.cyber-heading { font-family: 'Orbitron', sans-serif; font-size: 1.5rem; color: #ff0055; margin-bottom: 18px; }
.cyber-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.neon-pill { background: rgba(0, 255, 204, 0.1); border: 1px solid #00ffcc; padding: 6px 12px; font-size: 0.9rem; }
.cyber-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
.cyber-card { background: #0b0d14; border: 1px solid #242938; padding: 20px; border-left: 4px solid #00ffcc; }
.cyber-card-header { font-family: 'Orbitron', sans-serif; color: #ffe600; font-size: 1.1rem; margin-bottom: 8px; }
.cyber-card p { font-size: 0.9rem; color: #94a3b8; margin-bottom: 12px; }
.cyber-stack { font-size: 0.8rem; color: #ff0055; margin-bottom: 14px; }
.cyber-btn { display: inline-block; background: #00ffcc; color: #000; font-weight: bold; text-decoration: none; padding: 6px 14px; font-size: 0.85rem; }
.cyber-footer { text-align: center; border-top: 1px solid #242938; padding-top: 30px; }
.cyber-footer a { color: #ffe600; text-decoration: none; }`;

  const js = `console.log('CYBER_SYS INITIALIZED');`;
  return { html, css, js };
}

// 8. GLASSMORPHISM TEMPLATE ENGINE (Translucent Frosted Panels, Blurred Mesh)
export function generateGlassmorphismTemplate(data = DEFAULT_USER_DATA) {
  const p = data.personal || DEFAULT_USER_DATA.personal;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.name} — Glass Portfolio</title>
  <link rel="stylesheet" href="style.css">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap" rel="stylesheet">
</head>
<body class="theme-glass">
  <div class="ambient-mesh circle-1"></div>
  <div class="ambient-mesh circle-2"></div>
  <div class="ambient-mesh circle-3"></div>

  <div class="glass-shell">
    <header class="glass-card hero-glass">
      <div class="avatar-glass" style="background-image: url('${p.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}')"></div>
      <h1 class="glass-name">${p.name}</h1>
      <p class="glass-role">${p.profession}</p>
      <p class="glass-bio">${p.bio}</p>
      <div class="glass-btns">
        <a href="#projects" class="btn-glass">View Work</a>
        <a href="mailto:${data.contact?.email}" class="btn-glass-primary">Contact Me</a>
      </div>
    </header>

    <div class="glass-columns">
      <section class="glass-card">
        <h2>About & Vision</h2>
        <p>${p.about}</p>
        <div class="glass-chips">
          ${(data.skills?.technical || []).map(s => `<span>${s}</span>`).join('')}
        </div>
      </section>

      <section class="glass-card">
        <h2>Experience</h2>
        ${(data.experience || []).map(e => `
          <div class="glass-exp">
            <strong>${e.role}</strong>
            <p>${e.company} • ${e.duration}</p>
          </div>
        `).join('')}
      </section>
    </div>

    <section id="projects" class="glass-card projects-glass">
      <h2>Curated Projects</h2>
      <div class="glass-proj-grid">
        ${(data.projects || []).map(pr => `
          <div class="proj-card-glass">
            <h3>${pr.title}</h3>
            <p>${pr.description}</p>
            <div class="tech">${(pr.tags || []).join(' • ')}</div>
            ${pr.live ? `<a href="${pr.live}" target="_blank">Explore &rarr;</a>` : ''}
          </div>
        `).join('')}
      </div>
    </section>
  </div>
  <script src="script.js"></script>
</body>
</html>`;

  const css = `* { margin:0; padding:0; box-sizing:border-box; }
body.theme-glass {
  background-color: #0c0e17;
  color: #f1f5f9;
  font-family: 'Plus Jakarta Sans', sans-serif;
  min-height: 100vh;
  padding: 40px 16px;
  position: relative;
  overflow-x: hidden;
}
.ambient-mesh {
  position: fixed; border-radius: 50%; filter: blur(100px); pointer-events: none; z-index: 1;
}
.circle-1 { width: 350px; height: 350px; background: rgba(168, 85, 247, 0.35); top: -80px; left: -50px; }
.circle-2 { width: 450px; height: 450px; background: rgba(6, 182, 212, 0.3); bottom: -100px; right: -80px; }
.circle-3 { width: 300px; height: 300px; background: rgba(236, 72, 153, 0.2); top: 40%; left: 30%; }

.glass-shell { max-width: 900px; margin: 0 auto; position: relative; z-index: 10; display: flex; flex-direction: column; gap: 24px; }
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 36px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
}
.hero-glass { text-align: center; }
.avatar-glass { width: 90px; height: 90px; border-radius: 50%; background-size: cover; background-position: center; margin: 0 auto 16px; border: 2px solid rgba(255,255,255,0.2); }
.glass-name { font-size: 2.75rem; font-weight: 800; }
.glass-role { font-size: 1.25rem; color: #38bdf8; margin-bottom: 14px; }
.glass-bio { max-width: 650px; margin: 0 auto 24px; color: #cbd5e1; font-size: 1.05rem; }
.glass-btns { display: flex; justify-content: center; gap: 14px; }
.btn-glass { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 10px 24px; border-radius: 30px; text-decoration: none; font-weight: 600; }
.btn-glass-primary { background: #38bdf8; color: #000; padding: 10px 24px; border-radius: 30px; text-decoration: none; font-weight: 700; }
.glass-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.glass-card h2 { font-size: 1.35rem; margin-bottom: 16px; color: #f8fafc; }
.glass-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.glass-chips span { background: rgba(255,255,255,0.08); padding: 5px 12px; border-radius: 12px; font-size: 0.85rem; }
.glass-exp { margin-bottom: 14px; }
.glass-exp strong { color: #38bdf8; }
.glass-exp p { font-size: 0.85rem; color: #94a3b8; }
.glass-proj-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
.proj-card-glass { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 20px; border-radius: 14px; }
.proj-card-glass h3 { font-size: 1.15rem; margin-bottom: 8px; }
.proj-card-glass p { font-size: 0.9rem; color: #94a3b8; margin-bottom: 10px; }
.proj-card-glass .tech { font-size: 0.75rem; color: #c084fc; margin-bottom: 12px; }
.proj-card-glass a { color: #38bdf8; text-decoration: none; font-weight: 600; font-size: 0.85rem; }
@media(max-width: 640px) { .glass-columns { grid-template-columns: 1fr; } }`;

  const js = `console.log('Glassmorphism loaded');`;
  return { html, css, js };
}

// 9. CREATIVE TEMPLATE ENGINE (Neo-Brutalist, Chunky Borders, Playful)
export function generateCreativeTemplate(data = DEFAULT_USER_DATA) {
  const p = data.personal || DEFAULT_USER_DATA.personal;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.name} ! (Creative)</title>
  <link rel="stylesheet" href="style.css">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&display=swap" rel="stylesheet">
</head>
<body class="theme-creative">
  <div class="brutal-wrap">
    <header class="brutal-hero">
      <div class="sticker">★ PORTFOLIO ★</div>
      <h1>${p.name}</h1>
      <div class="brutal-badge">${p.profession}</div>
      <p class="brutal-bio">${p.bio}</p>
    </header>

    <section class="brutal-box yellow-bg">
      <h2>SUPERPOWERS & SKILLS</h2>
      <div class="brutal-skills">
        ${(data.skills?.technical || []).map(s => `<span class="b-tag">${s}</span>`).join('')}
      </div>
    </section>

    <section class="brutal-box pink-bg">
      <h2>FEATURED CREATIONS</h2>
      <div class="brutal-grid">
        ${(data.projects || []).map(pr => `
          <div class="brutal-card">
            <h3>${pr.title}</h3>
            <p>${pr.description}</p>
            <div class="b-tech">${(pr.tags || []).join(', ')}</div>
            ${pr.live ? `<a href="${pr.live}" target="_blank" class="b-link">CHECK IT OUT &rarr;</a>` : ''}
          </div>
        `).join('')}
      </div>
    </section>

    <footer class="brutal-box cyan-bg text-center">
      <h2>SAY HELLO!</h2>
      <a href="mailto:${data.contact?.email}" class="b-big-btn">${data.contact?.email}</a>
    </footer>
  </div>
  <script src="script.js"></script>
</body>
</html>`;

  const css = `* { margin:0; padding:0; box-sizing:border-box; }
body.theme-creative {
  background: #fef08a;
  color: #000;
  font-family: 'Plus Jakarta Sans', sans-serif;
  padding: 40px 16px;
}
.brutal-wrap { max-width: 860px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
.brutal-hero { background: #fff; border: 4px solid #000; box-shadow: 8px 8px 0 #000; padding: 40px; }
.sticker { display: inline-block; background: #f43f5e; color: #fff; font-weight: 800; padding: 4px 12px; border: 2px solid #000; margin-bottom: 14px; }
.brutal-hero h1 { font-size: 3.5rem; font-weight: 900; letter-spacing: -2px; }
.brutal-badge { display: inline-block; background: #38bdf8; border: 2px solid #000; padding: 6px 14px; font-weight: 800; margin: 12px 0; }
.brutal-bio { font-size: 1.2rem; font-weight: 600; line-height: 1.5; }
.brutal-box { border: 4px solid #000; box-shadow: 8px 8px 0 #000; padding: 32px; }
.yellow-bg { background: #fff; }
.pink-bg { background: #fda4af; }
.cyan-bg { background: #67e8f9; }
.brutal-box h2 { font-size: 1.75rem; font-weight: 900; margin-bottom: 20px; }
.brutal-skills { display: flex; flex-wrap: wrap; gap: 10px; }
.b-tag { background: #fff; border: 2px solid #000; padding: 8px 16px; font-weight: 800; box-shadow: 3px 3px 0 #000; }
.brutal-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; }
.brutal-card { background: #fff; border: 3px solid #000; padding: 20px; box-shadow: 4px 4px 0 #000; }
.brutal-card h3 { font-size: 1.3rem; font-weight: 800; margin-bottom: 8px; }
.brutal-card p { font-size: 0.95rem; font-weight: 600; margin-bottom: 12px; }
.b-tech { font-size: 0.8rem; font-weight: 700; color: #4b5563; margin-bottom: 14px; }
.b-link { display: inline-block; background: #000; color: #fff; padding: 8px 16px; text-decoration: none; font-weight: 800; }
.text-center { text-align: center; }
.b-big-btn { display: inline-block; background: #000; color: #fff; font-size: 1.25rem; font-weight: 800; padding: 12px 24px; text-decoration: none; border: 2px solid #000; box-shadow: 4px 4px 0 #fff; margin-top: 10px; }
@media (max-width: 640px) {
  body.theme-creative { padding: 16px 10px; }
  .brutal-hero { padding: 22px 16px; border-width: 3px; box-shadow: 4px 4px 0 #000; }
  .brutal-hero h1 { font-size: 2.2rem; letter-spacing: -1px; word-break: break-word; }
  .brutal-box { padding: 20px 16px; border-width: 3px; box-shadow: 4px 4px 0 #000; }
  .brutal-grid { grid-template-columns: 1fr; }
  .b-big-btn { font-size: 1rem; padding: 10px 18px; }
}`;

  const js = `console.log('Creative mode on');`;
  return { html, css, js };
}

// 10. PHOTOGRAPHER TEMPLATE ENGINE (Masonry, Lightbox feel, Clean Minimalist)
export function generatePhotographerTemplate(data = DEFAULT_USER_DATA) {
  const p = data.personal || DEFAULT_USER_DATA.personal;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.name} // Visuals</title>
  <link rel="stylesheet" href="style.css">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600&display=swap" rel="stylesheet">
</head>
<body class="theme-photo">
  <header class="photo-header">
    <div class="photo-brand">${p.name.toUpperCase()}</div>
    <p class="photo-tagline">${p.profession} — ${data.contact?.location || 'Worldwide'}</p>
  </header>

  <div class="photo-gallery">
    ${(data.projects || []).map((pr, i) => `
      <div class="photo-frame">
        <img src="${pr.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71'}" alt="${pr.title}">
        <div class="photo-caption">
          <strong>${pr.title}</strong>
          <span>${pr.description}</span>
        </div>
      </div>
    `).join('')}
  </div>

  <section class="photo-about">
    <p>${p.about}</p>
    <div class="photo-contact">
      <a href="mailto:${data.contact?.email}">Inquiries: ${data.contact?.email}</a>
    </div>
  </section>
  <script src="script.js"></script>
</body>
</html>`;

  const css = `* { margin:0; padding:0; box-sizing:border-box; }
body.theme-photo { background: #000; color: #e5e5e5; font-family: 'Plus Jakarta Sans', sans-serif; padding: 40px 24px; }
.photo-header { text-align: center; margin-bottom: 60px; }
.photo-brand { font-size: 1.8rem; font-weight: 600; letter-spacing: 6px; }
.photo-tagline { font-size: 0.85rem; color: #737373; letter-spacing: 2px; margin-top: 8px; text-transform: uppercase; }
.photo-gallery { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px; }
.photo-frame { overflow: hidden; position: relative; }
.photo-frame img { width: 100%; height: 380px; object-fit: cover; filter: grayscale(30%); transition: all 0.4s ease; }
.photo-frame:hover img { filter: grayscale(0%); transform: scale(1.03); }
.photo-caption { padding: 12px 0; }
.photo-caption strong { display: block; font-size: 1rem; color: #fff; margin-bottom: 4px; }
.photo-caption span { font-size: 0.85rem; color: #737373; }
.photo-about { max-width: 700px; margin: 80px auto 40px; text-align: center; color: #a3a3a3; font-size: 1.1rem; line-height: 1.6; }
.photo-contact { margin-top: 24px; }
.photo-contact a { color: #fff; text-decoration: none; font-size: 0.95rem; letter-spacing: 1px; }`;

  const js = `console.log('Gallery loaded');`;
  return { html, css, js };
}

// 11. DARK TEMPLATE ENGINE (Deep Stealth, Obsidian, Emerald/Cyan Glow)
export function generateDarkTemplate(data = DEFAULT_USER_DATA) {
  const p = data.personal || DEFAULT_USER_DATA.personal;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.name} — Stealth Dark</title>
  <link rel="stylesheet" href="style.css">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
</head>
<body class="theme-dark-stealth">
  <main class="dark-container">
    <div class="stealth-glow"></div>
    <header class="dark-header">
      <div class="badge-stealth">AVAILABLE FOR REMOTE WORK</div>
      <h1 class="dark-title">${p.name}</h1>
      <p class="dark-role">${p.profession}</p>
      <p class="dark-bio">${p.bio}</p>
    </header>

    <section class="dark-section">
      <h2 class="dark-h2"><span>//</span> EXPERTISE</h2>
      <div class="dark-skills-grid">
        ${(data.skills?.technical || []).map(s => `<div class="dark-skill-pill">${s}</div>`).join('')}
      </div>
    </section>

    <section class="dark-section">
      <h2 class="dark-h2"><span>//</span> FEATURED DEPLOYS</h2>
      <div class="dark-projects-grid">
        ${(data.projects || []).map(pr => `
          <div class="dark-proj-card">
            <h3>${pr.title}</h3>
            <p>${pr.description}</p>
            <div class="dark-tags">${(pr.tags || []).map(t => `<span>${t}</span>`).join('')}</div>
            ${pr.live ? `<a href="${pr.live}" target="_blank" class="dark-btn">View Deployment &rarr;</a>` : ''}
          </div>
        `).join('')}
      </div>
    </section>

    <footer class="dark-footer">
      <p>Initiate contact: <a href="mailto:${data.contact?.email}">${data.contact?.email}</a></p>
    </footer>
  </main>
  <script src="script.js"></script>
</body>
</html>`;

  const css = `* { margin:0; padding:0; box-sizing:border-box; }
body.theme-dark-stealth { background: #08090c; color: #e2e8f0; font-family: 'Plus Jakarta Sans', sans-serif; padding: 60px 20px; position: relative; }
.stealth-glow { position: fixed; top: 10%; right: 15%; width: 400px; height: 400px; background: radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%); pointer-events: none; }
.dark-container { max-width: 860px; margin: 0 auto; position: relative; z-index: 10; }
.badge-stealth { display: inline-block; font-size: 0.75rem; letter-spacing: 2px; color: #10b981; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); padding: 4px 12px; border-radius: 20px; margin-bottom: 20px; }
.dark-title { font-size: 3.5rem; font-weight: 800; color: #fff; letter-spacing: -1.5px; }
.dark-role { font-size: 1.35rem; color: #94a3b8; margin: 8px 0 20px; }
.dark-bio { font-size: 1.15rem; color: #cbd5e1; line-height: 1.6; max-width: 700px; margin-bottom: 50px; }
.dark-section { margin-bottom: 50px; }
.dark-h2 { font-size: 1.25rem; font-weight: 700; color: #fff; letter-spacing: 1px; margin-bottom: 20px; }
.dark-h2 span { color: #10b981; margin-right: 8px; }
.dark-skills-grid { display: flex; flex-wrap: wrap; gap: 10px; }
.dark-skill-pill { background: #12151c; border: 1px solid #1e2430; padding: 8px 16px; border-radius: 8px; font-size: 0.9rem; color: #cbd5e1; }
.dark-projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; }
.dark-proj-card { background: #10121a; border: 1px solid #1a1f2c; padding: 24px; border-radius: 12px; }
.dark-proj-card h3 { font-size: 1.25rem; color: #fff; margin-bottom: 8px; }
.dark-proj-card p { font-size: 0.9rem; color: #94a3b8; margin-bottom: 16px; }
.dark-tags span { background: #181c26; color: #10b981; font-size: 0.75rem; padding: 3px 8px; border-radius: 4px; margin-right: 6px; }
.dark-btn { display: inline-block; margin-top: 14px; color: #10b981; text-decoration: none; font-size: 0.9rem; font-weight: 600; }
.dark-footer { border-top: 1px solid #1a1f2c; padding-top: 30px; text-align: center; color: #64748b; font-size: 0.95rem; }
.dark-footer a { color: #10b981; text-decoration: none; }`;

  const js = `console.log('Stealth dark initiated');`;
  return { html, css, js };
}

// 12. 3D TEMPLATE ENGINE (Isometric Layers, Dynamic Tilt Interaction)
export function generate3DTemplate(data = DEFAULT_USER_DATA) {
  const p = data.personal || DEFAULT_USER_DATA.personal;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.name} — 3D Dimensional Portfolio</title>
  <link rel="stylesheet" href="style.css">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&display=swap" rel="stylesheet">
</head>
<body class="theme-3d">
  <div class="perspective-wrap">
    <div class="card-3d hero-3d">
      <div class="card-inner">
        <div class="tag-3d">DEPTH: Z-INDEX 100</div>
        <h1>${p.name}</h1>
        <p class="role-3d">${p.profession}</p>
        <p class="bio-3d">${p.bio}</p>
      </div>
    </div>

    <div class="section-title-3d">DIMENSIONAL PROJECTS</div>
    <div class="grid-3d">
      ${(data.projects || []).map(pr => `
        <div class="card-3d proj-3d">
          <div class="card-inner">
            <h3>${pr.title}</h3>
            <p>${pr.description}</p>
            <div class="tags-3d">${(pr.tags || []).join(' • ')}</div>
            ${pr.live ? `<a href="${pr.live}" target="_blank" class="btn-3d">EXPLORE IN 3D &rarr;</a>` : ''}
          </div>
        </div>
      `).join('')}
    </div>

    <div class="card-3d contact-3d">
      <div class="card-inner">
        <h2>INTERSECT DIMENSIONS</h2>
        <p>Email: <a href="mailto:${data.contact?.email}">${data.contact?.email}</a></p>
      </div>
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>`;

  const css = `* { margin:0; padding:0; box-sizing:border-box; }
body.theme-3d {
  background: #0f111a;
  color: #fff;
  font-family: 'Plus Jakarta Sans', sans-serif;
  padding: 60px 20px;
  perspective: 1000px;
}
.perspective-wrap { max-width: 880px; margin: 0 auto; display: flex; flex-direction: column; gap: 30px; }
.card-3d {
  background: linear-gradient(135deg, #1f2438 0%, #151824 100%);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2);
  transform: rotateX(4deg) rotateY(-2deg);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card-3d:hover {
  transform: rotateX(0deg) rotateY(0deg) scale(1.02);
  box-shadow: 0 40px 80px rgba(168,85,247,0.25);
}
.tag-3d { font-size: 0.75rem; letter-spacing: 2px; color: #a855f7; font-weight: 800; margin-bottom: 12px; }
.hero-3d h1 { font-size: 3rem; font-weight: 800; }
.role-3d { font-size: 1.25rem; color: #38bdf8; margin: 8px 0 16px; }
.bio-3d { color: #94a3b8; font-size: 1.05rem; line-height: 1.5; }
.section-title-3d { font-size: 1.1rem; letter-spacing: 2px; color: #a855f7; font-weight: 800; margin: 10px 0 0; }
.grid-3d { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; }
.proj-3d { padding: 24px; }
.proj-3d h3 { font-size: 1.2rem; margin-bottom: 8px; }
.proj-3d p { font-size: 0.85rem; color: #94a3b8; margin-bottom: 12px; }
.tags-3d { font-size: 0.75rem; color: #38bdf8; margin-bottom: 14px; }
.btn-3d { display: inline-block; background: #a855f7; color: #fff; padding: 6px 14px; border-radius: 8px; text-decoration: none; font-size: 0.8rem; font-weight: 700; }
.contact-3d { text-align: center; }
.contact-3d a { color: #38bdf8; font-weight: bold; }`;

  const js = `// 3D Tilt interactive effect
document.querySelectorAll('.card-3d').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = \`rotateY(\${x / 25}deg) rotateX(\${-y / 25}deg) translateY(-5px)\`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(4deg) rotateY(-2deg)';
  });
});`;

  return { html, css, js };
}

// Master dispatch function
export function generatePortfolioCode(templateName = 'Minimal', userData = DEFAULT_USER_DATA) {
  const norm = (templateName || 'Minimal').toLowerCase().replace(/[\s-_]+/g, '');
  switch (norm) {
    case 'bento':
      return generateBentoTemplate(userData);
    case 'terminal':
      return generateTerminalTemplate(userData);
    case 'neumorphic':
    case 'softui':
      return generateNeumorphicTemplate(userData);
    case 'retroarcade':
    case 'arcade':
    case 'retro':
      return generateRetroArcadeTemplate(userData);
    case 'editorial':
      return generateEditorialTemplate(userData);
    case 'aurora':
      return generateAuroraTemplate(userData);
    case 'blueprint':
      return generateBlueprintTemplate(userData);
    case 'kinetic':
      return generateKineticTemplate(userData);
    case 'carddeck':
    case 'deck':
      return generateCardDeckTemplate(userData);
    case 'holographic':
    case 'holo':
      return generateHolographicTemplate(userData);
    case 'deepspace':
    case 'space':
      return generateSpaceTemplate(userData);
    case 'origami':
    case 'paper':
      return generateOrigamiTemplate(userData);
    case 'developer':
      return generateDeveloperTemplate(userData);
    case 'student':
      return generateStudentTemplate(userData);
    case 'corporate':
      return generateCorporateTemplate(userData);
    case 'designer':
      return generateDesignerTemplate(userData);
    case 'luxury':
      return generateLuxuryTemplate(userData);
    case 'cyberpunk':
      return generateCyberpunkTemplate(userData);
    case 'glassmorphism':
      return generateGlassmorphismTemplate(userData);
    case 'creative':
      return generateCreativeTemplate(userData);
    case 'photographer':
      return generatePhotographerTemplate(userData);
    case 'dark':
      return generateDarkTemplate(userData);
    case '3d':
      return generate3DTemplate(userData);
    case 'minimal':
    default:
      return generateMinimalTemplate(userData);
  }
}
