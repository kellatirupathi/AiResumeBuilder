import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  loginUser,
  registerUser,
  getExternalInviteDetails,
} from "@/Services/login";
import { VITE_GOOGLE_CLIENT_ID } from "@/config/config.js";
import {
  Loader2,
  Eye,
  EyeOff,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
  Sparkles,
  FileText,
} from "lucide-react";
import NxtResumeWordmark from "@/components/brand/NxtResumeWordmark";

// ── Design tokens ─────────────────────────────────────────────────────
const DISPLAY = { fontFamily: "Fraunces, Georgia, serif" };
const ACCENT = "#FF4800";

// ── Toast ─────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const isError = type === "error";
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className="fixed right-4 top-4 z-50 flex max-w-sm items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg"
    >
      <div
        className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${
          isError ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
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

// ── Minimal input field ───────────────────────────────────────────────
function Field({ label, htmlFor, hint, right, children }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label
          htmlFor={htmlFor}
          className="text-[11.5px] font-semibold text-slate-800"
        >
          {label}
        </label>
        {right}
      </div>
      {children}
      {hint && <p className="mt-0.5 text-[10.5px] text-slate-500">{hint}</p>}
    </div>
  );
}

function Input({ id, type = "text", placeholder, value, onChange, required, rightEl }) {
  return (
    <div className="relative flex items-center rounded-lg border border-slate-200 bg-white transition-colors focus-within:border-slate-900 focus-within:ring-2 focus-within:ring-slate-900/10">
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-lg bg-transparent px-3 py-2 text-[13px] text-slate-900 placeholder:text-slate-400 outline-none"
      />
      {rightEl && <div className="pr-3">{rightEl}</div>}
    </div>
  );
}

