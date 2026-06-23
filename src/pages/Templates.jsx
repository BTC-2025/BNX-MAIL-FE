import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useMail } from "../context/MailContext";
import {
  MdSearch,
  MdAdd,
  MdDeleteOutline,
  MdEdit,
  MdSend,
  MdClose,
  MdAssignment,
} from "react-icons/md";
import toast from "react-hot-toast";

export const DEFAULT_TEMPLATES = [
  {
    id: "default-1",
    title: "Meeting Request",
    subject: "Meeting Request: Discussion on Project Updates",
    body: "Hi [Name],\n\nI hope you are doing well.\n\nI would like to schedule a brief meeting with you to discuss our progress on the project. Could you please let me know your availability for a 15-minute call sometime this week?\n\nLooking forward to hearing from you.\n\nBest regards,\n\n[Your Name]",
    category: "Business",
    isDefault: true,
  },
  {
    id: "default-2",
    title: "Follow-Up Discussion",
    subject: "Following up on our recent discussion",
    body: "Hi [Name],\n\nI hope this email finds you well.\n\nI wanted to follow up on our discussion last week regarding [Topic]. Please let me know if you've had a chance to review the details or if you have any questions.\n\nThanks,\n\n[Your Name]",
    category: "Business",
    isDefault: true,
  },
  {
    id: "default-3",
    title: "Out of Office",
    subject: "Out of Office: [Your Name] - [Start Date] to [End Date]",
    body: "Hello,\n\nThank you for your email. I am currently out of the office with limited access to my email. I will return on [Date].\n\nIf your request is urgent, please contact [Alternative Contact Name/Email]. Otherwise, I will reply to your message as soon as possible upon my return.\n\nBest regards,\n\n[Your Name]",
    category: "Out of Office",
    isDefault: true,
  },
  {
    id: "default-4",
    title: "Thank You Note",
    subject: "Thank you for your support",
    body: "Hi [Name],\n\nI wanted to send a quick note to say thank you for your help with [Task/Project]. I really appreciate your time and support.\n\nBest,\n\n[Your Name]",
    category: "Personal",
    isDefault: true,
  },
  {
    id: "default-5",
    title: "Request for Feedback",
    subject: "Request for Feedback: [Project/Topic]",
    body: "Hi [Name],\n\nI hope you're having a great week.\n\nCould you please share your feedback on [Project/Topic]? I would appreciate any thoughts or suggestions you might have.\n\nThank you,\n\n[Your Name]",
    category: "Business",
    isDefault: true,
  },
];

