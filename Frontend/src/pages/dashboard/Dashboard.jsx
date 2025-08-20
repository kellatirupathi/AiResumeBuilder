// C:\Users\NxtWave\Downloads\AiResumeBuilder-3\Frontend\src\pages\dashboard\Dashboard.jsx

import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { getAllResumeData } from "@/Services/resumeAPI";
import AddResume from "./components/AddResume";
import ResumeCard from "./components/ResumeCard";
import ATSScoreChecker from "./components/ATSScoreChecker";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Grid, 
  List, 
  Plus, 
  FileText, 
  PieChart,
  ChevronDown,
  Clock,
  ArrowUpDown,
  LoaderCircle,
  Briefcase,
  GraduationCap,
  FolderGit,
  Award,
  Edit,
  BadgePlus,
  PlusCircle,
  User,
  Calendar,
  ChevronRight,
  Filter,
  SlidersHorizontal,
  Moon,
  Sun
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate, useOutletContext } from "react-router-dom";

// Animated User Icon Component
const AnimatedUserIcon = ({ fullName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayLetter, setDisplayLetter] = useState('');

  // Get all letters from the full name (remove spaces and convert to uppercase)
  const letters = fullName ? fullName.replace(/\s+/g, '').toUpperCase().split('') : ['U'];

  useEffect(() => {
    if (letters.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % letters.length);
    }, 2000); // Change letter every 2 seconds

    return () => clearInterval(interval);
  }, [letters.length]);

  useEffect(() => {
    setDisplayLetter(letters[currentIndex] || 'U');
  }, [currentIndex, letters]);

  return (
    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md overflow-hidden relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -30, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            duration: 0.4
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {displayLetter}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// More compact, visually appealing stat card component
const StatCard = ({ icon, label, count, className = "" }) => (
  <div className={`flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
    <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 p-1.5 rounded-md">
      {React.cloneElement(icon, { className: "w-4 h-4 text-indigo-600 dark:text-indigo-400" })}
    </div>
    <div>
      <span className="text-base font-bold text-gray-800 dark:text-white leading-none">{count}</span>
      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">{label}</span>
    </div>
  </div>
);

function Dashboard() {
  const { darkMode, toggleDarkMode } = useOutletContext();
  const user = useSelector((state) => state.editUser.userData);
  const [resumeList, setResumeList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [showATSModal, setShowATSModal] = useState(false);
  const sortDropdownRef = useRef(null);
  const navigate = useNavigate();
  
  const isDarkMode = document.documentElement.classList.contains('dark');

  const fetchAllResumeData = async () => {
    setIsLoading(true);
    try {
      const resumes = await getAllResumeData();
      setResumeList(resumes.data || []);
      setFilteredList(resumes.data || []);
    } catch (error) {
      toast.error("Failed to load resumes", {
        description: "Please try refreshing the page",
        action: { label: "Retry", onClick: () => fetchAllResumeData() },
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOpenATSChecker = () => {
    if (resumeList.length === 0) {
      toast.error("No resumes available", { description: "Please create a resume first to use the ATS checker"});
      return;
    }
    setShowATSModal(true);
  };
  
  useEffect(() => { fetchAllResumeData(); }, [user]);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let filtered = [...resumeList];
    if (searchQuery.trim()) {
      filtered = filtered.filter(resume => resume.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (sortOption === "newest") filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    else if (sortOption === "oldest") filtered.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
    else if (sortOption === "alphabetical") filtered.sort((a, b) => a.title.localeCompare(b.title));
    setFilteredList(filtered);
  }, [searchQuery, resumeList, sortOption]);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const itemVariants = { hidden: { y: 15, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 120, damping: 12 } } };

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    const firstName = user.fullName ? user.fullName.split(' ')[0] : 'User';
    if (hour < 12) return `Good morning, ${firstName}`;
    if (hour < 18) return `Good afternoon, ${firstName}`;
    return `Good evening, ${firstName}`;
  };

  const getLastUpdatedDate = () => {
    if (resumeList.length > 0) {
      return new Date(Math.max(...resumeList.map(r => new Date(r.updatedAt)))).toLocaleDateString();
    }
    return "-";
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 overflow-x-hidden ${isDarkMode ? 'dark bg-gradient-to-br from-gray-900 via-indigo-950/30 to-purple-950/30 text-gray-200' : 'bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/20 text-gray-800'}`}>
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 left-20 w-72 h-72 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-emerald-400/10 dark:bg-emerald-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 right-40 w-64 h-64 bg-pink-400/10 dark:bg-pink-600/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.03]"></div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">{[...Array(30)].map((_, i) => <motion.div key={i} className={`absolute w-1 h-1 rounded-full ${isDarkMode ? 'bg-white' : 'bg-indigo-600'} opacity-20`} style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} animate={{ y: [0, -30, 0], opacity: [0.1, 0.3, 0.1], scale: [1, Math.random() * 0.5 + 1, 1] }} transition={{ repeat: Infinity, duration: 3 + Math.random() * 5, delay: Math.random() * 2 }} />)}</div>
        <motion.div className={`absolute top-1/4 -right-24 w-96 h-96 border ${isDarkMode ? 'border-indigo-600/20' : 'border-indigo-300/30'} rounded-full opacity-20`} animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}></motion.div>
        <motion.div className={`absolute bottom-1/4 -left-32 w-96 h-96 border ${isDarkMode ? 'border-emerald-600/20' : 'border-emerald-300/30'} rounded-full opacity-20`} animate={{ rotate: -360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }}></motion.div>
        <motion.div className={`absolute left-1/3 -top-40 w-[40rem] h-[40rem] border ${isDarkMode ? 'border-purple-600/20' : 'border-purple-300/30'} rounded-full opacity-10`} animate={{ rotate: 360 }} transition={{ duration: 100, repeat: Infinity, ease: "linear" }}></motion.div>
      </div>

      <div className="container mx-auto px-4 pt-16 relative z-10 max-w-full h-screen flex flex-col">
        
        {/* --- Profile Summary Container (Top) --- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-3 flex-shrink-0">
              <AnimatedUserIcon fullName={user.fullName} />
              <div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                  {getGreeting()}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Welcome to your resume dashboard
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 items-center justify-center">
              <StatCard icon={<Briefcase/>} label="Experience" count={user.experience?.length || 0} />
              <StatCard icon={<GraduationCap />} label="Education" count={user.education?.length || 0} />
              <StatCard icon={<FolderGit />} label="Projects" count={user.projects?.length || 0} />
              <StatCard icon={<Award />} label="Certs" count={user.certifications?.length || 0} />
              <StatCard icon={<BadgePlus />} label="Skills" count={user.skills?.length || 0} />
              <StatCard icon={<PlusCircle />} label="Extras" count={user.additionalSections?.length || 0} />
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant="outline" className="border-indigo-300 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-300 dark:hover:bg-indigo-900/50 flex items-center gap-2 flex-shrink-0" onClick={() => navigate("/profile")}>
                <Edit className="h-4 w-4"/>
                Edit Profile
              </Button>
              <Button 
                onClick={toggleDarkMode} 
                variant="outline" 
                size="icon" 
                className="border-indigo-300 hover:bg-indigo-50 dark:border-indigo-700 dark:hover:bg-indigo-900/50 flex-shrink-0"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="h-5 w-5 text-amber-300" /> : <Moon className="h-5 w-5 text-indigo-600" />}
              </Button>
            </div>
          </div>
        </motion.div>
        
        <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden">
          
          {/* Left Column - Stats & Actions (Compact) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="lg:w-72 flex flex-col gap-4"
          >
            {/* Profile Summary - Compact */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 p-3 flex items-center">
                <User className="w-4 h-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                Profile Summary
              </h3>
              
              <div className="p-3 space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50/80 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700/80">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-gray-800 dark:text-white">{resumeList.length}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Total Resumes</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50/80 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700/80">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 dark:text-white">{getLastUpdatedDate()}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Last Updated</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50/80 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700/80">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/60 flex items-center justify-center">
                    <PieChart className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <button 
                      onClick={handleOpenATSChecker}
                      disabled={isLoading || resumeList.length === 0}
                      className="font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                    >
                      Check Score
                    </button>
                    <div className="text-xs text-gray-500 dark:text-gray-400">ATS Compatibility</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 p-3 flex items-center">
                <SlidersHorizontal className="w-4 h-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                Quick Actions
              </h3>
              
              <div className="p-3 space-y-2">
                <Button 
                  onClick={handleOpenATSChecker} 
                  disabled={isLoading || resumeList.length === 0} 
                  className="w-full rounded-lg text-sm py-2 h-auto bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 shadow-sm hover:shadow-md transition-all"
                >
                  <PieChart className="h-3.5 w-3.5 mr-1.5" /> 
                  ATS Checker
                </Button>
                
                <Button 
                  onClick={() => document.querySelector('.add-resume-trigger')?.click()} 
                  className="w-full rounded-lg text-sm py-2 h-auto bg-gradient-to-r from-emerald-500 to-blue-600 text-white hover:from-emerald-600 hover:to-blue-700 shadow-sm hover:shadow-md transition-all"
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" /> 
                  New Resume
                </Button>
              </div>
            </div>
            
            {/* Recent Activity (Compact) */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-200 dark:border-gray-700 h-[200px] flex flex-col">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 p-3 flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                Recent Activity
              </h3>
              
              <div className="p-3 space-y-2 overflow-hidden flex-1">
                {resumeList
                  .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                  .slice(0, 2)
                  .map((resume, idx) => (
                  <div key={idx} className="flex items-center p-2 rounded-lg bg-gray-50/80 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700/80">
                    <div className="w-7 h-7 rounded-md bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center mr-2">
                      <FileText className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-800 dark:text-white truncate">{resume.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(resume.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                  </div>
                ))}
                
                {resumeList.length > 2 && (
                  <div className="text-center mt-1">
                    <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                      View more...
                    </button>
                  </div>
                )}
                
                {resumeList.length === 0 && !isLoading && (
                  <div className="text-center p-3 text-gray-500 dark:text-gray-400 text-sm">
                    No resume activity yet
                  </div>
                )}
                
                {isLoading && (
                  <div className="text-center p-3">
                    <LoaderCircle className="h-5 w-5 animate-spin text-indigo-500 mx-auto" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          
          {/* Right Column - Resume List */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="lg:flex-1 flex flex-col"
          >
            {/* Search and filter controls */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-3 mb-4 relative z-30">
              <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                <div className="relative w-full md:w-auto flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Input 
                    placeholder="Search resumes..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full md:w-80 bg-gray-50 dark:bg-gray-700/60 border-gray-200 dark:border-gray-600 rounded-lg h-9" 
                  />
                </div>
                
                {/* Sort Controls - with higher z-index and better positioning */}
                <div className="flex items-center gap-2">
                  <div ref={sortDropdownRef} className="relative z-50">
                    <Button variant="outline" onClick={() => setShowSortOptions(!showSortOptions)} className="h-8 rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 whitespace-nowrap flex items-center text-sm">
                      <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" />
                      {sortOption === "newest" && "Newest first"}
                      {sortOption === "oldest" && "Oldest first"}
                      {sortOption === "alphabetical" && "A to Z"}
                      <ChevronDown className="h-3.5 w-3.5 ml-1.5" />
                    </Button>
                    {showSortOptions && (
                      <div className="absolute z-[9999] mt-1 right-0 w-44 rounded-md shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                          <button 
                            onClick={() => { setSortOption("newest"); setShowSortOptions(false); }} 
                            className={`w-full text-left px-3 py-2 text-sm transition-colors ${sortOption === "newest" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                          >
                            <div className="flex items-center">
                              {sortOption === "newest" && <svg className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                              <span className={sortOption === "newest" ? "" : "ml-6"}>Newest first</span>
                            </div>
                          </button>
                          <button 
                            onClick={() => { setSortOption("oldest"); setShowSortOptions(false); }} 
                            className={`w-full text-left px-3 py-2 text-sm transition-colors ${sortOption === "oldest" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                          >
                            <div className="flex items-center">
                              {sortOption === "oldest" && <svg className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                              <span className={sortOption === "oldest" ? "" : "ml-6"}>Oldest first</span>
                            </div>
                          </button>
                          <button 
                            onClick={() => { setSortOption("alphabetical"); setShowSortOptions(false); }} 
                            className={`w-full text-left px-3 py-2 text-sm transition-colors ${sortOption === "alphabetical" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                          >
                            <div className="flex items-center">
                              {sortOption === "alphabetical" && <svg className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                              <span className={sortOption === "alphabetical" ? "" : "ml-6"}>A to Z</span>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg flex p-1">
                    <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-white dark:bg-gray-600 text-emerald-500 shadow-sm" : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
                      <Grid className="h-4 w-4" />
                    </button>
                    <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-white dark:bg-gray-600 text-emerald-500 shadow-sm" : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          
            
            {/* Resume Cards */}
            <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 rounded-xl bg-gray-50/50 dark:bg-gray-900/30 backdrop-blur-sm shadow-inner border border-gray-100 dark:border-gray-800 p-3 pb-0">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <LoaderCircle className="h-10 w-10 animate-spin text-indigo-500 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Loading your resumes...</p>
                  </div>
                </div>
              ) : (
                <AnimatePresence>
                  <motion.div 
                    key={viewMode} 
                    variants={containerVariants}
                    initial="hidden" 
                    animate="visible" 
                    exit="exit"
                    className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "flex flex-col space-y-3"}
                  >
                    {!searchQuery && (
                      <motion.div variants={itemVariants} className={viewMode === "list" ? "w-full" : ""}>
                        <AddResume viewMode={viewMode} />
                      </motion.div>
                    )}
                    {filteredList.map((resume) => (
                      <motion.div key={resume._id} variants={itemVariants} className={viewMode === "list" ? "w-full" : ""}>
                        <ResumeCard resume={resume} refreshData={fetchAllResumeData} viewMode={viewMode} />
                      </motion.div>
                    ))}
                    
                    {filteredList.length === 0 && searchQuery && (
                      <div className="col-span-full text-center py-10">
                        <Search className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">No matches found</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Try adjusting your search query</p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* ATS Score Checker Modal */}
      <ATSScoreChecker isOpen={showATSModal} onClose={() => setShowATSModal(false)} resumes={resumeList} />
    </div>
  );
}

export default Dashboard;
