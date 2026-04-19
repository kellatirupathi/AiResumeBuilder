import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  loginUser,
  registerUser,
  googleLogin,
  getExternalInviteDetails,
} from "@/Services/login";
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

  const handleGoogleSuccess = async (credentialResponse) => {
    setGoogleLoading(true);
    try {
      const user = await googleLogin(credentialResponse.credential, inviteToken);
      if (user?.statusCode === 200) {
        showToast("Signed in with Google", "success");
        setTimeout(() => navigate("/dashboard"), 700);
      }
    } catch (error) {
      showToast(error.message || "Google sign-in failed.");
    } finally {
      setGoogleLoading(false);
    }
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

              {googleLoading ? (
                <div className="flex h-10 items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                </div>
              ) : (
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => showToast("Google sign-in failed.")}
                    theme="outline"
                    text={isSignUp ? "signup_with" : "signin_with"}
                    shape="rectangular"
                    width="360"
                    disabled={Boolean(inviteToken) && !inviteDetails}
                  />
                </div>
              )}
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

export default AuthPage;
