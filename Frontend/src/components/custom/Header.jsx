// C:\Users\NxtWave\Downloads\code\Frontend\src\components\custom\Header.jsx
import React, { useEffect, useState, useRef } from "react";
import { Button } from "../ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/Services/login";
import { addUserData } from "@/features/user/userFeatures";
import { motion } from "framer-motion";
import { FaUser, FaSignOutAlt, FaTachometerAlt, FaKey, FaEdit } from "react-icons/fa"; // Import FaEdit
import { Moon, Sun } from "lucide-react";
import ChangePasswordModal from "./ChangePasswordModal";

function Header({ user, darkMode, toggleDarkMode }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isChangePasswordOpen, setChangePasswordOpen] = useState(false);
  const userDropdownRef = useRef(null);

  const isDashboardPage = location.pathname === '/dashboard';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      if (response.statusCode === 200) {
        dispatch(addUserData(""));
        navigate("/");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleUserDropdown = () => setUserDropdownOpen(!userDropdownOpen);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        id="printHeader"
        className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-4 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-sm shadow-md dark:bg-gray-900/80" : "bg-white/80 backdrop-blur-sm dark:bg-gray-900/60"}`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-indigo-600 bg-clip-text text-transparent">
              NxtResume
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                {!isDashboardPage && (
                    <Button variant="outline" className="border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 dark:text-indigo-300 dark:border-indigo-700 dark:hover:bg-indigo-900/50 flex items-center gap-2" onClick={() => navigate("/dashboard")}>
                        <FaTachometerAlt className="w-4 h-4" />Dashboard
                    </Button>
                )}
                <div ref={userDropdownRef} className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm ml-2 cursor-pointer hover:shadow-lg transition-shadow" onClick={toggleUserDropdown}>
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                  </div>
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 py-2 text-left">
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700"><div className="text-gray-900 dark:text-gray-100 font-medium">User Profile</div></div>
                      <div className="px-4 py-3">
                        <div className="mb-2"><div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Full Name</div><div className="text-sm font-medium text-gray-800 dark:text-gray-200">{user.fullName || "Not Available"}</div></div>
                        <div className="mb-2"><div className="text-xs text-gray-500 dark:text-gray-400 mb-1">NIAT ID</div><div className="text-sm font-medium text-gray-800 dark:text-gray-200 font-mono">{user.niatId || "Not Available"}</div></div>
                        <div className="mb-2"><div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email</div><div className="text-sm font-medium text-gray-800 dark:text-gray-200 break-all">{user.email || "Not Available"}</div></div>
                        
                        {/* --- NEW EDIT PROFILE BUTTON --- */}
                        <button onClick={() => { navigate('/profile'); setUserDropdownOpen(false); }} className="w-full text-left text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-2 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                          <FaEdit className="w-3 h-3" /> Edit Profile
                        </button>
                        
                        <button onClick={() => { setChangePasswordOpen(true); setUserDropdownOpen(false); }} className="w-full text-left text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-2 mt-2">
                          <FaKey className="w-3 h-3" /> Change Password
                        </button>
                      </div>
                      <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-2">
                        <button onClick={handleLogout} className="w-full text-left text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-2">
                          <FaSignOutAlt className="w-3 h-3" />Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/auth/sign-in">
                  <Button className="bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                    <FaUser className="w-3 h-3" />Get Started
                  </Button>
                </Link>
                 <button
                  onClick={toggleDarkMode}
                  className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-sm transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <Sun className="h-5 w-5 text-amber-300" /> : <Moon className="h-5 w-5 text-indigo-600" />}
                </button>
              </div>
            )}
          </div>
          <button className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={toggleMenu}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="md:hidden bg-white dark:bg-gray-800 shadow-lg rounded-b-lg mt-4 overflow-hidden">
            <div className="border-t border-gray-100 dark:border-gray-700 px-6 py-4">
              {user ? (
                <div className="flex flex-col gap-3">
                  {user && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-3">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                          {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800 dark:text-gray-200">{user.fullName || "User"}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">{user.niatId}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                        </div>
                      </div>
                       <button onClick={() => { setChangePasswordOpen(true); setMenuOpen(false); }} className="w-full text-left text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 flex items-center gap-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                          <FaKey className="w-3 h-3" /> Change Password
                        </button>
                    </div>
                  )}
                  {!isDashboardPage && (<Button variant="outline" className="w-full justify-center border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 dark:text-indigo-300 dark:border-indigo-700 dark:hover:bg-indigo-900/50" onClick={() => { navigate("/dashboard"); setMenuOpen(false); }}><FaTachometerAlt className="w-4 w-4" />Dashboard</Button>)}
                  <Button className="w-full justify-center bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 flex items-center gap-2" onClick={() => { handleLogout(); setMenuOpen(false); }}><FaSignOutAlt className="w-4 h-4" />Logout</Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/auth/sign-in" className="w-full" onClick={() => setMenuOpen(false)}>
                    <Button className="w-full justify-center bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 flex items-center gap-2"><FaUser className="w-3 h-3" />Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </motion.header>
      <ChangePasswordModal isOpen={isChangePasswordOpen} onClose={() => setChangePasswordOpen(false)} />
    </>
  );
}

export default Header;
