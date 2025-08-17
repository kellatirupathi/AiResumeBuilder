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
import ForgotPasswordModal from "./ForgotPasswordModal";

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
  const [isForgotModalOpen, setForgotModalOpen] = useState(false);
  const navigate = useNavigate();

  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const niatIdRegex = /^N24H01[A-Z]\d{4}$/;

  const validateNiatId = (id) => {
    if (!id) return true;
    return niatIdRegex.test(id);
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
      showToast("Invalid NIAT ID format. Correct format is N24H01X####.", "error");
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
        showToast("Your NIAT ID is not registered in our system. Please crosscheck and enter the correct NIAT ID.", "error");
      } else {
        showToast(error.message || "Registration failed. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)", backgroundSize: "25px 25px" }}></div>
      <AnimatePresence>
        {toast.show && (<Toast message={toast.message} type={toast.type} onClose={closeToast} />)}
      </AnimatePresence>
      <div className="max-w-5xl w-full rounded-2xl overflow-hidden shadow-2xl relative z-10">
        <div className="flex flex-row">
          <div className="w-5/12 bg-gradient-to-br from-emerald-500 to-blue-600 p-10 text-white relative">
            <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
            <div className="relative">
              <div className="flex items-center mb-4">
                <div className="bg-white rounded-lg p-2 mr-3">
                  <FaRegFileAlt className="text-emerald-500 text-xl" />
                </div>
                <h1 className="text-3xl font-bold">NxtResume</h1>
              </div>
              <p className="text-white/90 mb-10">
                Build your professional resume with our intuitive AI-powered platform in minutes.
              </p>
              <div className="space-y-8">
                <h3 className="uppercase text-white/80 font-medium tracking-wider mb-4">WHY CHOOSE US</h3>
                <div className="flex items-start">
                  <div className="bg-white/20 p-2 rounded-lg mr-4">
                    <FaRegFileAlt className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium">ATS-Optimized Templates</h4>
                    <p className="text-white/70 text-sm">Stand out with designs that help you pass applicant tracking systems.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-white/20 p-2 rounded-lg mr-4">
                    <FaRegLightbulb className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium">AI-Powered Suggestions</h4>
                    <p className="text-white/70 text-sm">Get smart content recommendations tailored to your industry and role.</p>
                  </div>
                </div>

              </div>
              <div className="mt-12">
                <p className="text-sm text-white/60">
                  By signing up, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
                </p>
              </div>
            </div>
          </div>
          
          {/* Right side - Auth forms */}
          <div className="w-7/12 bg-white p-10 flex flex-col">
            <div className="flex mb-8">
              <button onClick={() => setIsSignUp(false)} className={`py-2 px-4 flex items-center gap-1.5 font-medium ${!isSignUp ? "text-emerald-600 border-b-2 border-emerald-600" : "text-gray-500"}`}>
                Sign In
              </button>
              <button onClick={() => setIsSignUp(true)} className={`py-2 px-4 flex items-center gap-1.5 font-medium ${isSignUp ? "text-emerald-600 border-b-2 border-emerald-600" : "text-gray-500"}`}>
                Sign Up
              </button>
            </div>
            
            {/* Forms section */}
            <div className="flex-grow">
            {isSignUp ? (
                // Sign Up Form
                <form onSubmit={handleSignUpSubmit} className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Create your account</h2>
                  <div>
                    <label htmlFor="fullName" className="block text-gray-700 font-medium mb-1">Full Name</label>
                    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                      <FaUser className="text-gray-400 mr-2" />
                      <input id="fullName" type="text" className="w-full outline-none" placeholder="Enter your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required/>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="niatId" className="block text-gray-700 font-medium mb-1">NIAT ID</label>
                    <div className={`flex items-center border rounded-lg px-3 py-2 border-gray-300 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500`}>
                      <FaIdBadge className="text-gray-400 mr-2" />
                      <input id="niatId" type="text" className="w-full outline-none" placeholder="Format: N24H01X####" value={niatId} onChange={handleNiatIdChange} required/>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email Address</label>
                    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                      <FaEnvelope className="text-gray-400 mr-2" />
                      <input id="email" type="email" className="w-full outline-none" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-gray-700 font-medium mb-1">Password</label>
                    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                      <FaLock className="text-gray-400 mr-2" />
                      <input id="password" type={showPassword ? "text" : "password"} className="w-full outline-none" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 focus:outline-none">{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
                    </div>
                    <p className="text-gray-500 text-xs mt-1">Password must be at least 6 characters long</p>
                  </div>
                  <button type="submit" disabled={loading} className={`w-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white py-3 rounded-lg flex items-center justify-center ${loading ? "opacity-70 cursor-not-allowed" : "hover:from-emerald-600 hover:to-blue-700"}`}>
                    {loading ? (<Loader2 className="animate-spin h-5 w-5" />) : (<>Create Account <FaArrowRight className="ml-2" /></>)}
                  </button>
                </form>
            ) : (
                // Sign In Form
                <form onSubmit={handleSignInSubmit} className="space-y-5">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome Back</h2>
                    <div>
                        <label htmlFor="signin-email" className="block text-gray-700 font-medium mb-1">Email Address</label>
                        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                          <FaEnvelope className="text-gray-400 mr-2" />
                          <input id="signin-email" type="email" className="w-full outline-none" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="signin-password" className="block text-gray-700 font-medium mb-1">Password</label>
                        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                          <FaLock className="text-gray-400 mr-2" />
                          <input id="signin-password" type={showPassword ? "text" : "password"} className="w-full outline-none" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 focus:outline-none">{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
                        </div>
                    </div>
                    <div className="text-right">
                        <button type="button" onClick={() => setForgotModalOpen(true)} className="text-emerald-600 text-sm hover:underline focus:outline-none">
                        Forgot Password?
                        </button>
                    </div>
                    <button type="submit" disabled={loading} className={`w-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white py-3 rounded-lg flex items-center justify-center ${loading ? "opacity-70 cursor-not-allowed" : "hover:from-emerald-600 hover:to-blue-700"}`}>
                      {loading ? (<Loader2 className="animate-spin h-5 w-5" />) : (<>Sign In <FaArrowRight className="ml-2" /></>)}
                    </button>
                </form>
            )}
            </div>

            {/* Google Auth Divider and Button */}
            <div className="mt-6 flex flex-col items-center">
                <div className="relative w-full my-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
                  <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with</span></div>
                </div>
                {googleLoading ? (
                    <div className="flex justify-center items-center h-10">
                        <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
                    </div>
                ) : (
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        theme="outline"
                        text={isSignUp ? "signup_with" : "signin_with"}
                        shape="pill"
                        width="300px"
                    />
                )}
            </div>
          </div>
        </div>
      </div>
      <ForgotPasswordModal isOpen={isForgotModalOpen} onClose={() => setForgotModalOpen(false)} />
    </div>
  );
}

export default AuthPage;
