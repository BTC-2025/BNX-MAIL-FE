import React, { useState } from "react";
import EmailList from "../components/EmailList";
import EmailDetails from "../components/EmailDetails";
import { useTheme } from "../context/ThemeContext";

const Starred = ({ emails = [], onDelete, onStar, onArchive }) => {
  const { theme } = useTheme();

  const starredEmails = emails.filter((e) => e.starred);
  const [selectedEmail, setSelectedEmail] = useState(null);

  const handleSelectEmail = (email) => {
    setSelectedEmail(email);
  };

  /* ---------------- MAIN UI ---------------- */
  return (
    <div className="flex h-full relative overflow-hidden">
      {/* LEFT — LIST */}
      <div
        className={`transition-all duration-300 w-full bg-transparent`}
        style={{
          backgroundColor: theme.bg,
        }}
      >
        {/* HEADER */}
        <div
          className="p-4 border-b flex items-center justify-between"
          style={{ borderColor: theme.border }}
        >
          <h2
            className="text-xl font-semibold flex items-center gap-2"
            style={{ color: theme.text }}
          >
            <span className="text-yellow-400">⭐</span> Starred
            <span
              className="ml-2 text-sm font-normal"
              style={{ color: theme.subText }}
            >
              ({starredEmails.length})
            </span>
          </h2>
        </div>

        {/* EMPTY STATE */}
        {starredEmails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <span className="text-6xl mb-4 text-yellow-400">⭐</span>
            <p
              className="text-lg font-medium mb-1"
              style={{ color: theme.text }}
            >
              No starred emails
            </p>
            <p style={{ color: theme.subText }}>
              Star important emails to find them quickly
            </p>
          </div>
        ) : (
          <EmailList
            emails={starredEmails}
            selectedEmail={selectedEmail}
            onSelectEmail={handleSelectEmail}
            onStar={onStar}
          />
        )}
      </div>

      {/* RIGHT — DETAILS */}
      <EmailDetails
        email={selectedEmail}
        onBack={() => setSelectedEmail(null)}
        onClose={() => setSelectedEmail(null)}
        onDelete={(uid) => {
          if (onDelete) onDelete(uid);
          setSelectedEmail(null);
        }}
        onStar={onStar}
        onArchive={(uid) => {
          if (onArchive) onArchive(uid);
          setSelectedEmail(null);
        }}
      />
    </div>
  );
};

export default Starred;
