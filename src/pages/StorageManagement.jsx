import React from 'react';
import { useTheme } from '../context/ThemeContext';
import StorageCard from '../components/StorageCard';
import logo from '../assets/bluechat_logo.webp';
import cliksBusinessLogo from '../assets/cliks-business.png';
import cliksLogo from '../assets/cliks.png';
import b2authLogo from '../assets/b2auth.png';
import bittoolLogo from '../assets/BIT-TOOL-2.png';

const StorageManagement = () => {
  const { theme } = useTheme();

  return (
    <div
      className="min-h-screen flex flex-col font-sans overflow-y-auto"
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      {/* Top Header Bar */}
      <div
        className="px-6 py-4 border-b flex items-center justify-between bg-white/30 dark:bg-gray-900/30 backdrop-blur-md sticky top-0 z-10"
        style={{ borderColor: theme.border }}
      >
        <div className="flex items-center gap-3">
          <img src={beta2.png} alt="BNX Mail" className="h-7 w-auto" />
          <span className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
          <span className="text-xs font-bold uppercase tracking-wider opacity-75">Storage Control Center</span>
        </div>

        {/* Close Tab Button */}
        <button
          onClick={() => window.close()}
          className="px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all hover:bg-black/5 dark:hover:bg-white/5 active:scale-[0.98] cursor-pointer"
          style={{ borderColor: theme.border, color: theme.text }}
        >
          Close Page
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 space-y-8">

        {/* Page Header Titles */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Storage Management</h1>
          <p className="text-xs sm:text-sm" style={{ color: theme.subText }}>
            View and manage storage usage across your applications.
          </p>
          <div className="mt-2.5">
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider"
              style={{ backgroundColor: `${theme.accent}15`, color: theme.accent }}
            >
              5 GB per application
            </span>
          </div>
        </div>

        {/* 2-Column Responsive Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StorageCard name="Cliks Business" logo={cliksBusinessLogo} />
          <StorageCard name="Cliks" logo={cliksLogo} />
          <StorageCard name="B2Auth" logo={b2authLogo} />
          <StorageCard name="BitTool" logo={bittoolLogo} />
        </div>

      </div>
    </div>
  );
};

export default StorageManagement;
