import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, Check, ArrowLeft, ShieldCheck } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabase/client.js';
import { useToast } from '../context/ToastContext.jsx';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetRequest = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/reset-password`
        });
        if (error) throw error;
      }
      setIsSent(true);
      addToast('Password recovery email dispatched successfully', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm p-6 sm:p-8 rounded-xl bg-white border border-[#E6E1D6] space-y-5 shadow-2xs">
        
        <div className="space-y-1">
          <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#D97706] mb-1">
            AUTHENTICATION RECOVERY
          </div>
          <h1 className="text-xl font-bold text-[#18181B] tracking-tight">
            Reset Password
          </h1>
          <p className="text-xs text-[#52525B]">
            Provide your account email address to receive password reset credentials.
          </p>
        </div>

        {isSent ? (
          <div className="p-4 rounded-lg bg-[#FAF8F5] border border-[#E6E1D6] text-center space-y-3">
            <Check className="w-6 h-6 text-emerald-600 mx-auto" />
            <p className="text-xs text-[#52525B] leading-relaxed">
              We dispatched recovery instructions to <strong className="text-[#18181B]">{email}</strong>. Please check your inbox.
            </p>
            <Link
              to="/"
              className="inline-block px-4 py-2 rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-[#18181B] hover:text-white font-bold text-xs transition-all shadow-2xs"
            >
              Return to Catalog
            </Link>
          </div>
        ) : (
          <form onSubmit={handleResetRequest} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#18181B] mb-1.5">Account Email</label>
              <input
                type="email"
                required
                placeholder="dev@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E6E1D6] text-[#18181B] focus:outline-none focus:border-[#D97706] focus:ring-2 focus:ring-[#F59E0B]/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-3 rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-[#18181B] hover:text-white font-bold text-xs transition-all cursor-pointer disabled:opacity-50 shadow-2xs"
            >
              {loading ? 'Dispatched instructions...' : 'Send reset link'}
            </button>
          </form>
        )}

        <div className="pt-2 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#71717A] hover:text-[#18181B] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to PortfolioHub</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
