import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { MdSettings, MdEmail, MdLogout, MdLightMode, MdDarkMode, MdNotifications, MdCheckCircle, MdManageAccounts } from "react-icons/md";
// import logo from "../assets/bnx.jpeg";

import logo from "../assets/bnx-remove.png";
import bitToolLogo from "../assets/BIT-TOOL-2.png";

const NavBar = ({ searchQuery, setSearchQuery, onOpenMenu, onToggleDesktopSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, currentThemeName, changeTheme } = useTheme();
  const isPrimary = user?.isPrimary || user?.mailboxes?.find(m => m.email === user.email)?.isPrimary;


  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleThemeToggle = () => {
    changeTheme(currentThemeName === "Dark" ? "Classic" : "Dark");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching:", searchQuery);
  };

  return (
    <nav
      className="sticky top-0 z-50 px-6 py-2.5 transition-colors duration-300"
      style={{ backgroundColor: theme.bg }}
    >
      <div className="flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center flex-1">
          <div className="w-[200px] shrink-0 flex items-center gap-2.5">
            <img
              src={logo}
              alt="BNX Mail"
              className="h-10 cursor-pointer drop-shadow-sm transition-transform hover:scale-105"
              onClick={() => navigate("/inbox")}
            />
            <span
              onClick={() => navigate("/inbox")}
              className="text-xl font-bold tracking-tight cursor-pointer hover:opacity-90 transition-opacity"
              style={{ color: theme.text }}
            >
              BNX<span style={{ color: theme.accent || "#135bec" }}>mail</span>
            </span>
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-3xl hidden md:block">
            <div className="relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search mail"
                className="w-full px-5 py-2.5 pl-12 pr-12 rounded-full text-[14px] placeholder:text-gray-500 dark:placeholder:text-gray-400 bg-black/[0.04] dark:bg-white/[0.06] focus:bg-white dark:focus:bg-gray-950 focus:shadow-md border border-transparent outline-none transition-all duration-200"
                style={{ color: theme.text }}
              />
              <svg
                className="absolute left-4 top-3.5 h-4 w-4 transition-colors text-gray-500 dark:text-gray-400 group-focus-within:text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </form>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* THEME TOGGLE */}
          {/* <button
            onClick={handleThemeToggle}
            className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors tooltip-trigger flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
            title="Toggle theme"
          >
            {currentThemeName === "Dark" ? <MdLightMode size={22} className="text-yellow-400" /> : <MdDarkMode size={22} className="text-blue-600" />}
          </button> */}

          {/* NOTIFICATION */}
          {/* <button className="p-2.5 rounded-full relative hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 flex items-center justify-center">
            <MdNotifications size={24} />
            <span className="absolute top-2 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900" />
          </button> */}

          {/* USER */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
            >
              {user?.profilePictureUrl ? (
                <img
                  src={`${import.meta.env.VITE_API_URL || "https://api.bnxmail.com"}${user.profilePictureUrl}`}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover shadow-sm border border-white dark:border-gray-700 shrink-0"
                />
              ) : (
                <div
                  className="h-8 w-8 rounded-full flex items-center justify-center text-white font-semibold shadow-sm shrink-0"
                  style={{ backgroundColor: theme.accent || "#135bec" }}
                >
                  {user?.email?.[0]?.toUpperCase() || "U"}
                </div>
              )}
              <div className="hidden md:flex items-center gap-1.5">
                <span
                  className="text-sm font-medium"
                  style={{ color: theme.text }}
                >
                  {user?.email || "User"}
                </span>
                {isPrimary && (
                  <MdCheckCircle className="text-green-500 shrink-0" size={14} title="Primary Account" />
                )}
              </div>
              <svg
                className="h-4 w-4 hidden md:block"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: theme.subText }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showDropdown && (
              <div
                className="absolute right-0 mt-3 w-64 rounded-2xl shadow-xl dark:shadow-soft-dark border z-50 overflow-hidden animate-fade-in bg-white dark:bg-gray-900"
                style={{ borderColor: theme.border }}
              >
                <div className="px-5 py-4 border-b bg-white/50 dark:bg-gray-900/50" style={{ borderColor: theme.border }}>
                  <p className="text-sm font-semibold mb-0.5" style={{ color: theme.text }}>
                    {user?.username || "User"}
                  </p>
                  <div className="flex items-center gap-1.5 max-w-full">
                    <p className="text-xs truncate" style={{ color: theme.subText }}>
                      {user?.email}
                    </p>
                    {isPrimary && (
                      <MdCheckCircle className="text-green-500 shrink-0" size={12} title="Primary Account" />
                    )}
                  </div>
                </div>

                <div className="p-2">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      const token = localStorage.getItem("accessToken") || "";
                      window.open(`https://account.beta-softnet.com/security?token=${encodeURIComponent(token)}`, "_blank");
                    }}
                    className="w-full text-left px-3 py-2.5 text-sm rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-colors flex items-center gap-3 font-semibold"
                    style={{ color: theme.accent || "#135bec" }}
                  >
                    <MdManageAccounts size={20} /> Manage your account
                  </button>

                  <button
                    onClick={() => { setShowDropdown(false); navigate("/settings"); }}
                    className="w-full text-left px-3 py-2.5 text-sm rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-colors flex items-center gap-3"
                    style={{ color: theme.text }}
                  >
                    <MdSettings size={20} className="text-gray-500" /> Settings
                  </button>

                  <button
                    onClick={() => { setShowDropdown(false); navigate("/settings/emails"); }}
                    className="w-full text-left px-3 py-2.5 text-sm rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-colors flex items-center gap-3"
                    style={{ color: theme.text }}
                  >
                    <MdEmail size={20} className="text-gray-500" /> Manage Emails
                  </button>
                </div>

                <div className="border-t p-2" style={{ borderColor: theme.border }}>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2.5 text-sm rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-3 font-medium"
                  >
                    <MdLogout size={20} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="h-6 w-[1px] bg-gray-200 dark:bg-gray-700 mx-1 hidden sm:block" />
          
          <img 
            src={bitToolLogo} 
            alt="BIT Tool" 
            className="h-8 object-contain ml-2" 
          />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
