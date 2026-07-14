import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { casboxAPI } from "../services/api";
import { MdCheck, MdDoneAll, MdStarBorder, MdStar, MdDeleteOutline, MdRefresh, MdSend } from "react-icons/md";
import toast from "react-hot-toast";

const Casbox = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { stompClient, isConnected } = useSocket();
  
  const [messages, setMessages] = useState([]);
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (!stompClient || !isConnected) return;

    // Subscribe to incoming messages
    const messageSub = stompClient.subscribe('/user/queue/casbox/messages', (msg) => {
        const newMsg = JSON.parse(msg.body);
        setMessages(prev => [newMsg, ...prev]);
        
        // Mark as seen immediately if received while open
        casboxAPI.updateStatus({ messageIds: [newMsg.id], status: 'SEEN' }).catch(console.error);
    });

    // Subscribe to status updates (read receipts)
    const statusSub = stompClient.subscribe('/user/queue/casbox/status', (msg) => {
        const updatedMsg = JSON.parse(msg.body);
        setMessages(prev => prev.map(m => m.id === updatedMsg.id ? updatedMsg : m));
    });
    
    // Mark pending as delivered
    casboxAPI.markAsDelivered().catch(console.error);

    return () => {
        messageSub.unsubscribe();
        statusSub.unsubscribe();
    };
  }, [stompClient, isConnected]);

  const fetchMessages = async () => {
    try {
        setLoading(true);
        const res = await casboxAPI.getAllMessages();
        setMessages(res.data);
        
        // Extract unseen IDs
        const unseenIds = res.data
            .filter(m => m.receiverEmail === user?.email && m.status !== 'SEEN')
            .map(m => m.id);
            
        if (unseenIds.length > 0) {
            await casboxAPI.updateStatus({ messageIds: unseenIds, status: 'SEEN' });
        }
    } catch (err) {
        toast.error("Failed to fetch messages");
    } finally {
        setLoading(false);
    }
  };

  const handleSend = async () => {
      if (!composeTo || !composeBody) {
          toast.error("Please enter a receiver email and message body.");
          return;
      }
      try {
          const res = await casboxAPI.sendMessage({
              receiverEmail: composeTo,
              subject: composeSubject,
              body: composeBody
          });
          setMessages(prev => [res.data, ...prev]);
          setComposeTo("");
          setComposeSubject("");
          setComposeBody("");
          setIsComposing(false);
      } catch (err) {
          toast.error("Failed to send message");
      }
  };

  
  const getStatusIcon = (status) => {
    if (status === "sent") return <MdCheck size={16} className="text-gray-400" title="Sent" />;
    if (status === "delivered") return <MdDoneAll size={16} className="text-gray-400" title="Delivered" />;
    if (status === "seen") return <MdDoneAll size={16} className="text-blue-500" title="Seen" />;
    return null;
  };

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-[#121212] relative overflow-hidden">
      
      {/* Header toolbar (like inbox) */}
      <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 shrink-0 bg-transparent">
        <span
          className="px-4 py-1.5 text-xs font-bold rounded-full shadow-sm text-white tracking-wide flex items-center gap-1.5 uppercase select-none"
          style={{ background: `linear-gradient(135deg, ${theme.accent || "#135bec"} 0%, #3b82f6 100%)` }}
        >
          Casbox ({messages.length})
        </span>
        <div className="flex-1"></div>
        <button 
          onClick={() => setIsComposing(!isComposing)}
          className="px-3 py-1.5 rounded-full text-sm font-bold text-white transition-transform active:scale-95"
          style={{ backgroundColor: theme.accent || "#135bec" }}
        >
          {isComposing ? "Cancel" : "Compose"}
        </button>
        <button 
          onClick={fetchMessages}
          className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
        >
          <MdRefresh size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Quick Compose Area */}
      {isComposing && (
        <div className="px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
                <input 
                    type="email" 
                    placeholder="To: (Email address)" 
                    className="w-full sm:w-1/3 px-3 py-2 rounded-lg text-sm bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 outline-none focus:border-blue-500 dark:text-gray-200"
                    value={composeTo}
                    onChange={e => setComposeTo(e.target.value)}
                />
                <input 
                    type="text" 
                    placeholder="Subject (Optional)" 
                    className="w-full sm:w-2/3 px-3 py-2 rounded-lg text-sm bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 outline-none focus:border-blue-500 dark:text-gray-200"
                    value={composeSubject}
                    onChange={e => setComposeSubject(e.target.value)}
                />
            </div>
            <div className="flex items-end gap-3">
                <input 
                    type="text" 
                    placeholder="Type your message..." 
                    className="flex-1 px-3 py-2 rounded-lg text-sm bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 outline-none focus:border-blue-500 dark:text-gray-200"
                    value={composeBody}
                    onChange={e => setComposeBody(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <button 
                    onClick={handleSend}
                    className="p-2.5 rounded-lg text-white shadow-sm hover:scale-105 active:scale-95 transition shrink-0"
                    style={{ backgroundColor: theme.accent || "#135bec" }}
                >
                    <MdSend size={18} />
                </button>
            </div>
        </div>
      )}

      {/* List Area */}
      <div className="flex-1 overflow-y-auto hidden-scrollbar">
        {messages.map((msg) => {
          const isMe = msg.senderEmail === user?.email;
          return (
          <div 
            key={msg.id}
            className={`group flex items-center px-4 sm:px-6 py-2.5 sm:py-3 border-b border-gray-100 dark:border-gray-800/50 hover:shadow-sm transition-all cursor-pointer relative bg-white dark:bg-[#121212] hover:bg-gray-50/50 dark:hover:bg-gray-800/30 ${!isMe && msg.status !== 'SEEN' ? 'bg-blue-50/20 dark:bg-blue-900/10' : ''}`}
          >
            {/* Left Controls (Checkbox & Star) */}
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

            {/* Sender Name */}
            <div className="w-36 sm:w-44 md:w-48 shrink-0 truncate pr-2">
              <span className={`text-sm font-bold text-gray-900 dark:text-gray-100`}>
                {isMe ? "Me" : msg.senderEmail.split('@')[0]}
              </span>
            </div>

            {/* Subject & Snippet */}
            <div className="flex-1 min-w-0 flex items-baseline gap-2 truncate pr-4">
              <span className="text-sm truncate font-bold text-gray-900 dark:text-gray-100">
                {msg.subject || (isMe ? `To: ${msg.receiverEmail}` : "")}
              </span>
              <span className="text-sm text-gray-400 dark:text-gray-500 truncate font-normal">
                — {msg.body}
              </span>
            </div>

            {/* Status Indicator (Seen/Delivered) */}
            <div className="shrink-0 mx-2 flex items-center justify-center w-6">
              {isMe && getStatusIcon(msg.status)}
            </div>

            {/* Date / Time */}
            <div className="shrink-0 w-20 sm:w-24 text-right">
              <span className={`text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            {/* Hover Actions */}
            <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-l from-white via-white to-transparent dark:from-[#121212] dark:via-[#121212] dark:to-transparent pl-8 pr-2 py-1">
              <button className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-gray-500 transition-colors">
                <MdDeleteOutline size={18} />
              </button>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default Casbox;
