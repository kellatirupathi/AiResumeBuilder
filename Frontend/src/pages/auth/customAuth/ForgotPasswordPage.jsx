import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestPasswordReset } from '@/Services/login';
import { Loader2, Mail, Check, AlertCircle, ArrowLeft } from 'lucide-react';
import NxtResumeLogoMark from '@/components/brand/NxtResumeLogoMark';
import { motion, AnimatePresence } from 'framer-motion';

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError('');
  };

  const handleEmailBlur = () => {
    setIsFocused(false);
    if (email && !validateEmail(email)) {
      setEmailError('Please enter a valid email address');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setLoading(true);
    try {
      await requestPasswordReset({ email });
      setIsSubmitted(true);
    } catch (err) {
      setEmailError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = email && validateEmail(email);
  const showError = emailError && !isFocused;
  const showSuccess = email && isValidEmail && !isFocused && !emailError;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Background grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-50 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            /* ── Request form ── */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
            >
              {/* Back link */}
              <button
                type="button"
                onClick={() => navigate('/auth/sign-in')}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </button>


              <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Forgot your password?</h1>
              <p className="text-sm text-gray-500 mb-7 leading-relaxed">
                No worries. Enter your registered email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <div
                    className={`flex items-center border rounded-xl px-3.5 py-2.5 bg-gray-50 transition-all duration-200 ${
                      isFocused
                        ? 'border-indigo-400 ring-2 ring-indigo-500/20 bg-white'
                        : showError
                        ? 'border-red-300 ring-2 ring-red-400/20'
                        : showSuccess
                        ? 'border-emerald-300 ring-2 ring-emerald-400/20'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Mail
                      className={`w-4 h-4 mr-2.5 flex-shrink-0 transition-colors ${
                        isFocused
                          ? 'text-indigo-500'
                          : showError
                          ? 'text-red-400'
                          : showSuccess
                          ? 'text-emerald-500'
                          : 'text-gray-400'
                      }`}
                    />
                    <input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      onFocus={() => setIsFocused(true)}
                      onBlur={handleEmailBlur}
                      placeholder="Enter your email address"
                      required
                      autoComplete="email"
                      className="w-full outline-none bg-transparent text-sm text-gray-800 placeholder-gray-400"
                    />
                    {showSuccess && <Check className="w-4 h-4 text-emerald-500 ml-2 flex-shrink-0" />}
                    {showError && <AlertCircle className="w-4 h-4 text-red-400 ml-2 flex-shrink-0" />}
                  </div>
                  {showError && (
                    <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {emailError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !isValidEmail}
                  className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                    loading || !isValidEmail
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-[1.01]'
                  }`}
                >
                  {loading ? (
                    <><Loader2 className="animate-spin w-4 h-4" /> Sending reset link...</>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            /* ── Success state ── */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center"
            >
              {/* Animated check circle */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6"
              >
                <Check className="w-10 h-10 text-emerald-600" />
              </motion.div>

              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Check your inbox</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-2">
                We've sent a password reset link to
              </p>
              <p className="font-semibold text-gray-800 text-sm mb-6 break-all">{email}</p>
              <p className="text-xs text-gray-400 mb-8">
                Didn't receive it? Check your spam folder or try again in a few minutes.
              </p>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => { setIsSubmitted(false); setEmail(''); setEmailError(''); }}
                  className="w-full py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Try a different email
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/auth/sign-in')}
                  className="w-full py-3 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                >
                  Back to Sign In
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
