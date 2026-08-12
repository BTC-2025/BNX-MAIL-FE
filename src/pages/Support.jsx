import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { 
  MdHelpOutline, 
  MdAssignment, 
  MdArrowDropDown, 
  MdSend, 
  MdEmail, 
  MdLanguage,
  MdForum,
  MdSearch,
  MdReceipt,
  MdContactSupport
} from "react-icons/md";
import toast from "react-hot-toast";

const Support = () => {
  const { theme } = useTheme();

  // Navigation Tab State ("faq", "ticket", "logs")
  const [activeTab, setActiveTab] = useState("faq");

  // FAQ Search Query State
  const [faqSearch, setFaqSearch] = useState("");

  // Ticket Form State
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketPriority, setTicketPriority] = useState("Medium - Performance/Glitch");
  const [ticketDescription, setTicketDescription] = useState("");
  const [tickets, setTickets] = useState([]);

  // FAQ Accordion State (default index 2 is expanded)
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(2);

  const faqs = [
    {
      q: "How do I reset my password?",
      a: "To reset your password, click on the 'Forgot Password' link on the login page and follow the OTP verification instructions sent to your recovery email."
    },
    {
      q: "Is my data secure?",
      a: "Yes, BNX Mail uses end-to-end encryption for transmissions and securely encrypts data stored on our servers using industry standards."
    },
    {
      q: "Can I use the app offline?",
      a: "Currently, the application requires an active internet connection to sync data in real-time. An offline mode is planned for future updates."
    }
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
      faq.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const handleLodgeTicket = (e) => {
    e.preventDefault();
    if (!ticketSubject.trim()) {
      toast.error("Subject is required");
      return;
    }
    if (!ticketDescription.trim()) {
      toast.error("Description is required");
      return;
    }

    const newTicket = {
      id: "ticket_" + Date.now(),
      subject: ticketSubject.trim(),
      priority: ticketPriority,
      description: ticketDescription.trim(),
      date: new Date().toLocaleDateString()
    };

    setTickets(prev => [newTicket, ...prev]);
    setTicketSubject("");
    setTicketDescription("");
    toast.success("Support ticket logged successfully!");
    // Auto-navigate to logs tab to view the submission
    setActiveTab("logs");
  };

  const getPriorityColor = (priority) => {
    if (priority.includes("Low")) return { text: "text-blue-500", bg: "bg-blue-500/10", border: "border-l-blue-500" };
    if (priority.includes("High")) return { text: "text-rose-500", bg: "bg-rose-500/10", border: "border-l-rose-500" };
    return { text: "text-amber-500", bg: "bg-amber-500/10", border: "border-l-amber-500" };
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto bg-transparent font-sans hidden-scrollbar">
      
      {/* Premium Hero Search Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-10 flex flex-col items-center justify-center text-center relative overflow-hidden shrink-0">
        {/* Abstract background shapes */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/5 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md mb-3 border border-white/10">
          Support Hub
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          How can we help you today?
        </h1>
        <p className="text-xs sm:text-sm text-blue-100 mt-2 max-w-md">
          Search our knowledge base or lodge a ticket directly to our engineers.
        </p>

        {/* FAQ Search Bar */}
        <div className="mt-6 w-full max-w-md relative">
          <MdSearch size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search FAQs, guides, and articles..."
            value={faqSearch}
            onChange={(e) => {
              setFaqSearch(e.target.value);
              if (activeTab !== "faq") setActiveTab("faq"); // Switch to FAQ tab if searching
            }}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border-none outline-none text-sm text-gray-800 dark:text-gray-100 bg-white/95 dark:bg-gray-900/95 shadow-lg focus:ring-4 focus:ring-white/15 transition-all duration-300"
          />
        </div>
      </div>

      {/* Tabbed Navigation Bar */}
      <div 
        className="px-6 py-3 border-b flex justify-center bg-white/50 dark:bg-gray-950/20 backdrop-blur-md shrink-0 sticky top-0 z-10"
        style={{ borderColor: theme.border }}
      >
        <div className="flex items-center gap-2 bg-gray-100/80 dark:bg-gray-900/50 p-1.5 rounded-2xl border border-gray-250/20 max-w-md w-full justify-between">
          <button
            onClick={() => setActiveTab("faq")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "faq"
                ? "bg-white dark:bg-gray-800 shadow-sm text-blue-600 dark:text-blue-400 border border-gray-200/50 dark:border-gray-700/50"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <MdHelpOutline size={16} />
            <span>FAQs & Guides</span>
          </button>
          
          <button
            onClick={() => setActiveTab("ticket")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "ticket"
                ? "bg-white dark:bg-gray-800 shadow-sm text-blue-600 dark:text-blue-400 border border-gray-200/50 dark:border-gray-700/50"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <MdForum size={16} />
            <span>Lodge Ticket</span>
          </button>

          <button
            onClick={() => setActiveTab("logs")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "logs"
                ? "bg-white dark:bg-gray-800 shadow-sm text-blue-600 dark:text-blue-400 border border-gray-200/50 dark:border-gray-700/50"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <MdReceipt size={16} />
            <span>My Support Log ({tickets.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 max-w-4xl w-full mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        {/* FAQ TAB */}
        {activeTab === "faq" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* FAQ Accordion list (7 cols) */}
            <div 
              className="md:col-span-7 bg-white/70 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-md rounded-2xl p-6 shadow-sm flex flex-col gap-4 text-left"
            >
              <div className="flex items-center gap-3 pb-2 border-b border-gray-100 dark:border-gray-800/50">
                <h3 className="text-sm font-bold" style={{ color: theme.text }}>Frequently Asked Questions</h3>
              </div>

              {filteredFaqs.length === 0 ? (
                <div className="py-12 text-center opacity-60">
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">No results match your search query</p>
                  <p className="text-xs text-gray-400 mt-1">Try other general keywords like password, secure, or offline.</p>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800/60">
                  {filteredFaqs.map((faq, idx) => {
                    const isExpanded = expandedFaqIndex === idx;
                    return (
                      <div key={idx} className="py-3.5 first:pt-0 last:pb-0">
                        <button
                          type="button"
                          onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                          className="w-full flex items-center justify-between gap-4 text-left font-bold text-xs sm:text-sm text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer border-none bg-transparent p-0 outline-none"
                        >
                          <span>{faq.q}</span>
                          <MdArrowDropDown 
                            size={20} 
                            className="text-gray-400 transition-transform duration-300 shrink-0" 
                            style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
                          />
                        </button>
                        
                        <div 
                          className="transition-all duration-300 overflow-hidden"
                          style={{ 
                            maxHeight: isExpanded ? "120px" : "0px",
                            opacity: isExpanded ? 1 : 0,
                            marginTop: isExpanded ? "8px" : "0px"
                          }}
                        >
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Direct Coordinates Card (5 cols) */}
            <div className="md:col-span-5 bg-gradient-to-br from-[#0c5934] to-[#083b22] dark:from-[#083a22] dark:to-[#041c10] text-white p-6 rounded-2xl shadow-md flex flex-col gap-4">
              <div className="flex items-center gap-3.5 pb-2 border-b border-emerald-800/40">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
                  <MdContactSupport size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Direct Channels</h3>
                  <p className="text-[10px] text-emerald-200 opacity-80 mt-0.5">Contact coordinates.</p>
                </div>
              </div>
              <p className="text-xs text-emerald-100/90 leading-relaxed text-left font-medium">
                Need instant answers or have specialized billing queries? Get in touch directly via our channels below:
              </p>
              
              <div className="flex flex-col gap-3 mt-1 w-full">
                {/* Email Support Card */}
                <div className="bg-white/10 hover:bg-white/15 dark:bg-black/20 dark:hover:bg-black/30 p-4 rounded-xl border border-white/10 hover:border-white/20 flex items-center gap-3.5 transition-all duration-300 group cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform duration-200">
                    <MdEmail size={15} />
                  </div>
                  <div className="flex flex-col text-left min-w-0">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-300">Email Support</span>
                    <span className="text-xs font-bold truncate text-white select-all">support@beta-softnet.com</span>
                  </div>
                </div>

                {/* Official Portal Card */}
                <div className="bg-white/10 hover:bg-white/15 dark:bg-black/20 dark:hover:bg-black/30 p-4 rounded-xl border border-white/10 hover:border-white/20 flex items-center gap-3.5 transition-all duration-300 group cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform duration-200">
                    <MdLanguage size={15} />
                  </div>
                  <div className="flex flex-col text-left min-w-0">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-300">Official Portal</span>
                    <span className="text-xs font-bold truncate text-white select-all">beta-softnet.com</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* LODGE TICKET TAB */}
        {activeTab === "ticket" && (
          <form 
            onSubmit={handleLodgeTicket}
            className="bg-white/80 dark:bg-gray-900/85 border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-lg rounded-2xl p-6 shadow-sm flex flex-col gap-5 text-left w-full max-w-xl mx-auto"
          >
            <div className="flex items-center gap-3.5 pb-2 border-b border-gray-100 dark:border-gray-800/50">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <MdForum size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold" style={{ color: theme.text }}>Open a Support Ticket</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Let us know how we can assist you.</p>
              </div>
            </div>

            {/* Subject */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Issue Subject
              </label>
              <input
                type="text"
                required
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="e.g. Invoicing tax breakdown looks wrong"
                className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm transition-all focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 bg-white/40 dark:bg-black/10"
                style={{
                  borderColor: theme.border,
                  color: theme.text,
                }}
              />
            </div>

            {/* Priority */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Severity Priority
              </label>
              <div className="relative">
                <select
                  value={ticketPriority}
                  onChange={(e) => setTicketPriority(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm transition-all focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 appearance-none cursor-pointer bg-white/40 dark:bg-black/10"
                  style={{
                    borderColor: theme.border,
                    color: theme.text,
                  }}
                >
                  <option value="Low - General Query" style={{ backgroundColor: theme.bg }}>Low - General Query</option>
                  <option value="Medium - Performance/Glitch" style={{ backgroundColor: theme.bg }}>Medium - Performance/Glitch</option>
                  <option value="High - Critical Failure" style={{ backgroundColor: theme.bg }}>High - Critical Failure</option>
                </select>
                <MdArrowDropDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-500" />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Detailed Explanation
              </label>
              <textarea
                required
                rows={4}
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                placeholder="Please describe exactly what you were doing, what went wrong, and how our support specialists can assist you."
                className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm resize-none transition-all focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 bg-white/40 dark:bg-black/10 leading-relaxed"
                style={{
                  borderColor: theme.border,
                  color: theme.text,
                }}
              />
            </div>

            <button
              type="submit"
              className="w-full mt-1.5 py-3 rounded-xl text-sm font-semibold text-white cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md border-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <MdSend size={16} className="transform rotate-[-15deg]" /> 
              <span>Lodge Support Ticket</span>
            </button>
          </form>
        )}

        {/* TICKET LOGS TAB */}
        {activeTab === "logs" && (
          <div 
            className="bg-white/80 dark:bg-gray-900/85 border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-lg rounded-2xl p-6 shadow-sm flex flex-col gap-5 text-left w-full max-w-xl mx-auto"
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800/50">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <MdAssignment size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold" style={{ color: theme.text }}>My Support Log</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">Your submitted support requests history.</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                {tickets.length} logged
              </span>
            </div>

            {tickets.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center opacity-60">
                <MdForum className="text-4xl text-gray-300 dark:text-gray-700 mb-2" />
                <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                  No filed tickets detected in your system history.
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[420px] overflow-y-auto hidden-scrollbar pr-1">
                {tickets.map((t) => {
                  const design = getPriorityColor(t.priority);
                  return (
                    <div 
                      key={t.id} 
                      className={`p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white/40 dark:bg-black/10 flex flex-col gap-2 border-l-4 ${design.border} hover:shadow-sm transition-all duration-200`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <span className="font-bold text-xs text-gray-800 dark:text-gray-200 truncate">{t.subject}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-extrabold tracking-wider uppercase shrink-0 ${design.bg} ${design.text}`}>
                          {t.priority.split(' ')[0]}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{t.description}</p>
                      <div className="flex justify-between items-center mt-1 pt-2 border-t border-gray-100/50 dark:border-gray-800/30">
                        <span className="text-[9px] text-gray-400 font-medium">{t.id}</span>
                        <span className="text-[9px] text-gray-400 font-semibold">{t.date}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Support;
