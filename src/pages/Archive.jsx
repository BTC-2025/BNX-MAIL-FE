import React, { useEffect, useState } from "react";
import { useMail } from "../context/MailContext";
import EmailList from "../components/EmailList";
import EmailDetails from "../components/EmailDetails";
import { useTheme } from "../context/ThemeContext";

const Archive = ({ searchQuery }) => {
  const { theme } = useTheme();
  const { emails, loading, fetchEmails, handleToggleStar, handleMoveToTrash, handleUnarchive } = useMail();

  const [selectedEmailUid, setSelectedEmailUid] = useState(null);
  const selectedEmail = emails.find((e) => String(e.uid) === String(selectedEmailUid));

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

  // UI-only filter states
  const [showTime, setShowTime] = useState(false);
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);

  useEffect(() => {
    fetchEmails('archive');
  }, [fetchEmails]);

  const handleSelectEmail = (email) => {
    setSelectedEmailUid(email.uid);
  };

  /* ---------------- LOADING ---------------- */
  if (loading && emails.length === 0) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ background: theme.bg }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-10 w-10 border-b-2 mx-auto mb-4"
            style={{ borderColor: theme.accent }}
          />
          <p style={{ color: theme.subText }}>Loading archive…</p>
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
          onClose={() => setSelectedEmailUid(null)}
          onDelete={(uid) => {
            handleMoveToTrash(uid, "archive");
            setSelectedEmailUid(null);
          }}
          onStar={(uid) => handleToggleStar(uid, "archive")}
          onArchive={(uid) => {
            handleUnarchive(uid);
            setSelectedEmailUid(null);
          }}
          isArchiveFolder={true}
        />
      ) : (
        <>
          {/* HEADER */}
          <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 flex flex-wrap items-center gap-3 shrink-0 bg-transparent">
            <span
              className="px-4 py-1.5 text-xs font-bold rounded-full shadow-sm text-white tracking-wide flex items-center gap-1.5 uppercase select-none"
              style={{ background: theme.accent }}
            >
              📦 Archive ({emails.length})
            </span>

            {/* UI-only filters */}
            <FilterButton label="From" open={showFrom} setOpen={setShowFrom} />
            <FilterButton label="To" open={showTo} setOpen={setShowTo} />
            <FilterButton label="Any time" open={showTime} setOpen={setShowTime} />
          </div>

          {/* LIST / EMPTY */}
          <div className="flex-1 overflow-y-auto hidden-scrollbar pb-12">
            {emails.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
                <span className="text-5xl mb-3">📭</span>
                <p className="text-base font-semibold" style={{ color: theme.text }}>No archived emails</p>
                <p className="text-sm" style={{ color: theme.subText }}>
                  Archive emails to keep your inbox clean
                </p>
              </div>
            ) : (
              <EmailList
                emails={visibleEmails}
                selectedEmailId={selectedEmail?.uid}
                onSelectEmail={handleSelectEmail}
                onDelete={(uid) => handleMoveToTrash(uid, "archive")}
                onStar={(uid) => handleToggleStar(uid, "archive")}
                onArchive={handleUnarchive}
                isArchiveFolder={true}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

/* ---------------- FILTER BUTTON ---------------- */
const FilterButton = ({ label, open, setOpen }) => (
  <div className="relative">
    <button
      onClick={() => setOpen(!open)}
      className="px-3 py-1 border rounded-full text-sm bg-white dark:bg-gray-850 dark:border-gray-700 dark:text-gray-200 cursor-pointer"
    >
      {label} ▾
    </button>

    {open && (
      <div className="absolute mt-2 w-56 bg-white dark:bg-gray-800 shadow-xl rounded-xl p-3 z-10 text-sm border dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">Filter UI only</p>
      </div>
    )}
  </div>
);

export default Archive;
