/**
 * AuthContext.jsx: Login state for the whole app (user, profile, session, isAdmin) plus sign in / sign up / sign out.
 * Works with Supabase when it is configured, and with a local demo user when it is not.
 * Use it anywhere with: const { user, isAdmin } = useAuth();
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../supabase/client.js';
import { SITE } from '../config/siteConfig.js';
import { KEYS, readText, writeText, removeKey } from '../services/localStore.js';

const AuthContext = createContext(null);

/**
 * Columns we read from `profiles`. `email` is left out on purpose: the database hides it from other
 * users, and the app already has your own email from the login session.
 */
const PROFILE_COLUMNS = 'id, username, full_name, avatar_url, bio, role, is_banned, website, github, linkedin, created_at, updated_at';

/** Profile fields a user is allowed to change about themselves (role etc. can never be sent from the app). */
const EDITABLE_PROFILE_FIELDS = ['username', 'full_name', 'bio', 'avatar_url', 'website', 'github', 'linkedin'];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user session on mount
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (isSupabaseConfigured) {
        try {
          const { data: { session: currentSession } } = await supabase.auth.getSession();
          if (mounted && currentSession) {
            setSession(currentSession);
            setUser(currentSession.user);
            await fetchProfile(currentSession.user.id);
          }
        } catch (e) {
          console.warn('Supabase session load error:', e);
        }
      } else {
        // Check local demo session
        const savedDemo = readText(KEYS.authUser);
        if (savedDemo) {
          try {
            const parsed = JSON.parse(savedDemo);
            setUser(parsed);
            setProfile(parsed);
          } catch (e) {
            console.error('Demo auth parse error:', e);
          }
        }
      }

      if (mounted) setLoading(false);
    }

    initAuth();

    // Listen for Supabase auth state changes if configured
    let authListener = null;
    if (isSupabaseConfigured) {
      const { data } = supabase.auth.onAuthStateChange(async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user || null);
        if (newSession?.user) {
          await ensureProfile(newSession.user);
        } else {
          setProfile(null);
        }
        setLoading(false);
      });
      authListener = data.subscription;
    }

    // Listen for OAuth completion message from popup callback window
    const handleOAuthMessage = async (event) => {
      // Only accept the message from our own site (the OAuth popup callback page)
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'SUPABASE_OAUTH_SUCCESS') {
        try {
          const { data } = await supabase.auth.getSession();
          if (data?.session) {
            setSession(data.session);
            setUser(data.session.user);
            await ensureProfile(data.session.user);
          }
        } catch (e) {
          console.warn('OAuth session refresh error:', e);
        }
      }
    };
    window.addEventListener('message', handleOAuthMessage);

    return () => {
      mounted = false;
      if (authListener) authListener.unsubscribe();
      window.removeEventListener('message', handleOAuthMessage);
    };
  }, []);

  /**
   * Load the signed-in user's profile row.
   * The database creates the row when someone signs up (trigger handle_new_user). If it is
   * missing (old account), we create it. We only create it when the read worked and found
   * nothing: a failed read must never overwrite an existing profile (it could demote an admin).
   */
  async function ensureProfile(userRecord, customUsername = '') {
    if (!isSupabaseConfigured || !userRecord?.id) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(PROFILE_COLUMNS)
        .eq('id', userRecord.id)
        .maybeSingle();

      if (error) {
        console.warn('Profile read notice:', error.message);
        return null;
      }
      if (data) {
        setProfile(data);
        return data;
      }

      // No row yet: create one. `role` is not sent, the database default ("user") applies.
      const fallbackName = customUsername ||
        userRecord.user_metadata?.username ||
        userRecord.user_metadata?.full_name ||
        userRecord.user_metadata?.name ||
        userRecord.email?.split('@')[0] ||
        'Developer';

      const newProfile = {
        id: userRecord.id,
        username: fallbackName,
        email: userRecord.email,
        full_name: userRecord.user_metadata?.full_name || fallbackName,
        avatar_url: userRecord.user_metadata?.avatar_url || null
      };

      const { error: insertErr } = await supabase.from('profiles').upsert(newProfile, { onConflict: 'id', ignoreDuplicates: true });
      if (insertErr) console.warn('Profile create notice:', insertErr.message);

      const { data: created } = await supabase.from('profiles').select(PROFILE_COLUMNS).eq('id', userRecord.id).maybeSingle();
      const finalProfile = created || { ...newProfile, role: 'user' };
      setProfile(finalProfile);
      return finalProfile;
    } catch (e) {
      console.warn('Profile synchronization note:', e);
      return null;
    }
  }

  async function fetchProfile(userId) {
    if (!isSupabaseConfigured) return;
    try {
      const { data, error } = await supabase.from('profiles').select(PROFILE_COLUMNS).eq('id', userId).maybeSingle();
      if (!error && data) {
        setProfile(data);
      } else if (user) {
        await ensureProfile(user);
      }
    } catch (e) {
      console.warn('Profile fetch error:', e);
    }
  }

  // Google / GitHub OAuth Sign In
  async function signInWithOAuth(provider = 'google') {
    if (isSupabaseConfigured) {
      // Remember return path so user returns to the exact same page
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname + window.location.search;
        if (!currentPath.includes('/auth/callback')) {
          writeText(KEYS.authReturnUrl, currentPath);
        }
      }

      const callbackUrl = `${window.location.origin}/auth/callback`;

      // Detect if app is running inside an iframe (e.g. AI Studio embedded preview)
      const isInIframe = typeof window !== 'undefined' && window.self !== window.top;

      // On mobile devices or standalone window (e.g. Vercel deployment or opened in normal tab):
      // Redirect in the EXACT SAME PAGE without opening any popups or new windows!
      if (!isInIframe) {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: callbackUrl,
            skipBrowserRedirect: false // Direct in-page navigation in the same tab!
          }
        });

        if (error) throw error;
        return data;
      }

      // If embedded inside an iframe (AI Studio preview):
      // Must use popup window with skipBrowserRedirect because Google denies rendering inside iframes (X-Frame-Options: DENY)
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: callbackUrl,
          skipBrowserRedirect: true,
        }
      });

      if (error) throw error;
      if (!data?.url) throw new Error('Supabase did not return an OAuth authorization URL.');

      // Open OAuth provider in a popup window
      const width = 540;
      const height = 660;
      const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - width) / 2));
      const top = Math.max(0, Math.round(window.screenY + (window.outerHeight - height) / 2));

      const popup = window.open(
        data.url,
        'supabase_oauth_popup',
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,status=no,toolbar=no,menubar=no`
      );

      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        const popupErr = new Error('The Google Sign-in popup was blocked by your browser. Please allow popups or use the direct link.');
        popupErr.code = 'POPUP_BLOCKED';
        popupErr.url = data.url;
        throw popupErr;
      }

      // Return popup reference and url so caller can track it
      return { popup, url: data.url };
    } else {
      const demoUser = {
        id: 'google-demo-user',
        email: 'alex.creator@gmail.com',
        username: 'Alex Vance',
        full_name: 'Alex Vance',
        role: 'user',
        avatar_url: null,
        bio: ''
      };
      setUser(demoUser);
      setProfile(demoUser);
      writeText(KEYS.authUser, JSON.stringify(demoUser));
      return { user: demoUser };
    }
  }

  // Backwards compatibility alias
  const signInWithGoogle = () => signInWithOAuth('google');

  // Email & Password Sign In
  async function signInWithPassword(email, password) {
    if (isSupabaseConfigured) {
      const cleanEmail = email.trim();
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: cleanEmail, 
        password 
      });

      if (error) {
        if (error.message?.toLowerCase().includes('email not confirmed')) {
          const customErr = new Error('Your email address has not been confirmed yet. Please check your inbox for the confirmation link, or disable "Confirm email" in your Supabase Auth settings to log in immediately.');
          customErr.code = 'email_not_confirmed';
          customErr.email = cleanEmail;
          throw customErr;
        }
        throw error;
      }

      setUser(data.user);
      setSession(data.session);
      await ensureProfile(data.user);
      return data;
    } else {
      const demoUser = {
        id: `user-${Date.now()}`,
        email,
        username: email.split('@')[0],
        full_name: email.split('@')[0],
        // Demo mode only (no Supabase): exactly one email, set by VITE_DEMO_ADMIN_EMAIL, is admin
        role: SITE.demoAdminEmail && email.toLowerCase() === SITE.demoAdminEmail.toLowerCase() ? 'admin' : 'user',
        avatar_url: null,
        bio: ''
      };
      setUser(demoUser);
      setProfile(demoUser);
      writeText(KEYS.authUser, JSON.stringify(demoUser));
      return { user: demoUser };
    }
  }

  // Email & Password Sign Up
  async function signUpWithPassword(email, password, username = '') {
    if (isSupabaseConfigured) {
      const cleanEmail = email.trim();
      const cleanUsername = (username || cleanEmail.split('@')[0]).trim();

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: { 
            username: cleanUsername,
            full_name: cleanUsername
          }
        }
      });

      if (error) throw error;

      // Check if session was created or if email confirmation is required
      if (data?.session) {
        setSession(data.session);
        setUser(data.user);
        await ensureProfile(data.user, cleanUsername);
        return { 
          user: data.user, 
          session: data.session, 
          requiresEmailConfirmation: false 
        };
      } else if (data?.user) {
        // Confirmation email was sent by Supabase
        return { 
          user: data.user, 
          session: null, 
          requiresEmailConfirmation: true,
          email: cleanEmail,
          message: 'Confirmation email sent! Please check your email inbox to verify your account.' 
        };
      }
      return data;
    } else {
      const demoUser = {
        id: `user-${Date.now()}`,
        email,
        username: username || email.split('@')[0],
        full_name: username || email.split('@')[0],
        role: 'user',
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        bio: 'New PortfolioHub Member'
      };
      setUser(demoUser);
      setProfile(demoUser);
      writeText(KEYS.authUser, JSON.stringify(demoUser));
      return { user: demoUser, session: { user: demoUser }, requiresEmailConfirmation: false };
    }
  }

  // Resend confirmation email
  async function resendConfirmationEmail(email) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
      });
      if (error) throw error;
      return data;
    }
    return { success: true };
  }

  // Forgot Password
  async function forgotPassword(email) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      return data;
    } else {
      return { message: 'Reset email instructions sent to ' + email };
    }
  }

  // Reset Password
  async function resetPassword(newPassword) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      return data;
    } else {
      return { success: true };
    }
  }

  /**
   * Save changes to the user's own profile.
   * Only the fields in EDITABLE_PROFILE_FIELDS are sent, so the app can never try to change
   * `role` or `is_banned` (the database blocks that as well).
   */
  async function updateProfile(updates) {
    const allowed = Object.fromEntries(
      Object.entries(updates || {}).filter(([key]) => EDITABLE_PROFILE_FIELDS.includes(key))
    );
    const newProfile = { ...(profile || {}), ...allowed };
    setProfile(newProfile);

    if (isSupabaseConfigured && user?.id) {
      const { error } = await supabase
        .from('profiles')
        .update({ ...allowed, updated_at: new Date().toISOString() })
        .eq('id', user.id);
      if (error) {
        console.warn('Profile update db error:', error);
        throw new Error(error.message);
      }
    } else {
      const demoUser = { ...(user || {}), ...allowed };
      setUser(demoUser);
      writeText(KEYS.authUser, JSON.stringify(demoUser));
    }
    return newProfile;
  }

  // Sign Out
  async function signOut() {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Signout error:', e);
      }
    }
    setUser(null);
    setProfile(null);
    setSession(null);
    removeKey(KEYS.authUser);
  }

  const value = {
    user,
    profile,
    session,
    loading,
    // With Supabase the profile row is the only source of truth. Demo mode (no Supabase) grants admin
    // only on your own computer (`npm run dev`) and only to the VITE_DEMO_ADMIN_EMAIL account.
    isAdmin: isSupabaseConfigured
      ? profile?.role === 'admin'
      : import.meta.env.DEV && user?.role === 'admin',
    signInWithOAuth,
    signInWithGoogle,
    signInWithPassword,
    signUpWithPassword,
    resendConfirmationEmail,
    forgotPassword,
    resetPassword,
    updateProfile,
    signOut,
    isSupabaseConfigured
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
