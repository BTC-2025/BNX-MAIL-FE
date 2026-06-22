import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMail } from "../context/MailContext";
import { MdStar, MdStarBorder } from "react-icons/md";
import EmailList from "../components/EmailList";
import EmailDetails from "../components/EmailDetails";
import { useTheme } from "../context/ThemeContext";

const Starred = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { emails, loading, fetchEmails, handleToggleStar, handleMoveToTrash, handleApplyLabel, handleArchive } = useMail();
  const [selectedEmail, setSelectedEmail] = useState(null);

  useEffect(() => {
    fetchEmails('starred');
  }, [fetchEmails]);

  const handleSelectEmail = (email) => {
    setSelectedEmail(email);
  };

  const handleUnstar = async (uid) => {
    await handleToggleStar(uid, 'starred');
  };

  const handleReply = (email) => {
    navigate("/compose", {
      state: {
        replyTo: email.senderEmail || email.from,
        subject: `Re: ${email.subject || ""}`,
        originalBody: email.body,
      },
    });
  };

  /* ---------------- MAIN UI ---------------- */
  return (
    <div className="h-full flex flex-col overflow-hidden bg-transparent">
      {selectedEmail ? (
        <EmailDetails
          email={selectedEmail}
          onBack={() => setSelectedEmail(null)}
          onClose={() => setSelectedEmail(null)}
          onDelete={(uid) => {
            handleMoveToTrash(uid, "starred");
            setSelectedEmail(null);
          }}
          onStar={handleUnstar}
          onArchive={(uid) => {
            handleArchive(uid, "starred");
            setSelectedEmail(null);
          }}
          onReply={handleReply}
          onApplyLabel={handleApplyLabel}
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
              <MdStar className="text-yellow-400" size={20} /> Starred
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
                emails={emails}
                selectedEmailId={selectedEmail?.uid}
                onSelectEmail={handleSelectEmail}
                onStar={handleUnstar}
                onArchive={(uid) => handleArchive(uid, "starred")}
                onDelete={(uid) => handleMoveToTrash(uid, "starred")}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Starred;
