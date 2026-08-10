import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMail } from "../context/MailContext";
import { MdMailOutline } from "react-icons/md";
import EmailList from "../components/EmailList";
import EmailDetails from "../components/EmailDetails";
import { useTheme } from "../context/ThemeContext";

import BulkActionsToolbar from "../components/BulkActionsToolbar";
import ReadingPaneLayout from "../components/ReadingPaneLayout";

const BulkMail = ({ searchQuery }) => {
  const navigate = useNavigate();
  const { theme, readingPaneMode } = useTheme();
  const { handleToggleStar, handleMoveToTrash, handleArchive, openCompose } = useMail();
  const [selectedEmailUid, setSelectedEmailUid] = useState(null);
  
  // Empty state requirements: no dummy emails, no fake counts
  const emails = [];
  const visibleEmails = [];
  const selectedEmail = null;

  const [selectedIds, setSelectedIds] = useState(new Set());
  const handleToggleSelect = (uid) => {
    const strUid = String(uid);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(strUid)) next.delete(strUid);
      else next.add(strUid);
      return next;
    });
  };

  const handleSelectEmail = (email) => {
    setSelectedEmailUid(email.uid);
  };

  const handleForward = (email) => {
    openCompose({
      forward: true,
      subject: `Fwd: ${email.subject || ""}`,
      originalBody: email.body,
    });
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
      emailList={visibleEmails}
      onNavigate={(email) => setSelectedEmailUid(email.uid)}
      email={selectedEmail}
      onBack={() => setSelectedEmailUid(null)}
      onDelete={(uid) => {
        handleMoveToTrash(uid, "bulk");
        setSelectedEmailUid(null);
      }}
      onStar={(uid) => handleToggleStar(uid, "bulk")}
      onArchive={(uid) => {
        handleArchive(uid, "bulk");
        setSelectedEmailUid(null);
      }}
      onReply={handleReply}
      onForward={handleForward}
    />
  ) : null;

  const headerComponent = selectedIds.size > 0 ? (
    <BulkActionsToolbar
      selectedIds={selectedIds}
      setSelectedIds={setSelectedIds}
      visibleEmails={visibleEmails}
      folder="bulk"
    />
  ) : (
    <div
      className="p-4 sm:p-5 border-b flex flex-col justify-between shrink-0 bg-transparent gap-1"
      style={{ borderColor: theme.border }}
    >
      <h2
        className="text-base font-bold flex items-center gap-2"
        style={{ color: theme.text }}
      >
        <MdMailOutline size={20} style={{ color: theme.accent || "#135bec" }} /> Bulk Mail
      </h2>
      <p className="text-xs" style={{ color: theme.subText }}>
        Automatically organize bulk and mass-mail emails in one place.
      </p>
    </div>
  );

  const listComponent = (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <MdMailOutline size={52} className="text-gray-300 dark:text-gray-600 mb-4 opacity-50" />
        <p
          className="text-base font-semibold mb-1"
          style={{ color: theme.text }}
        >
          No bulk mail emails yet.
        </p>
        <p className="text-sm max-w-sm" style={{ color: theme.subText }}>
          Bulk and mass-mail emails identified by BNX Mail will appear here automatically.
        </p>
      </div>
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

export default BulkMail;
