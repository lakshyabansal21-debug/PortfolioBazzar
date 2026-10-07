import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Github, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  ShieldCheck,
  Send,
  Copy
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { 
  supabaseUrl, 
  isSupabaseConfigured, 
  saveCustomSupabase, 
  clearCustomSupabase, 
  testSupabaseConnection 
} from '../../supabase/client.js';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const { 
    user,
    signInWithOAuth, 
    signInWithPassword, 
    signUpWithPassword, 
    forgotPassword, 
    resendConfirmationEmail 
  } = useAuth();
  const { addToast } = useToast();

  const [mode, setMode] = useState(initialMode); // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [popupBlockedUrl, setPopupBlockedUrl] = useState(null);
  
  // Close modal automatically when authenticated (e.g. from Google OAuth popup)
  useEffect(() => {
    if (user && isOpen) {
      onClose();
    }
  }, [user, isOpen, onClose]);
  
  // Email confirmation state (when Supabase has "Confirm email" enabled)
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // In-app Supabase Project Connection drawer
  const [showConfig, setShowConfig] = useState(false);
  const [configUrl, setConfigUrl] = useState(supabaseUrl || '');
  const [configKey, setConfigKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    addToast('Copied to clipboard!', 'info');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  useEffect(() => {
    setMode(initialMode);
    setErrorMsg('');
    setNeedsConfirmation(false);
    setResendSuccess(false);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await signInWithPassword(email, password);
        addToast('Signed in successfully', 'success');
        onClose();
      } else if (mode === 'signup') {
        const res = await signUpWithPassword(email, password, username);
        if (res?.requiresEmailConfirmation) {
          setConfirmationEmail(email);
          setNeedsConfirmation(true);
          addToast('Account created! Please verify your email inbox.', 'info');
        } else {
          addToast('Account created and signed in!', 'success');
          onClose();
        }
      } else if (mode === 'forgot') {
        await forgotPassword(email);
        addToast('Password reset link sent to your email', 'info');
        setMode('login');
      }
    } catch (err) {
      if (err.code === 'email_not_confirmed') {
        setConfirmationEmail(email);
        setErrorMsg(err.message);
      } else {
        setErrorMsg(err.message || 'Authentication failed. Please verify your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isInIframe = typeof window !== 'undefined' && window.self !== window.top;

  const handleOAuth = async (provider = 'google') => {
    setErrorMsg('');
    setPopupBlockedUrl(null);
    setLoading(true);
    try {
      addToast(
        isInIframe 
          ? 'Opening Google sign-in window...' 
          : 'Connecting to Google...', 
        'info'
      );
      await signInWithOAuth(provider);
    } catch (err) {
      if (err.code === 'POPUP_BLOCKED') {
        setErrorMsg('The sign-in popup was blocked by your browser. Please click the button below to open it.');
        setPopupBlockedUrl(err.url);
      } else {
        const raw = err.message || '';
        if (raw.toLowerCase().includes('access_denied') || raw.includes('403')) {
          setErrorMsg(
            'Google Error 403 (access_denied): Your Google Cloud OAuth app is currently in "Testing" mode. To allow logins, go to Google Cloud Console → OAuth consent screen and either click "Publish App" or add your email to "Test users".'
          );
        } else {
          setErrorMsg(raw || 'Google authentication failed. Please verify that the Google provider is enabled in your Supabase dashboard.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    const targetEmail = confirmationEmail || email;
    if (!targetEmail) {
      setErrorMsg('Please enter your email address first.');
      return;
    }
    setResending(true);
    try {
      await resendConfirmationEmail(targetEmail);
      setResendSuccess(true);
      addToast(`Verification link resent to ${targetEmail}`, 'success');
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err) {
      addToast('Could not resend email: ' + (err.message || 'Rate limit reached'), 'error');
    } finally {
      setResending(false);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testSupabaseConnection();
      setTestResult(res);
      if (res.ok) {
        addToast(res.message, 'success');
      } else {
        addToast(res.message, 'error');
      }
    } catch (e) {
      setTestResult({ ok: false, message: e.message });
    } finally {
      setTesting(false);
    }
  };

  const handleSaveConfig = () => {
    if (!configUrl || !configKey) {
      addToast('Please enter both Supabase URL and anon key', 'error');
      return;
    }
    saveCustomSupabase(configUrl, configKey);
    addToast('Supabase connection credentials saved! Reloading...', 'success');
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  const handleResetConfig = () => {
    clearCustomSupabase();
    addToast('Reset to default project credentials. Reloading...', 'info');
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl p-6 sm:p-7 border border-line shadow-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-pencil hover:text-ink hover:bg-paper-2 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-accent">
              PORTFOLIOHUB ACCESS
            </span>
            <span className="inline-flex items-center gap-1 text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Supabase Auth
            </span>
          </div>

          <h2 className="text-xl font-bold text-ink tracking-tight">
            {needsConfirmation 
              ? 'Check your inbox' 
              : mode === 'login' 
              ? 'Sign in to your account' 
              : mode === 'signup' 
              ? 'Create developer account' 
              : 'Reset account password'}
          </h2>
          <p className="text-xs text-soft mt-1 leading-relaxed">
            {needsConfirmation
              ? `We sent a verification link to ${confirmationEmail}.`
              : mode === 'login' 
              ? 'Access your cloud-synced portfolios, custom engine presets, and starred templates.' 
              : mode === 'signup' 
              ? 'Your profile, custom templates, and stars are stored directly in Supabase Postgres.' 
              : 'Enter your email to receive recovery instructions.'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMsg}</div>
            </div>
            {errorMsg.toLowerCase().includes('not confirmed') && (
              <div className="pt-2 border-t border-red-200 flex items-center justify-between">
                <span className="text-[11px] text-red-600">Didn't receive email?</span>
                <button
                  type="button"
                  onClick={handleResendConfirmation}
                  disabled={resending}
                  className="text-xs font-semibold text-red-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>{resending ? 'Sending...' : 'Resend verification link'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Screen: Email Confirmation Instructions */}
        {needsConfirmation ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs space-y-3">
              <div className="flex items-center gap-2 text-amber-800 font-semibold">
                <Mail className="w-4 h-4 text-accent" />
                <span>Verification Email Dispatched</span>
              </div>
              <p className="text-pencil leading-relaxed">
                Click the confirmation link sent to <strong className="text-ink">{confirmationEmail}</strong>. 
                Once confirmed, you can log in with your email and password.
              </p>
              <div className="p-2.5 rounded-lg bg-white/80 border border-amber-200/80 text-[11px] text-soft space-y-1">
                <span className="font-semibold text-ink block">Developer / Admin Tip:</span>
                <p>
                  To enable instant sign in without confirmation emails, go to your 
                  <strong className="text-ink"> Supabase Dashboard → Authentication → Providers → Email</strong> and toggle 
                  <strong className="text-accent"> "Confirm email" to OFF</strong>.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleResendConfirmation}
                disabled={resending}
                className="w-full py-2.5 px-3 rounded-lg border border-line bg-white hover:bg-paper text-ink font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Send className={`w-3.5 h-3.5 ${resending ? 'animate-pulse' : ''}`} />
                <span>{resendSuccess ? 'Email sent!' : resending ? 'Resending...' : 'Resend confirmation email'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setNeedsConfirmation(false);
                  setMode('login');
                }}
                className="w-full py-2.5 px-3 rounded-lg bg-hl hover:bg-accent text-ink hover:text-white font-bold text-xs transition-all cursor-pointer shadow-2xs"
              >
                Back to Sign in
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Third-party OAuth Buttons */}
            {mode !== 'forgot' && (
              <div className="space-y-2 mb-4">
                <button
                  type="button"
                  onClick={() => handleOAuth('google')}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border border-line bg-white hover:bg-paper text-ink text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 shadow-2xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {popupBlockedUrl && (
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-center space-y-2">
                    <p className="text-[11px] text-amber-800">
                      Popup blocked by browser. Click below to authorize in a new tab:
                    </p>
                    <a
                      href={popupBlockedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 py-1.5 px-3 rounded-md bg-ink text-white text-[11px] font-semibold hover:bg-black"
                    >
                      Open Google Sign-in ↗
                    </a>
                  </div>
                )}

                <p className="text-[10px] text-pencil text-center">
                  {isInIframe
                    ? 'Opens in a secure popup window (preview mode).'
                    : 'Signs in securely directly on this page.'}
                </p>
              </div>
            )}

            {mode !== 'forgot' && (
              <div className="flex items-center gap-3 my-4">
                <div className="h-px bg-line flex-1" />
                <span className="text-[10px] text-pencil uppercase font-mono">or email & password</span>
                <div className="h-px bg-line flex-1" />
              </div>
            )}

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Username</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-pencil absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="alexvance"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-line text-ink focus:outline-none focus:border-accent focus:ring-2 focus:ring-hl/20"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Email</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-pencil absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="alex@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-line text-ink focus:outline-none focus:border-accent focus:ring-2 focus:ring-hl/20"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-ink">Password</label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-[11px] text-pencil hover:text-accent cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-pencil absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-line text-ink focus:outline-none focus:border-accent focus:ring-2 focus:ring-hl/20"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-3 rounded-lg bg-hl hover:bg-accent text-ink hover:text-white font-bold text-xs transition-all cursor-pointer disabled:opacity-50 shadow-2xs flex items-center justify-center gap-1.5"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Connecting to Supabase...</span>
                  </>
                ) : (
                  <span>
                    {mode === 'login' ? 'Sign in' : mode === 'signup' ? 'Create Account' : 'Send recovery link'}
                  </span>
                )}
              </button>
            </form>

            {/* Mode Switch */}
            <div className="mt-4 pt-4 border-t border-line text-center text-xs text-soft">
              {mode === 'login' && (
                <p>
                  Don't have an account?{' '}
                  <button
                    onClick={() => { setMode('signup'); setErrorMsg(''); }}
                    className="font-bold text-ink hover:text-accent ml-1 cursor-pointer"
                  >
                    Create one
                  </button>
                </p>
              )}

              {mode === 'signup' && (
                <p>
                  Already registered?{' '}
                  <button
                    onClick={() => { setMode('login'); setErrorMsg(''); }}
                    className="font-bold text-ink hover:text-accent ml-1 cursor-pointer"
                  >
                    Sign in
                  </button>
                </p>
              )}

              {mode === 'forgot' && (
                <p>
                  Remember your password?{' '}
                  <button
                    onClick={() => { setMode('login'); setErrorMsg(''); }}
                    className="font-bold text-ink hover:text-accent ml-1 cursor-pointer"
                  >
                    Back to sign in
                  </button>
                </p>
              )}
            </div>
          </>
        )}

        {/* Collapsible Supabase Connection Manager & Cloud Guide */}
        <div className="mt-5 pt-3 border-t border-line">
          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            className="w-full flex items-center justify-between text-[11px] font-mono text-pencil hover:text-ink py-1 cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-accent" />
              <span>Supabase Connection & Guide</span>
            </div>
            {showConfig ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showConfig && (
            <div className="mt-3 p-3 rounded-xl bg-paper border border-line space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-pencil">Connected URL:</span>
                <span className="font-mono text-[11px] font-bold text-ink truncate max-w-[200px]" title={supabaseUrl}>
                  {supabaseUrl || 'Not configured'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="flex-1 py-1.5 px-2.5 rounded-md bg-white border border-line hover:bg-paper-2 text-ink text-[11px] font-semibold cursor-pointer shadow-2xs flex items-center justify-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${testing ? 'animate-spin' : ''}`} />
                  <span>{testing ? 'Testing...' : 'Test Connection'}</span>
                </button>
              </div>

              {testResult && (
                <div className={`p-2 rounded-md text-[11px] font-mono ${
                  testResult.ok ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {testResult.message}
                </div>
              )}

              {/* How to Connect instructions */}
              <div className="space-y-3 pt-2 border-t border-line text-[11px] text-soft">
                {/* Notice for Vercel DEPLOYMENT_NOT_FOUND */}
                <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-300/80 space-y-1.5 text-[11px] text-amber-950">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Seeing 404: DEPLOYMENT_NOT_FOUND on Google login?</span>
                  </div>
                  <p className="text-[10px] leading-relaxed text-amber-800">
                    This error comes from Vercel when Supabase redirects Google Auth to an old or deleted Vercel URL. Fix it in your Supabase Dashboard:
                  </p>
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between bg-white px-2 py-1 rounded border border-amber-200">
                      <span className="font-mono text-[10px] text-soft truncate mr-2">
                        Site URL: {window.location.origin}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(window.location.origin, 'site_url')}
                        className="text-[10px] font-semibold text-accent hover:underline flex items-center gap-1 shrink-0"
                      >
                        <Copy className="w-2.5 h-2.5" />
                        {copiedKey === 'site_url' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between bg-white px-2 py-1 rounded border border-amber-200">
                      <span className="font-mono text-[10px] text-soft truncate mr-2">
                        Redirect URL: {window.location.origin}/**
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(`${window.location.origin}/**`, 'redirect_url')}
                        className="text-[10px] font-semibold text-accent hover:underline flex items-center gap-1 shrink-0"
                      >
                        <Copy className="w-2.5 h-2.5" />
                        {copiedKey === 'redirect_url' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>

                <strong className="text-ink block">Supabase & Google Setup Checklist:</strong>
                
                <div className="space-y-1">
                  <span className="font-semibold text-ink block text-[11px]">1. Supabase URL Configuration (Fixes 404 DEPLOYMENT_NOT_FOUND):</span>
                  <ul className="list-disc pl-4 space-y-1 text-soft">
                    <li>Open <strong>Supabase Dashboard → Authentication → URL Configuration</strong>.</li>
                    <li>Update <strong>Site URL</strong> to: <code className="text-accent font-mono select-all">{window.location.origin}</code></li>
                    <li>In <strong>Redirect URLs</strong>, add: <code className="text-accent font-mono select-all">{window.location.origin}/**</code></li>
                  </ul>
                </div>

                <div className="space-y-1">
                  <span className="font-semibold text-ink block text-[11px]">2. Google Provider in Supabase:</span>
                  <ul className="list-disc pl-4 space-y-0.5 text-soft">
                    <li>Go to <strong>Authentication → Providers → Google</strong> and toggle ON.</li>
                    <li>Ensure your Google <strong>Client ID</strong> and <strong>Client Secret</strong> are entered.</li>
                    <li>In Google Cloud Console, add Authorized redirect URI: <code className="text-accent break-all">{configUrl || 'https://svdimbfahtekqdelpeyg.supabase.co'}/auth/v1/callback</code></li>
                  </ul>
                </div>

                <div className="space-y-1">
                  <span className="font-semibold text-ink block text-[11px]">3. Email & Instant Sign-in:</span>
                  <ul className="list-disc pl-4 space-y-0.5 text-soft">
                    <li>In <strong>Providers → Email</strong>, toggle <strong>"Confirm email" OFF</strong> for immediate signup without email verification links.</li>
                  </ul>
                </div>

                <div className="space-y-1">
                  <span className="font-semibold text-ink block text-[11px]">4. Run Database Schema:</span>
                  <ul className="list-disc pl-4 space-y-0.5 text-soft">
                    <li>In <strong>SQL Editor</strong>, run <code className="text-accent">/sql/schema.sql</code> to create profiles, templates, and the signup trigger.</li>
                  </ul>
                </div>

                <div className="space-y-1">
                  <span className="font-semibold text-amber-800 block text-[11px]">5. Fix Google 403 Error & Mobile Logins:</span>
                  <ul className="list-disc pl-4 space-y-0.5 text-soft">
                    <li>In <strong>Google Cloud Console → OAuth consent screen</strong>: If status is <strong>"Testing"</strong>, only emails added to <strong>"Test users"</strong> can log in (others get error 403: access_denied). Click <strong>"Publish App"</strong> to make it public!</li>
                    <li>On mobile, always open in <strong>Safari / Chrome</strong> directly rather than in-app webviews (e.g. inside Instagram/TikTok/WhatsApp) which block Google logins.</li>
                  </ul>
                </div>
              </div>

              {/* Custom Keys Input (Optional Override) */}
              <div className="pt-2 border-t border-line space-y-2">
                <span className="text-[10px] font-mono text-pencil uppercase block">Connect Custom Supabase Keys:</span>
                <input
                  type="text"
                  placeholder="https://your-project.supabase.co"
                  value={configUrl}
                  onChange={(e) => setConfigUrl(e.target.value)}
                  className="w-full px-2 py-1.5 text-[11px] rounded border border-line bg-white font-mono"
                />
                <input
                  type="password"
                  placeholder="Your anon public API key"
                  value={configKey}
                  onChange={(e) => setConfigKey(e.target.value)}
                  className="w-full px-2 py-1.5 text-[11px] rounded border border-line bg-white font-mono"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSaveConfig}
                    className="flex-1 py-1 rounded bg-ink text-white text-[10px] font-bold cursor-pointer"
                  >
                    Save & Reconnect
                  </button>
                  <button
                    type="button"
                    onClick={handleResetConfig}
                    className="px-2 py-1 rounded border border-line text-[10px] text-pencil hover:text-ink cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
