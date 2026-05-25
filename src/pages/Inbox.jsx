import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMail } from "../context/MailContext";
import { mailAPI } from "../services/api";
import EmailList from "../components/EmailList";
import EmailDetails from "../components/EmailDetails";
import { useTheme } from "../context/ThemeContext";
import { MdRefresh, MdInbox } from "react-icons/md";
import toast from "react-hot-toast";

const Inbox = ({ searchQuery }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const { emails, loading, fetchEmails, handleToggleStar, handleMoveToTrash, handleMarkRead, handleSnooze, handleApplyLabel } = useMail();

  const [selectedEmail, setSelectedEmail] = useState(null);

  useEffect(() => {
    fetchEmails('inbox');
  }, [fetchEmails]);

  const visibleEmails = emails.filter(
    (e) =>
      (e.subject?.toLowerCase().includes((searchQuery || "").toLowerCase()) ||
        e.from?.toLowerCase().includes((searchQuery || "").toLowerCase()) ||
        e.senderEmail?.toLowerCase().includes((searchQuery || "").toLowerCase()))
  );

  useEffect(() => {
    setSelectedEmail(null);
  }, [location.pathname]);

  const handleSelectEmail = (email) => {
    setSelectedEmail(email);
    if (!email.isRead) {
      handleMarkRead(email.uid);
    }
  };


  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      <div
        className={`w-full border-r ${selectedEmail ? 'hidden md:block' : 'block'} flex flex-col h-full`}
        style={{ backgroundColor: theme.bg }}
      >
        {/* HEADER */}
        <div className="p-4 sm:p-5 border-b border-gray-200/50 dark:border-gray-800/50 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className="px-4 py-1.5 text-sm font-semibold rounded-full shadow-sm text-white tracking-wide flex items-center gap-2"
                style={{ background: `linear-gradient(135deg, ${theme.accent || '#135bec'} 0%, #3b82f6 100%)` }}
              >
                <MdInbox size={16} /> Inbox ({visibleEmails.length})
              </span>

              <button
                onClick={() => fetchEmails('inbox')}
                disabled={loading}
                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 flex items-center justify-center"
                title="Refresh mail"
              >
                <MdRefresh size={20} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>
        </div>

        {/* EMAIL LIST CONTAINER */}
        <div className="flex-1 overflow-y-auto hidden-scrollbar pb-24">
          {loading && <div className="p-4 text-center text-sm opacity-60">Loading inbox...</div>}
          <EmailList
            emails={visibleEmails}
            selectedEmailId={selectedEmail?.uid}
            onSelectEmail={handleSelectEmail}
            onDelete={(uid) => handleMoveToTrash(uid, 'inbox')}
            onStar={(uid) => handleToggleStar(uid, 'inbox')}
            onSnooze={handleSnooze}
          />
        </div>
      </div>

      <div className={`flex-1 ${selectedEmail ? 'block' : 'hidden md:block'}`}>
        <EmailDetails
          email={selectedEmail}
          onBack={() => setSelectedEmail(null)}
          onDelete={(uid) => {
            handleMoveToTrash(uid, 'inbox');
            setSelectedEmail(null);
          }}
          onStar={(uid) => handleToggleStar(uid, 'inbox')}
          onSnooze={handleSnooze}
          onApplyLabel={handleApplyLabel}
          onReply={(email) =>
            navigate("/compose", {
              state: {
                replyTo: email.from,
                subject: `Re: ${email.subject}`,
                originalBody: email.body,
              },
            })
          }
        />
      </div>
    </div>
  );
};

export default Inbox;
