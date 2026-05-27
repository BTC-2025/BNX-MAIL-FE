import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMail } from "../context/MailContext";
import { MdReport } from "react-icons/md";
import EmailList from "../components/EmailList";
import EmailDetails from "../components/EmailDetails";
import { useTheme } from "../context/ThemeContext";

const Spam = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { emails, loading, fetchEmails, handleToggleStar, handleMoveToTrash } = useMail();
  const [selectedEmail, setSelectedEmail] = useState(null);

  useEffect(() => {
    fetchEmails('spam');
  }, [fetchEmails]);

  const handleSelectEmail = (email) => {
    setSelectedEmail(email);
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
          onDelete={(uid) => {
            handleMoveToTrash(uid, "spam");
            setSelectedEmail(null);
          }}
          onStar={(uid) => handleToggleStar(uid, "spam")}
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
              <MdReport size={20} className="text-red-500" /> Spam
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
                emails={emails}
                selectedEmailId={selectedEmail?.uid}
                onSelectEmail={handleSelectEmail}
                onDelete={(uid) => handleMoveToTrash(uid, "spam")}
                onStar={(uid) => handleToggleStar(uid, "spam")}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Spam;
