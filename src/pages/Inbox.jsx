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
  const { emails, loading, fetchEmails, handleToggleStar, handleMoveToTrash, handleMarkRead, handleSnooze, handleApplyLabel, handleArchive } = useMail();

  const [selectedEmailUid, setSelectedEmailUid] = useState(null);
  const selectedEmail = emails.find((e) => e.uid === selectedEmailUid);

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
    setSelectedEmailUid(null);
  }, [location.pathname]);

  const handleSelectEmail = (email) => {
    setSelectedEmailUid(email.uid);
    if (!email.isRead) {
      handleMarkRead(email.uid);
    }
  };


  return (
    <div className="h-full flex flex-col overflow-hidden bg-transparent">
      {selectedEmail ? (
        <EmailDetails
          email={selectedEmail}
          onBack={() => setSelectedEmailUid(null)}
          onDelete={(uid) => {
            handleMoveToTrash(uid, "inbox");
            setSelectedEmailUid(null);
          }}
          onStar={(uid) => handleToggleStar(uid, "inbox")}
          onArchive={(uid) => {
            handleArchive(uid, "inbox");
            setSelectedEmailUid(null);
          }}
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
      ) : (
        <>
          {/* HEADER */}
          <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0 bg-transparent">
            <div className="flex items-center gap-3">
              <span
                className="px-4 py-1.5 text-xs font-bold rounded-full shadow-sm text-white tracking-wide flex items-center gap-1.5 uppercase select-none"
                style={{ background: `linear-gradient(135deg, ${theme.accent || "#135bec"} 0%, #3b82f6 100%)` }}
              >
                <MdInbox size={15} /> Inbox ({visibleEmails.length})
              </span>

              <button
                onClick={() => fetchEmails("inbox")}
                disabled={loading}
                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 flex items-center justify-center cursor-pointer"
                title="Refresh mail"
              >
                <MdRefresh size={18} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {/* EMAIL LIST CONTAINER */}
          <div className="flex-1 overflow-y-auto hidden-scrollbar pb-12">
            {loading && <div className="p-4 text-center text-xs opacity-60">Loading inbox...</div>}
            <EmailList
              emails={visibleEmails}
              selectedEmailId={selectedEmail?.uid}
              onSelectEmail={handleSelectEmail}
              onDelete={(uid) => handleMoveToTrash(uid, "inbox")}
              onStar={(uid) => handleToggleStar(uid, "inbox")}
              onArchive={(uid) => handleArchive(uid, "inbox")}
              onSnooze={handleSnooze}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Inbox;
