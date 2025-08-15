import Header from "@/components/custom/Header";
import React, { useEffect, useState } from "react";
import heroSnapshot from "@/assets/heroSnapshot.png";
import heroSnapshot2 from "@/assets/heroSnapshot2.png";
import heroSnapshot3 from "@/assets/heroSnapshot3.png";
import heroSnapshot4 from "@/assets/heroSnapshot4.png";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaRegLightbulb, FaRegFileAlt, FaRegStar, FaRegClock, FaRegChartBar, FaCheck, FaPlay, FaExpand, FaVideo } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { startUser } from "../../Services/login.js";
import { useDispatch, useSelector } from "react-redux";
import { addUserData } from "@/features/user/userFeatures.js";
import { motion } from "framer-motion";

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
  
  // Add your video URL here
  const demoVideoUrl = "https://res.cloudinary.com/dg8n2jeur/video/upload/v1755269862/NxtResume_Demo_-_Made_with_Clipchamp_1_jivyme.mp4"; // Replace with your actual video URL

  // Hero images array - filter out any undefined/null images
  const heroImages = [
    heroSnapshot,
    heroSnapshot2,
    heroSnapshot3,
    heroSnapshot4
  ].filter(img => img); // Remove any undefined/null images

  useEffect(() => {
    // Preload images to prevent blank spaces
    const preloadImages = async () => {
      const imagePromises = heroImages.map((src, index) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            setLoadedImages(prev => ({ ...prev, [index]: true }));
            resolve();
          };
          img.onerror = () => {
            console.warn(`Failed to load image: ${src}`);
            resolve(); // Still resolve to not block other images
          };
          img.src = src;
        });
      });
      
      await Promise.all(imagePromises);
      setImagesLoaded(true);
    };

    preloadImages();
  }, []);

  useEffect(() => {
    // Dark mode setup
    const storedDarkMode = localStorage.getItem("prefersDarkMode") === "true";
    setDarkMode(storedDarkMode);
    if (storedDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Auth check
    const fetchResponse = async () => {
      setIsLoading(true);
      try {
        const response = await startUser();
        dispatch(addUserData(response.statusCode === 200 ? response.data : ""));
      } catch (error) {
        console.log("Error fetching user data:", error.message);
        dispatch(addUserData(""));
      } finally {
        setIsLoading(false);
      }
    };
    fetchResponse();
  }, [dispatch]);

  // Auto-scroll effect for hero images - only start when images are loaded
  useEffect(() => {
    if (!imagesLoaded || heroImages.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        return nextIndex >= heroImages.length ? 0 : nextIndex;
      });
    }, 2000); // Exactly 2 seconds per image

    return () => clearInterval(interval);
  }, [heroImages.length, imagesLoaded]);

  // Handle fullscreen change events
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
          // Fullscreen styles
          video.style.width = '100vw';
          video.style.height = '100vh';
          video.style.objectFit = 'contain';
          video.style.backgroundColor = '#000';
          video.style.borderRadius = '0';
        } else {
          // Normal styles
          video.style.width = '100%';
          video.style.height = '100%';
          video.style.objectFit = 'cover';
          video.style.backgroundColor = 'transparent';
          video.style.borderRadius = '0.75rem'; // rounded-xl
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
    setShowVideoControls(false); // Hide custom controls when playing
    // Start playing the video
    const video = document.getElementById('demo-video');
    if (video) {
      video.play();
    }
  };

  const handleFullscreen = () => {
    const video = document.getElementById('demo-video');
    if (video) {
      // Apply fullscreen styles before entering fullscreen
      video.style.width = '100vw';
      video.style.height = '100vh';
      video.style.objectFit = 'contain';
      video.style.backgroundColor = '#000';
      
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
      }
    }
  };

  const features = [
    {
      icon: <FaRegLightbulb className="w-10 h-10 text-amber-500" />,
      title: "AI-Powered Suggestions",
      description: "Get intelligent content recommendations tailored for your industry and role"
    },
    {
      icon: <FaRegFileAlt className="w-10 h-10 text-emerald-500" />,
      title: "Premium Templates",
      description: "Access professionally designed templates that stand out to recruiters"
    },
    {
      icon: <FaRegStar className="w-10 h-10 text-purple-500" />,
      title: "ATS-Friendly Formats",
      description: "Ensure your resume passes through applicant tracking systems easily"
    },
    {
      icon: <FaRegClock className="w-10 h-10 text-blue-500" />,
      title: "Quick Creation",
      description: "Build a professional resume in minutes, not hours"
    },
    {
      icon: <FaRegChartBar className="w-10 h-10 text-rose-500" />,
      title: "Performance Analytics",
      description: "Track how your resume performs with detailed insights"
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      <Header user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      {/* Hero Section */}
      <section className="pt-28 pb-16 overflow-hidden">
        <div className="relative">
          {/* Enhanced animated background elements */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 right-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-40 left-40 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-6000"></div>
          
          <div className="grid md:grid-cols-5 gap-12 items-center relative z-10">
            {/* Left side - Text content */}
            <div className="md:col-span-2 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto md:mx-0 md:pl-8 lg:pl-16">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-left space-y-8"
              >
                <motion.span 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium text-sm inline-block shadow-sm"
                >
                  Future of Resume Building
                </motion.span>
                <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="block"
                  >
                    Elevate Your
                  </motion.span>
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-600 bg-clip-text text-transparent"
                  >
                    Career Journey
                  </motion.span>
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="block mt-1"
                  >
                    With Smart Resumes
                  </motion.span>
                </h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                  className="text-xl text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed"
                >
                  Our AI-powered platform helps you create stunning, professional resumes that get you noticed by employers and boost your job search success.
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                  className="pt-4"
                >
                  <Button 
                    className="bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white px-10 py-7 rounded-xl text-xl font-semibold flex items-center gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105" 
                    onClick={handleGetStartedClick}
                  >
                    Start Building Now
                    <FaArrowRight className="animate-pulse" />
                  </Button>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3, duration: 0.5 }}
                  className="flex items-center gap-6 pt-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 p-1 rounded-full">
                      <FaCheck className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">AI-Powered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 p-1 rounded-full">
                      <FaCheck className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">ATS-Friendly</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
            
            {/* Right side - Image carousel section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="md:col-span-3 relative w-full pr-4 md:pr-8"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-indigo-500/30 rounded-2xl blur-3xl"></div>
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="relative overflow-hidden rounded-2xl shadow-2xl border border-white/50 bg-white w-full"
                style={{ height: '600px' }}
              >
                {/* Browser header with dynamic dots */}
                <div className="h-12 bg-gradient-to-r from-emerald-500 to-indigo-600 flex items-center px-4">
                  <div className="flex space-x-2">
                    {heroImages.map((_, index) => (
                      <div 
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentImageIndex 
                            ? 'bg-white' 
                            : 'bg-white/40'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
                
                {/* Image carousel container */}
                <div className="relative w-full overflow-hidden bg-gray-100" style={{ height: 'calc(100% - 48px)' }}>
                  {/* Loading state */}
                  {!imagesLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-600 font-medium">Loading Dashboard...</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Images container */}
                  {imagesLoaded && heroImages.length > 0 && (
                    <div 
                      className="flex h-full transition-transform duration-700 ease-out"
                      style={{ 
                        transform: `translateX(calc(-${currentImageIndex} * 100%))`,
                        width: '100%'
                      }}
                    >
                      {heroImages.map((image, index) => (
                        <div 
                          key={index}
                          className="flex-shrink-0 h-full flex items-center justify-center bg-white w-full"
                        >
                          <img
                            src={image}
                            alt={`Resume Builder Dashboard ${index + 1}`}
                            className="max-w-full max-h-full object-contain"
                            style={{ 
                              width: 'auto', 
                              height: 'auto',
                              maxWidth: '100%',
                              maxHeight: '100%'
                            }}
                            onLoad={() => {
                              setLoadedImages(prev => ({ ...prev, [index]: true }));
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
              
              {/* Floating cards */}
              <motion.div 
                initial={{ opacity: 0, x: 20, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -right-0 top-0 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-1 flex items-center gap-3 border border-gray-100 dark:border-gray-700 z-10"
              >
                <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg">
                  <FaRegLightbulb className="w-5 h-5" />
                </div>
                <span className="font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">AI Powered</span>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20, y: -20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute left-12 -bottom-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 flex items-center gap-3 border border-gray-100 dark:border-gray-700 z-10"
              >
                <div className="bg-indigo-100 text-indigo-700 p-2 rounded-lg">
                  <FaRegStar className="w-5 h-5" />
                </div>
                <span className="font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">ATS Optimized</span>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                className="absolute right-12 -bottom-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 flex items-center gap-3 border border-gray-100 dark:border-gray-700 z-10"
              >
                <div className="bg-amber-100 text-amber-700 p-2 rounded-lg">
                  <FaRegClock className="w-5 h-5" />
                </div>
                <span className="font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">Quick Setup</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* See NxtResume in Action Section - Redesigned to match other sections */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-teal-50/30 dark:from-gray-900 dark:to-teal-900/10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="mt-6 text-4xl font-extrabold text-gray-900 bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 dark:text-transparent dark:bg-gradient-to-r dark:from-gray-100 dark:to-gray-300">See NxtResume in Action</h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Watch how our AI-powered platform transforms your resume building experience in just minutes</p>
          </motion.div>

          {/* Main Video Demo Card */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid lg:grid-cols-3 gap-8 mb-12"
          >
            {/* Video Container - Takes up 2/3 width */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:border-teal-200 hover:shadow-xl transition-all duration-300"
            >
              <div 
                className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl overflow-hidden group cursor-pointer"
                onMouseEnter={() => setShowVideoControls(true)}
                onMouseLeave={() => setShowVideoControls(false)}
              >
                {/* Video Element */}
                <div className="aspect-video">
                  <video
                    id="demo-video"
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      isFullscreen 
                        ? 'rounded-none' 
                        : 'rounded-xl'
                    }`}
                    style={{
                      width: isFullscreen ? '100vw' : '100%',
                      height: isFullscreen ? '100vh' : '100%',
                      objectFit: 'contain' // Changed from 'cover' to 'contain' for fullscreen
                    }}
                    controls={false} // Never show native controls
                    poster="" // You can add a poster image URL here
                    onPlay={() => {
                      setIsVideoPlaying(true);
                      setShowVideoControls(false);
                    }}
                    onPause={() => {
                      setIsVideoPlaying(false);
                      setShowVideoControls(true);
                    }}
                    onEnded={() => {
                      setIsVideoPlaying(false);
                      setShowVideoControls(true);
                    }}
                  >
                    <source src={demoVideoUrl} type="video/mp4" />
                    <source src={demoVideoUrl} type="video/webm" />
                    <source src={demoVideoUrl} type="video/ogg" />
                    Your browser does not support the video tag.
                  </video>

                  {/* Play Button Overlay - Only show when video is not playing */}
                  {!isVideoPlaying && (
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <motion.button
                        onClick={handleVideoPlay}
                        className="w-16 h-16 bg-teal-600 hover:bg-teal-700 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-110"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaPlay className="w-6 h-6 text-white ml-1" />
                      </motion.button>
                    </motion.div>
                  )}

                  {/* Custom Video Controls Overlay - Show on hover during playback or when paused */}
                  <motion.div 
                    className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
                      showVideoControls ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    {/* Demo Tag */}
                    <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg backdrop-blur-sm">
                      <span className="text-xs font-medium">NxtResume Demo</span>
                    </div>

                    {/* Custom Controls - Only show when playing */}
                    {isVideoPlaying && (
                      <div className="absolute bottom-4 right-4 flex items-center gap-2">
                        {/* Pause/Play Button */}
                        <button 
                          onClick={() => {
                            const video = document.getElementById('demo-video');
                            if (video) {
                              if (video.paused) {
                                video.play();
                              } else {
                                video.pause();
                              }
                            }
                          }}
                          className="w-8 h-8 bg-black/70 hover:bg-black/80 rounded-lg flex items-center justify-center transition-colors pointer-events-auto"
                        >
                          {isVideoPlaying ? (
                            <div className="w-3 h-3 bg-white rounded-sm flex">
                              <div className="w-1 h-3 bg-white mr-1"></div>
                              <div className="w-1 h-3 bg-white"></div>
                            </div>
                          ) : (
                            <FaPlay className="w-3 h-3 text-white ml-0.5" />
                          )}
                        </button>
                        
                        {/* Fullscreen Button */}
                        <button 
                          onClick={handleFullscreen}
                          className="w-8 h-8 bg-black/70 hover:bg-black/80 rounded-lg flex items-center justify-center transition-colors pointer-events-auto"
                        >
                          <FaExpand className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    )}

                    {/* Fullscreen Button for paused state */}
                    {!isVideoPlaying && (
                      <button 
                        onClick={handleFullscreen}
                        className="absolute bottom-4 right-4 w-8 h-8 bg-black/70 hover:bg-black/80 rounded-lg flex items-center justify-center transition-colors pointer-events-auto"
                      >
                        <FaExpand className="w-3 h-3 text-white" />
                      </button>
                    )}
                  </motion.div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">Interactive Platform Demo</h3>
                <p className="text-gray-600 dark:text-gray-300">Experience our intuitive interface and see how AI suggestions help you craft the perfect resume in real-time</p>
              </div>
            </motion.div>

            {/* Side Features */}
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Feature Card 1 */}
              <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:border-teal-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="mb-4 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl w-12 h-12 flex items-center justify-center">
                  <FaVideo className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">Live Interface</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">See our user-friendly dashboard in action with real-time editing capabilities</p>
              </div>

              {/* Feature Card 2 */}
              <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:border-teal-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl w-12 h-12 flex items-center justify-center">
                  <FaRegLightbulb className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">AI Assistance</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Watch AI provide intelligent suggestions and content recommendations</p>
              </div>

              {/* Feature Card 3 */}
              <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:border-teal-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl w-12 h-12 flex items-center justify-center">
                  <FaRegFileAlt className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">Template Preview</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Explore our professional templates and customization options</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Demo Features Tags */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4"
          >
            {[
              { text: "Interactive Demo", color: "from-teal-400/70 to-teal-500/70" },
              { text: "User-friendly Interface", color: "from-emerald-400/70 to-emerald-500/70" },
              { text: "Real-time AI Assistance", color: "from-indigo-400/70 to-indigo-500/70" }
            ].map((tag, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-gradient-to-r ${tag.color} text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer`}
              >
                {tag.text}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-medium text-sm inline-block shadow-sm">Powerful Features</span>
            <h2 className="mt-6 text-4xl font-extrabold text-gray-900 bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 dark:text-transparent dark:bg-gradient-to-r dark:from-gray-100 dark:to-gray-300">Everything You Need to Succeed</h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Our platform provides all the tools you need to create a professional resume that stands out to employers</p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid md:grid-cols-3 lg:grid-cols-5 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-indigo-200 group hover:-translate-y-2"
              >
                <div className="mb-5 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-indigo-50/30 dark:from-gray-900 dark:to-indigo-900/10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-medium text-sm inline-block shadow-sm">Simple Process</span>
            <h2 className="mt-6 text-4xl font-extrabold text-gray-900 bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 dark:text-transparent dark:bg-gradient-to-r dark:from-gray-100 dark:to-gray-300">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Create your professional resume in just three simple steps</p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid md:grid-cols-3 gap-12"
          >
            {[
              { step: "01", title: "Sign Up & Create Profile", description: "Create an account and fill in your professional details and experience" },
              { step: "02", title: "Choose Template & Customize", description: "Select from our professional templates and customize with AI assistance" },
              { step: "03", title: "Download & Apply", description: "Export your polished resume and start applying for your dream jobs" }
            ].map((step, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="relative bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 group hover:border-emerald-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="bg-gradient-to-r from-emerald-500 to-indigo-600 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold text-white mb-6 group-hover:scale-110 transition-transform duration-300">{step.step}</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                {index < 2 && (<div className="hidden md:block absolute top-8 left-full w-24 h-2 bg-gradient-to-r from-emerald-500 to-indigo-500 transform -translate-x-12 rounded-full"></div>)}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-600 rounded-3xl p-12 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 overflow-hidden">
            <svg className="absolute left-0 top-0 h-full w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">
              <defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" /></pattern></defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full"></div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center text-white relative z-10"
          >
            <h2 className="text-4xl font-bold mb-6">Transform Your Career Today</h2>
            <p className="text-xl opacity-90 mb-10 max-w-3xl mx-auto">Joined professionals who've boosted their career opportunities with our AI-powered resume builder</p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button 
                className="bg-white text-indigo-700 hover:bg-gray-100 text-lg px-10 py-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                onClick={handleGetStartedClick}
              >
                Create Your Resume Now
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
      
      <footer className="mt-auto bg-white dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-700 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col items-center md:items-start">
            <div className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-indigo-600 bg-clip-text text-transparent mb-2">
              NxtResume
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm text-center md:text-left">Building futures, one resume at a time.</p>
          </div>
          <div className="flex gap-8 mt-6 md:mt-0">
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition-colors">Terms</a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition-colors">Privacy</a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition-colors">Contact</a>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-6 md:mt-0">© 2024 AI-Resume-Builder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
