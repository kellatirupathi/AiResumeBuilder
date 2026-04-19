import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { requestPasswordReset } from '@/Services/login';
import {
  Loader2,
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
function Toast({ message, type, onClose }) {
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

// ── Field + Input (matches AuthPage) ──────────────────────────────────
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

function Input({ id, type = 'text', placeholder, value, onChange, required, autoComplete }) {
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
    </div>
  );
}

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

  const showToast = (message, type = 'error') =>
    setToast({ show: true, message, type });
  const closeToast = () => setToast((t) => ({ ...t, show: false }));

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      showToast('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      await requestPasswordReset({ email });
      setIsSubmitted(true);
      showToast('Check your email for the reset link.', 'success');
    } catch (err) {
      showToast(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-white text-slate-900 antialiased">
      <AnimatePresence>
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={closeToast}
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

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSubmit}
                className="space-y-3"
              >
                <div className="text-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-slate-500">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: ACCENT }}
                    />
                    PASSWORD RESET
                  </span>
                  <h1
                    className="mt-4 text-[26px] font-semibold leading-[1.1] tracking-tight text-slate-900"
                    style={DISPLAY}
                  >
                    Forgot your password?
                  </h1>
                  <p className="mt-1.5 text-[13px] text-slate-600">
                    Enter your email and we'll send a reset link.
                  </p>
                </div>

                <div className="pt-2">
                  <Field label="Email" htmlFor="reset-email">
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </Field>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-11 w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 text-[13.5px] font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Send reset link
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>

                <p className="pt-2 text-center text-[12.5px] text-slate-500">
                  Remembered it?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/auth/sign-in')}
                    className="font-semibold text-slate-900 underline-offset-4 hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white">
                  <CheckCircle2
                    className="h-5 w-5"
                    style={{ color: ACCENT }}
                  />
                </div>

                <h1
                  className="mt-5 text-[26px] font-semibold leading-[1.1] tracking-tight text-slate-900"
                  style={DISPLAY}
                >
                  Check your email.
                </h1>
                <p className="mt-1.5 text-[13px] text-slate-600">
                  We sent a reset link to
                </p>
                <p className="mt-1 text-[13px] font-semibold text-slate-900 break-all">
                  {email}
                </p>
                <p className="mt-3 text-[11.5px] text-slate-500">
                  Didn't get it? Check spam, or try again in a minute.
                </p>

                <div className="mt-6 space-y-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail('');
                    }}
                    className="flex h-11 w-full items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-[13.5px] font-semibold text-slate-900 transition-colors hover:bg-slate-50"
                  >
                    Try a different email
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/auth/sign-in')}
                    className="flex h-11 w-full items-center justify-center rounded-full bg-slate-900 px-5 text-[13.5px] font-semibold text-white transition-colors hover:bg-slate-800"
                  >
                    Back to sign in
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
