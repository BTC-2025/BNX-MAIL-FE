import React, { useState } from "react";
import { MdClose, MdEdit } from "react-icons/md";
import bnxLogo from "../assets/bnx-remove.png";
import b2authLogo from "../assets/b2auth.png";
import bitToolLogo from "../assets/BIT-TOOL-2.png";
import cliksLogo from "../assets/cliks.png";
import cliksBusinessLogo from "../assets/cliks-business.png";

const AppLauncher = ({ onClose, onToggleBitToolSidebar }) => {
  const [activeTab, setActiveTab] = useState('BASE');

  const publicApps = [
    { name: 'Cliks', icon: cliksLogo, href: 'https://cliks.beta-softnet.com' },
    { name: 'BNXmail', icon: bnxLogo, href: 'https://www.bnxmail.com' },
    { name: 'Bit-Tool', icon: bitToolLogo, isButton: true },
    { name: 'B2Auth', icon: b2authLogo, href: 'https://www.b2auth.com' }
  ];

  const businessApps = [
    { name: 'CliksBusiness', icon: cliksBusinessLogo, href: 'https://www.cliksbusiness.com' }
  ];

  const displayApps = activeTab === 'BASE' 
    ? [...publicApps, ...businessApps] 
    : activeTab === 'PUBLIC' 
      ? publicApps 
      : businessApps;

  return (
    <div className="flex flex-col h-full bg-white w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
        <div className="flex items-center text-xl font-black text-gray-900 tracking-tight">
          <span className="text-blue-500 text-3xl font-serif mr-2 leading-none">B</span> Beta
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-full text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            <MdEdit size={14} /> Edit
          </button>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 transition-colors">
            <MdClose size={18} />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
        {/* Favorites & Recent */}
        <div className="bg-[#f8fbff] border border-blue-50/50 rounded-[20px] p-4 flex gap-4 mb-8 shadow-sm">
          {/* Favorites */}
          <div className="flex-1">
            <h3 className="text-[11px] font-extrabold text-slate-700 tracking-widest mb-3">FAVORITES</h3>
            <div className="grid grid-cols-2 gap-2">
              {publicApps.map((app, idx) => (
                <div 
                  key={idx} 
                  className="bg-white border border-gray-100 rounded-2xl p-2 flex flex-col items-center justify-center gap-1 hover:border-gray-200 hover:shadow-sm cursor-pointer transition-all aspect-[4/3]" 
                  onClick={app.isButton ? () => { onToggleBitToolSidebar?.(); onClose(); } : () => window.open(app.href, '_blank')}
                >
                  <img src={app.icon} alt={app.name} className="w-6 h-6 object-contain" />
                  <span className="text-[9px] font-bold text-slate-700 mt-0.5">{app.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Vertical Divider */}
          <div className="w-px bg-gray-200/60 my-2"></div>

          {/* Recent View */}
          <div className="flex-1 flex flex-col">
            <h3 className="text-[11px] font-extrabold text-slate-700 tracking-widest mb-3">RECENT VIEW</h3>
            <div className="flex-1 border border-dashed border-gray-300 rounded-2xl flex items-center justify-center bg-transparent min-h-[80px]">
              <span className="text-[10px] font-bold text-gray-400">No recents</span>
            </div>
          </div>
        </div>

        {/* Tabs Row */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => setActiveTab('BASE')}
            className={`text-[13px] font-extrabold tracking-widest pb-1.5 border-b-2 transition-colors ${activeTab === 'BASE' ? 'text-slate-700 border-slate-700' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
          >
            BASE
          </button>
          
          <div className="flex items-center gap-3 text-[11px] font-extrabold tracking-widest">
            <button 
              onClick={() => setActiveTab('PUBLIC')}
              className={`pb-1.5 border-b-2 transition-colors ${activeTab === 'PUBLIC' ? 'text-blue-600 border-blue-600' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
            >
              PUBLIC
            </button>
            <span className="text-gray-300 pb-1.5 font-normal">|</span>
            <button 
              onClick={() => setActiveTab('BUSINESS')}
              className={`pb-1.5 border-b-2 transition-colors ${activeTab === 'BUSINESS' ? 'text-blue-600 border-blue-600' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
            >
              BUSINESS
            </button>
          </div>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-4 gap-x-2 gap-y-4">
          {displayApps.map((app, idx) => (
            <div 
              key={idx}
              onClick={app.isButton ? () => { onToggleBitToolSidebar?.(); onClose(); } : () => window.open(app.href, '_blank')}
              className="flex flex-col items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-[60px] h-[60px] rounded-[18px] bg-[#fafafa] border border-gray-100 flex items-center justify-center group-hover:shadow-md group-hover:border-gray-200 group-hover:bg-white transition-all">
                <img src={app.icon} alt={app.name} className="w-7 h-7 object-contain" />
              </div>
              <span className="text-[10px] font-bold text-slate-700 text-center leading-tight">
                {app.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50/50 py-4 text-center border-t border-gray-100 shrink-0 rounded-b-[24px]">
        <span className="text-[9px] font-extrabold text-gray-400 tracking-[0.2em]">BETA ECO-SYSTEM • FUTURE READY</span>
      </div>
    </div>
  );
};

export default AppLauncher;
