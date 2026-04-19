import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { resetPassword } from '@/Services/login';
import {
  Loader2,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import NxtResumeWordmark from '@/components/brand/NxtResumeWordmark';

// ── Design tokens ─────────────────────────────────────────────────────
const DISPLAY = { fontFamily: 'Fraunces, Georgia, serif' };
const ACCENT = '#FF4800';

// ── Toast ─────────────────────────────────────────────────────────────
function InlineToast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const isError = type === 'error';
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className="fixed right-4 top-4 z-50 flex max-w-sm items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg"
    >
      <div
        className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${
          isError ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
        }`}
      >
        {isError ? (
          <AlertCircle className="h-3.5 w-3.5" />
        ) : (
          <CheckCircle2 className="h-3.5 w-3.5" />
        )}
      </div>
      <p className="flex-1 text-[13px] font-medium text-slate-800">{message}</p>
      <button
        onClick={onClose}
        className="text-slate-400 transition-colors hover:text-slate-700"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

// ── Field + Input ─────────────────────────────────────────────────────
function Field({ label, htmlFor, hint, children }) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1 block text-[11.5px] font-semibold text-slate-800"
      >
        {label}
      </label>
      {children}
      {hint && <p className="mt-0.5 text-[10.5px] text-slate-500">{hint}</p>}
    </div>
  );
}

function Input({ id, type = 'text', placeholder, value, onChange, required, rightEl, autoComplete }) {
  return (
    <div className="relative flex items-center rounded-lg border border-slate-200 bg-white transition-colors focus-within:border-slate-900 focus-within:ring-2 focus-within:ring-slate-900/10">
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded-lg bg-transparent px-3 py-2 text-[13px] text-slate-900 placeholder:text-slate-400 outline-none"
      />
      {rightEl && <div className="pr-3">{rightEl}</div>}
    </div>
  );
}

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isValidToken, setIsValidToken] = useState(true);
  const [inlineToast, setInlineToast] = useState({
    show: false,
    message: '',
    type: 'error',
  });

  const showInlineToast = (message, type = 'error') =>
    setInlineToast({ show: true, message, type });
  const closeInlineToast = () => setInlineToast((t) => ({ ...t, show: false }));

  useEffect(() => {
    const resetToken = searchParams.get('token');
    if (!resetToken) {
      setError('Invalid or missing reset token. Please request a new link.');
      setIsValidToken(false);
    } else {
      setToken(resetToken);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      showInlineToast('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      showInlineToast('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ token, newPassword, confirmPassword });
      toast.success('Password reset successfully!', {
        description: 'You can now sign in with your new password.',
      });
      navigate('/auth/sign-in');
    } catch (err) {
      const message =
        err.message || 'Failed to reset password. The link may have expired.';
      setError(message);
      showInlineToast(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-white text-slate-900 antialiased">
      <AnimatePresence>
        {inlineToast.show && (
          <InlineToast
            message={inlineToast.message}
            type={inlineToast.type}
            onClose={closeInlineToast}
          />
        )}
      </AnimatePresence>

      <div className="flex h-full items-center justify-center px-6 py-10">
        <div className="w-full max-w-[420px]">
          {/* Back link */}
          <button
            type="button"
            onClick={() => navigate('/auth/sign-in')}
            className="mb-8 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-500 transition-colors hover:text-slate-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </button>

          {/* Brand */}
          <Link to="/" className="mb-8 flex items-center justify-center">
            <NxtResumeWordmark size="22px" color="#0F172A" />
          </Link>

          {!isValidToken ? (
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white">
                <AlertCircle className="h-5 w-5" style={{ color: ACCENT }} />
              </div>
              <h1
                className="mt-5 text-[26px] font-semibold leading-[1.1] tracking-tight text-slate-900"
                style={DISPLAY}
              >
                Link invalid or expired.
              </h1>
              <p className="mt-1.5 text-[13px] text-slate-600">{error}</p>

              <div className="mt-6 space-y-2.5">
                <Link
                  to="/forgot-password"
                  className="flex h-11 w-full items-center justify-center rounded-full bg-slate-900 px-5 text-[13.5px] font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  Request a new link
                </Link>
                <Link
                  to="/auth/sign-in"
                  className="flex h-11 w-full items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-[13.5px] font-semibold text-slate-900 transition-colors hover:bg-slate-50"
                >
                  Back to sign in
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="text-center">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-slate-500">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: ACCENT }}
                  />
                  RESET PASSWORD
                </span>
                <h1
                  className="mt-4 text-[26px] font-semibold leading-[1.1] tracking-tight text-slate-900"
                  style={DISPLAY}
                >
                  Set a new password.
                </h1>
                <p className="mt-1.5 text-[13px] text-slate-600">
                  Make it 6+ characters. Make it memorable.
                </p>
              </div>

              <div className="pt-2">
                <Field label="New password" htmlFor="new-password">
                  <Input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    rightEl={
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="text-slate-400 transition-colors hover:text-slate-700"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    }
                  />
                </Field>
              </div>

              <Field label="Confirm new password" htmlFor="confirm-password">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  rightEl={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((s) => !s)}
                      className="text-slate-400 transition-colors hover:text-slate-700"
                      aria-label="Toggle password visibility"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  }
                />
              </Field>

              {error && (
                <p className="text-center text-[12px] text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group flex h-11 w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 text-[13.5px] font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Reset password
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
