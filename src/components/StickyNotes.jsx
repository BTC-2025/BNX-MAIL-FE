import React, { useState, useEffect, useRef } from "react";
import { 
  MdClose, MdMinimize, MdOutlinePushPin, MdDeleteOutline, 
  MdPalette, MdPlaylistAddCheck, MdAdd, MdOutlineNoteAlt, MdOutlineFolderOpen
} from "react-icons/md";
import { useTheme } from "../context/ThemeContext";

// Color options mapping
export const NOTE_COLORS = [
  { id: "yellow", hex: "#FEF3C7", border: "#FDE68A", darkHex: "#D97706", text: "#78350F" },
  { id: "blue", hex: "#E0F2FE", border: "#BAE6FD", darkHex: "#2563EB", text: "#0C4A6E" },
  { id: "green", hex: "#D1FAE5", border: "#A7F3D0", darkHex: "#059669", text: "#064E3B" },
  { id: "pink", hex: "#FFE4E6", border: "#FECDD3", darkHex: "#E11D48", text: "#4C0519" },
  { id: "purple", hex: "#F3E8FF", border: "#E9D5FF", darkHex: "#9333EA", text: "#4C1D95" },
  { id: "orange", hex: "#FFEDD5", border: "#FED7AA", darkHex: "#EA580C", text: "#7C2D12" }
];

const CATEGORIES = ["Personal", "Work", "Ideas", "Tasks"];

