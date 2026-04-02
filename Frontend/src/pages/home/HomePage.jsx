import Header from "@/components/custom/Header";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import heroSnapshot from "@/assets/heroSnapshot.png";
import heroSnapshot2 from "@/assets/heroSnapshot2.png";
import heroSnapshot3 from "@/assets/heroSnapshot3.png";
import heroSnapshot4 from "@/assets/heroSnapshot4.png";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaRegLightbulb, FaRegFileAlt, FaRegStar, FaRegClock, FaRegChartBar, FaCheck, FaPlay, FaExpand, FaVideo } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { getSessionUser } from "../../Services/login.js";
import { useDispatch, useSelector } from "react-redux";
import { addUserData } from "@/features/user/userFeatures.js";
import { motion } from "framer-motion";
import NxtResumeLogoMark from "@/components/brand/NxtResumeLogoMark";

function HomePage() {
  const user = useSelector((state) => state.editUser.userData);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showVideoControls, setShowVideoControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const demoVideoUrl = "https://res.cloudinary.com/dg8n2jeur/video/upload/v1755269862/NxtResume_Demo_-_Made_with_Clipchamp_1_jivyme.mp4";

  const heroImages = [
    heroSnapshot,
    heroSnapshot2,
    heroSnapshot3,
    heroSnapshot4
  ].filter(img => img);

  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = heroImages.map((src, index) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            setLoadedImages(prev => ({ ...prev, [index]: true }));
            resolve();
          };
          img.onerror = () => resolve();
          img.src = src;
        });
      });
      await Promise.all(imagePromises);
      setImagesLoaded(true);
    };
    preloadImages();
  }, []);

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("prefersDarkMode") === "true";
    setDarkMode(storedDarkMode);
    if (storedDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    const fetchResponse = async () => {
      setIsLoading(true);
      try {
        const response = await getSessionUser();
        dispatch(addUserData(response.data || ""));
      } catch (error) {
        dispatch(addUserData(""));
      } finally {
        setIsLoading(false);
      }
    };
    fetchResponse();
  }, [dispatch]);

  useEffect(() => {
    if (!imagesLoaded || heroImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        return nextIndex >= heroImages.length ? 0 : nextIndex;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [heroImages.length, imagesLoaded]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
      const video = document.getElementById('demo-video');
      if (video) {
        if (isCurrentlyFullscreen) {
          video.style.width = '100vw';
          video.style.height = '100vh';
          video.style.objectFit = 'contain';
          video.style.backgroundColor = '#000';
          video.style.borderRadius = '0';
        } else {
          video.style.width = '100%';
          video.style.height = '100%';
          video.style.objectFit = 'cover';
          video.style.backgroundColor = 'transparent';
          video.style.borderRadius = '0.75rem';
        }
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("prefersDarkMode", newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleGetStartedClick = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth/sign-in");
    }
  };

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
    setShowVideoControls(false);
    const video = document.getElementById('demo-video');
    if (video) video.play();
  };

  const handleFullscreen = () => {
    const video = document.getElementById('demo-video');
    if (video) {
      video.style.width = '100vw';
      video.style.height = '100vh';
      video.style.objectFit = 'contain';
      video.style.backgroundColor = '#000';
      if (video.requestFullscreen) video.requestFullscreen();
      else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
      else if (video.msRequestFullscreen) video.msRequestFullscreen();
    }
  };

  const features = [
    {
      icon: <FaRegLightbulb className="w-6 h-6 text-amber-500" />,
      bg: "bg-amber-50 dark:bg-amber-900/20",
      title: "AI-Powered Suggestions",
      description: "Get intelligent content recommendations tailored for your industry and role"
    },
    {
      icon: <FaRegFileAlt className="w-6 h-6 text-emerald-500" />,
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      title: "Premium Templates",
      description: "Access professionally designed templates that stand out to recruiters"
    },
    {
      icon: <FaRegStar className="w-6 h-6 text-purple-500" />,
      bg: "bg-purple-50 dark:bg-purple-900/20",
      title: "ATS-Friendly Formats",
      description: "Ensure your resume passes through applicant tracking systems easily"
    },
    {
      icon: <FaRegClock className="w-6 h-6 text-blue-500" />,
      bg: "bg-blue-50 dark:bg-blue-900/20",
      title: "Quick Creation",
      description: "Build a professional resume in minutes, not hours"
    },
    {
      icon: <FaRegChartBar className="w-6 h-6 text-rose-500" />,
      bg: "bg-rose-50 dark:bg-rose-900/20",
      title: "Performance Analytics",
      description: "Track how your resume performs with detailed insights"
    },
    {
      icon: <FaCheck className="w-6 h-6 text-teal-500" />,
      bg: "bg-teal-50 dark:bg-teal-900/20",
      title: "One-Click Export",
      description: "Download your polished resume as PDF instantly"
    },
  ];

  const steps = [
    {
      step: "01",
      color: "from-emerald-400 to-emerald-600",
      title: "Sign Up & Create Profile",
      description: "Create an account and fill in your professional details and experience",
      icon: "👤"
    },
    {
      step: "02",
      color: "from-blue-400 to-indigo-600",
      title: "Choose Template & Customize",
      description: "Select from our professional templates and customize with AI assistance",
      icon: "✨"
    },
    {
      step: "03",
      color: "from-purple-400 to-pink-600",
      title: "Download & Apply",
      description: "Export your polished resume and start applying for your dream jobs",
      icon: "🚀"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Helmet>
        <title>NxtResume – AI-Powered Resume Builder | ATS-Friendly Resumes in Minutes</title>
        <meta name="description" content="Build a professional, ATS-optimized resume in minutes with NxtResume – the AI-powered resume builder. Get smart suggestions, premium templates, and download as PDF. Free to start." />
        <meta name="keywords" content="AI resume builder, resume maker, ATS-friendly resume, professional resume, NxtResume, online resume builder, free resume builder, CV maker" />
        <link rel="canonical" href="https://ai-resume-builder-ochre-five.vercel.app/" />
        <meta property="og:title" content="NxtResume – AI-Powered Resume Builder" />
        <meta property="og:description" content="Create a stunning, ATS-friendly resume in minutes with AI-powered suggestions. Free templates, PDF export, and more." />
        <meta property="og:url" content="https://ai-resume-builder-ochre-five.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://ai-resume-builder-ochre-five.vercel.app/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="NxtResume – AI-Powered Resume Builder" />
        <meta name="twitter:description" content="Create a stunning, ATS-friendly resume in minutes with AI-powered suggestions. Free to start." />
        <meta name="twitter:image" content="https://ai-resume-builder-ochre-five.vercel.app/og-image.png" />
      </Helmet>
      <Header user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      {/* ─── HERO ─── */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] opacity-60" />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-emerald-50/40 to-indigo-50/60 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950/30" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-14">

            {/* Left — text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex-1 max-w-xl"
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-6 border border-emerald-200 dark:border-emerald-800"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Future of Resume Building
              </motion.div>

              <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1]">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="block"
                >
                  Elevate Your
                </motion.span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="block bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-600 bg-clip-text text-transparent"
                >
                  Career Journey
                </motion.span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="block text-gray-900 dark:text-white"
                >
                  With Smart Resumes
                </motion.span>
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-6 text-lg text-gray-500 dark:text-gray-400 leading-relaxed"
              >
                Our AI-powered platform helps you create stunning, professional resumes that get you noticed by employers and boost your job search success.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                <Button
                  onClick={handleGetStartedClick}
                  className="bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white px-8 py-6 rounded-xl text-lg font-semibold flex items-center gap-3 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                >
                  Start Building Now
                  <FaArrowRight className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <FaCheck className="w-2.5 h-2.5 text-green-600" />
                    </span>
                    AI-Powered
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <FaCheck className="w-2.5 h-2.5 text-green-600" />
                    </span>
                    ATS-Friendly
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <FaCheck className="w-2.5 h-2.5 text-green-600" />
                    </span>
                    Free to Start
                  </span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right — image carousel */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
              className="flex-1 w-full max-w-2xl relative"
            >
              {/* Glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400/20 via-blue-400/20 to-indigo-400/20 rounded-3xl blur-2xl" />

              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex gap-1.5">
                    {[0, 1, 2, 3].map((dot) => (
                      <div
                        key={dot}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                          dot === currentImageIndex
                            ? 'bg-emerald-500 scale-110'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex-1 mx-4 h-5 bg-gray-200 dark:bg-gray-700 rounded-full text-xs text-gray-400 flex items-center px-3">
                    nxtresume.app/dashboard
                  </div>
                </div>

                {/* Images */}
                <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-900" style={{ height: '480px' }}>
                  {!imagesLoaded ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-gray-500">Loading preview...</p>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="flex h-full transition-transform duration-700 ease-in-out"
                      style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                    >
                      {heroImages.map((image, index) => (
                        <div key={index} className="flex-shrink-0 w-full h-full flex items-center justify-center">
                          <img
                            src={image}
                            alt={`NxtResume Dashboard ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Floating badge — top right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute -top-3 -right-3 bg-white dark:bg-gray-800 shadow-lg rounded-xl px-3 py-2 flex items-center gap-2 border border-gray-100 dark:border-gray-700"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                  <FaRegLightbulb className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">AI Powered</span>
              </motion.div>

              {/* Floating badge — bottom left */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4 }}
                className="absolute -bottom-3 left-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl px-3 py-2 flex items-center gap-2 border border-gray-100 dark:border-gray-700"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                  <FaRegStar className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">ATS Optimized</span>
              </motion.div>

              {/* Floating badge — bottom right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.6 }}
                className="absolute -bottom-3 right-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl px-3 py-2 flex items-center gap-2 border border-gray-100 dark:border-gray-700"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                  <FaRegClock className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">Quick Setup</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── STATS STRIP ─── */}
      <div className="border-y border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-10 md:gap-20">
            {[
              { value: "10,000+", label: "Resumes Created" },
              { value: "95%", label: "ATS Pass Rate" },
              { value: "3 min", label: "Avg. Build Time" },
              { value: "50+", label: "Templates Available" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-extrabold bg-gradient-to-r from-emerald-500 to-indigo-600 bg-clip-text text-transparent">{stat.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── VIDEO DEMO ─── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="px-4 py-1.5 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-sm font-medium inline-block mb-4 border border-teal-200 dark:border-teal-800">
              Live Demo
            </span>
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">See NxtResume in Action</h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Watch how our AI-powered platform transforms your resume building experience in just minutes
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-3 bg-gradient-to-r from-emerald-400/20 via-blue-400/20 to-indigo-400/20 rounded-3xl blur-2xl" />
            <div
              className="relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700"
              onMouseEnter={() => setShowVideoControls(true)}
              onMouseLeave={() => setShowVideoControls(false)}
            >
              {/* Video chrome bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4 h-6 bg-white dark:bg-gray-700 rounded-full flex items-center px-3 gap-2">
                  <FaVideo className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-400">NxtResume Interactive Demo</span>
                </div>
              </div>

              <div className="aspect-video relative">
                <video
                  id="demo-video"
                  className={`w-full h-full transition-all duration-300 ${isFullscreen ? 'rounded-none' : ''}`}
                  style={{
                    width: isFullscreen ? '100vw' : '100%',
                    height: isFullscreen ? '100vh' : '100%',
                    objectFit: 'contain'
                  }}
                  controls={false}
                  onPlay={() => { setIsVideoPlaying(true); setShowVideoControls(false); }}
                  onPause={() => { setIsVideoPlaying(false); setShowVideoControls(true); }}
                  onEnded={() => { setIsVideoPlaying(false); setShowVideoControls(true); }}
                >
                  <source src={demoVideoUrl} type="video/mp4" />
                  <source src={demoVideoUrl} type="video/webm" />
                  <source src={demoVideoUrl} type="video/ogg" />
                </video>

                {/* Play overlay */}
                {!isVideoPlaying && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900/60 to-indigo-900/60 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.button
                      onClick={handleVideoPlay}
                      className="w-20 h-20 bg-white hover:bg-gray-50 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaPlay className="w-7 h-7 text-indigo-600 ml-1" />
                    </motion.button>
                  </motion.div>
                )}

                {/* Controls overlay */}
                <motion.div
                  className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${showVideoControls ? 'opacity-100' : 'opacity-0'}`}
                >
                  <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-lg backdrop-blur-sm">
                    <span className="text-xs font-medium">NxtResume Demo</span>
                  </div>
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    {isVideoPlaying && (
                      <button
                        onClick={() => {
                          const video = document.getElementById('demo-video');
                          if (video) video.paused ? video.play() : video.pause();
                        }}
                        className="w-8 h-8 bg-black/60 hover:bg-black/80 rounded-lg flex items-center justify-center pointer-events-auto transition-colors"
                      >
                        <div className="flex gap-0.5">
                          <div className="w-1 h-3 bg-white rounded-sm" />
                          <div className="w-1 h-3 bg-white rounded-sm" />
                        </div>
                      </button>
                    )}
                    <button
                      onClick={handleFullscreen}
                      className="w-8 h-8 bg-black/60 hover:bg-black/80 rounded-lg flex items-center justify-center pointer-events-auto transition-colors"
                    >
                      <FaExpand className="w-3 h-3 text-white" />
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium inline-block mb-4 border border-indigo-200 dark:border-indigo-800">
              Powerful Features
            </span>
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">Everything You Need to Succeed</h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Our platform provides all the tools you need to create a professional resume that stands out to employers
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800/60 p-7 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-700 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium inline-block mb-4 border border-emerald-200 dark:border-emerald-800">
              Simple Process
            </span>
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">How It Works</h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Create your professional resume in just three simple steps
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid md:grid-cols-3 gap-8 relative"
          >
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[calc(33%+1rem)] right-[calc(33%+1rem)] h-0.5 bg-gradient-to-r from-emerald-300 via-blue-300 to-purple-300 dark:from-emerald-800 dark:via-blue-800 dark:to-purple-800" />

            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center group"
              >
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-2xl shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {step.icon}
                </div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className={`text-xs font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                    Step {step.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-600 rounded-3xl blur-sm opacity-70" />
          <div className="relative bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-600 rounded-3xl p-12 shadow-2xl overflow-hidden text-center">
            {/* Background grid pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="cta-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cta-grid)" />
              </svg>
            </div>
            <div className="absolute top-6 left-6 w-16 h-16 bg-white/10 rounded-full" />
            <div className="absolute bottom-6 right-6 w-24 h-24 bg-white/10 rounded-full" />

            <div className="relative z-10">
              <h2 className="text-4xl font-extrabold text-white mb-4">Transform Your Career Today</h2>
              <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
                Join professionals who've boosted their career opportunities with our AI-powered resume builder
              </p>
              <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <Button
                  onClick={handleGetStartedClick}
                  className="bg-white text-indigo-700 hover:bg-gray-50 px-10 py-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Create Your Resume Now
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <NxtResumeLogoMark className="h-9 w-9" />
              <div>
                <div className="text-lg font-bold bg-gradient-to-r from-emerald-500 to-indigo-600 bg-clip-text text-transparent">
                  NxtResume
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500">Building futures, one resume at a time.</p>
              </div>
            </div>

            {/* Links */}
            <div className="flex gap-8">
              {["Terms", "Privacy", "Contact"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>

            {/* Copyright */}
            <p className="text-sm text-gray-400 dark:text-gray-500">© 2024 NxtResume. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
