import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaArrowRight,
  FaIdBadge,
  FaRegFileAlt,
  FaRegLightbulb,
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc"; // <-- NEW: Google Icon
import { motion, AnimatePresence } from "framer-motion";
import { loginUser, registerUser, googleLogin } from "@/Services/login"; // <-- NEW: Import googleLogin
import { GoogleLogin } from '@react-oauth/google'; // <-- NEW: Import GoogleLogin component
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NxtResumeLogoMark from "@/components/brand/NxtResumeLogoMark";

// Toast component for displaying notifications
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Close after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, x: 20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${
        type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
      }`}
      style={{ maxWidth: "calc(100% - 2rem)" }}
    >
      <div className="flex-shrink-0 mr-2">
        {type === "error" ? (
          <FaExclamationTriangle className="w-5 h-5" />
        ) : (
          <FaCheckCircle className="w-5 h-5" />
        )}
      </div>
      <div className="mr-2 text-sm font-medium">{message}</div>
      <button
        onClick={onClose}
        className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg p-1.5 inline-flex h-8 w-8 items-center justify-center"
      >
        <FaTimes className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [niatId, setNiatId] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false); // <-- NEW STATE
  const navigate = useNavigate();

  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const validateNiatId = (id) => {
    if (!id) return true;
    return id.trim().length > 0;
  };

  const handleNiatIdChange = (e) => {
    const newNiatId = e.target.value.toUpperCase();
    setNiatId(newNiatId);
  };

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
  };

  const closeToast = () => {
    setToast({ ...toast, show: false });
  };
  
  // <-- NEW: Google login success handler -->
  const handleGoogleSuccess = async (credentialResponse) => {
    setGoogleLoading(true);
    try {
        const user = await googleLogin(credentialResponse.credential);
        if (user?.statusCode === 200) {
            showToast("Signed in with Google!", "success");
            setTimeout(() => navigate("/dashboard"), 1000);
        }
    } catch (error) {
        showToast(error.message || "Google Sign-In failed.", "error");
    } finally {
        setGoogleLoading(false);
    }
  };
  
  // <-- NEW: Google login error handler -->
  const handleGoogleError = () => {
    showToast("Google Sign-In failed. Please try again.", "error");
  };


  const handleSignInSubmit = async (event) => {
    event.preventDefault();
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }
    
    setLoading(true);
    const data = { email, password };
    
    try {
      const user = await loginUser(data);
      if (user?.statusCode === 200) {
        showToast("Sign in successful!", "success");
        // Navigate after toast appears
        setTimeout(() => navigate("/dashboard"), 1000);
      }
    } catch (error) {
      showToast(error.message || "Failed to sign in. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (event) => {
    event.preventDefault();
    
    // Validate form fields
    if (!validateNiatId(niatId)) {
      showToast("Please enter a valid ID.", "error");
      return;
    }
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }
    
    if (password.length < 6) {
      showToast("Password must be at least 6 characters long.", "error");
      return;
    }
    
    setLoading(true);
    const data = { fullName, niatId, email, password };
    
    try {
      const response = await registerUser(data);
      if (response?.statusCode === 201) {
        showToast("Account created successfully!", "success");
        const user = await loginUser({ email, password });
        if (user?.statusCode === 200) {
          // Navigate after toast appears
          setTimeout(() => navigate("/dashboard"), 1000);
        }
      }
    } catch (error) {
      // This is the specific NIAT ID error we want to show as a toast
      if (error.message && error.message.includes("NIAT ID")) {
        showToast("Your Student ID is not registered in our system. Please crosscheck and enter the correct Student ID.", "error");
      } else {
        showToast(error.message || "Registration failed. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  // Reusable input wrapper
  const InputField = ({ id, label, icon, type = "text", placeholder, value, onChange, required, hint, rightEl }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative flex items-center border border-gray-200 rounded-xl px-3.5 py-2.5 bg-gray-50 focus-within:bg-white focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all duration-200">
        <span className="text-gray-400 mr-2.5 flex-shrink-0">{icon}</span>
        <input
          id={id}
          type={type}
          className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-400 text-sm"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
        {rightEl && <span className="ml-2 flex-shrink-0">{rightEl}</span>}
      </div>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );

  return (
    <div className="min-h-screen w-full flex bg-gray-50">
      <AnimatePresence>
        {toast.show && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
      </AnimatePresence>

      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-[45%] relative flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />

        {/* Brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <NxtResumeLogoMark className="h-11 w-11" />
            <span className="text-2xl font-bold text-white">NxtResume</span>
          </div>

          <h2 className="text-4xl font-extrabold text-white leading-snug mb-4">
            Build your{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              resume
            </span>{" "}
            in minutes
          </h2>
          <p className="text-white/60 text-base leading-relaxed mb-12">
            Our AI-powered platform helps you craft professional, ATS-friendly resumes that get you noticed.
          </p>

          {/* Feature list */}
          <div className="space-y-5">
            {[
              { icon: <FaRegFileAlt />, title: "ATS-Optimized Templates", desc: "Pass applicant tracking systems with confidence." },
              { icon: <FaRegLightbulb />, title: "AI-Powered Suggestions", desc: "Smart content tailored to your industry and role." },
              { icon: <FaShieldAlt />, title: "Secure & Private", desc: "Your data is encrypted and never shared." },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-emerald-400">
                  {f.icon}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{f.title}</p>
                  <p className="text-white/50 text-xs mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p className="relative z-10 text-xs text-white/40 mt-10">
          By signing up, you agree to our{" "}
          <a href="#" className="text-white/60 underline hover:text-white transition-colors">Terms of Service</a>{" "}
          and{" "}
          <a href="#" className="text-white/60 underline hover:text-white transition-colors">Privacy Policy</a>.
        </p>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">

          {/* Mobile brand */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <NxtResumeLogoMark className="h-8 w-8" />
            <span className="text-xl font-bold text-gray-900">NxtResume</span>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                !isSignUp
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                isSignUp
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign Up
            </button>
          </div>

          <AnimatePresence mode="wait">
            {isSignUp ? (
              /* ── Sign Up ── */
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleSignUpSubmit}
                className="space-y-4"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-extrabold text-gray-900">Create your account</h2>
                  <p className="text-sm text-gray-500 mt-1">Start building your professional resume today</p>
                </div>

                <InputField
                  id="fullName" label="Full Name"
                  icon={<FaUser className="w-4 h-4" />}
                  placeholder="Enter your full name"
                  value={fullName} onChange={(e) => setFullName(e.target.value)} required
                />
                <InputField
                  id="niatId" label="Student ID"
                  icon={<FaIdBadge className="w-4 h-4" />}
                  placeholder="Enter your Student ID"
                  value={niatId} onChange={handleNiatIdChange} required
                />
                <InputField
                  id="email" label="Email Address"
                  icon={<FaEnvelope className="w-4 h-4" />}
                  type="email" placeholder="Enter your email"
                  value={email} onChange={(e) => setEmail(e.target.value)} required
                />
                <InputField
                  id="password" label="Password"
                  icon={<FaLock className="w-4 h-4" />}
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password} onChange={(e) => setPassword(e.target.value)} required
                  hint="Password must be at least 6 characters long"
                  rightEl={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 transition-colors">
                      {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                    </button>
                  }
                />

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full mt-2 py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-indigo-600 shadow-lg shadow-emerald-200 transition-all duration-200 ${loading ? "opacity-60 cursor-not-allowed" : "hover:from-emerald-600 hover:to-indigo-700 hover:shadow-xl hover:scale-[1.01]"}`}
                >
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <><span>Create Account</span><FaArrowRight className="w-3.5 h-3.5" /></>}
                </button>
              </motion.form>
            ) : (
              /* ── Sign In ── */
              <motion.form
                key="signin"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleSignInSubmit}
                className="space-y-4"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-extrabold text-gray-900">Welcome back</h2>
                  <p className="text-sm text-gray-500 mt-1">Sign in to continue building your resume</p>
                </div>

                <InputField
                  id="signin-email" label="Email Address"
                  icon={<FaEnvelope className="w-4 h-4" />}
                  type="email" placeholder="Enter your email"
                  value={email} onChange={(e) => setEmail(e.target.value)} required
                />

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="signin-password" className="text-sm font-medium text-gray-700">Password</label>
                    <button
                      type="button"
                      onClick={() => navigate('/forgot-password')}
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-medium hover:underline focus:outline-none"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative flex items-center border border-gray-200 rounded-xl px-3.5 py-2.5 bg-gray-50 focus-within:bg-white focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all duration-200">
                    <span className="text-gray-400 mr-2.5 flex-shrink-0"><FaLock className="w-4 h-4" /></span>
                    <input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-400 text-sm"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="ml-2 text-gray-400 hover:text-gray-600 transition-colors">
                      {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full mt-2 py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-indigo-600 shadow-lg shadow-emerald-200 transition-all duration-200 ${loading ? "opacity-60 cursor-not-allowed" : "hover:from-emerald-600 hover:to-indigo-700 hover:shadow-xl hover:scale-[1.01]"}`}
                >
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <><span>Sign In</span><FaArrowRight className="w-3.5 h-3.5" /></>}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Google divider + button */}
          <div className="mt-6">
            <div className="relative flex items-center my-5">
              <div className="flex-1 border-t border-gray-200" />
              <span className="px-3 text-xs text-gray-400 font-medium">or continue with</span>
              <div className="flex-1 border-t border-gray-200" />
            </div>

            {googleLoading ? (
              <div className="flex justify-center items-center h-11">
                <Loader2 className="animate-spin h-5 w-5 text-gray-400" />
              </div>
            ) : (
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  text={isSignUp ? "signup_with" : "signin_with"}
                  shape="rectangular"
                  width="360"
                />
              </div>
            )}
          </div>

          {/* Switch mode link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline focus:outline-none"
            >
              {isSignUp ? "Sign in" : "Sign up free"}
            </button>
          </p>
        </div>
      </div>

    </div>
  );
}

export default AuthPage;
