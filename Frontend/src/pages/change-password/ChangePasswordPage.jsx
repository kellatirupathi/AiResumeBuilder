import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { changePassword } from '@/Services/login';
import Header from '@/components/custom/Header';
import {
  Loader2,
  Eye,
  EyeOff,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';

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

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.editUser.userData);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inlineToast, setInlineToast] = useState({
    show: false,
    message: '',
    type: 'error',
  });

  const showInlineToast = (message, type = 'error') =>
    setInlineToast({ show: true, message, type });
  const closeInlineToast = () => setInlineToast((t) => ({ ...t, show: false }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match.');
      showInlineToast('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      showInlineToast('New password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const response = await changePassword({
        currentPassword,
        newPassword,
        confirmNewPassword,
      });
      toast.success(response.message || 'Password changed successfully!');
      navigate(-1);
    } catch (err) {
      const message =
        err.message || 'Failed to change password. Please check your current password.';
      setError(message);
      showInlineToast(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
      <Header user={user} />

      <AnimatePresence>
        {inlineToast.show && (
          <InlineToast
            message={inlineToast.message}
            type={inlineToast.type}
            onClose={closeInlineToast}
          />
        )}
      </AnimatePresence>

      <main className="max-w-md mx-auto px-5 py-16">
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-slate-500">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: ACCENT }}
            />
            ACCOUNT SECURITY
          </span>
          <h1
            className="mt-4 text-[26px] font-semibold leading-[1.1] tracking-tight text-slate-900"
            style={DISPLAY}
          >
            Change your password.
          </h1>
          <p className="mt-1.5 text-[13px] text-slate-600">
            Enter current password + a new one.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Field label="Current password" htmlFor="current-password">
            <Input
              id="current-password"
              type={showCurrent ? 'text' : 'password'}
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              autoComplete="current-password"
              rightEl={
                <button
                  type="button"
                  onClick={() => setShowCurrent((s) => !s)}
                  className="text-slate-400 transition-colors hover:text-slate-700"
                  aria-label="Toggle password visibility"
                >
                  {showCurrent ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
            />
          </Field>

          <Field label="New password" htmlFor="new-password" hint="At least 6 characters.">
            <Input
              id="new-password"
              type={showNew ? 'text' : 'password'}
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              autoComplete="new-password"
              rightEl={
                <button
                  type="button"
                  onClick={() => setShowNew((s) => !s)}
                  className="text-slate-400 transition-colors hover:text-slate-700"
                  aria-label="Toggle password visibility"
                >
                  {showNew ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
            />
          </Field>

          <Field label="Confirm new password" htmlFor="confirm-new-password">
            <Input
              id="confirm-new-password"
              type={showConfirm ? 'text' : 'password'}
              placeholder="••••••••"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              autoComplete="new-password"
              rightEl={
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="text-slate-400 transition-colors hover:text-slate-700"
                  aria-label="Toggle password visibility"
                >
                  {showConfirm ? (
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

          <div className="pt-1">
            <button
              type="submit"
              disabled={loading}
              className="group flex h-11 w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 text-[13.5px] font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Update password
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </div>

          <p className="pt-2 text-center text-[12.5px] text-slate-500">
            <Link
              to="/profile"
              className="font-semibold text-slate-900 underline-offset-4 hover:underline"
            >
              Cancel
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
