import React, { useState } from 'react';
import { 
  Mail, 
  Copy, 
  Check, 
  Send, 
  Github, 
  Linkedin, 
  MapPin, 
  Clock, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { DEVELOPER_DATA } from '../../data/portfolioData.js';

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(DEVELOPER_DATA.personal.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleSubmitMessage = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormOpen(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <section id="contact" className="py-20 sm:py-28 border-t border-line/70 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Card Container */}
        <div className="bg-white rounded-2xl border border-line p-8 sm:p-12 lg:p-14 shadow-[0_4px_20px_rgba(24,24,27,0.03)] text-center relative overflow-hidden">
          
          {/* Subtle Corner Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/5 rounded-tr-full pointer-events-none" />

          {/* Availability Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-paper border border-line text-xs font-medium text-soft mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{DEVELOPER_DATA.personal.status}</span>
          </div>

          {/* Main Title */}
          <h2 className="text-3xl sm:text-5xl font-bold text-ink tracking-tight mb-4">
            Let's build something meaningful.
          </h2>

          <p className="text-sm sm:text-base text-soft max-w-xl mx-auto leading-relaxed mb-8">
            Whether you have a breakthrough distributed systems challenge, an ambitious engineering role, or want to discuss resilient architecture — my inbox is always open.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {/* Direct Email Link */}
            <a
              href={`mailto:${DEVELOPER_DATA.personal.email}`}
              className="px-5 py-3 rounded-lg bg-ink text-white text-xs sm:text-sm font-semibold hover:bg-ink-2 transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>{DEVELOPER_DATA.personal.email}</span>
            </a>

            {/* Copy Email Button */}
            <button
              onClick={handleCopyEmail}
              className="px-4 py-3 rounded-lg bg-white border border-line text-ink text-xs sm:text-sm font-medium hover:bg-paper-2 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Copy email to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-pencil" />
                  <span>Copy</span>
                </>
              )}
            </button>

            {/* In-place message toggle */}
            <button
              onClick={() => setFormOpen(!formOpen)}
              className="px-4 py-3 rounded-lg bg-white border border-line text-ink text-xs sm:text-sm font-medium hover:bg-paper-2 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-4 h-4 text-accent" />
              <span>{formOpen ? 'Close Form' : 'Send Quick Note'}</span>
            </button>
          </div>

          {/* Interactive In-Place Contact Form */}
          {formOpen && (
            <div className="mt-8 pt-8 border-t border-line max-w-lg mx-auto text-left animate-in fade-in duration-200">
              {formSubmitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                  <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-sm text-emerald-900">Message Received</h4>
                  <p className="text-xs text-emerald-700">Thank you for reaching out. I typically respond within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitMessage} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">Your Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Sarah Jenkins"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-line focus:border-accent focus:outline-none bg-paper"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">Your Email</label>
                    <input
                      type="email"
                      placeholder="sarah@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-line focus:border-accent focus:outline-none bg-paper"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">Message</label>
                    <textarea
                      rows={3}
                      placeholder="Let's connect regarding a distributed systems opportunity..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-line focus:border-accent focus:outline-none bg-paper resize-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-ink text-white text-xs font-semibold hover:bg-ink-2 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Social Profiles Grid */}
          <div className="pt-8 border-t border-line flex flex-wrap items-center justify-center gap-6 text-xs text-soft">
            <a
              href={DEVELOPER_DATA.personal.github}
              target="_blank"
              rel="noreferrer"
              className="hover:text-ink flex items-center gap-1.5 font-medium transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>github.com/lakshyabansal</span>
            </a>
            <span className="text-line hidden sm:inline">/</span>
            <a
              href={DEVELOPER_DATA.personal.linkedin}
              target="_blank"
              rel="noreferrer"
              className="hover:text-ink flex items-center gap-1.5 font-medium transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              <span>linkedin.com/in/lakshyabansal</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
