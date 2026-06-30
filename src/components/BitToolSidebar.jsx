import React, { useState } from "react";
import { 
  MdCalendarToday, MdCalculate, MdPeople, MdSecurity, MdKeyboard, 
  MdTranslate, MdFilterCenterFocus, MdCloudQueue, MdNewspaper, 
  MdAdd, MdCheck, MdClose, MdOutlineEdit, MdTune
} from "react-icons/md";
import { useTheme } from "../context/ThemeContext";

// Tools Definition
const ALL_TOOLS = [
  { id: "calendar", name: "Calendar", icon: MdCalendarToday, color: "#f59e0b", ringClass: "border-[#f59e0b]", textClass: "text-[#f59e0b]", bgClass: "bg-amber-50 dark:bg-amber-950/20" },
  { id: "calculator", name: "Calculator", icon: MdCalculate, color: "#10b981", ringClass: "border-[#10b981]", textClass: "text-[#10b981]", bgClass: "bg-emerald-50 dark:bg-emerald-950/20" },
  { id: "contacts", name: "Contacts", icon: MdPeople, color: "#3b82f6", ringClass: "border-[#3b82f6]", textClass: "text-[#3b82f6]", bgClass: "bg-blue-50 dark:bg-blue-950/20" },
  { id: "security", name: "Security", icon: MdSecurity, color: "#0d9488", ringClass: "border-[#0d9488]", textClass: "text-[#0d9488]", bgClass: "bg-teal-50 dark:bg-teal-950/20" },
  { id: "keyboard", name: "Keyboard", icon: MdKeyboard, color: "#6366f1", ringClass: "border-[#6366f1]", textClass: "text-[#6366f1]", bgClass: "bg-indigo-50 dark:bg-indigo-950/20" },
  { id: "translator", name: "Translator", icon: MdTranslate, color: "#ec4899", ringClass: "border-[#ec4899]", textClass: "text-[#ec4899]", bgClass: "bg-pink-50 dark:bg-pink-950/20" },
  { id: "lens", name: "Lens", icon: MdFilterCenterFocus, color: "#8b5cf6", ringClass: "border-[#8b5cf6]", textClass: "text-[#8b5cf6]", bgClass: "bg-purple-50 dark:bg-purple-950/20" },
  { id: "weather", name: "Weather", icon: MdCloudQueue, color: "#06b6d4", ringClass: "border-[#06b6d4]", textClass: "text-[#06b6d4]", bgClass: "bg-cyan-50 dark:bg-cyan-950/20" },
  { id: "news", name: "News", icon: MdNewspaper, color: "#6b7280", ringClass: "border-[#6b7280]", textClass: "text-[#6b7280]", bgClass: "bg-gray-50 dark:bg-gray-800/30" }
];