// ── Auth Page ─────────────────────────────────────────────────────────
function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [niatId, setNiatId] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteDetails, setInviteDetails] = useState(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("invite") || "";
  const isInviteFlow = Boolean(inviteDetails);

  const [toast, setToast] = useState({ show: false, message: "", type: "error" });
  const showToast = (message, type = "error") =>
    setToast({ show: true, message, type });
  const closeToast = () => setToast((t) => ({ ...t, show: false }));

  // Invite loader
  useEffect(() => {
    let cancelled = false;
    if (!inviteToken) {
      setInviteDetails(null);
      return undefined;
    }
    setInviteLoading(true);
    setIsSignUp(true);

    const openedKey = `invite-opened:${inviteToken}`;
    const already =
      typeof window !== "undefined" && window.sessionStorage.getItem(openedKey);
    const mark = !already;
    if (mark && typeof window !== "undefined") {
      window.sessionStorage.setItem(openedKey, "1");
    }

    getExternalInviteDetails(inviteToken, { markOpened: mark })
      .then((response) => {
        if (!cancelled) setInviteDetails(response?.data || null);
      })
      .catch((error) => {
        if (mark && typeof window !== "undefined") {
          window.sessionStorage.removeItem(openedKey);
        }
        if (!cancelled) {
          setInviteDetails(null);
          showToast(error.message || "This invite link is invalid or expired.");
        }
      })
      .finally(() => {
        if (!cancelled) setInviteLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [inviteToken]);

  const handleGoogleRedirect = () => {
    if (!VITE_GOOGLE_CLIENT_ID) {
      showToast("Google sign-in is not configured.");
      return;
    }
    setGoogleLoading(true);

    const nonce =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2) + Date.now().toString(36);

    window.sessionStorage.setItem("google_oauth_nonce", nonce);

    const stateParams = new URLSearchParams();
    if (inviteToken) stateParams.set("invite", inviteToken);
    stateParams.set("nonce", nonce);

    const redirectUri = `${window.location.origin}/auth/google/callback`;

    const authParams = new URLSearchParams({
      client_id: VITE_GOOGLE_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: "id_token",
      scope: "openid email profile",
      nonce,
      state: stateParams.toString(),
      prompt: "select_account",
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${authParams.toString()}`;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return showToast("Please enter a valid email address.");
    }
    setLoading(true);
    try {
      const user = await loginUser({ email, password });
      if (user?.statusCode === 200) {
        showToast("Signed in — taking you to your dashboard", "success");
        setTimeout(() => navigate("/dashboard"), 700);
      }
    } catch (error) {
      showToast(error.message || "Couldn't sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!isInviteFlow && !niatId.trim()) {
      return showToast("Please enter a valid Student ID.");
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return showToast("Please enter a valid email address.");
    }
    if (password.length < 6) {
      return showToast("Password must be at least 6 characters.");
    }

    setLoading(true);
    const data = { fullName, email, password, inviteToken };
    if (!isInviteFlow) data.niatId = niatId;

    try {
      const response = await registerUser(data);
      if (response?.statusCode === 201) {
        showToast("Account created — signing you in", "success");
        const user = await loginUser({ email, password });
        if (user?.statusCode === 200) {
          setTimeout(() => navigate("/dashboard"), 700);
        }
      }
    } catch (error) {
      if (!isInviteFlow && error.message && error.message.includes("NIAT ID")) {
        showToast(
          "Your Student ID isn't registered. Please double-check and try again."
        );
      } else {
        showToast(error.message || "Registration failed. Please try again.");
      }
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

      <div className="grid h-screen grid-cols-1 lg:grid-cols-2">
        {/* ── Left: brand panel (dark) ── */}
        <LeftBrandPanel isSignUp={isSignUp} />

        {/* ── Right: form ── */}
        <section className="flex h-full items-center justify-center overflow-y-auto px-6 py-6 sm:px-10 lg:px-14">
          <div className="w-full max-w-[400px]">
            {/* Mobile brand row */}
            <Link to="/" className="mb-5 flex items-center lg:hidden">
              <NxtResumeWordmark size="20px" color="#0F172A" />
            </Link>

            {/* Tab switcher */}
            <div className="mb-5 inline-flex items-center gap-0 rounded-full border border-slate-200 bg-white p-1 text-[13px]">
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`rounded-full px-4 py-1.5 font-semibold transition-colors ${
                  !isSignUp
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className={`rounded-full px-4 py-1.5 font-semibold transition-colors ${
                  isSignUp
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Create account
              </button>
            </div>

            <AnimatePresence mode="wait">
              {isSignUp ? (
                <motion.form
                  key="signup"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSignUp}
                  className="space-y-3"
                >
                  <div>
                    <h1
                      className="text-[26px] font-semibold leading-[1.1] tracking-tight text-slate-900"
                      style={DISPLAY}
                    >
                      Create your account.
                    </h1>
                    <p className="mt-1.5 text-[13px] text-slate-600">
                      {isInviteFlow
                        ? "You're joining through an admin invite. No Student ID needed."
                        : "Free forever. No credit card. Takes about 60 seconds."}
                    </p>
                  </div>

                  {inviteToken && (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] text-slate-700">
                      {inviteLoading
                        ? "Validating your invite link…"
                        : inviteDetails
                        ? `Invite active until ${new Date(
                            inviteDetails.expiresAt
                          ).toLocaleString()}.`
                        : "This invite needs to be valid before you can create an account."}
                    </div>
                  )}

                  <Field label="Full name" htmlFor="fullName">
                    <Input
                      id="fullName"
                      placeholder="Ananya Reddy"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </Field>

                  {!isInviteFlow && (
                    <Field label="Student ID" htmlFor="niatId">
                      <Input
                        id="niatId"
                        placeholder="e.g. NIAT24A001"
                        value={niatId}
                        onChange={(e) =>
                          setNiatId(e.target.value.toUpperCase())
                        }
                        required
                      />
                    </Field>
                  )}

                  <Field label="Email" htmlFor="email">
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Field>

                  <Field
                    label="Password"
                    htmlFor="password"
                    hint="At least 6 characters."
                  >
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
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

                  <button
                    type="submit"
                    disabled={
                      loading || (Boolean(inviteToken) && !inviteDetails)
                    }
                    className="group flex h-11 w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 text-[13.5px] font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Create account
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="signin"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSignIn}
                  className="space-y-3"
                >
                  <div>
                    <h1
                      className="text-[26px] font-semibold leading-[1.1] tracking-tight text-slate-900"
                      style={DISPLAY}
                    >
                      Welcome back.
                    </h1>
                    <p className="mt-1.5 text-[13px] text-slate-600">
                      Sign in to pick up where you left off.
                    </p>
                  </div>

                  <Field label="Email" htmlFor="signin-email">
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Field>

                  <Field
                    label="Password"
                    htmlFor="signin-password"
                    right={
                      <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                        className="text-[11px] font-semibold text-slate-500 transition-colors hover:text-slate-900"
                      >
                        Forgot?
                      </button>
                    }
                  >
                    <Input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
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

                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex h-11 w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 text-[13.5px] font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Sign in
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Divider + Google */}
            <div className="mt-4">
              <div className="my-3 flex items-center">
                <div className="flex-1 border-t border-slate-200" />
                <span className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  or
                </span>
                <div className="flex-1 border-t border-slate-200" />
              </div>

              <button
                type="button"
                onClick={handleGoogleRedirect}
                disabled={
                  googleLoading || (Boolean(inviteToken) && !inviteDetails)
                }
                className="flex h-10 w-full items-center justify-center gap-2.5 rounded-lg border border-slate-200 bg-white text-[13px] font-semibold text-slate-800 transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {googleLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                ) : (
                  <>
                    <GoogleIcon />
                    {isSignUp ? "Sign up with Google" : "Sign in with Google"}
                  </>
                )}
              </button>
            </div>

            {/* Switch mode */}
            <p className="mt-4 text-center text-[12.5px] text-slate-500">
              {isSignUp ? "Already have an account? " : "New to NxtResume? "}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-semibold text-slate-900 underline-offset-4 hover:underline"
              >
                {isSignUp ? "Sign in" : "Create an account"}
              </button>
            </p>

            <p className="mt-3 text-center text-[10.5px] leading-relaxed text-slate-400">
              By continuing you agree to our{" "}
              <Link to="/documentation" className="underline hover:text-slate-700">
                Terms
              </Link>{" "}
              and{" "}
              <Link to="/documentation" className="underline hover:text-slate-700">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

// ── Left brand panel ──────────────────────────────────────────────────
function LeftBrandPanel({ isSignUp }) {
  return (
    <aside className="relative hidden h-screen overflow-hidden bg-slate-900 text-white lg:flex lg:flex-col lg:justify-between">
      {/* Quiet texture — small accent glow, no rainbow blurs */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full opacity-20"
        style={{ backgroundColor: ACCENT, filter: "blur(100px)" }}
      />

      <div className="relative z-10 px-12 pt-10">
        {/* Brand */}
        <Link to="/" className="flex items-center">
          <NxtResumeWordmark size="22px" color="#FFFFFF" />
        </Link>

        {/* Headline */}
        <div className="mt-12 max-w-md">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-white/80">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: ACCENT }}
            />
            {isSignUp ? "WELCOME TO" : "WELCOME BACK TO"} NXTRESUME
          </span>

          <h2
            className="mt-5 text-[38px] font-semibold leading-[1.05] tracking-tight"
            style={DISPLAY}
          >
            The resume that{" "}
            <span className="text-white/50">gets you a reply.</span>
          </h2>

          <p className="mt-4 text-[14px] leading-relaxed text-white/70">
            AI-polished writing. ATS-safe design. 16 templates built by real
            designers. Free forever.
          </p>
        </div>

        {/* Feature list */}
        <div className="mt-8 max-w-md space-y-3.5">
          {[
            {
              icon: <Sparkles className="h-4 w-4" />,
              title: "AI that knows when to shut up",
              body: "Polishes bullets without ruining your voice.",
            },
            {
              icon: <FileText className="h-4 w-4" />,
              title: "16 ATS-safe templates",
              body: "Pixel-perfect print output. Switch anytime.",
            },
            {
              icon: <ShieldCheck className="h-4 w-4" />,
              title: "You own your data",
              body: "Never sold. Never used to train models.",
            },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <div
                className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: `${ACCENT}22`, color: ACCENT }}
              >
                {f.icon}
              </div>
              <div>
                <p className="text-[13.5px] font-semibold text-white">
                  {f.title}
                </p>
                <p className="mt-0.5 text-[12.5px] text-white/60">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer copy */}
      <div className="relative z-10 border-t border-white/10 px-12 py-6">
        <div className="flex items-center justify-between text-[11px] text-white/50">
          <p>
            Built in 2024 · Used by 14,000+ students
          </p>
          <div className="flex items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "#10B981" }}
            />
            All systems operational
          </div>
        </div>
      </div>
    </aside>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

export default AuthPage;
