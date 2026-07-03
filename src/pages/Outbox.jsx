import React, { useEffect, useState } from "react";
import { mailAPI } from "../services/api";
import EmailList from "../components/EmailList";
import EmailDetails from "../components/EmailDetails";
import { useTheme } from "../context/ThemeContext";

import BulkActionsToolbar from "../components/BulkActionsToolbar";
import ReadingPaneLayout from "../components/ReadingPaneLayout";

const Outbox = ({ searchQuery }) => {
  const { theme, readingPaneMode } = useTheme();

  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    fetchOutbox();
  }, []);

  /* ---------------- FETCH OUTBOX ---------------- */
  const fetchOutbox = async () => {
    try {
      setLoading(true);
      setError("");

      // 🔹 Backend-ready (replace when endpoint exists)
      // const res = await mailAPI.getOutbox();
      // if (res.data?.success) setEmails(res.data.data.emails || []);

      // TEMP safe fallback
      setEmails([]);
    } catch (err) {
      console.error("Failed to fetch outbox:", err);
      setError("Failed to load outbox");
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

  const handleArchive = (uid) => {
    setEmails((prev) =>
      prev.map((e) =>
        e.uid === uid ? { ...e, folder: "archive" } : e
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
          <p style={{ color: theme.subText }}>Loading outbox…</p>
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
            onClick={fetchOutbox}
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
  
  const detailsComponent = selectedEmail ? (
<EmailDetails
          email={selectedEmail}
          onClose={() => setSelectedEmail(null)}
          onDelete={handleDelete}
          onStar={handleStar}
          onArchive={handleArchive}
        />
  ) : null;

  const headerComponent = selectedIds.size > 0 ? (

            <BulkActionsToolbar
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              visibleEmails={visibleEmails}
              folder="outbox"
            />
          
  ) : (

            <div
              className="p-4 sm:p-5 border-b flex justify-between items-center shrink-0 bg-transparent"
              style={{ borderColor: theme.border }}
            >
              <h2
                className="text-base font-bold flex items-center gap-2"
                style={{ color: theme.text }}
              >
                📤 Outbox
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
                <span className="text-5xl mb-3">📭</span>
                <p className="text-base font-semibold" style={{ color: theme.text }}>Outbox is empty</p>
                <p className="text-sm" style={{ color: theme.subText }}>
                  Emails waiting to be sent will appear here
                </p>
              </div>
            ) : (
              <EmailList
                emails={visibleEmails}
                selectedEmailId={selectedEmail?.uid}
                onSelectEmail={setSelectedEmail}
                onDelete={handleDelete}
                onStar={handleStar}
                onArchive={handleArchive}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
              />
            )}
    </div>
  );

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

export default Outbox;
