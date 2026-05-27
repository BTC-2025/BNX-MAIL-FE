import React from "react";
import { MdArchive, MdDelete, MdStar, MdStarBorder, MdAccessTime } from "react-icons/md";

const EmailList = ({
  emails,
  selectedEmailId,
  onSelectEmail,
  onDelete,
  onStar,
  onArchive,
  onSnooze,
  showTo = false,
  selectedIds = new Set(),
  onToggleSelect,
}) => {
  return (
    <div className="flex-1 overflow-y-auto bg-transparent">
      {emails.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-400 p-8">
          <span className="text-5xl mb-4 opacity-75">📭</span>
          <p className="text-base font-medium text-gray-500 dark:text-gray-400">Your folder is empty</p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800/60">
          {emails.map((email, i) => {
            const sender = showTo ? (email.to || email.recipientEmail) : email.from;
            const isUnread = !email.isRead;
            const isSelected = selectedEmailId === email.uid;

            return (
              <div
                key={email.uid}
                onClick={() => onSelectEmail(email)}
                className={`group flex items-center gap-3 py-2.5 px-4 cursor-pointer relative transition-colors duration-150 select-none
                  ${isSelected
                    ? "bg-primary/5 dark:bg-primary/10 border-l-[3px] border-primary"
                    : isUnread
                      ? "bg-black/[0.01] dark:bg-white/[0.02] hover:bg-black/[0.03] dark:hover:bg-white/[0.04] border-l-[3px] border-transparent"
                      : "bg-transparent hover:bg-black/[0.02] dark:hover:bg-white/[0.02] border-l-[3px] border-transparent"
                  }`}
              >
                {/* Checkbox */}
                <div className="flex items-center shrink-0" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(email.uid)}
                    onChange={() => onToggleSelect?.(email.uid)}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                  />
                </div>

                {/* Star Button */}
                <div className="flex items-center shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStar?.(email.uid);
                    }}
                    className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-400 dark:text-gray-500 hover:text-yellow-500 cursor-pointer"
                    title={email.starred ? "Unstar" : "Star"}
                  >
                    {email.starred ? (
                      <MdStar size={20} className="text-yellow-500 fill-current" />
                    ) : (
                      <MdStarBorder size={20} className="text-gray-400 dark:text-gray-500" />
                    )}
                  </button>
                </div>

                {/* Sender Name */}
                <div className="w-36 sm:w-44 md:w-48 shrink-0 truncate pr-2">
                  <span
                    className={`text-sm ${
                      isUnread
                        ? "font-bold text-gray-900 dark:text-gray-100"
                        : "font-medium text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {showTo ? (
                      <span className="flex items-center gap-1">
                        <span className="text-[9px] font-bold border border-current px-0.5 rounded-sm opacity-50">TO</span>
                        {(email.to || email.recipientEmail)?.split("@")[0]}
                      </span>
                    ) : (
                      sender?.split("@")[0] || sender
                    )}
                  </span>
                </div>

                {/* Subject & Snippet */}
                <div className="flex-1 min-w-0 flex items-baseline gap-2 truncate pr-4">
                  <span
                    className={`text-sm truncate ${
                      isUnread
                        ? "font-bold text-gray-900 dark:text-gray-100"
                        : "font-medium text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {email.subject || "(No Subject)"}
                  </span>
                  <span className="text-sm text-gray-400 dark:text-gray-500 truncate font-normal">
                    — {email.body ? email.body.replace(/\s+/g, " ") : ""}
                  </span>
                </div>

                {/* Labels */}
                {email.labels && email.labels.length > 0 && (
                  <div className="hidden sm:flex gap-1 shrink-0 mr-2 select-none">
                    {email.labels.map((label) => (
                      <span
                        key={label.id}
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-tight text-white border border-black/5 dark:border-white/5"
                        style={{ backgroundColor: label.colorHex }}
                      >
                        {label.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Date / Hover Actions */}
                <div className="w-16 sm:w-20 shrink-0 text-right relative flex justify-end items-center h-full">
                  <span
                    className={`text-xs whitespace-nowrap transition-opacity duration-100 group-hover:opacity-0 ${
                      isUnread ? "font-bold text-primary" : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {email.receivedDate
                      ? new Date(email.receivedDate).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })
                      : ""}
                  </span>

                  {/* Quick actions that fade-in on row hover */}
                  <div
                    className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-0.5 bg-white dark:bg-gray-900 dark:bg-slate-900 pl-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => onArchive?.(email.uid)}
                      className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer"
                      title="Archive"
                    >
                      <MdArchive size={18} />
                    </button>
                    <button
                      onClick={() => onDelete?.(email.uid)}
                      className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-red-500 cursor-pointer"
                      title="Delete"
                    >
                      <MdDelete size={18} />
                    </button>
                    <button
                      onClick={() => {
                        const wakeUpAt = new Date();
                        wakeUpAt.setDate(wakeUpAt.getDate() + 1);
                        onSnooze?.(email.uid, wakeUpAt.toISOString());
                      }}
                      className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-blue-500 cursor-pointer"
                      title="Snooze"
                    >
                      <MdAccessTime size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EmailList;
