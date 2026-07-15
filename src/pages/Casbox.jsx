import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { useMail } from "../context/MailContext";
import { casboxAPI } from "../services/api";
import { MdCheck, MdDoneAll, MdStarBorder, MdStar, MdDeleteOutline, MdRefresh, MdSend, MdClose } from "react-icons/md";
import toast from "react-hot-toast";
import ReadingPaneLayout from "../components/ReadingPaneLayout";

const Casbox = () => {
  const { theme, readingPaneMode } = useTheme();
  const { user } = useAuth();
  const { stompClient, isConnected } = useSocket();
  const { openCompose } = useMail();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();

    // Background auto-polling for new casbox messages every 30 seconds
    const interval = setInterval(() => {
      if (!document.hidden) {
        fetchMessages(true);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!stompClient || !isConnected) return;

    const messageSub = stompClient.subscribe('/user/queue/casbox/messages', (msg) => {
      const newMsg = JSON.parse(msg.body);
      setMessages(prev => [newMsg, ...prev]);
    });

    const statusSub = stompClient.subscribe('/user/queue/casbox/status', (msg) => {
      const updatedMsg = JSON.parse(msg.body);
      setMessages(prev => prev.map(m => m.id === updatedMsg.id ? updatedMsg : m));
    });

    casboxAPI.markAsDelivered().catch(console.error);

    return () => {
      messageSub.unsubscribe();
      statusSub.unsubscribe();
    };
  }, [stompClient, isConnected]);

  const fetchMessages = async (background = false) => {
    try {
      if (!background) setLoading(true);
      const res = await casboxAPI.getAllMessages();
      setMessages(res.data);
    } catch (err) {
      if (!background) toast.error("Failed to fetch messages");
    } finally {
      if (!background) setLoading(false);
    }
  };

  const handleSelectMessage = async (msg) => {
    setSelectedMessage(msg);
    if (msg.receiverEmail === user?.email && msg.status !== 'SEEN') {
      try {
        await casboxAPI.updateStatus({ messageIds: [msg.id], status: 'SEEN' });
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status: 'SEEN' } : m));
        if (selectedMessage?.id === msg.id) {
          setSelectedMessage({ ...msg, status: 'SEEN' });
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const getStatusIcon = (status) => {
    if (!status) return null;
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === "sent") return <MdCheck size={16} className="text-gray-400" title="Sent" />;
    if (lowerStatus === "delivered") return <MdDoneAll size={16} className="text-gray-400" title="Delivered" />;
    if (lowerStatus === "seen") return <MdDoneAll size={16} className="text-blue-500" title="Seen" />;
    return null;
  };

  const parseTimestamp = (ts) => {
    if (!ts) return new Date();
    if (Array.isArray(ts)) {
      const [year, month, day, hour = 0, minute = 0, second = 0] = ts;
      return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
    }
    if (typeof ts === 'string') {
      const str = ts.endsWith('Z') || ts.includes('+') ? ts : ts + 'Z';
      return new Date(str);
    }
    return new Date(ts);
  };

  const headerComponent = (
    <div className="flex flex-col shrink-0">
      <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 shrink-0 bg-transparent">
        <span
          className="px-4 py-1.5 text-xs font-bold rounded-full shadow-sm text-white tracking-wide flex items-center gap-1.5 uppercase select-none"
          style={{ background: `linear-gradient(135deg, ${theme.accent || "#135bec"} 0%, #3b82f6 100%)` }}
        >
          Casbox ({messages.length})
        </span>
        <div className="flex-1"></div>
        <button
          onClick={() => openCompose({ mode: 'casbox' })}
          className="px-3 py-1.5 rounded-full text-sm font-bold text-white transition-transform active:scale-95"
          style={{ backgroundColor: theme.accent || "#135bec" }}
        >
          Compose
        </button>
        <button
          onClick={fetchMessages}
          className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
        >
          <MdRefresh size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>
    </div>
  );

  const listComponent = (
    <div className="flex-1 overflow-y-auto hidden-scrollbar relative bg-transparent">
      {messages.map((msg) => {
        const isMe = msg.senderEmail === user?.email;
        const isSelected = selectedMessage?.id === msg.id;
        return (
          <div
            key={msg.id}
            onClick={() => handleSelectMessage(msg)}
            className={`group flex items-center px-4 sm:px-6 py-2.5 sm:py-3 border-b border-gray-100 dark:border-gray-800/50 hover:shadow-sm transition-all cursor-pointer relative bg-white dark:bg-[#121212] ${isSelected ? 'bg-blue-50/50 dark:bg-blue-900/20' : 'hover:bg-gray-50/50 dark:hover:bg-gray-800/30'} ${!isMe && msg.status !== 'SEEN' ? 'font-bold' : ''}`}
          >
            {isSelected && (
              <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r bg-blue-500"></div>
            )}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0 mr-3 sm:mr-4">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 cursor-pointer bg-transparent"
                readOnly
              />
              <button className="text-gray-400 hover:text-yellow-400 transition-colors">
                <MdStarBorder size={20} />
              </button>
            </div>

            <div className="w-36 sm:w-44 md:w-48 shrink-0 truncate pr-2">
              <span className={`text-sm ${!isMe && msg.status !== 'SEEN' ? 'font-extrabold text-gray-900 dark:text-white' : 'font-semibold text-gray-800 dark:text-gray-200'}`}>
                {isMe ? "Me" : msg.senderEmail.split('@')[0]}
              </span>
            </div>

            <div className="flex-1 min-w-0 flex items-baseline gap-2 truncate pr-4">
              <span className={`text-sm truncate ${!isMe && msg.status !== 'SEEN' ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-800 dark:text-gray-200'}`}>
                {msg.subject || (isMe ? `To: ${msg.receiverEmail}` : "")}
              </span>
              <span className="text-sm text-gray-400 dark:text-gray-500 truncate font-normal">
                — {msg.body}
              </span>
            </div>

            <div className="shrink-0 mx-2 flex items-center justify-center w-6">
              {isMe && getStatusIcon(msg.status)}
            </div>

            <div className="shrink-0 w-20 sm:w-24 text-right">
              <span className={`text-xs sm:text-sm ${!isMe && msg.status !== 'SEEN' ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-500 dark:text-gray-400'}`}>
                {parseTimestamp(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-l from-white via-white to-transparent dark:from-[#121212] dark:via-[#121212] dark:to-transparent pl-8 pr-2 py-1">
              <button className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-gray-500 transition-colors">
                <MdDeleteOutline size={18} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  const detailsComponent = selectedMessage ? (
    <div className="flex flex-col h-full bg-white dark:bg-[#121212] border-l border-gray-100 dark:border-gray-800 overflow-y-auto hidden-scrollbar p-6 sm:p-8">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedMessage(null)}
            className="md:hidden p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
            title="Back to list"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {selectedMessage.subject || "Casbox Message"}
          </h2>
        </div>
        <button
          onClick={() => setSelectedMessage(null)}
          className="p-2 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
          title="Close"
        >
          <MdClose size={22} />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg">
          {selectedMessage.senderEmail.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-gray-900 dark:text-gray-100">{selectedMessage.senderEmail}</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            To: {selectedMessage.receiverEmail}
          </div>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 shrink-0">
          {parseTimestamp(selectedMessage.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
        </div>
      </div>
      <div className="text-[15px] leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
        {selectedMessage.body}
      </div>

      {selectedMessage.attachmentsJson && (
        <div className="mt-8 border-t border-gray-100 dark:border-gray-800 pt-6">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Attachments
          </h4>
          <div className="flex flex-wrap gap-3">
            {JSON.parse(selectedMessage.attachmentsJson).map((file, i) => (
              <a
                key={i}
                href={`${import.meta.env.VITE_API_URL || "https://api.bnxmail.com"}${file.url || file.filePath || file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors w-64 group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 transition-colors">
                    {file.fileName || file.name || (typeof file === 'string' ? file.split('/').pop() : "Attachment")}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-600 bg-gray-50/30 dark:bg-[#1e1e1e]/30 border-l border-gray-100 dark:border-gray-800">
      <MdSend className="text-6xl mb-4 opacity-50" />
      <p className="text-base font-medium">Select a message to read</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-[#121212] relative overflow-hidden">
      <ReadingPaneLayout
        mode={theme?.readingPaneMode || 'no_split'}
        hasSelection={!!selectedMessage}
        headerComponent={headerComponent}
        listComponent={listComponent}
        detailsComponent={detailsComponent}
      />
    </div>
  );
};

export default Casbox;
