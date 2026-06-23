import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMail } from "../context/MailContext";
import { MdSend } from "react-icons/md";
import EmailList from "../components/EmailList";
import EmailDetails from "../components/EmailDetails";
import { useTheme } from "../context/ThemeContext";

const Send = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { emails, loading, fetchEmails, handleToggleStar, handleMoveToTrash, handleArchive, handleSnooze, handleApplyLabel } = useMail();
  const [selectedEmailUid, setSelectedEmailUid] = useState(null);
  const selectedEmail = emails.find((e) => String(e.uid) === String(selectedEmailUid));

  useEffect(() => {
    fetchEmails('sent');
  }, [fetchEmails]);

  const handleSelectEmail = (email) => {
    setSelectedEmailUid(email.uid);
  };

  const handleDelete = (uid) => {
    handleMoveToTrash(uid, 'sent');
    setSelectedEmailUid(null);
  };

  const handleReply = (email) => {
    navigate("/compose", {
      state: {
        replyTo: email.to || email.senderEmail || email.from, // For sent mail, reply to the recipient
        subject: `Re: ${email.subject || ""}`,
        originalBody: email.body,
      },
    });
  };

  /* ---------------- LOADING ---------------- */
  if (loading && emails.length === 0) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ backgroundColor: theme.bg }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-10 w-10 border-b-2 mx-auto mb-4"
            style={{ borderColor: theme.accent }}
          />
          <p style={{ color: theme.subText }}>Loading sent mail…</p>
        </div>
      </div>
    );
  }

  /* ---------------- MAIN UI ---------------- */
  return (
    <div className="h-full flex flex-col overflow-hidden bg-transparent">
      {selectedEmail ? (
        <EmailDetails
          email={selectedEmail}
          onBack={() => setSelectedEmailUid(null)}
          onDelete={handleDelete}
          onStar={(uid) => handleToggleStar(uid, "sent")}
          onArchive={(uid) => {
            handleArchive(uid, "sent");
            setSelectedEmailUid(null);
          }}
          onSnooze={handleSnooze}
          onApplyLabel={handleApplyLabel}
          onReply={handleReply}
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
              Sent
              <span
                className="ml-2 text-xs font-normal"
                style={{ color: theme.subText }}
              >
                ({emails.length})
              </span>
            </h2>
          </div>

          {/* LIST / EMPTY */}
          <div className="flex-1 overflow-y-auto hidden-scrollbar pb-12">
            {emails.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <MdSend className="text-5xl mb-4 text-gray-300 dark:text-gray-600 opacity-55" />
                <p className="text-base font-semibold" style={{ color: theme.text }}>No sent emails</p>
              </div>
            ) : (
              <EmailList
                emails={emails}
                selectedEmailId={selectedEmail?.uid}
                onSelectEmail={handleSelectEmail}
                onStar={(uid) => handleToggleStar(uid, "sent")}
                onDelete={(uid) => handleMoveToTrash(uid, "sent")}
                onArchive={(uid) => handleArchive(uid, "sent")}
                onSnooze={handleSnooze}
                showTo={true}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Send;
