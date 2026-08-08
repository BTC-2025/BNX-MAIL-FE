import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { MdHelpOutline, MdAttachFile } from "react-icons/md";
import toast from "react-hot-toast";

const Support = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [issueType, setIssueType] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || user.fullName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File is too large. Size limit is 5MB.");
        return;
      }
      setAttachment(file);
    }
  };

  const handleCancel = () => {
    navigate("/inbox");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!issueType) {
      toast.error("Please select an issue type");
      return;
    }
    if (!subject.trim()) {
      toast.error("Subject is required");
      return;
    }
    if (!description.trim()) {
      toast.error("Please describe your issue");
      return;
    }

    setSubmitting(true);
    
    // Simulate submission delay
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Support request submitted successfully!");
      navigate("/inbox");
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-transparent font-sans">
      {/* HEADER */}
      <div
        className="p-6 border-b shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/10 backdrop-blur-md animate-in fade-in duration-200"
        style={{ borderColor: theme.border }}
      >
        <div>
          <h1
            className="text-2xl font-bold tracking-tight flex items-center gap-2"
            style={{ color: theme.text }}
          >
            <MdHelpOutline className="opacity-80" /> Help & Support
          </h1>
          <p className="text-sm mt-1" style={{ color: theme.subText }}>
            We're here to help you with BNX Mail.
          </p>
        </div>
      </div>

      {/* FORM CONTENT */}
      <div className="flex-1 p-6 overflow-y-auto hidden-scrollbar flex justify-center items-start">
        <form 
          onSubmit={handleSubmit}
          className="w-full max-w-xl p-6 rounded-2xl border shadow-xl flex flex-col gap-4 bg-white/40 dark:bg-gray-850/40 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-300 animate-out duration-150"
          style={{
            backgroundColor: theme.cardBg,
            borderColor: theme.border,
          }}
        >
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.subText }}>
              Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="px-4 py-2.5 rounded-xl border outline-none text-sm transition-all focus:ring-1"
              style={{
                backgroundColor: theme.bg,
                borderColor: theme.border,
                color: theme.text,
              }}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.subText }}>
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="px-4 py-2.5 rounded-xl border outline-none text-sm transition-all focus:ring-1"
              style={{
                backgroundColor: theme.bg,
                borderColor: theme.border,
                color: theme.text,
              }}
            />
          </div>

          {/* Issue Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.subText }}>
              Issue Type
            </label>
            <select
              value={issueType}
              required
              onChange={(e) => setIssueType(e.target.value)}
              className="px-4 py-2.5 rounded-xl border outline-none text-sm transition-all focus:ring-1 cursor-pointer"
              style={{
                backgroundColor: theme.bg,
                borderColor: theme.border,
                color: theme.text,
              }}
            >
              <option value="">Select an issue type</option>
              <option value="Account Issue">Account & Security Issue</option>
              <option value="Email Delivery">Email Sending & Delivery</option>
              <option value="Spam & Junk">Spam & Junk Mail Filters</option>
              <option value="Layout & Themes">Layout, Appearance & Themes</option>
              <option value="Technical Bug">Technical Bug & Performance</option>
              <option value="Billing & Subscriptions">Billing & Subscriptions</option>
              <option value="Other">Other / General Feedback</option>
            </select>
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.subText }}>
              Subject
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter your subject"
              className="px-4 py-2.5 rounded-xl border outline-none text-sm transition-all focus:ring-1"
              style={{
                backgroundColor: theme.bg,
                borderColor: theme.border,
                color: theme.text,
              }}
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.subText }}>
              Describe your issue
            </label>
            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us what you need help with..."
              className="px-4 py-2.5 rounded-xl border outline-none text-sm resize-none transition-all focus:ring-1"
              style={{
                backgroundColor: theme.bg,
                borderColor: theme.border,
                color: theme.text,
              }}
            />
          </div>

          {/* Attachment */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.subText }}>
              Attachment
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                id="support-file-input"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => document.getElementById("support-file-input").click()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
                style={{
                  borderColor: theme.border,
                  color: theme.text
                }}
              >
                <MdAttachFile className="transform rotate-45" /> Attach File
              </button>
              {attachment && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs bg-black/5 dark:bg-white/5" style={{ borderColor: theme.border, color: theme.text }}>
                  <span className="truncate max-w-[150px] font-semibold">{attachment.name}</span>
                  <button
                    type="button"
                    onClick={() => setAttachment(null)}
                    className="hover:text-red-500 font-bold text-xs"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div
            className="flex items-center justify-end gap-3 mt-4 pt-4 border-t"
            style={{ borderColor: theme.border }}
          >
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              style={{ color: theme.subText }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${theme.accent || "#135bec"} 0%, #3b82f6 100%)`,
              }}
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Support;
