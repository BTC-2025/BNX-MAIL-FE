import React, { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import bnxLogo from "../assets/bnx-remove.png";
import b2authLogo from "../assets/b2auth.png";
import bitToolLogo from "../assets/BIT-TOOL-2.png";
import cliksLogo from "../assets/cliks.png";
import cliksBusinessLogo from "../assets/cliks-business.png";

const AppLauncher = ({ isOpen, onClose, onToggleBitToolSidebar }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if clicking the toggle button
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        // Also check if the click was on the trigger button (by ID or class, though we don't strictly have one. We can just rely on capturing)
        // Wait, the trigger button stops propagation? If not, clicking the trigger button outside the portal might immediately close and reopen it.
        // But since we use mousedown on document, if it's outside the popup, it triggers onClose.
        // The trigger button is inside BitToolSidebar and also uses mousedown/click. 
        onClose();
      }
    };
    if (isOpen) {
      // Small delay to prevent immediate close from the click that opened it
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={popupRef}
      className="fixed top-[80px] right-2 md:right-[85px] w-[calc(100vw-16px)] md:w-[560px] max-w-[560px] max-h-[calc(100vh-100px)] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-gray-100 z-[9999] animate-fade-in custom-scrollbar"
    >
      <div className="flex flex-col md:flex-row bg-white min-h-full">
        {/* Category Column */}
        <div className="w-full md:w-[110px] border-b md:border-b-0 md:border-r border-gray-100 p-2 md:p-3 flex flex-row md:flex-col items-center shrink-0">
          <h3 className="text-[10px] font-bold text-gray-800 tracking-wider mb-0 md:mb-3 self-center md:self-start pl-1 mr-4 md:mr-0">CATEGORY</h3>
          
          <div className="flex justify-center mb-0 md:mb-3 mr-2 md:mr-0">
            <span className="px-3 py-1 border border-blue-100 text-blue-900 rounded-full text-[9px] font-bold tracking-widest bg-blue-50/50">
              BASE
            </span>
          </div>

          <div className="hidden md:block w-full h-px bg-gray-100 my-2"></div>

          <div className="flex justify-center md:mt-2">
            <span className="px-2 py-0.5 border border-orange-200 text-orange-400 rounded-md text-[8px] font-bold tracking-widest bg-orange-50/30 text-center leading-tight">
              COMING<span className="hidden md:inline"><br/></span><span className="inline md:hidden"> </span>SOON
            </span>
          </div>
        </div>

        {/* Public Column */}
        <div className="flex-[1.2] border-b md:border-b-0 md:border-r border-gray-100 p-2 md:p-3">
          <h3 className="text-[10px] font-bold text-gray-800 tracking-wider mb-1.5 md:mb-2.5">PUBLIC</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5">
            {/* BNXmail */}
            <a href="#" className="flex items-center gap-2 p-1.5 md:p-2 rounded-xl border border-transparent hover:border-gray-200 hover:shadow-sm transition-all bg-gray-50/40">
              <img src={bnxLogo} alt="BNXmail" className="w-6 h-6 md:w-7 md:h-7 object-contain" />
              <div className="min-w-0">
                <h4 className="text-gray-900 font-semibold text-[11px] md:text-[12px] leading-tight">BNXmail</h4>
                <p className="text-gray-500 text-[9px] md:text-[10px] truncate leading-tight">Real time mail, always in sync.</p>
              </div>
            </a>

            {/* B2Auth */}
            <a href="#" className="flex items-center gap-2 p-1.5 md:p-2 rounded-xl border border-transparent hover:border-gray-200 hover:shadow-sm transition-all bg-gray-50/40">
              <img src={b2authLogo} alt="B2Auth" className="w-6 h-6 md:w-7 md:h-7 object-contain" />
              <div className="min-w-0">
                <h4 className="text-gray-900 font-semibold text-[11px] md:text-[12px] leading-tight">B2Auth</h4>
                <p className="text-gray-500 text-[9px] md:text-[10px] truncate leading-tight">MFA & SSO Gateway</p>
              </div>
            </a>

            {/* Bit-Tool */}
            <button 
              onClick={() => {
                onToggleBitToolSidebar && onToggleBitToolSidebar();
                onClose();
              }}
              className="flex items-center gap-2 p-1.5 md:p-2 rounded-xl border border-transparent hover:border-gray-200 hover:shadow-sm transition-all bg-gray-50/40 w-full text-left"
            >
              <img src={bitToolLogo} alt="Bit-Tool" className="w-6 h-6 md:w-7 md:h-7 object-contain" />
              <div className="min-w-0">
                <h4 className="text-gray-900 font-semibold text-[11px] md:text-[12px] leading-tight">Bit-Tool</h4>
                <p className="text-gray-500 text-[9px] md:text-[10px] truncate leading-tight">User's daily utility assistant</p>
              </div>
            </button>

            {/* Cliks */}
            <a href="#" className="flex items-center gap-2 p-1.5 md:p-2 rounded-xl border border-transparent hover:border-gray-200 hover:shadow-sm transition-all bg-gray-50/40">
              <img src={cliksLogo} alt="Cliks" className="w-6 h-6 md:w-7 md:h-7 object-contain" />
              <div className="min-w-0">
                <h4 className="text-gray-900 font-semibold text-[11px] md:text-[12px] leading-tight">Cliks</h4>
                <p className="text-gray-500 text-[9px] md:text-[10px] truncate leading-tight">Make your Money</p>
              </div>
            </a>
          </div>
        </div>

        {/* Business Column */}
        <div className="flex-1 p-2 md:p-3">
          <h3 className="text-[10px] font-bold text-gray-800 tracking-wider mb-1.5 md:mb-2.5">BUSINESS</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5">
            {/* CliksBusiness */}
            <a href="#" className="flex items-center gap-2 p-1.5 md:p-2 rounded-xl border border-transparent hover:border-gray-200 hover:shadow-sm transition-all bg-gray-50/40">
              <img src={cliksBusinessLogo} alt="CliksBusiness" className="w-6 h-6 md:w-7 md:h-7 object-contain" />
              <div className="min-w-0">
                <h4 className="text-gray-900 font-semibold text-[11px] md:text-[12px] leading-tight">CliksBusiness</h4>
                <p className="text-gray-500 text-[9px] md:text-[10px] truncate leading-tight">Work together, faster</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 py-3 text-center border-t border-gray-100 sticky bottom-0">
        <span className="text-[11px] font-bold text-gray-800 tracking-[0.2em]">BETA ECOSYSTEM</span>
      </div>
    </div>,
    document.body
  );
};

export default AppLauncher;
