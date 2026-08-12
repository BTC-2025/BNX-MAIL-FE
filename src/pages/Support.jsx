import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { 
  MdHelpOutline, 
  MdAssignment, 
  MdArrowDropDown, 
  MdArrowDropUp, 
  MdSend, 
  MdEmail, 
  MdLanguage,
  MdForum
} from "react-icons/md";
import toast from "react-hot-toast";

const Support = () => {
  const { theme } = useTheme();
  
  // Ticket Form State
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketPriority, setTicketPriority] = useState("Medium - Performance/Glitch");
  const [ticketDescription, setTicketDescription] = useState("");
  const [tickets, setTickets] = useState([]);

  // FAQ Accordion State (Index 4 "Can I use the app offline?" is expanded by default)
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(4);

  const faqs = [
    {
      q: "How do I reset my password?",
      a: "To reset your password, click on the 'Forgot Password' link on the login page and follow the OTP verification instructions sent to your recovery email."
    },
    {
      q: "Can I export my financial data?",
      a: "Currently, financial data export is not directly supported in BNX Mail. You can view all billing receipts under Settings → Billing."
    },
    {
      q: "How do I add a new team member?",
      a: "For business accounts, you can add new members by going to Settings → Organization and clicking the 'Add Member' button."
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
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto bg-transparent font-sans">
      {/* HEADER */}
      <div 
        className="p-6 border-b shrink-0 flex flex-col items-start gap-1 bg-white/10 backdrop-blur-md"
        style={{ borderColor: theme.border }}
      >
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Faq</span>
        <div className="mt-1">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white">
            Help Center
          </span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight mt-2" style={{ color: theme.text }}>
          Help & Customer Support
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          Access common guides or log direct tickets to our dedicated customer support squad.
        </p>
      </div>

      {/* Main Responsive Grid Layout */}
      <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Left Column: Form & Logs */}
        <div className="flex flex-col gap-6">
          {/* Open a Support Ticket Card */}
          <form 
            onSubmit={handleLodgeTicket}
            className="bg-white/70 dark:bg-gray-900/70 border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-md rounded-2xl p-6 shadow-sm flex flex-col gap-4 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <MdForum size={20} />
              </div>
              <h3 className="text-base font-bold" style={{ color: theme.text }}>Open a Support Ticket</h3>
            </div>

            {/* Subject */}
            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Issue Subject
              </label>
              <input
                type="text"
                required
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="e.g. Invoicing tax breakdown looks wrong"
                className="px-4 py-2.5 rounded-xl border outline-none text-sm transition-all focus:ring-1 bg-transparent"
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
                  className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm transition-all appearance-none cursor-pointer bg-transparent"
                  style={{
                    borderColor: theme.border,
                    color: theme.text,
                  }}
                >
                  <option value="Low - General Query" style={{ backgroundColor: theme.bg }}>Low - General Query</option>
                  <option value="Medium - Performance/Glitch" style={{ backgroundColor: theme.bg }}>Medium - Performance/Glitch</option>
                  <option value="High - Critical Failure" style={{ backgroundColor: theme.bg }}>High - Critical Failure</option>
                </select>
                <MdArrowDropDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
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
                className="px-4 py-2.5 rounded-xl border outline-none text-sm resize-none transition-all focus:ring-1 bg-transparent"
                style={{
                  borderColor: theme.border,
                  color: theme.text,
                }}
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-xl text-sm font-semibold text-white cursor-pointer hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm border-0"
              style={{ background: theme.accent || "#135bec" }}
            >
              <MdSend className="transform rotate-[-20deg]" /> Lodge Support Ticket
            </button>
          </form>

          {/* My Support Log Card */}
          <div 
            className="bg-white/70 dark:bg-gray-900/70 border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-md rounded-2xl p-6 shadow-sm flex flex-col gap-4 text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <MdAssignment size={20} />
                </div>
                <h3 className="text-base font-bold" style={{ color: theme.text }}>My Support Log</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-gray-800 text-gray-505 text-gray-500 dark:text-gray-400">
                {tickets.length} logged
              </span>
            </div>

            {tickets.length === 0 ? (
              <div className="py-8 flex flex-col items-center justify-center text-center">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  No filed tickets detected in your system history.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-48 overflow-y-auto hidden-scrollbar">
                {tickets.map((t) => (
                  <div 
                    key={t.id} 
                    className="p-3.5 rounded-xl border border-gray-100 dark:border-gray-800/50 bg-white/40 dark:bg-black/10 flex flex-col gap-1"
                  >
                    <div className="flex justify-between items-center gap-4">
                      <span className="font-semibold text-xs text-gray-800 dark:text-gray-200 truncate">{t.subject}</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-600 shrink-0">
                        {t.priority.split(' ')[0]}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed truncate">{t.description}</p>
                    <span className="text-[9px] text-gray-400 self-end">{t.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: FAQs & Direct Support coordinates */}
        <div className="flex flex-col gap-6">
          {/* FAQs Accordion Card */}
          <div 
            className="bg-white/70 dark:bg-gray-900/70 border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-md rounded-2xl p-6 shadow-sm flex flex-col gap-4 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <MdHelpOutline size={20} />
              </div>
              <h3 className="text-base font-bold" style={{ color: theme.text }}>Frequently Asked Questions</h3>
            </div>

            <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800/50">
              {faqs.map((faq, idx) => {
                const isExpanded = expandedFaqIndex === idx;
                return (
                  <div key={idx} className="py-3.5 first:pt-0 last:pb-0">
                    <button
                      type="button"
                      onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                      className="w-full flex items-center justify-between gap-4 text-left font-semibold text-xs sm:text-sm text-gray-800 dark:text-gray-200 hover:opacity-80 transition-opacity cursor-pointer border-none bg-transparent p-0"
                    >
                      <span>{faq.q}</span>
                      {isExpanded ? <MdArrowDropUp size={20} className="text-gray-400" /> : <MdArrowDropDown size={20} className="text-gray-400" />}
                    </button>
                    
                    <div 
                      className={`transition-all duration-300 overflow-hidden ${
                        isExpanded ? "max-h-24 opacity-100 mt-2" : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Direct Support Coordinates Card */}
          <div className="bg-[#0c5934] text-white p-6 rounded-2xl shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
                <MdEmail size={20} />
              </div>
              <h3 className="text-base font-bold text-white">Direct Support Coordinates</h3>
            </div>
            <p className="text-xs text-emerald-100 leading-relaxed text-left">
              Need instant answers or have specialized billing queries? Get in touch directly via our channels below:
            </p>
            
            <div className="flex flex-col gap-3 mt-1">
              {/* Email Support Card */}
              <div className="bg-white/10 p-4 rounded-xl border border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
                  <MdEmail size={16} />
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-200">Email Support</span>
                  <span className="text-xs font-bold truncate text-white">support@beta-softnet.com</span>
                </div>
              </div>

              {/* Official Portal Card */}
              <div className="bg-white/10 p-4 rounded-xl border border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
                  <MdLanguage size={16} />
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-200">Official Portal</span>
                  <span className="text-xs font-bold truncate text-white">beta-softnet.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Support;
