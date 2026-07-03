import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMail } from "../context/MailContext";
import { mailAPI } from "../services/api";
import EmailList from "../components/EmailList";
import EmailDetails from "../components/EmailDetails";
import { useTheme } from "../context/ThemeContext";
import { MdRefresh, MdInbox, MdLocalOffer, MdPeople, MdInfo } from "react-icons/md";
import toast from "react-hot-toast";
import BulkActionsToolbar from "../components/BulkActionsToolbar";
import ReadingPaneLayout from "../components/ReadingPaneLayout";

const Inbox = ({ searchQuery }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, readingPaneMode } = useTheme();
  const { emails, loading, fetchEmails, handleToggleStar, handleMoveToTrash, handleMarkRead, handleSnooze, handleApplyLabel, handleArchive, openCompose } = useMail();

  const [selectedEmailUid, setSelectedEmailUid] = useState(null);
  const [activeTab, setActiveTab] = useState('PRIMARY');
  const selectedEmail = emails.find((e) => String(e.uid) === String(selectedEmailUid));

  const [selectedIds, setSelectedIds] = useState(new Set());
  const handleToggleSelect = (uid) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(uid)) next.delete(uid);
      else next.add(uid);
      return next;
    });
  };

  useEffect(() => {
    fetchEmails('inbox');
  }, [fetchEmails]);

  const visibleEmails = emails.filter(
    (e) =>
      ((e.category || 'PRIMARY').toUpperCase() === activeTab) &&
      (!searchQuery ||
        e.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.from?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.senderEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.to?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.recipientEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.body?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.textPlain?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  useEffect(() => {
    setSelectedEmailUid(null);
    setSelectedIds(new Set());
  }, [location.pathname, activeTab]);

  const handleSelectEmail = (email) => {
    setSelectedEmailUid(email.uid);
    if (!email.isRead) {
      handleMarkRead(email.uid);
    }
  };


  const listComponent = (
    <div className="flex-1 overflow-y-auto hidden-scrollbar pb-12">
      {loading && <div className="p-4 text-center text-xs opacity-60">Loading inbox...</div>}
      <EmailList
        emails={visibleEmails}
        selectedEmailId={selectedEmailUid}
        onSelectEmail={handleSelectEmail}
        onDelete={(uid) => handleMoveToTrash(uid, "inbox")}
        onStar={(uid) => handleToggleStar(uid, "inbox")}
        onArchive={(uid) => handleArchive(uid, "inbox")}
        onSnooze={handleSnooze}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
      />
    </div>
  );

  const headerComponent = selectedIds.size > 0 ? (
    <BulkActionsToolbar
      selectedIds={selectedIds}
      setSelectedIds={setSelectedIds}
      visibleEmails={visibleEmails}
      folder="inbox"
    />
  ) : (
    <div className="flex flex-col border-b border-gray-100 dark:border-gray-800 bg-transparent shrink-0">
      <div className="p-4 sm:p-5 flex items-center justify-between border-b border-gray-100/50 dark:border-gray-800/50">
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

      {/* TABS */}
      <div className="flex px-4 pt-1 gap-2 sm:gap-6 text-sm font-medium overflow-x-auto hidden-scrollbar">
        <button
          onClick={() => setActiveTab('PRIMARY')}
          className={`py-3 px-2 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeTab === 'PRIMARY' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          style={activeTab === 'PRIMARY' ? { borderColor: theme.accent, color: theme.accent } : {}}
        >
          <MdInbox size={18} />
          Primary
        </button>
        <button
          onClick={() => setActiveTab('PROMOTIONS')}
          className={`py-3 px-2 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeTab === 'PROMOTIONS' ? 'border-green-500 text-green-500' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          <MdLocalOffer size={18} />
          Promotions
        </button>
        <button
          onClick={() => setActiveTab('SOCIAL')}
          className={`py-3 px-2 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeTab === 'SOCIAL' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          <MdPeople size={18} />
          Social
        </button>
        <button
          onClick={() => setActiveTab('UPDATES')}
          className={`py-3 px-2 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeTab === 'UPDATES' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          <MdInfo size={18} />
          Updates
        </button>
      </div>
    </div>
  );

  const detailsComponent = selectedEmail ? (
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
        openCompose({
          replyTo: email.from,
          subject: `Re: ${email.subject}`,
          originalBody: email.body,
        })
      }
    />
  ) : null;

  return (
    <ReadingPaneLayout
      mode={readingPaneMode || 'no_split'}
      hasSelection={!!selectedEmail}
      listComponent={listComponent}
      detailsComponent={detailsComponent}
      headerComponent={headerComponent}
    />
  );
};

export default Inbox;