const BitToolSidebar = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const [pinnedTools, setPinnedTools] = useState(["calendar", "calculator", "contacts", "security"]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);

  // Tooltip helper state
  const [hoveredTool, setHoveredTool] = useState(null);

  // Calculator State
  const [calcInput, setCalcInput] = useState("");
  const [calcResult, setCalcResult] = useState("");

  // Translator State
  const [transText, setTransText] = useState("");
  const [transTarget, setTransTarget] = useState("es");
  const [transOutput, setTransOutput] = useState("");

  // Contacts Search State
  const [contactsSearch, setContactsSearch] = useState("");

  // Security Scan State
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState("System Protected");

  // Weather State
  const [weatherCity, setWeatherCity] = useState("New York");

  if (!isOpen) return null;

  // Toggle Pinned status
  const handleTogglePin = (toolId) => {
    if (pinnedTools.includes(toolId)) {
      // Don't allow unpinning if it's the last one
      if (pinnedTools.length > 1) {
        setPinnedTools(pinnedTools.filter(id => id !== toolId));
      }
    } else {
      setPinnedTools([...pinnedTools, toolId]);
    }
  };

  // Calculator Buttons Click
  const handleCalcClick = (val) => {
    if (val === "C") {
      setCalcInput("");
      setCalcResult("");
    } else if (val === "=") {
      try {
        // Safe evaluation
        const cleanExpression = calcInput.replace(/[^0-9+\-*/.]/g, "");
        const res = Function(`"use strict"; return (${cleanExpression})`)();
        setCalcResult(String(res));
      } catch (err) {
        setCalcResult("Error");
      }
    } else if (val === "Del") {
      setCalcInput(prev => prev.slice(0, -1));
    } else {
      setCalcInput(prev => prev + val);
    }
  };

  // Translator Translate Trigger
  const handleTranslate = () => {
    if (!transText.trim()) return;
    const dictionary = {
      es: { hello: "Hola", welcome: "Bienvenido", security: "Seguridad", email: "Correo electrónico" },
      fr: { hello: "Bonjour", welcome: "Bienvenue", security: "Sécurité", email: "E-mail" },
      de: { hello: "Hallo", welcome: "Willkommen", security: "Sicherheit", email: "E-Mail" }
    };
    const key = transText.toLowerCase().trim();
    const targetDict = dictionary[transTarget] || {};
    const translated = targetDict[key] || `[Translated to ${transTarget.toUpperCase()}]: ${transText}`;
    setTransOutput(translated);
  };

  // Security Scan Trigger
  const handleStartScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanResult("Scanning for threats...");
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setScanProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        setScanResult("✓ System Secure. 0 threats found.");
      }
    }, 200);
  };

  const renderMiniApp = () => {
    switch (selectedTool) {
      case "calendar": {
        const today = new Date();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        const firstDayIndex = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        
        return (
          <div className="flex flex-col h-full text-gray-700 dark:text-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-sm">{monthNames[today.getMonth()]} {today.getFullYear()}</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-[10px] text-center font-bold opacity-60 mb-2">
              <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isToday = day === today.getDate();
                return (
                  <div 
                    key={`day-${day}`}
                    className={`py-1.5 rounded-full flex items-center justify-center font-semibold ${isToday ? "bg-amber-500 text-white shadow-sm" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
            <div className="mt-6 border-t border-gray-100 dark:border-gray-800 pt-4">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Today's Schedule</span>
              <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-xs flex flex-col gap-1">
                <span className="font-bold text-amber-600 dark:text-amber-400">14:00 - Project Review</span>
                <span className="opacity-75">Reviewing mail client features with team members.</span>
              </div>
            </div>
          </div>
        );
      }
      case "calculator":
        return (
          <div className="flex flex-col h-full text-gray-700 dark:text-gray-200">
            <div className="bg-black/5 dark:bg-black/20 p-3 rounded-2xl text-right mb-4 border border-gray-200/20 shadow-inner min-h-[72px] flex flex-col justify-end">
              <div className="text-xs opacity-60 tracking-wider truncate mb-1">{calcInput || "0"}</div>
              <div className="text-xl font-bold truncate">{calcResult || "0"}</div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {["C", "Del", "(", ")"].map(btn => (
                <button key={btn} onClick={() => handleCalcClick(btn)} className="py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 font-bold hover:scale-[1.03] active:scale-[0.97] transition-all text-xs cursor-pointer">{btn}</button>
              ))}
              {["7", "8", "9", "/"].map(btn => (
                <button key={btn} onClick={() => handleCalcClick(btn)} className="py-2.5 rounded-xl bg-white dark:bg-gray-700 font-semibold border border-gray-100 dark:border-gray-800 hover:scale-[1.03] active:scale-[0.97] transition-all text-xs cursor-pointer">{btn}</button>
              ))}
              {["4", "5", "6", "*"].map(btn => (
                <button key={btn} onClick={() => handleCalcClick(btn)} className="py-2.5 rounded-xl bg-white dark:bg-gray-700 font-semibold border border-gray-100 dark:border-gray-800 hover:scale-[1.03] active:scale-[0.97] transition-all text-xs cursor-pointer">{btn}</button>
              ))}
              {["1", "2", "3", "-"].map(btn => (
                <button key={btn} onClick={() => handleCalcClick(btn)} className="py-2.5 rounded-xl bg-white dark:bg-gray-700 font-semibold border border-gray-100 dark:border-gray-800 hover:scale-[1.03] active:scale-[0.97] transition-all text-xs cursor-pointer">{btn}</button>
              ))}
              {["0", ".", "=", "+"].map(btn => (
                <button key={btn} onClick={() => handleCalcClick(btn)} className={`py-2.5 rounded-xl font-bold hover:scale-[1.03] active:scale-[0.97] transition-all text-xs cursor-pointer ${btn === "=" ? "bg-emerald-500 text-white" : "bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-800"}`}>{btn}</button>
              ))}
            </div>
          </div>
        );
      case "contacts": {
        const list = [
          { name: "Sridharan", email: "sridharan@bnxmail.com" },
          { name: "Sri", email: "sri@bnxmail.com" },
          { name: "Beta Account", email: "beta@bnxmail.com" },
          { name: "Admin Support", email: "support@bnxmail.com" }
        ].filter(c => c.name.toLowerCase().includes(contactsSearch.toLowerCase()) || c.email.toLowerCase().includes(contactsSearch.toLowerCase()));

        return (
          <div className="flex flex-col h-full text-gray-700 dark:text-gray-200">
            <input 
              type="text" 
              placeholder="Search contacts"
              value={contactsSearch}
              onChange={(e) => setContactsSearch(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-black/5 dark:bg-white/5 border border-transparent focus:border-gray-300 dark:focus:border-gray-700 outline-none mb-4"
            />
            <div className="flex-1 space-y-2 overflow-y-auto hidden-scrollbar">
              {list.map((c, i) => (
                <div key={i} className="p-2.5 rounded-xl border border-gray-100 dark:border-gray-800/60 bg-white/40 dark:bg-gray-900/40 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs shrink-0">
                    {c.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs truncate">{c.name}</div>
                    <div className="text-[10px] opacity-60 truncate">{c.email}</div>
                  </div>
                </div>
              ))}
              {list.length === 0 && (
                <div className="text-center py-6 text-xs opacity-50">No contacts found</div>
              )}
            </div>
          </div>
        );
      }
      case "security":
        return (
          <div className="flex flex-col h-full items-center text-center text-gray-700 dark:text-gray-200">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isScanning ? "bg-teal-500/10 text-teal-500 animate-pulse" : "bg-teal-500 text-white shadow-md"}`}>
              <MdSecurity size={36} />
            </div>
            <h5 className="font-bold text-sm mb-1">{scanResult}</h5>
            <p className="text-xs opacity-60 mb-6">Last scanned: Today, {new Date().toLocaleTimeString()}</p>
            {isScanning && (
              <div className="w-full bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden mb-6">
                <div className="bg-teal-500 h-full transition-all duration-200" style={{ width: `${scanProgress}%` }} />
              </div>
            )}
            <button 
              disabled={isScanning}
              onClick={handleStartScan}
              className="px-6 py-2.5 rounded-xl text-white font-bold text-xs bg-teal-500 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
            >
              {isScanning ? "Scanning..." : "Start System Scan"}
            </button>
          </div>
        );
      case "keyboard":
        return (
          <div className="flex flex-col h-full text-gray-700 dark:text-gray-200 text-xs">
            <span className="font-bold text-gray-400 uppercase tracking-wider block mb-3 text-[10px]">Shortcuts Cheat Sheet</span>
            <div className="space-y-3.5">
              {[
                { key: "C", desc: "Compose new email" },
                { key: "/", desc: "Focus search bar" },
                { key: "I", desc: "Navigate to Inbox" },
                { key: "G", desc: "Open Colab/Group chats" },
                { key: "R", desc: "Reply to currently open email" }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="opacity-75">{item.desc}</span>
                  <kbd className="px-2 py-1 bg-black/5 dark:bg-white/10 rounded font-mono font-bold text-[10px] shadow-sm border border-gray-200/20">{item.key}</kbd>
                </div>
              ))}
            </div>
          </div>
        );
      case "translator":
        return (
          <div className="flex flex-col h-full text-gray-700 dark:text-gray-200 text-xs">
            <label className="block font-bold text-gray-400 uppercase tracking-wider mb-1 text-[10px]">Translate text</label>
            <textarea 
              value={transText}
              onChange={(e) => setTransText(e.target.value)}
              placeholder="Type word (e.g. hello, welcome...)"
              className="w-full h-16 p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-transparent focus:border-gray-300 dark:focus:border-gray-700 outline-none resize-none mb-3"
            />
            <div className="flex items-center gap-2 mb-3">
              <span className="opacity-60">Translate to:</span>
              <select 
                value={transTarget}
                onChange={(e) => setTransTarget(e.target.value)}
                className="bg-black/5 dark:bg-white/5 p-1 rounded border border-transparent outline-none font-semibold cursor-pointer"
              >
                <option value="es" className="dark:bg-gray-900">Spanish</option>
                <option value="fr" className="dark:bg-gray-900">French</option>
                <option value="de" className="dark:bg-gray-900">German</option>
              </select>
            </div>
            <button 
              onClick={handleTranslate}
              className="w-full py-2.5 rounded-xl bg-pink-500 text-white font-bold shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer mb-4"
            >
              Translate
            </button>
            {transOutput && (
              <div className="p-3 bg-pink-500/10 rounded-xl border border-pink-500/20 font-semibold">
                {transOutput}
              </div>
            )}
          </div>
        );
      case "lens":
        return (
          <div className="flex flex-col h-full items-center text-center text-gray-700 dark:text-gray-200">
            <div className="w-full aspect-video border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center p-4 mb-4 bg-black/5 dark:bg-white/5">
              <MdFilterCenterFocus size={32} className="text-purple-500 mb-2" />
              <span className="text-[10px] opacity-65">Drop images here to scan</span>
            </div>
            <button className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
              Upload Image
            </button>
          </div>
        );
      case "weather":
        return (
          <div className="flex flex-col h-full text-gray-700 dark:text-gray-200">
            <select 
              value={weatherCity}
              onChange={(e) => setWeatherCity(e.target.value)}
              className="bg-black/5 dark:bg-white/5 p-2 rounded-xl border border-transparent outline-none font-semibold cursor-pointer mb-4 text-xs"
            >
              <option value="New York" className="dark:bg-gray-900">New York</option>
              <option value="London" className="dark:bg-gray-900">London</option>
              <option value="Tokyo" className="dark:bg-gray-900">Tokyo</option>
            </select>
            <div className="flex flex-col items-center text-center bg-cyan-500/10 p-4 rounded-2xl border border-cyan-500/20">
              <MdCloudQueue size={40} className="text-cyan-500 mb-2" />
              <span className="text-3xl font-extrabold">{weatherCity === "New York" ? "24°C" : weatherCity === "London" ? "16°C" : "28°C"}</span>
              <span className="text-xs font-semibold mt-1 opacity-75">{weatherCity === "London" ? "Light Rain" : "Sunny & Clear"}</span>
            </div>
          </div>
        );
      case "news":
        return (
          <div className="flex flex-col h-full text-gray-700 dark:text-gray-200 text-xs space-y-3 overflow-y-auto hidden-scrollbar">
            {[
              { title: "Vite 5.0 Release", desc: "Significant startup performance boosts and cleaner CLI logs." },
              { title: "Java 21 LTS", desc: "Virtual threads and structured concurrency now generally stable." },
              { title: "Next.js 14 Speed", desc: "Turbopack integration now passing 99% of integration tests." }
            ].map((feed, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-gray-500/10 border border-gray-500/20">
                <div className="font-bold mb-0.5 truncate">{feed.title}</div>
                <div className="opacity-75 text-[10px] leading-relaxed">{feed.desc}</div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex pointer-events-none select-none">
      {/* Background Overlay (Click outside to close) */}
      <div 
        className="fixed inset-0 bg-transparent pointer-events-auto"
        onClick={() => {
          setSelectedTool(null);
          onClose();
        }}
      />

      {/* Mini-App Slide Panel (Shown to the left of the sidebar) */}
      {selectedTool && (
        <div className="w-[300px] border-r dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl flex flex-col h-screen overflow-hidden pointer-events-auto animate-slide-in relative select-text">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-black/[0.01] dark:bg-white/[0.01]">
            <h4 className="font-bold text-sm" style={{ color: theme.text }}>
              {ALL_TOOLS.find(t => t.id === selectedTool)?.name}
            </h4>
            <button 
              onClick={() => setSelectedTool(null)} 
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
            >
              <MdClose size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {renderMiniApp()}
          </div>
        </div>
      )}

      {/* Right Sidebar Strip */}
      <div 
        className="w-[72px] border-l dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl flex flex-col items-center py-4 h-screen justify-between pointer-events-auto relative select-none"
        style={{ borderColor: theme.border }}
      >
        <div className="flex flex-col items-center w-full">
          {/* HEADER / EDIT MODE LABEL */}
          {isEditing ? (
            <div className="mb-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center leading-none">
              Edit<br />Pins
            </div>
          ) : (
            <div className="h-6" /> // spacer
          )}

          {/* ACTIVE & INACTIVE TOOLS LIST */}
          <div className="flex flex-col items-center gap-4 w-full">
            {isEditing ? (
              // EDIT MODE LAYOUT: Shows all tools, currently pinned ones have color rings, unpinned have dashed
              ALL_TOOLS.map((tool) => {
                const isPinned = pinnedTools.includes(tool.id);
                const Icon = tool.icon;
                return (
                  <div key={tool.id} className="relative group">
                    <button
                      onClick={() => handleTogglePin(tool.id)}
                      onMouseEnter={() => setHoveredTool(tool.id)}
                      onMouseLeave={() => setHoveredTool(null)}
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer border-2 ${
                        isPinned 
                          ? `${tool.ringClass} ${tool.bgClass} ${tool.textClass}` 
                          : "border-dashed border-gray-300 dark:border-gray-700 bg-transparent text-gray-400 hover:border-gray-400"
                      }`}
                    >
                      <Icon size={20} />
                    </button>
                    
                    {/* CUSTOM POPOVER TOOLTIP */}
                    {hoveredTool === tool.id && (
                      <div className="absolute right-[56px] top-1/2 -translate-y-1/2 bg-gray-800 text-white text-[11px] font-medium px-2 py-1 rounded shadow-md whitespace-nowrap z-50">
                        {isPinned ? `Unpin ${tool.name}` : `Pin ${tool.name}`}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              // NORMAL MODE LAYOUT: Shows only pinned tools
              ALL_TOOLS
                .filter(t => pinnedTools.includes(t.id))
                .map((tool) => {
                  const Icon = tool.icon;
                  const isSelected = selectedTool === tool.id;
                  return (
                    <div key={tool.id} className="relative">
                      <button
                        onClick={() => setSelectedTool(isSelected ? null : tool.id)}
                        onMouseEnter={() => setHoveredTool(tool.id)}
                        onMouseLeave={() => setHoveredTool(null)}
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer border-2 ${
                          isSelected 
                            ? `${tool.ringClass} ${tool.bgClass} ${tool.textClass} scale-95 shadow-inner` 
                            : `border-transparent hover:scale-105 ${tool.bgClass} ${tool.textClass} shadow-sm`
                        }`}
                      >
                        <Icon size={20} />
                      </button>

                      {/* TOOLTIP */}
                      {hoveredTool === tool.id && (
                        <div className="absolute right-[56px] top-1/2 -translate-y-1/2 bg-gray-800 text-white text-[11px] font-medium px-2 py-1 rounded shadow-md whitespace-nowrap z-50">
                          {tool.name}
                        </div>
                      )}
                    </div>
                  );
                })
            )}

            {/* PLUS ICON / CHECKMARK ICON */}
            {isEditing ? (
              // Green Checkmark Button
              <button
                onClick={() => setIsEditing(false)}
                className="w-11 h-11 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer mt-2"
                title="Save Pins"
              >
                <MdCheck size={22} />
              </button>
            ) : (
              // Plus Button (Dashed ring)
              <button
                onClick={() => setIsEditing(true)}
                className="w-11 h-11 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-600 flex items-center justify-center transition-all cursor-pointer"
                title="Edit Pins"
              >
                <MdAdd size={22} />
              </button>
            )}
          </div>
        </div>

        {/* BOTTOM UTILITY ICON BLOCK */}
        <div className="flex flex-col items-center gap-3.5 w-full mt-auto">
          <div className="w-8 h-[1px] bg-gray-200 dark:bg-gray-800" />
          
          <button 
            className="w-11 h-11 rounded-2xl border border-gray-200/60 dark:border-gray-850 hover:bg-gray-50 dark:hover:bg-gray-850 text-gray-500 dark:text-gray-400 flex items-center justify-center transition-all cursor-pointer bg-white/50 dark:bg-gray-900/50 shadow-sm"
            title="Shortcuts"
            onClick={() => setSelectedTool("keyboard")}
          >
            <MdOutlineEdit size={20} />
          </button>

          <button 
            className="w-11 h-11 rounded-2xl border border-gray-200/60 dark:border-gray-850 hover:bg-gray-50 dark:hover:bg-gray-850 text-gray-500 dark:text-gray-400 flex items-center justify-center transition-all cursor-pointer bg-white/50 dark:bg-gray-900/50 shadow-sm"
            title="Customize Sidebar"
            onClick={() => setIsEditing(true)}
          >
            <MdTune size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BitToolSidebar;
