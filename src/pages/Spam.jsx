import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMail } from "../context/MailContext";
import { MdReport } from "react-icons/md";
import EmailList from "../components/EmailList";
import EmailDetails from "../components/EmailDetails";
import { useTheme } from "../context/ThemeContext";

import BulkActionsToolbar from "../components/BulkActionsToolbar";
import ReadingPaneLayout from "../components/ReadingPaneLayout";

const Spam = ({ searchQuery }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { emails, loading, fetchEmails, handleToggleStar, handleMoveToTrash, handleArchive, openCompose } = useMail();
  const [selectedEmailUid, setSelectedEmailUid] = useState(null);
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
    setSelectedIds(new Set());
  }, [emails]);

  useEffect(() => {
    fetchEmails('spam');
  }, [fetchEmails]);

  const visibleEmails = emails.filter(
    (e) =>
      !searchQuery ||
      e.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.from?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.senderEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.to?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.recipientEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.body?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.textPlain?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectEmail = (email) => {
    setSelectedEmailUid(email.uid);
  };

  const handleReply = (email) => {
    openCompose({
      replyTo: email.senderEmail || email.from,
      subject: `Re: ${email.subject || ""}`,
      originalBody: email.body,
    });
  };

  /* ---------------- MAIN UI ---------------- */
  
  const detailsComponent = selectedEmail ? (
<EmailDetails
          email={selectedEmail}
          onBack={() => setSelectedEmailUid(null)}
          onDelete={(uid) => {
            handleMoveToTrash(uid, "spam");
            setSelectedEmailUid(null);
          }}
          onStar={(uid) => handleToggleStar(uid, "spam")}
          onArchive={(uid) => {
            handleArchive(uid, "spam");
            setSelectedEmailUid(null);
          }}
          onReply={handleReply}
        />
  ) : null;

  const headerComponent = selectedIds.size > 0 ? (

            <BulkActionsToolbar
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              visibleEmails={visibleEmails}
              folder="spam"
            />
          
  ) : (

            <div
              className="p-4 sm:p-5 border-b flex items-center justify-between shrink-0 bg-transparent"
              style={{ borderColor: theme.border }}
            >
              <h2
                className="text-base font-bold flex items-center gap-2"
                style={{ color: theme.text }}
              >
                <MdReport size={20} className="text-red-500" /> Spam
                <span
                  className="ml-2 text-xs font-normal"
                  style={{ color: theme.subText }}
                >
                  ({emails.length})
                </span>
              </h2>
            </div>
          
  );

  const listComponent = (
    <div className="flex-1 overflow-y-auto hidden-scrollbar pb-12">
{emails.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
                <MdReport size={52} className="text-gray-300 dark:text-gray-600 mb-4 opacity-50" />
                <p
                  className="text-base font-semibold mb-1"
                  style={{ color: theme.text }}
                >
                  No spam emails
                </p>
                <p className="text-sm" style={{ color: theme.subText }}>
                  Spam emails will automatically appear here
                </p>
              </div>
            ) : (
              <EmailList
                emails={visibleEmails}
                selectedEmailId={selectedEmail?.uid}
                onSelectEmail={handleSelectEmail}
                onDelete={(uid) => handleMoveToTrash(uid, "spam")}
                onStar={(uid) => handleToggleStar(uid, "spam")}
                onArchive={(uid) => handleArchive(uid, "spam")}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
              />
            )}
    </div>
  );

  return (
    <ReadingPaneLayout
      mode={theme.readingPaneMode || 'no_split'}
      hasSelection={!!selectedEmail}
      listComponent={listComponent}
      detailsComponent={detailsComponent}
      headerComponent={headerComponent}
    />
  );

};

export default Spam;
