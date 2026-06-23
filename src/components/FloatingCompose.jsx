import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { 
  MdSend, 
  MdAttachFile, 
  MdDeleteOutline, 
  MdClose, 
  MdAssignment, 
  MdRemove, 
  MdOpenInFull, 
  MdCloseFullscreen 
} from "react-icons/md";
import { mailAPI } from "../services/api";
import { useTheme } from "../context/ThemeContext";
import { useMail } from "../context/MailContext";
import { DEFAULT_TEMPLATES } from "../pages/Templates";

const FloatingCompose = () => {
  const { theme } = useTheme();
  const { 
    isComposeOpen, 
    closeCompose, 
    isComposeMinimized, 
    setIsComposeMinimized, 
    isComposeMaximized, 
    setIsComposeMaximized, 
    composeData,
    fetchEmails
  } = useMail();

  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);

  const [showTemplates, setShowTemplates] = useState(false);
  const [allTemplates, setAllTemplates] = useState([]);

  const [formData, setFormData] = useState({
    to: "",
    cc: "",
    bcc: "",
    subject: "",
    body: "",
  });

  const [size, setSize] = useState({ width: 540, height: 500 });
  const [position, setPosition] = useState({ x: window.innerWidth - 570, y: window.innerHeight - 520 });

  // Reset/sync positioning and size on state toggle
  useEffect(() => {
    if (!isComposeOpen) return;

    if (isComposeMaximized) {
      const w = Math.min(1000, window.innerWidth * 0.85);
      const h = Math.min(700, window.innerHeight * 0.85);
      setSize({ width: w, height: h });
      setPosition({ x: (window.innerWidth - w) / 2, y: (window.innerHeight - h) / 2 });
    } else if (isComposeMinimized) {
      setSize({ width: 500, height: 45 });
      setPosition({ x: window.innerWidth - 530, y: window.innerHeight - 45 });
    } else {
      setSize({ width: 540, height: 500 });
      setPosition({ x: window.innerWidth - 570, y: window.innerHeight - 520 });
    }
  }, [isComposeMaximized, isComposeMinimized, isComposeOpen]);

  // Load Custom + Default templates for inline insertion
  useEffect(() => {
    if (!isComposeOpen) return;
    const saved = localStorage.getItem("bnx_mail_custom_templates");
    let custom = [];
    if (saved) {
      try {
        custom = JSON.parse(saved);
      } catch (e) {}
    }
    setAllTemplates([...DEFAULT_TEMPLATES, ...custom]);
  }, [showTemplates, isComposeOpen]);

  /* ---------------- PREFILL ON COMPOSE DATA CHANGE ---------------- */
  useEffect(() => {
    if (isComposeOpen) {
      if (composeData) {
        if (composeData.replyTo) {
          setFormData({
            to: composeData.replyTo,
            cc: "",
            bcc: "",
            subject: composeData.subject || "",
            body: composeData.originalBody
              ? `\n\n--- Original Message ---\n${composeData.originalBody}`
              : "",
          });
        } else if (composeData.draft) {
          const d = composeData.draft;
          setFormData({
            to: d.to || "",
            cc: d.cc || "",
            bcc: d.bcc || "",
            subject: d.subject || "",
            body: d.body || "",
          });
          if (d.cc) setShowCc(true);
          if (d.bcc) setShowBcc(true);
        } else {
          setFormData({
            to: composeData.to || "",
            cc: composeData.cc || "",
            bcc: composeData.bcc || "",
            subject: composeData.subject || "",
            body: composeData.body || "",
          });
          if (composeData.cc) setShowCc(true);
          if (composeData.bcc) setShowBcc(true);
        }
      } else {
        setFormData({
          to: "",
          cc: "",
          bcc: "",
          subject: "",
          body: "",
        });
        setShowCc(false);
        setShowBcc(false);
      }
      setError("");
      setSuccess("");
    }
  }, [composeData, isComposeOpen]);

  if (!isComposeOpen) return null;

  const handleApplyTemplate = (template) => {
    const confirmApply =
      !formData.subject.trim() && !formData.body.trim()
        ? true
        : window.confirm("Apply template? This will replace your current subject and body.");

    if (confirmApply) {
      setFormData((prev) => ({
        ...prev,
        subject: template.subject,
        body: template.body,
      }));
      setShowTemplates(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  /* ---------------- SEND EMAIL ---------------- */
  const handleSend = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.to) {
      setError("Recipient email is required");
      return;
    }

    if (!formData.subject) {
      setError("Subject is required");
      return;
    }

    try {
      setSending(true);

      const payload = {
        to: formData.to,
        subject: formData.subject,
        body: formData.body,
      };

      if (formData.cc) payload.cc = formData.cc;
      if (formData.bcc) payload.bcc = formData.bcc;

      const response = await mailAPI.send(payload);

      if (response.data?.success) {
        setSuccess("Email sent successfully");
        fetchEmails('inbox');
        setTimeout(() => {
          closeCompose();
        }, 1000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send email");
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    const hasContent = formData.to.trim() || formData.subject.trim() || formData.body.trim() || formData.cc.trim() || formData.bcc.trim();
    if (hasContent) {
      const payload = {
        to: formData.to,
        subject: formData.subject || "(No Subject)",
        body: formData.body,
      };
      if (formData.cc) payload.cc = formData.cc;
      if (formData.bcc) payload.bcc = formData.bcc;

      // Save draft in the background silently
      mailAPI.saveDraft(payload)
        .then(() => fetchEmails('draft'))
        .catch((err) => {
          console.error("Failed to auto-save draft in the background:", err);
        });
    }
    closeCompose();
  };

  const handleDiscard = () => {
    if (window.confirm("Discard this email?")) {
      closeCompose();
    }
  };

  return (
    <Rnd
      size={{ 
        width: size.width, 
        height: isComposeMinimized ? 45 : size.height 
      }}
      position={position}
      onDragStop={(e, d) => {
        setPosition({ x: d.x, y: d.y });
      }}
      onResizeStop={(e, direction, ref, delta, pos) => {
        setSize({
          width: parseInt(ref.style.width, 10),
          height: parseInt(ref.style.height, 10)
        });
        setPosition(pos);
      }}
      minWidth={350}
      minHeight={isComposeMinimized ? 45 : 300}
      maxWidth={window.innerWidth}
      maxHeight={window.innerHeight}
      enableResizing={!isComposeMinimized}
      disableDragging={isComposeMaximized}
      dragHandleClassName="compose-drag-handle"
      bounds="window"
      style={{
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        borderRadius: "12px 12px 0 0",
        boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
        border: `1px solid ${theme.border}`,
        backgroundColor: theme.cardBg,
        overflow: "hidden"
      }}
    >
      {/* HEADER / DRAG HANDLE */}
      <div
        className="compose-drag-handle flex items-center justify-between px-4 py-2 cursor-move shrink-0 border-b select-none"
        style={{ 
          backgroundColor: theme.accent || "#135bec",
          color: "#ffffff",
          borderColor: theme.border
        }}
      >
        <span className="text-sm font-semibold truncate">
          {composeData?.draft ? "Edit Draft" : "New Message"}
        </span>

        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setIsComposeMinimized(!isComposeMinimized)}
            className="p-1 rounded hover:bg-white/10 transition-colors text-white flex items-center justify-center cursor-pointer"
            title="Minimize"
          >
            <MdRemove size={16} />
          </button>
          <button
            onClick={() => setIsComposeMaximized(!isComposeMaximized)}
            className="p-1 rounded hover:bg-white/10 transition-colors text-white flex items-center justify-center cursor-pointer"
            title={isComposeMaximized ? "Restore Window" : "Maximize"}
          >
            {isComposeMaximized ? <MdCloseFullscreen size={14} /> : <MdOpenInFull size={14} />}
          </button>
          <button
            onClick={handleClose}
            className="p-1 rounded hover:bg-white/10 transition-colors text-white flex items-center justify-center cursor-pointer"
            title="Save & Close"
          >
            <MdClose size={16} />
          </button>
        </div>
      </div>

      {/* BODY CONTENT (HIDDEN WHEN MINIMIZED) */}
      {!isComposeMinimized && (
        <form onSubmit={handleSend} className="flex-1 flex flex-col p-4 overflow-hidden min-h-0 bg-transparent">
          {/* ALERTS */}
          {error && (
            <div className="mb-3 p-2 rounded bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30 text-xs font-medium shrink-0">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-3 p-2 rounded bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900/30 text-xs font-medium shrink-0">
              {success}
            </div>
          )}

          {/* FIELDS */}
          <div className="flex-1 flex flex-col gap-0.5 overflow-y-auto hidden-scrollbar min-h-0 pr-1">
            {/* TO */}
            <div className="flex items-center gap-2 border-b py-1.5 shrink-0" style={{ borderColor: theme.border }}>
              <span className="text-xs font-semibold w-10 text-gray-500">To:</span>
              <input
                name="to"
                value={formData.to}
                onChange={handleChange}
                className="flex-1 bg-transparent text-sm outline-none border-none"
                style={{ color: theme.text }}
                placeholder="recipients@example.com"
                spellCheck="false"
              />
              <div className="flex gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowCc((v) => !v)}
                  className="font-medium hover:underline text-gray-500"
                >
                  Cc
                </button>
                <button
                  type="button"
                  onClick={() => setShowBcc((v) => !v)}
                  className="font-medium hover:underline text-gray-500"
                >
                  Bcc
                </button>
              </div>
            </div>

            {/* CC */}
            {showCc && (
              <div className="flex items-center gap-2 border-b py-1.5 shrink-0 animate-fade-in" style={{ borderColor: theme.border }}>
                <span className="text-xs font-semibold w-10 text-gray-500">Cc:</span>
                <input
                  name="cc"
                  value={formData.cc}
                  onChange={handleChange}
                  className="flex-1 bg-transparent text-sm outline-none border-none"
                  style={{ color: theme.text }}
                  placeholder="carboncopy@example.com"
                  spellCheck="false"
                />
              </div>
            )}

            {/* BCC */}
            {showBcc && (
              <div className="flex items-center gap-2 border-b py-1.5 shrink-0 animate-fade-in" style={{ borderColor: theme.border }}>
                <span className="text-xs font-semibold w-10 text-gray-500">Bcc:</span>
                <input
                  name="bcc"
                  value={formData.bcc}
                  onChange={handleChange}
                  className="flex-1 bg-transparent text-sm outline-none border-none"
                  style={{ color: theme.text }}
                  placeholder="blindcopy@example.com"
                  spellCheck="false"
                />
              </div>
            )}

            {/* SUBJECT */}
            <div className="flex items-center gap-2 border-b py-1.5 shrink-0" style={{ borderColor: theme.border }}>
              <span className="text-xs font-semibold w-10 text-gray-500">Subject:</span>
              <input
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="flex-1 bg-transparent text-sm outline-none border-none"
                style={{ color: theme.text }}
                placeholder="Enter subject..."
                spellCheck="false"
              />
            </div>

            {/* BODY */}
            <textarea
              name="body"
              value={formData.body}
              onChange={handleChange}
              placeholder="Type your message here..."
              className="w-full flex-1 resize-none outline-none py-2 text-sm bg-transparent border-none mt-2 placeholder:text-gray-400 min-h-[120px]"
              style={{ color: theme.text }}
            />
          </div>

          {/* ACTIONS FOOTER */}
          <div className="flex items-center justify-between border-t pt-3 mt-2 shrink-0" style={{ borderColor: theme.border }}>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={sending}
                className="flex items-center gap-1.5 px-5 py-2 rounded-full text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-60 cursor-pointer"
                style={{ background: `linear-gradient(135deg, ${theme.accent || '#135bec'} 0%, #3b82f6 100%)` }}
              >
                {sending ? "Sending…" : "Send"}
                {!sending && <MdSend size={14} />}
              </button>

              <button
                type="button"
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                title="Attach file"
              >
                <MdAttachFile size={18} className="transform rotate-45" />
              </button>

              {/* Inline Templates quick selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-xs font-semibold"
                  title="Insert Template"
                >
                  <MdAssignment size={16} />
                  <span>Templates</span>
                </button>

                {showTemplates && (
                  <div
                    className="absolute bottom-10 left-0 w-56 max-h-48 overflow-y-auto rounded-xl border shadow-xl z-50 p-1.5 glass"
                    style={{
                      backgroundColor: theme.cardBg,
                      borderColor: theme.border,
                      color: theme.text,
                    }}
                  >
                    <div className="flex items-center justify-between p-1.5 mb-1 border-b" style={{ borderColor: theme.border }}>
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Templates</span>
                      <button
                        type="button"
                        onClick={() => setShowTemplates(false)}
                        className="text-xs p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 text-gray-500"
                      >
                        <MdClose size={12} />
                      </button>
                    </div>
                    {allTemplates.length === 0 ? (
                      <p className="text-[10px] text-center p-2 opacity-60">No templates found</p>
                    ) : (
                      <div className="flex flex-col gap-0.5">
                        {allTemplates.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => handleApplyTemplate(t)}
                            className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors truncate text-gray-800 dark:text-gray-200 cursor-pointer"
                          >
                            <div className="font-semibold truncate">{t.title}</div>
                            <div className="text-[10px] opacity-60 truncate">{t.subject}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleDiscard}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs font-semibold transition-colors"
            >
              <MdDeleteOutline size={18} />
              <span>Discard</span>
            </button>
          </div>
        </form>
      )}
    </Rnd>
  );
};

export default FloatingCompose;
