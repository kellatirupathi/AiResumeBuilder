import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaLock,
  FaSignInAlt,
  FaUserPlus,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaArrowRight
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { loginUser, registerUser } from "@/Services/login";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { addUserData } from "@/features/user/userFeatures";


function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signUpError, setSignUpError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [signInError, setSignInError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 30; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 20 + 5,
          duration: Math.random() * 20 + 10
        });
      }
      setParticles(newParticles);
    };
    generateParticles();
  }, []);

  const handleSignInSubmit = async (event) => {
    setSignInError("");
    event.preventDefault();
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setSignInError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    const data = {
      email: email,
      password: password,
    };

    try {
      const userResponse = await loginUser(data);
      if (userResponse?.statusCode === 200) {
        dispatch(addUserData(userResponse.data.user)); // Update Redux store
        navigate("/dashboard"); // Navigate after successful login and state update
      }
    } catch (error) {
      setSignInError(error.message || "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  // *** FIXED SIGN-UP AND AUTO-LOGIN LOGIC ***
  const handleSignUpSubmit = async (event) => {
    setSignUpError("");
    event.preventDefault();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setSignUpError("Please enter a valid email address.");
      return;
    }
    
    if (password.length < 6) {
      setSignUpError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    
    const registrationData = {
      fullName: fullName,
      email: email,
      password: password,
    };
    
    try {
      // Step 1: Register the user
      const registrationResponse = await registerUser(registrationData);
      
      // Step 2: If registration is successful, then log the user in
      if (registrationResponse?.statusCode === 201) {
        console.log("User Registration Successful, now logging in...");
        
        const loginData = {
          email: email,
          password: password,
        };
        const loginResponse = await loginUser(loginData);
        
        // Step 3: If login is successful, update state and navigate
        if (loginResponse?.statusCode === 200) {
          console.log("Auto-login successful!");
          dispatch(addUserData(loginResponse.data.user)); // Update Redux state
          navigate("/dashboard"); // Navigate to dashboard
        } else {
          // Handle case where auto-login fails
          setSignUpError("Registration successful, but login failed. Please try signing in manually.");
          setIsSignUp(false); // Switch to sign-in view
        }
      }
    } catch (error) {
      console.log("User Registration or Login Failed");
      setSignUpError(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 p-4 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white opacity-10"
          initial={{ 
            left: `${particle.x}%`, 
            top: `${particle.y}%`, 
            width: `${particle.size}px`, 
            height: `${particle.size}px` 
          }}
          animate={{
            left: [`${particle.x}%`, `${(particle.x + 20) % 100}%`, `${(particle.x - 10) % 100}%`],
            top: [`${particle.y}%`, `${(particle.y - 20) % 100}%`, `${(particle.y + 10) % 100}%`],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      ))}

      <div className="w-full max-w-4xl flex flex-col md:flex-row shadow-2xl rounded-3xl overflow-hidden relative z-10 h-[600px]">
        {/* Left panel */}
        <div className="bg-gradient-to-br from-emerald-500 to-indigo-600 p-8 md:p-12 text-white md:w-2/5 relative flex flex-col justify-between">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <svg className="absolute left-0 top-0 h-full w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          <div className="relative">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">AI Resume Builder</h1>
            <p className="text-white/80 mb-8 max-w-xs">Create professional resumes in minutes with our AI-powered platform.</p>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="bg-white/20 p-2 rounded-full mr-4">
                  <FaUser className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Professional Templates</h3>
                  <p className="text-white/70 text-sm">Choose from dozens of ATS-friendly designs</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="bg-white/20 p-2 rounded-full mr-4">
                  <FaArrowRight className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Content Suggestions</h3>
                  <p className="text-white/70 text-sm">Get intelligent recommendations for your resume</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative mt-8 md:mt-0">
            <p className="text-sm text-white/60">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
        
        {/* Right panel - auth forms */}
        <div className="bg-white p-8 md:p-12 md:w-3/5 flex flex-col">
          <div className="mb-8">
            <div className="inline-flex items-center p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setIsSignUp(false)}
                className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-md transition-all duration-300 ${
                  !isSignUp 
                    ? "bg-gradient-to-r from-emerald-500 to-indigo-600 text-white shadow-md" 
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FaSignInAlt className="text-xs" />
                Sign In
              </button>
              <button
                onClick={() => setIsSignUp(true)}
                className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-md transition-all duration-300 ${
                  isSignUp 
                    ? "bg-gradient-to-r from-emerald-500 to-indigo-600 text-white shadow-md" 
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FaUserPlus className="text-xs" />
                Sign Up
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait" className="flex-grow">
            {isSignUp ? (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Create an Account</h2>
                <form onSubmit={handleSignUpSubmit} className="space-y-5 h-full flex flex-col">
                  <div className="space-y-2">
                    <label htmlFor="fullname" className="text-sm font-medium text-gray-700">Full Name</label>
                    <div className="flex items-center border-2 rounded-lg border-gray-300 p-3 focus-within:border-indigo-500 transition-colors">
                      <FaUser className="text-gray-400 mr-3" />
                      <input
                        id="fullname"
                        type="text"
                        placeholder="Enter your full name"
                        required
                        className="outline-none w-full text-gray-800"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                    <div className="flex items-center border-2 rounded-lg border-gray-300 p-3 focus-within:border-indigo-500 transition-colors">
                      <FaEnvelope className="text-gray-400 mr-3" />
                      <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        required
                        className="outline-none w-full text-gray-800"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                    <div className="flex items-center border-2 rounded-lg border-gray-300 p-3 focus-within:border-indigo-500 transition-colors">
                      <FaLock className="text-gray-400 mr-3" />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        required
                        className="outline-none w-full text-gray-800"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">Password must be at least 6 characters long</p>
                  </div>
                  
                  {signUpError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                      {signUpError}
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full mt-6 bg-gradient-to-r from-emerald-500 to-indigo-600 text-white py-3 rounded-lg font-medium flex justify-center items-center gap-2 shadow-md hover:shadow-lg transition-all ${
                      loading ? "opacity-80" : "hover:from-emerald-600 hover:to-indigo-700"
                    }`}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                      <>
                        Create Account <FaArrowRight className="text-xs" />
                      </>
                    )}
                  </button>
                </form>
                
                <p className="mt-auto pt-8 text-center text-gray-600">
                  Already have an account?{" "}
                  <button
                    onClick={() => setIsSignUp(false)}
                    className="text-indigo-600 font-medium hover:underline focus:outline-none"
                  >
                    Sign In
                  </button>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="signin"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Welcome Back</h2>
                <form onSubmit={handleSignInSubmit} className="space-y-5 h-full flex flex-col">
                  <div className="space-y-2">
                    <label htmlFor="signin-email" className="text-sm font-medium text-gray-700">Email Address</label>
                    <div className="flex items-center border-2 rounded-lg border-gray-300 p-3 focus-within:border-indigo-500 transition-colors">
                      <FaEnvelope className="text-gray-400 mr-3" />
                      <input
                        id="signin-email"
                        type="email"
                        placeholder="Enter your email"
                        required
                        className="outline-none w-full text-gray-800"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="signin-password" className="text-sm font-medium text-gray-700">Password</label>
                    <div className="flex items-center border-2 rounded-lg border-gray-300 p-3 focus-within:border-indigo-500 transition-colors">
                      <FaLock className="text-gray-400 mr-3" />
                      <input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        required
                        className="outline-none w-full text-gray-800"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  
                  {signInError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                      {signInError}
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-gradient-to-r from-emerald-500 to-indigo-600 text-white py-3 rounded-lg font-medium flex justify-center items-center gap-2 shadow-md hover:shadow-lg transition-all ${
                      loading ? "opacity-80" : "hover:from-emerald-600 hover:to-indigo-700"
                    }`}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                      <>
                        Sign In <FaArrowRight className="text-xs" />
                      </>
                    )}
                  </button>
                </form>
                
                <p className="mt-8 text-center text-gray-600">
                  Don't have an account?{" "}
                  <button
                    onClick={() => setIsSignUp(true)}
                    className="text-indigo-600 font-medium hover:underline focus:outline-none"
                  >
                    Sign Up
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
