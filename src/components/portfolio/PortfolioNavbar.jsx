import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Github, 
  Linkedin, 
  FileText, 
  Menu, 
  X, 
  Layers, 
  ArrowUpRight,
  Send,
  Terminal
} from 'lucide-react';
import { DEVELOPER_DATA } from '../../data/portfolioData.js';

export default function PortfolioNavbar({ onOpenResume, onOpenContact }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Experience', href: '#experience' },
    { label: 'Achievements', href: '#achievements' },
    { label: 'Contact', href: '#contact' }
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    
    if (location.pathname !== '/') {
      window.location.href = `/${href}`;
      return;
    }

    const target = document.querySelector(href);
    if (target) {
      const topOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled
            ? 'bg-paper/90 backdrop-blur-md border-b border-line shadow-[0_1px_3px_rgba(24,24,27,0.03)]'
            : 'bg-paper/80 backdrop-blur-xs border-b border-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
          
          {/* Left: Identity & Live Status */}
          <div className="flex items-center gap-4">
            <a 
              href="#hero" 
              onClick={(e) => handleNavClick(e, '#hero')}
              className="group flex items-center gap-2.5 focus-visible:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-ink text-white flex items-center justify-center font-mono text-xs font-semibold tracking-tight shadow-xs group-hover:bg-ink-2 transition-colors">
                <span>LB</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-ink tracking-tight group-hover:text-accent transition-colors">
                  {DEVELOPER_DATA.personal.name}
                </span>
                <span className="text-[11px] text-pencil hidden sm:block">
                  {DEVELOPER_DATA.personal.role.split('&')[0].trim()}
                </span>
              </div>
            </a>

            {/* Subtle Availability Indicator */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-paper border border-line text-[11px] text-soft">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available for roles</span>
            </div>
          </div>

          {/* Desktop Center Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-3 py-1.5 text-xs font-medium text-soft hover:text-ink hover:bg-paper-2/80 rounded-md transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Social Links */}
            <a
              href={DEVELOPER_DATA.personal.github}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-soft hover:text-ink hover:bg-paper-2 rounded-md transition-colors"
              title="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={DEVELOPER_DATA.personal.linkedin}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-soft hover:text-ink hover:bg-paper-2 rounded-md transition-colors"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4" />
            </a>

            {/* Studio / Templates Link (Existing feature preserved) */}
            <Link
              to="/explore"
              className="px-2.5 py-1.5 text-xs font-medium text-soft hover:text-ink hover:bg-paper-2 border border-line rounded-md transition-colors flex items-center gap-1.5"
              title="Portfolio Studio & Template Gallery"
            >
              <Layers className="w-3.5 h-3.5 text-accent" />
              <span className="hidden lg:inline">Templates</span>
            </Link>

            {/* Resume Button */}
            <button
              onClick={onOpenResume}
              className="px-3.5 py-1.5 text-xs font-semibold bg-ink text-white hover:bg-ink-2 rounded-md shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resume</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenResume}
              className="px-2.5 py-1 text-xs font-semibold bg-ink text-white rounded-md flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>CV</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-ink hover:bg-paper-2 rounded-md transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Slide-down Sheet */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-b border-line bg-paper px-4 py-5 shadow-lg animate-in slide-in-from-top duration-200">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-2 pb-2 mb-1 border-b border-line text-xs text-pencil">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{DEVELOPER_DATA.personal.statusShort}</span>
              </div>
              
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-3 py-2 text-sm font-medium text-ink hover:bg-paper-2 rounded-md transition-colors flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-pencil" />
                </a>
              ))}

              <div className="pt-3 mt-2 border-t border-line flex flex-col gap-2.5">
                <Link
                  to="/explore"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 px-3 text-xs font-medium text-soft bg-white border border-line rounded-md flex items-center justify-center gap-2"
                >
                  <Layers className="w-4 h-4 text-accent" />
                  <span>Explore Portfolio Templates & Studio</span>
                </Link>

                <div className="flex items-center justify-center gap-4 pt-1">
                  <a
                    href={DEVELOPER_DATA.personal.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-soft hover:text-ink bg-white border border-line rounded-md"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href={DEVELOPER_DATA.personal.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-soft hover:text-ink bg-white border border-line rounded-md"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenContact) onOpenContact();
                    }}
                    className="p-2 text-soft hover:text-ink bg-white border border-line rounded-md"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
