import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#E9E7E1] bg-white text-[#777777] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-3">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-[#111111] text-[#FACC15] font-black text-xs flex items-center justify-center font-mono">
                P
              </span>
              <span className="font-semibold text-sm tracking-tight text-[#111111]">
                PortfolioHub
              </span>
            </Link>
            <p className="text-xs text-[#777777] max-w-sm leading-relaxed">
              Open platform for discovering, customizing, and sharing clean developer portfolio architectures with 0KB dependencies and zero build steps.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="text-[#777777] hover:text-[#111111] transition-colors"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="text-[#777777] hover:text-[#111111] transition-colors"
                title="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="text-[#777777] hover:text-[#111111] transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Product */}
          <div>
            <h4 className="text-xs font-semibold text-[#111111] mb-3">
              Product
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/explore" className="hover:text-[#111111] transition-colors">Explore</Link></li>
              <li><Link to="/generator" className="hover:text-[#111111] transition-colors">Generator</Link></li>
              <li><Link to="/editor" className="hover:text-[#111111] transition-colors">Split Editor</Link></li>
              <li><Link to="/upload" className="hover:text-[#111111] transition-colors">Upload Template</Link></li>
            </ul>
          </div>

          {/* Col 3: Templates */}
          <div>
            <h4 className="text-xs font-semibold text-[#111111] mb-3">
              Templates
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/explore?category=Developer" className="hover:text-[#111111] transition-colors">Developer</Link></li>
              <li><Link to="/explore?category=Minimal" className="hover:text-[#111111] transition-colors">Minimal</Link></li>
              <li><Link to="/explore?category=Terminal" className="hover:text-[#111111] transition-colors">Terminal</Link></li>
              <li><Link to="/explore?category=Creative" className="hover:text-[#111111] transition-colors">Creative</Link></li>
            </ul>
          </div>

          {/* Col 4: Resources */}
          <div>
            <h4 className="text-xs font-semibold text-[#111111] mb-3">
              Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#111111] transition-colors">GitHub Repository</a></li>
              <li><Link to="/explore" className="hover:text-[#111111] transition-colors">Export Guide</Link></li>
              <li><Link to="/explore" className="hover:text-[#111111] transition-colors">Documentation</Link></li>
              <li><Link to="/admin" className="hover:text-[#111111] transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom row */}
        <div className="border-t border-[#E9E7E1] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#777777]">
          <p>© {new Date().getFullYear()} PortfolioHub. Clean developer portfolios.</p>
          <div className="flex items-center gap-4">
            <Link to="/explore" className="hover:text-[#111111]">Privacy</Link>
            <Link to="/explore" className="hover:text-[#111111]">Terms</Link>
            <Link to="/explore" className="hover:text-[#111111]">Changelog</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
