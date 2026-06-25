import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMail } from "../context/MailContext";
import { MdAccessTime } from "react-icons/md";
import EmailList from "../components/EmailList";
import EmailDetails from "../components/EmailDetails";
import { useTheme } from "../context/ThemeContext";

const Snoozed = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { 
    emails, 
    loading, 
    fetchEmails, 
    handleToggleStar, 
    handleMoveToTrash, 
    handleApplyLabel, 
    handleArchive, 
    handleUnarchive, 
    handleSnooze,
    openCompose 
  } = useMail();
  const [selectedEmailUid, setSelectedEmailUid] = useState(null);
  const selectedEmail = emails.find((e) => String(e.uid) === String(selectedEmailUid));

  useEffect(() => {
    fetchEmails('snoozed');
  }, [fetchEmails]);

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
  return (
    <div className="h-full flex flex-col overflow-hidden bg-transparent">
      {selectedEmail ? (
        <EmailDetails
          email={selectedEmail}
          onBack={() => setSelectedEmailUid(null)}
          onClose={() => setSelectedEmailUid(null)}
          onDelete={(uid) => {
            handleMoveToTrash(uid, "snoozed");
            setSelectedEmailUid(null);
          }}
          onStar={(uid) => handleToggleStar(uid, "snoozed")}
          onArchive={(uid) => {
            handleArchive(uid, "snoozed");
            setSelectedEmailUid(null);
          }}
          onUnarchive={(uid) => {
            handleUnarchive(uid);
            setSelectedEmailUid(null);
          }}
          onReply={handleReply}
          onApplyLabel={handleApplyLabel}
          onSnooze={handleSnooze}
        />
      ) : (
        <>
          {/* HEADER */}
          <div
            className="p-4 sm:p-5 border-b flex items-center justify-between shrink-0 bg-transparent"
            style={{ borderColor: theme.border }}
          >
            <h2
              className="text-base font-bold flex items-center gap-2"
              style={{ color: theme.text }}
            >
              <MdAccessTime className="text-blue-500" size={20} /> Snoozed
              <span
                className="ml-2 text-xs font-normal"
                style={{ color: theme.subText }}
              >
                ({emails.length})
              </span>
            </h2>
          </div>

          {/* EMAIL LIST CONTAINER */}
          <div className="flex-1 overflow-y-auto hidden-scrollbar pb-12">
            {emails.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
                <MdAccessTime className="text-5xl mb-4 text-blue-500 opacity-50" />
                <p
                  className="text-base font-semibold mb-1"
                  style={{ color: theme.text }}
                >
                  No snoozed emails
                </p>
                <p className="text-sm" style={{ color: theme.subText }}>
                  Snooze emails to hide them from your inbox until a later time
                </p>
              </div>
            ) : (
              <EmailList
                emails={emails}
                selectedEmailId={selectedEmail?.uid}
                onSelectEmail={handleSelectEmail}
                onStar={(uid) => handleToggleStar(uid, "snoozed")}
                onArchive={(uid) => handleArchive(uid, "snoozed")}
                onUnarchive={handleUnarchive}
                onDelete={(uid) => handleMoveToTrash(uid, "snoozed")}
                onSnooze={handleSnooze}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Snoozed;
