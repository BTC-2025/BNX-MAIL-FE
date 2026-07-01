import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMail } from "../context/MailContext";
import { MdStar, MdStarBorder } from "react-icons/md";
import EmailList from "../components/EmailList";
import EmailDetails from "../components/EmailDetails";
import { useTheme } from "../context/ThemeContext";

import BulkActionsToolbar from "../components/BulkActionsToolbar";

const Starred = ({ searchQuery }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { emails, loading, fetchEmails, handleToggleStar, handleMoveToTrash, handleApplyLabel, handleArchive, handleUnarchive, openCompose } = useMail();
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
    fetchEmails('starred');
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

  const handleUnstar = async (uid) => {
    await handleToggleStar(uid, 'starred');
  };

  const handleReply = (email) => {
    openCompose({
      replyTo: email.senderEmail || email.from,
      subject: `Re: ${email.subject || ""}`,
      originalBody: email.body,
    });
  };

  /* ---------------- MAIN UI ---------------- */
  return (
    <div className="h-full flex flex-col overflow-hidden bg-transparent">
      {selectedEmail ? (
        <EmailDetails
          email={selectedEmail}
          onBack={() => setSelectedEmailUid(null)}
          onClose={() => setSelectedEmailUid(null)}
          onDelete={(uid) => {
            handleMoveToTrash(uid, "starred");
            setSelectedEmailUid(null);
          }}
          onStar={handleUnstar}
          onArchive={(uid) => {
            handleArchive(uid, "starred");
            setSelectedEmailUid(null);
          }}
          onUnarchive={(uid) => {
            handleUnarchive(uid);
            setSelectedEmailUid(null);
          }}
          onReply={handleReply}
          onApplyLabel={handleApplyLabel}
        />
      ) : (
        <>
          {/* HEADER */}
          {selectedIds.size > 0 ? (
            <BulkActionsToolbar
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              visibleEmails={visibleEmails}
              folder="starred"
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
                <MdStar className="text-yellow-400" size={20} /> Starred
                <span
                  className="ml-2 text-xs font-normal"
                  style={{ color: theme.subText }}
                >
                  ({emails.length})
                </span>
              </h2>
            </div>
          )}

          {/* EMAIL LIST CONTAINER */}
          <div className="flex-1 overflow-y-auto hidden-scrollbar pb-12">
            {emails.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
                <MdStar className="text-5xl mb-4 text-yellow-400 opacity-50" />
                <p
                  className="text-base font-semibold mb-1"
                  style={{ color: theme.text }}
                >
                  No starred emails
                </p>
                <p className="text-sm" style={{ color: theme.subText }}>
                  Star important emails to find them quickly
                </p>
              </div>
            ) : (
              <EmailList
                emails={visibleEmails}
                selectedEmailId={selectedEmail?.uid}
                onSelectEmail={handleSelectEmail}
                onStar={handleUnstar}
                onArchive={(uid) => handleArchive(uid, "starred")}
                onUnarchive={handleUnarchive}
                onDelete={(uid) => handleMoveToTrash(uid, "starred")}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Starred;
