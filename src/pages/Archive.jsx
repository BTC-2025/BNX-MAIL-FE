import React, { useEffect, useState } from "react";
import { mailAPI } from "../services/api";
import EmailList from "../components/EmailList";
import EmailDetails from "../components/EmailDetails";
import { useTheme } from "../context/ThemeContext";

const Archive = () => {
  const { theme } = useTheme();

  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // UI-only filter states
  const [showTime, setShowTime] = useState(false);
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);

  useEffect(() => {
    fetchArchive();
  }, []);

  /* ---------------- FETCH ARCHIVE ---------------- */
  const fetchArchive = async () => {
    try {
      setLoading(true);
      setError("");

      // 🔹 Backend-ready (replace when endpoint exists)
      // const res = await mailAPI.getArchive();
      // if (res.data?.success) setEmails(res.data.data.emails || []);

      // TEMP safe fallback
      setEmails([]);
    } catch (err) {
      console.error("Failed to fetch archive:", err);
      setError("Failed to load archived emails");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- ACTIONS ---------------- */
  const handleDelete = (uid) => {
    setEmails((prev) => prev.filter((e) => e.uid !== uid));
    setSelectedEmail(null);
  };

  const handleStar = (uid) => {
    setEmails((prev) =>
      prev.map((e) =>
        e.uid === uid ? { ...e, starred: !e.starred } : e
      )
    );
  };

  const handleUnarchive = (uid) => {
    setEmails((prev) =>
      prev.map((e) =>
        e.uid === uid ? { ...e, folder: "inbox" } : e
      )
    );
    setSelectedEmail(null);
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
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

  /* ---------------- ERROR ---------------- */
  if (error) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ background: theme.bg }}
      >
        <div className="text-center">
          <p className="mb-4 text-red-600">{error}</p>
          <button
            onClick={fetchArchive}
            className="px-4 py-2 rounded text-white"
            style={{ background: theme.accent }}
          >
            Retry
          </button>
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
          onClose={() => setSelectedEmail(null)}
          onDelete={handleDelete}
          onStar={handleStar}
          onArchive={handleUnarchive}
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
                emails={emails}
                selectedEmailId={selectedEmail?.uid}
                onSelectEmail={setSelectedEmail}
                onDelete={handleDelete}
                onStar={handleStar}
                onArchive={handleUnarchive}
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