/* ---------------- STICKY NOTE PANEL (FLOATING) ---------------- */
export const StickyNote = ({ 
  note, 
  index,
  onUpdate, 
  onDelete, 
  onClose 
}) => {
  const [position, setPosition] = useState({ x: 120 + index * 40, y: 160 + index * 40 });
  const [isMinimized, setIsMinimized] = useState(note.isMinimized || false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showCategorySelect, setShowCategorySelect] = useState(false);
  
  const noteRef = useRef(null);

  // Position drag handling
  const handleMouseDown = (e) => {
    // Ignore drag if clicking input, buttons or selectors inside header
    if (
      e.target.tagName === "INPUT" || 
      e.target.tagName === "BUTTON" || 
      e.target.closest("button") || 
      e.target.closest("input")
    ) {
      return;
    }

    if (e.target.closest(".note-header-drag")) {
      e.preventDefault();
      const startX = e.clientX - position.x;
      const startY = e.clientY - position.y;

      const handleMouseMove = (moveEvent) => {
        setPosition({
          x: moveEvent.clientX - startX,
          y: moveEvent.clientY - startY
        });
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
  };

  const selectedColor = NOTE_COLORS.find(c => c.id === note.color) || NOTE_COLORS[0];

  const handleTextChange = (content) => {
    onUpdate(note.id, { content });
  };

  const handleTitleChange = (title) => {
    onUpdate(note.id, { title });
  };

  const handleColorChange = (colorId) => {
    onUpdate(note.id, { color: colorId });
    setShowColorPicker(false);
  };

  const handleCategoryChange = (category) => {
    onUpdate(note.id, { category });
    setShowCategorySelect(false);
  };

  // Checklist item helper updates
  const handleChecklistChange = (index, updates) => {
    try {
      const items = JSON.parse(note.content || "[]");
      items[index] = { ...items[index], ...updates };
      onUpdate(note.id, { content: JSON.stringify(items) });
    } catch (e) {
      console.error("Failed to update checklist item", e);
    }
  };

  const handleAddChecklistItem = () => {
    try {
      const items = JSON.parse(note.content || "[]");
      items.push({ text: "", done: false });
      onUpdate(note.id, { content: JSON.stringify(items) });
    } catch (e) {
      console.error("Failed to add checklist item", e);
    }
  };

  const handleRemoveChecklistItem = (index) => {
    try {
      const items = JSON.parse(note.content || "[]");
      items.splice(index, 1);
      onUpdate(note.id, { content: JSON.stringify(items) });
    } catch (e) {
      console.error("Failed to remove checklist item", e);
    }
  };

  const toggleChecklistMode = () => {
    const isCurrentlyChecklist = note.type === "checklist";
    if (isCurrentlyChecklist) {
      // Convert checklist array to plaintext
      try {
        const items = JSON.parse(note.content || "[]");
        const plainText = items.map(i => (i.done ? "✓ " : "") + i.text).join("\n");
        onUpdate(note.id, { type: "text", content: plainText });
      } catch (e) {
        onUpdate(note.id, { type: "text", content: "" });
      }
    } else {
      // Convert plaintext lines to checklist array
      const lines = (note.content || "").split("\n");
      const items = lines.map(line => {
        const clean = line.replace(/^[✓\s*-\[\]xX]+/, "").trim();
        return { text: clean, done: line.startsWith("✓") };
      }).filter(i => i.text.length > 0);
      
      if (items.length === 0) items.push({ text: "", done: false });
      onUpdate(note.id, { type: "checklist", content: JSON.stringify(items) });
    }
  };

  const parsedChecklist = () => {
    try {
      return JSON.parse(note.content || "[]");
    } catch (e) {
      return [];
    }
  };

  const toggleMinimize = () => {
    const nextMinimized = !isMinimized;
    setIsMinimized(nextMinimized);
    onUpdate(note.id, { isMinimized: nextMinimized });
  };

  return (
    <div
      ref={noteRef}
      onMouseDown={handleMouseDown}
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "280px",
        zIndex: 1000,
        backgroundColor: selectedColor.hex,
        borderColor: selectedColor.border,
        color: selectedColor.text
      }}
      className="rounded-2xl border shadow-xl flex flex-col overflow-hidden select-none transition-shadow hover:shadow-2xl max-h-[350px]"
    >
      {/* HEADER */}
      <div 
        className="note-header-drag px-3 py-2 flex items-center justify-between cursor-move border-b border-black/5"
        style={{ borderColor: `${selectedColor.border}80` }}
      >
        <div className="flex items-center gap-1.5 flex-1 min-w-0 pr-2">
          <MdOutlineNoteAlt size={16} className="shrink-0 opacity-75" />
          <input
            type="text"
            value={note.title || ""}
            onChange={(e) => handleTitleChange(e.target.value)}
            onFocus={(e) => {
              if (e.target.value === "New Note") {
                e.target.select();
              }
            }}
            placeholder="New Note"
            className="w-full bg-transparent font-bold text-xs outline-none border-b border-transparent focus:border-black/10 placeholder:text-black/40 truncate"
            style={{ color: selectedColor.text }}
          />
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button 
            onClick={toggleMinimize}
            className="p-1 rounded hover:bg-black/5 transition-colors cursor-pointer text-current"
            title={isMinimized ? "Expand" : "Minimize"}
          >
            <MdMinimize size={14} className={isMinimized ? "rotate-185 translate-y-[1px]" : "-translate-y-[2px]"} />
          </button>
          <button 
            onClick={() => onClose(note.id)}
            className="p-1 rounded hover:bg-black/5 transition-colors cursor-pointer text-current"
            title="Close"
          >
            <MdClose size={14} />
          </button>
        </div>
      </div>

      {/* CONTENT (Hidden when minimized) */}
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-3 min-h-[160px] max-h-[220px]">
            {note.type === "checklist" ? (
              <div className="flex flex-col gap-2">
                {parsedChecklist().map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 group/item">
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={(e) => handleChecklistChange(idx, { done: e.target.checked })}
                      className="rounded border-gray-400 text-slate-800 focus:ring-slate-500 cursor-pointer w-3.5 h-3.5"
                    />
                    <input
                      type="text"
                      value={item.text}
                      onChange={(e) => handleChecklistChange(idx, { text: e.target.value })}
                      placeholder="To-do item"
                      className={`flex-1 bg-transparent text-xs outline-none border-b border-transparent focus:border-black/10 ${item.done ? "line-through opacity-50" : ""}`}
                      style={{ color: selectedColor.text }}
                    />
                    <button
                      onClick={() => handleRemoveChecklistItem(idx)}
                      className="opacity-0 group-hover/item:opacity-100 hover:text-red-600 transition-opacity p-0.5"
                    >
                      <MdClose size={14} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleAddChecklistItem}
                  className="flex items-center gap-1 text-[11px] font-semibold mt-1 opacity-70 hover:opacity-100 cursor-pointer"
                >
                  <MdAdd size={14} /> Add checklist item
                </button>
              </div>
            ) : (
              <textarea
                value={note.content || ""}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Type note content here..."
                className="w-full h-full bg-transparent resize-none border-none outline-none text-xs placeholder:text-black/35 min-h-[140px]"
                style={{ color: selectedColor.text }}
              />
            )}
          </div>

          {/* FOOTER BAR */}
          <div 
            className="px-3 py-2 flex items-center justify-between border-t border-black/5 text-[10px]"
            style={{ borderColor: `${selectedColor.border}80` }}
          >
            {/* Category Breadcrumb */}
            <div className="relative">
              <button
                onClick={() => setShowCategorySelect(!showCategorySelect)}
                className="flex items-center gap-1 opacity-70 hover:opacity-100 font-semibold cursor-pointer"
              >
                <MdOutlineFolderOpen size={12} />
                <span>{note.category || "Personal"}</span>
              </button>
              {showCategorySelect && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowCategorySelect(false)} />
                  <div className="absolute bottom-full left-0 mb-1 w-28 bg-white dark:bg-gray-800 rounded-lg shadow-lg border z-50 py-1 border-gray-150 text-[11px]">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className="w-full text-left px-2.5 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer text-gray-700 dark:text-gray-200"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center gap-1.5 relative">
              {/* Checklist Toggle */}
              <button
                onClick={toggleChecklistMode}
                className={`p-1 rounded hover:bg-black/5 cursor-pointer text-current ${note.type === "checklist" ? "bg-black/5" : ""}`}
                title="Toggle checklist"
              >
                <MdPlaylistAddCheck size={14} />
              </button>

              {/* Color Palette Toggle */}
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-1 rounded hover:bg-black/5 cursor-pointer text-current"
                title="Change Color"
              >
                <MdPalette size={14} />
              </button>
              {showColorPicker && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowColorPicker(false)} />
                  <div className="absolute bottom-full right-0 mb-1 flex gap-1 p-1.5 bg-white rounded-lg shadow-lg border border-gray-150 z-50">
                    {NOTE_COLORS.map(color => (
                      <button
                        key={color.id}
                        onClick={() => handleColorChange(color.id)}
                        className="w-4 h-4 rounded-full border border-black/10 cursor-pointer shadow-sm transform hover:scale-110 transition-transform shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Trash/Delete */}
              <button
                onClick={() => onDelete(note.id)}
                className="p-1 rounded hover:bg-red-500/10 hover:text-red-600 cursor-pointer"
                title="Delete note"
              >
                <MdDeleteOutline size={14} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};


/* ---------------- NOTES LIST MANAGER (SIDEBAR-POPUP) ---------------- */
export const NotesManager = ({ 
  notes, 
  openNoteIds,
  onOpenNote, 
  onCreateNote, 
  onDeleteNote,
  onClose 
}) => {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 w-full rounded-l-2xl border-l dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700 shrink-0">
        <div className="flex items-center gap-2 font-bold text-sm" style={{ color: theme.text }}>
          <MdOutlineNoteAlt size={18} style={{ color: theme.accent }} />
          <span>My Sticky Notes</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={onCreateNote}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 transition cursor-pointer"
            title="Create sticky note"
          >
            <MdAdd size={18} />
          </button>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition cursor-pointer">
            <MdClose size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 hidden-scrollbar">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
            <MdOutlineNoteAlt size={48} className="text-gray-300 dark:text-gray-600 mb-3 opacity-60" />
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">No sticky notes yet</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">Click the + button to create a new floating sticky note.</p>
          </div>
        ) : (
          notes.map(note => {
            const colorOption = NOTE_COLORS.find(c => c.id === note.color) || NOTE_COLORS[0];
            const isOpen = openNoteIds.includes(note.id);
            let displayTitle = note.title;
            if (!displayTitle?.trim()) {
              if (note.type === "checklist") {
                try {
                  const items = JSON.parse(note.content || "[]");
                  const firstItem = items.find(i => i.text.trim());
                  displayTitle = firstItem ? `Checklist: ${firstItem.text}` : "New Checklist";
                } catch(e) { displayTitle = "New Checklist"; }
              } else {
                const firstLine = (note.content || "").split("\n")[0]?.trim();
                displayTitle = firstLine ? firstLine.substring(0, 20) : "New Note";
              }
            }
            
            // Generate clean snippet preview
            let previewText = "";
            if (note.type === "checklist") {
              try {
                const items = JSON.parse(note.content || "[]");
                previewText = items.map(i => (i.done ? "✓ " : "☐ ") + i.text).join(", ");
              } catch(e) { previewText = ""; }
            } else {
              previewText = note.content || "";
            }
            
            return (
              <div 
                key={note.id}
                onClick={() => onOpenNote(note.id)}
                className="group p-3.5 rounded-xl border flex flex-col gap-1.5 transition-all hover:shadow-md cursor-pointer relative overflow-hidden"
                style={{ 
                  backgroundColor: `${colorOption.hex}40`, 
                  borderColor: colorOption.border, 
                }}
              >
                {/* Left accent strip */}
                <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: colorOption.hex }} />
                
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-xs truncate" style={{ color: theme.text }}>
                    {displayTitle}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNote(note.id);
                      }}
                      className="p-1 rounded hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete note"
                    >
                      <MdDeleteOutline size={14} />
                    </button>
                  </div>
                </div>

                <p className="text-[11px] line-clamp-2 leading-relaxed" style={{ color: theme.subText }}>
                  {previewText || <span className="italic opacity-50">Empty note</span>}
                </p>

                <div className="flex items-center justify-between text-[9px] mt-1 opacity-70">
                  <span className="font-medium bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded" style={{ color: theme.text }}>
                    {note.category || "Personal"}
                  </span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {isOpen ? "Active" : "Closed"}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
