import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SIDEBAR_ITEMS } from "../Data/constants";
import { useTheme } from "../context/ThemeContext";
import { useMail } from "../context/MailContext";
import { MdLabel, MdAdd, MdClose, MdCheck } from "react-icons/md";

const SideBar = ({ isDesktopOpen, isMobileOpen, onCloseMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const { unreadCounts, labels, handleCreateLabel, openCompose } = useMail();

  const [isCreating, setIsCreating] = useState(false);
  const [newLabel, setNewLabel] = useState({ name: "", color: "#135bec" });

  const COLORS = ["#135bec", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#64748b"];

  const handleAddLabel = async () => {
    if (!newLabel.name.trim()) return;
    const success = await handleCreateLabel(newLabel.name, newLabel.color);
    if (success) {
      setIsCreating(false);
      setNewLabel({ name: "", color: "#135bec" });
    }
  };

  return (
    <aside
      className={`
        w-56 h-full overflow-y-auto flex flex-col transition-transform duration-300 shrink-0 border-r-0
        ${isMobileOpen ? "fixed inset-y-0 left-0 z-[60] flex translate-x-0 bg-white dark:bg-gray-900 shadow-xl" : "hidden -translate-x-full"}
        ${isDesktopOpen ? "md:flex md:relative md:translate-x-0" : "md:hidden"}
      `}
      style={{ backgroundColor: isMobileOpen ? undefined : theme.bg }}
    >
      {/* COMPOSE */}
      <div className="p-3 pl-3.5 pb-2">
        <button
          onClick={() => openCompose()}
          className="flex items-center gap-3 px-5 py-3 rounded-2xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02] cursor-pointer bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-200"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: theme.accent || "#135bec" }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <span className="text-[14px] font-medium" style={{ color: theme.text }}>Compose</span>
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 pr-0 py-2 space-y-0.5 overflow-y-auto">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = location.pathname === item.path || (location.pathname === "/" && item.path === "/inbox");
          const count = unreadCounts[item.name.toLowerCase()] || 0;

          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`w-[calc(100%-16px)] mx-2 flex items-center justify-between pl-4 pr-3 py-2 rounded-full transition-all duration-200 group cursor-pointer
                ${isActive
                  ? "bg-primary/10 dark:bg-primary/20"
                  : "hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
                }
              `}
              style={{
                color: isActive ? (theme.accent || "#135bec") : theme.sidebarText,
                fontWeight: isActive ? 600 : 500,
              }}
            >
              <div className="flex items-center gap-3">
                <span className={`text-[20px] transition-transform duration-200 ${isActive ? "scale-105" : "group-hover:scale-105"}`}>
                  {item.icon}
                </span>
                <span className="text-sm tracking-wide">{item.name}</span>
              </div>

              {count > 0 && (
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full shadow-sm"
                  style={{ backgroundColor: theme.accent || "#135bec", color: "#fff" }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}

        {/* CUSTOM LABELS */}
        <div className="mt-6">
          <div className="pl-4 pr-3 flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-50" style={{ color: theme.sidebarText }}>
              Labels
            </h3>
            <button
              onClick={() => setIsCreating(true)}
              className="p-1 rounded-md hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
              style={{ color: theme.accent }}
            >
              <MdAdd size={18} />
            </button>
          </div>

          {isCreating && (
            <div className="px-3 mb-4 animate-in slide-in-from-top-2 duration-200">
              <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-lg">
                <input
                  autoFocus
                  placeholder="Label name"
                  value={newLabel.name}
                  onChange={(e) => setNewLabel({ ...newLabel, name: e.target.value })}
                  className="w-full text-sm bg-transparent border-b dark:border-gray-700 pb-1 mb-3 outline-none focus:border-primary transition-colors"
                  style={{ color: theme.text }}
                />
                <div className="flex flex-wrap gap-2 mb-3">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setNewLabel({ ...newLabel, color: c })}
                      className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer ${
                        newLabel.color === c ? "border-white ring-2 ring-primary scale-110" : "border-transparent"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsCreating(false)}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    style={{ color: theme.subText }}
                  >
                    <MdClose size={18} />
                  </button>
                  <button
                    onClick={handleAddLabel}
                    className="p-1 rounded hover:bg-primary/10 cursor-pointer"
                    style={{ color: theme.accent }}
                  >
                    <MdCheck size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {labels.map((label) => (
            <button
              key={label.id}
              onClick={() => navigate(`/label/${label.id}`)}
              className="w-[calc(100%-16px)] mx-2 flex items-center gap-3 pl-4 pr-3 py-1.5 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-all cursor-pointer"
              style={{ color: theme.sidebarText }}
            >
              <MdLabel style={{ color: label.colorHex }} size={18} />
              <span className="text-sm">{label.name}</span>
            </button>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default SideBar;
