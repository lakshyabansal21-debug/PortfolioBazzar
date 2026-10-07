import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client.js';
import { CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // 'processing' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState('');

  useEffect(() => {
    let timeoutId;

    async function handleAuthCallback() {
      try {
        // Parse error params from query or hash
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
        
        const errorParam = urlParams.get('error') || hashParams.get('error');
        const errorDesc = urlParams.get('error_description') || hashParams.get('error_description');

        if (errorParam || errorDesc) {
          const rawErr = errorDesc ? decodeURIComponent(errorDesc) : errorParam;
          if (rawErr.toLowerCase().includes('access_denied') || errorParam === 'access_denied') {
            setErrorDetails(
              'Error 403: access_denied. Your Google Cloud OAuth consent screen is likely set to "Testing" mode. Only registered "Test users" can log in until you click "Publish App" in the Google Cloud Console (OAuth consent screen).'
            );
          }
          throw new Error(rawErr || 'Google OAuth authorization was denied.');
        }

        // Check for PKCE authorization code
        const code = urlParams.get('code');
        if (code && supabase?.auth?.exchangeCodeForSession) {
          const { error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeErr) {
            console.warn('exchangeCodeForSession error:', exchangeErr);
          }
        }

        // Supabase automatically parses hash tokens (#access_token=...) or query code (?code=...)
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        // Retrieve the page the user was on prior to signing in
        const returnUrl = localStorage.getItem('portfoliohub_auth_return_url') || '/';
        localStorage.removeItem('portfoliohub_auth_return_url');

        // If session is found
        if (data?.session) {
          setStatus('success');

          // If opened in an OAuth popup window, notify opener and close
          if (window.opener && !window.opener.closed) {
            try {
              window.opener.postMessage(
                { 
                  type: 'SUPABASE_OAUTH_SUCCESS', 
                  session: data.session,
                  user: data.session.user
                }, 
                '*'
              );
              timeoutId = setTimeout(() => {
                window.close();
              }, 600);
              return;
            } catch (postErr) {
              console.warn('postMessage to opener failed:', postErr);
            }
          }

          // In-page navigation (same tab / mobile flow): smoothly navigate to target page
          timeoutId = setTimeout(() => {
            navigate(returnUrl, { replace: true });
          }, 600);
          return;
        }

        // Fallback: wait for auth state change
        const { data: authSub } = supabase.auth.onAuthStateChange((event, session) => {
          if (session) {
            setStatus('success');
            if (window.opener && !window.opener.closed) {
              window.opener.postMessage(
                { type: 'SUPABASE_OAUTH_SUCCESS', session, user: session.user },
                '*'
              );
              timeoutId = setTimeout(() => {
                window.close();
              }, 600);
            } else {
              timeoutId = setTimeout(() => {
                navigate(returnUrl, { replace: true });
              }, 600);
            }
          }
        });

        // 8 second safety timeout
        timeoutId = setTimeout(() => {
          if (status === 'processing') {
            setStatus('error');
            setErrorMessage('Authentication session did not complete in time.');
          }
        }, 8000);

        return () => {
          authSub.subscription.unsubscribe();
          if (timeoutId) clearTimeout(timeoutId);
        };
      } catch (err) {
        setStatus('error');
        setErrorMessage(err.message || 'OAuth authentication failed.');
      }
    }

    handleAuthCallback();
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [navigate]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 bg-paper">
      <div className="max-w-md w-full bg-white rounded-2xl p-7 border border-line shadow-xl text-center space-y-4">
        {status === 'processing' && (
          <>
            <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-accent">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
            <h2 className="text-lg font-bold text-ink">Verifying Google Account...</h2>
            <p className="text-xs text-soft">
              Completing secure authentication handshake with Supabase.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-ink">Authentication Successful!</h2>
            <p className="text-xs text-soft">
              Returning you to your portfolio session...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto text-red-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-ink">Authentication Failed</h2>
            <p className="text-xs text-red-700 bg-red-50 p-3 rounded-lg border border-red-200 font-mono text-left leading-relaxed">
              {errorMessage}
            </p>
            {errorDetails && (
              <div className="text-xs text-amber-900 bg-amber-50 p-3 rounded-lg border border-amber-200 text-left leading-relaxed">
                <strong className="block font-semibold mb-1">How to fix 403 access_denied:</strong>
                {errorDetails}
              </div>
            )}
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() => {
                  if (window.opener && !window.opener.closed) window.close();
                  else navigate('/', { replace: true });
                }}
                className="py-2 px-4 rounded-lg bg-ink text-white text-xs font-bold hover:bg-black transition-colors"
              >
                {window.opener && !window.opener.closed ? 'Close Window' : 'Return to App'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
