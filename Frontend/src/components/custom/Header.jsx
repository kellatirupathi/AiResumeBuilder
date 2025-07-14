import React, { useEffect, useState, useRef } from "react";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/Services/login";
import { addUserData } from "@/features/user/userFeatures";
import { motion } from "framer-motion";
import { FaUser, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";

function Header({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);

  useEffect(() => {
    if (user) {
      console.log("Printing From Header User Found");
    } else {
      console.log("Printing From Header User Not Found");
    }

    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

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
  }, [user]);

  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      if (response.statusCode == 200) {
        dispatch(addUserData(""));
        navigate("/");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      id="printHeader"
      className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-4 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-md"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 group">
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-indigo-600 bg-clip-text text-transparent">
            AI Resume Builder
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">

          {user ? (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 flex items-center gap-2"
                onClick={() => navigate("/dashboard")}
              >
                <FaTachometerAlt className="w-4 h-4" />
                Dashboard
              </Button>
              <Button
                className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 flex items-center gap-2"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="w-4 h-4" />
                Logout
              </Button>
              <div 
                ref={userDropdownRef}
                className="relative"
              >
                <div 
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm ml-2 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={toggleUserDropdown}
                >
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                </div>
                
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 py-2 text-left">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="text-gray-900 font-medium">User Profile</div>
                    </div>
                    
                    <div className="px-4 py-3">
                      <div className="mb-2">
                        <div className="text-xs text-gray-500 mb-1">Full Name</div>
                        <div className="text-sm font-medium text-gray-800">{user.fullName || "Not Available"}</div>
                      </div>
                      
                      <div className="mb-2">
                        <div className="text-xs text-gray-500 mb-1">Email</div>
                        <div className="text-sm font-medium text-gray-800 break-all">{user.email || "Not Available"}</div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Password</div>
                        <div className="text-sm font-medium text-gray-800">••••••••</div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-100 px-4 py-2">
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left text-sm text-red-600 hover:text-red-800 flex items-center gap-2"
                      >
                        <FaSignOutAlt className="w-3 h-3" />
                        Sign out
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
                  <FaUser className="w-3 h-3" />
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          onClick={toggleMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white shadow-lg rounded-b-lg mt-4 overflow-hidden"
        >
          <nav className="flex flex-col py-2"></nav>
          <div className="border-t border-gray-100 px-6 py-4">
            {user ? (
              <div className="flex flex-col gap-3">
                {/* User info in mobile menu */}
                {user && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-3">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                        {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div>
                        <div className="font-medium">{user.fullName || "User"}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </div>
                )}
                
                <Button
                  variant="outline"
                  className="w-full justify-center border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 flex items-center gap-2"
                  onClick={() => {
                    navigate("/dashboard");
                    setMenuOpen(false);
                  }}
                >
                  <FaTachometerAlt className="w-4 h-4" />
                  Dashboard
                </Button>
                <Button
                  className="w-full justify-center bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 flex items-center gap-2"
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to="/auth/sign-in" className="w-full" onClick={() => setMenuOpen(false)}>
                  <Button className="w-full justify-center bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 flex items-center gap-2">
                    <FaUser className="w-3 h-3" />
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}

export default Header;
