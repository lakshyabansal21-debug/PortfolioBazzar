import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
<<<<<<< HEAD

export default function Footer() {
  const { isAdmin } = useAuth();

  return (
=======
import { TEMPLATE_CATEGORIES } from '../../services/templateEngines.js';
import { SITE } from '../../config/siteConfig.js';

const LINK_CLASS = 'hover:text-ink transition-colors';

/** An outside link that only shows up when its URL is set in siteConfig / .env. */
function ExternalLink({ href, children, className = LINK_CLASS }) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {children}
    </a>
  );
}

/** Site footer. Every outside link comes from SITE.links, so nothing is hard-coded here. */
export default function Footer() {
  const { isAdmin } = useAuth();
  const { links } = SITE;
  const socials = [
    { href: links.github, title: 'GitHub', Icon: Github },
    { href: links.twitter, title: 'X / Twitter', Icon: Twitter },
    { href: links.linkedin, title: 'LinkedIn', Icon: Linkedin }
  ].filter((item) => item.href);

  const resources = [
    { href: links.github, label: 'GitHub Repository' },
    { href: links.docs, label: 'Documentation' }
  ].filter((item) => item.href);

  const legal = [
    { href: links.privacy, label: 'Privacy' },
    { href: links.terms, label: 'Terms' },
    { href: links.changelog, label: 'Changelog' }
  ].filter((item) => item.href);

  return (
>>>>>>> a6a0a74 (Update website content and layout)
    <footer className="border-t border-line bg-white text-pencil text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">

          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-ink text-hl font-black text-xs flex items-center justify-center font-mono">
<<<<<<< HEAD
                P
              </span>
              <span className="font-semibold text-sm tracking-tight text-ink">
                PortfolioHub
=======
                {SITE.name.charAt(0)}
>>>>>>> a6a0a74 (Update website content and layout)
              </span>
              <span className="font-semibold text-sm tracking-tight text-ink">{SITE.name}</span>
            </Link>
            <p className="text-xs text-pencil max-w-sm leading-relaxed">
              Open platform for discovering, customizing, and sharing clean developer portfolio architectures with 0KB dependencies and zero build steps.
            </p>
<<<<<<< HEAD
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="text-pencil hover:text-ink transition-colors"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="text-pencil hover:text-ink transition-colors"
                title="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="text-pencil hover:text-ink transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Product */}
          <div>
            <h4 className="text-xs font-semibold text-ink mb-3">
              Product
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/explore" className="hover:text-ink transition-colors">Explore</Link></li>
              <li><Link to="/generator" className="hover:text-ink transition-colors">Generator</Link></li>
              <li><Link to="/editor" className="hover:text-ink transition-colors">Split Editor</Link></li>
              <li><Link to="/upload" className="hover:text-ink transition-colors">Upload Template</Link></li>
            </ul>
          </div>

          {/* Col 3: Templates */}
          <div>
            <h4 className="text-xs font-semibold text-ink mb-3">
              Templates
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/explore?category=Developer" className="hover:text-ink transition-colors">Developer</Link></li>
              <li><Link to="/explore?category=Minimal" className="hover:text-ink transition-colors">Minimal</Link></li>
              <li><Link to="/explore?category=Terminal" className="hover:text-ink transition-colors">Terminal</Link></li>
              <li><Link to="/explore?category=Creative" className="hover:text-ink transition-colors">Creative</Link></li>
            </ul>
          </div>

          {/* Col 4: Resources */}
          <div>
            <h4 className="text-xs font-semibold text-ink mb-3">
              Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-ink transition-colors">GitHub Repository</a></li>
              <li><Link to="/explore" className="hover:text-ink transition-colors">Export Guide</Link></li>
              <li><Link to="/explore" className="hover:text-ink transition-colors">Documentation</Link></li>
              {isAdmin && (
                <li><Link to="/admin" className="hover:text-ink transition-colors">Admin Portal</Link></li>
              )}
            </ul>
          </div>
=======
            {socials.length > 0 && (
              <div className="flex items-center gap-3 pt-1">
                {socials.map(({ href, title, Icon }) => (
                  <ExternalLink key={title} href={href} className="text-pencil hover:text-ink transition-colors">
                    <span title={title}><Icon className="w-4 h-4" /></span>
                  </ExternalLink>
                ))}
              </div>
            )}
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold text-ink mb-3">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/explore" className={LINK_CLASS}>Explore</Link></li>
              <li><Link to="/generator" className={LINK_CLASS}>Generator</Link></li>
              <li><Link to="/editor" className={LINK_CLASS}>Split Editor</Link></li>
              <li><Link to="/upload" className={LINK_CLASS}>Upload Template</Link></li>
            </ul>
          </div>

          {/* Templates: the first few categories from the real category list */}
          <div>
            <h4 className="text-xs font-semibold text-ink mb-3">Templates</h4>
            <ul className="space-y-2 text-xs">
              {TEMPLATE_CATEGORIES.slice(0, 4).map((category) => (
                <li key={category}>
                  <Link to={`/explore?category=${encodeURIComponent(category)}`} className={LINK_CLASS}>{category}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources: only links that are configured (plus the admin link for admins) */}
          {(resources.length > 0 || isAdmin) && (
            <div>
              <h4 className="text-xs font-semibold text-ink mb-3">Resources</h4>
              <ul className="space-y-2 text-xs">
                {resources.map(({ href, label }) => (
                  <li key={label}><ExternalLink href={href}>{label}</ExternalLink></li>
                ))}
                {isAdmin && <li><Link to="/admin" className={LINK_CLASS}>Admin Portal</Link></li>}
              </ul>
            </div>
          )}
>>>>>>> a6a0a74 (Update website content and layout)

        </div>

        {/* Bottom row */}
        <div className="border-t border-line mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-pencil">
<<<<<<< HEAD
          <p>© {new Date().getFullYear()} PortfolioHub. Clean developer portfolios.</p>
          <div className="flex items-center gap-4">
            <Link to="/explore" className="hover:text-ink">Privacy</Link>
            <Link to="/explore" className="hover:text-ink">Terms</Link>
            <Link to="/explore" className="hover:text-ink">Changelog</Link>
          </div>
=======
          <p>© {new Date().getFullYear()} {SITE.name}. Clean developer portfolios.</p>
          {legal.length > 0 && (
            <div className="flex items-center gap-4">
              {legal.map(({ href, label }) => (
                <ExternalLink key={label} href={href} className="hover:text-ink">{label}</ExternalLink>
              ))}
            </div>
          )}
>>>>>>> a6a0a74 (Update website content and layout)
        </div>
      </div>
    </footer>
  );
}