const Templates = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { openCompose } = useMail();

  const [customTemplates, setCustomTemplates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All"); // All, Default, Custom
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formSubject, setFormSubject] = useState("");
  const [formBody, setFormBody] = useState("");
  const [formCategory, setFormCategory] = useState("Business");

  // Load Custom Templates
  useEffect(() => {
    const saved = localStorage.getItem("bnx_mail_custom_templates");
    if (saved) {
      try {
        setCustomTemplates(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading templates", e);
      }
    }
  }, []);

  // Save Custom Templates helper
  const saveCustomTemplates = (templates) => {
    setCustomTemplates(templates);
    localStorage.setItem("bnx_mail_custom_templates", JSON.stringify(templates));
  };

  // Combine templates
  const allTemplates = [...DEFAULT_TEMPLATES, ...customTemplates];

  // Filters
  const filteredTemplates = allTemplates.filter((t) => {
    // Tab Filter
    if (activeTab === "Default" && !t.isDefault) return false;
    if (activeTab === "Custom" && t.isDefault) return false;

    // Search Query Filter
    const query = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(query) ||
      t.subject.toLowerCase().includes(query) ||
      t.body.toLowerCase().includes(query) ||
      t.category.toLowerCase().includes(query)
    );
  });

  // Open Create/Edit modal
  const handleOpenModal = (template = null) => {
    if (template) {
      setEditingTemplate(template);
      setFormTitle(template.title);
      setFormSubject(template.subject);
      setFormBody(template.body);
      setFormCategory(template.category || "Business");
    } else {
      setEditingTemplate(null);
      setFormTitle("");
      setFormSubject("");
      setFormBody("");
      setFormCategory("Business");
    }
    setIsModalOpen(true);
  };

  // Handle Save
  const handleSave = (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formSubject.trim() || !formBody.trim()) {
      toast.error("Please fill out all fields");
      return;
    }

    if (editingTemplate) {
      // Edit Custom Template
      const updated = customTemplates.map((t) =>
        t.id === editingTemplate.id
          ? {
              ...t,
              title: formTitle,
              subject: formSubject,
              body: formBody,
              category: formCategory,
            }
          : t
      );
      saveCustomTemplates(updated);
      toast.success("Template updated successfully");
    } else {
      // Create Custom Template
      const newTemplate = {
        id: "custom-" + Date.now(),
        title: formTitle,
        subject: formSubject,
        body: formBody,
        category: formCategory,
        isDefault: false,
      };
      saveCustomTemplates([...customTemplates, newTemplate]);
      toast.success("Template created successfully");
    }

    setIsModalOpen(false);
  };

  // Handle Delete
  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this template?")) {
      const updated = customTemplates.filter((t) => t.id !== id);
      saveCustomTemplates(updated);
      toast.success("Template deleted");
    }
  };

  // Use template
  const handleUseTemplate = (template) => {
    openCompose({
      subject: template.subject,
      body: template.body,
    });
  };

  return (
    <div
      className="h-full flex flex-col overflow-hidden bg-transparent"
    >
      {/* HEADER */}
      <div
        className="p-6 border-b shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/10 backdrop-blur-md"
        style={{ borderColor: theme.border }}
      >
        <div>
          <h1
            className="text-2xl font-bold tracking-tight flex items-center gap-2"
            style={{ color: theme.text }}
          >
            <MdAssignment className="opacity-80" /> Templates
          </h1>
          <p className="text-sm mt-1" style={{ color: theme.subText }}>
            Choose a quick mail template or build your own to speed up your messaging.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          style={{
            background: `linear-gradient(135deg, ${theme.accent || "#135bec"} 0%, #3b82f6 100%)`,
          }}
        >
          <MdAdd size={20} /> Add Template
        </button>
      </div>

      {/* FILTER & SEARCH */}
      <div
        className="p-6 pb-2 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100/10"
        style={{ borderColor: theme.border }}
      >
        {/* TABS */}
        <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-xl w-full sm:w-auto">
          {["All", "Default", "Custom"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeTab === tab
                  ? "bg-white dark:bg-gray-800 shadow-sm"
                  : "opacity-60 hover:opacity-100"
              }`}
              style={{
                color: activeTab === tab ? theme.accent : theme.text,
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* SEARCH */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-sm outline-none border focus:ring-1 transition-all duration-300"
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.border,
              color: theme.text,
            }}
          />
          <MdSearch
            className="absolute left-3 top-2.5 text-lg"
            style={{ color: theme.subText }}
          />
        </div>
      </div>

      {/* TEMPLATE GRID */}
      <div className="flex-1 p-6 overflow-y-auto hidden-scrollbar">
        {filteredTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <MdAssignment
              className="text-6xl mb-4 opacity-25"
              style={{ color: theme.text }}
            />
            <h3 className="text-lg font-semibold" style={{ color: theme.text }}>
              No templates found
            </h3>
            <p className="text-sm mt-1" style={{ color: theme.subText }}>
              {searchQuery ? "Try refining your search keyword" : "Get started by adding a custom template!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((t) => (
              <div
                key={t.id}
                onClick={() => handleUseTemplate(t)}
                className="group relative flex flex-col justify-between p-5 rounded-2xl border cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white/40 dark:bg-gray-850/40 backdrop-blur-md"
                style={{
                  backgroundColor: theme.cardBg,
                  borderColor: theme.border,
                }}
              >
                {/* Badges */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      t.isDefault
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                    }`}
                  >
                    {t.isDefault ? "Default" : "Custom"}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-md font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                  >
                    {t.category || "General"}
                  </span>
                </div>

                {/* Content */}
                <div className="mb-6">
                  <h3
                    className="text-lg font-bold truncate"
                    style={{ color: theme.text }}
                  >
                    {t.title}
                  </h3>
                  <p
                    className="text-xs font-semibold mt-1 truncate"
                    style={{ color: theme.subText }}
                  >
                    Subject: {t.subject}
                  </p>
                  <p
                    className="text-sm mt-3 line-clamp-4 leading-relaxed opacity-85"
                    style={{ color: theme.subText }}
                  >
                    {t.body}
                  </p>
                </div>

                {/* Hover Actions */}
                <div
                  className="flex items-center justify-between pt-4 border-t"
                  style={{ borderColor: theme.border }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUseTemplate(t);
                    }}
                    className="flex items-center gap-1.5 text-sm font-bold transition-colors"
                    style={{ color: theme.accent }}
                  >
                    <MdSend size={16} /> Use Template
                  </button>

                  {!t.isDefault && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal(t);
                        }}
                        className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        title="Edit Template"
                      >
                        <MdEdit size={18} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(t.id, e)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-500 hover:text-red-700"
                        title="Delete Template"
                      >
                        <MdDeleteOutline size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div
            className="relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border animate-in fade-in zoom-in duration-200"
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.border,
            }}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between p-5 border-b"
              style={{ borderColor: theme.border }}
            >
              <h2
                className="text-xl font-bold tracking-tight"
                style={{ color: theme.text }}
              >
                {editingTemplate ? "Edit Template" : "Create Custom Template"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
              >
                <MdClose size={22} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: theme.subText }}
                  >
                    Template Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Meeting Request"
                    className="px-4 py-2.5 rounded-xl border outline-none text-sm transition-all focus:ring-1"
                    style={{
                      backgroundColor: theme.bg,
                      borderColor: theme.border,
                      color: theme.text,
                    }}
                  />
                </div>

                {/* Category */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: theme.subText }}
                  >
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border outline-none text-sm transition-all focus:ring-1"
                    style={{
                      backgroundColor: theme.bg,
                      borderColor: theme.border,
                      color: theme.text,
                    }}
                  >
                    <option value="Business">Business</option>
                    <option value="Personal">Personal</option>
                    <option value="Out of Office">Out of Office</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: theme.subText }}
                >
                  Email Subject
                </label>
                <input
                  type="text"
                  required
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  placeholder="e.g. Schedule sync call"
                  className="px-4 py-2.5 rounded-xl border outline-none text-sm transition-all focus:ring-1"
                  style={{
                    backgroundColor: theme.bg,
                    borderColor: theme.border,
                    color: theme.text,
                  }}
                />
              </div>

              {/* Body */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: theme.subText }}
                >
                  Email Body
                </label>
                <textarea
                  required
                  rows={8}
                  value={formBody}
                  onChange={(e) => setFormBody(e.target.value)}
                  placeholder="Type your prefilled email body here..."
                  className="px-4 py-2.5 rounded-xl border outline-none text-sm resize-none transition-all focus:ring-1"
                  style={{
                    backgroundColor: theme.bg,
                    borderColor: theme.border,
                    color: theme.text,
                  }}
                />
              </div>

              {/* Modal Actions */}
              <div
                className="flex items-center justify-end gap-3 mt-4 pt-4 border-t"
                style={{ borderColor: theme.border }}
              >
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  style={{ color: theme.subText }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${theme.accent || "#135bec"} 0%, #3b82f6 100%)`,
                  }}
                >
                  {editingTemplate ? "Save Changes" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Templates;
