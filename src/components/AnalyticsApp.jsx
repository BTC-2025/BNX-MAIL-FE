import React, { useState, useEffect } from 'react';
import { MdTrendingUp, MdEmail, MdInbox, MdSend, MdDelete, MdReport, MdArchive, MdDrafts, MdPerson } from 'react-icons/md';
import { api } from '../services/api';

const AnalyticsApp = ({ onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('No token found');
        
        // use api instance to automatically include baseURL and tokens
        const res = await api.get('/api/mail/analytics');
        
        if (res.data && res.data.success) {
          setData(res.data.data);
        } else {
          throw new Error(res.data?.message || 'Failed to load analytics');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, []);

  const getFolderIcon = (folderName) => {
    switch (folderName) {
      case 'INBOX': return <MdInbox className="text-blue-500" />;
      case 'Sent': return <MdSend className="text-emerald-500" />;
      case 'Drafts': return <MdDrafts className="text-amber-500" />;
      case 'Trash': return <MdDelete className="text-red-500" />;
      case 'Spam': return <MdReport className="text-orange-500" />;
      case 'Archive': return <MdArchive className="text-purple-500" />;
      default: return <MdEmail className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-3">
        <div className="animate-spin text-3xl"><MdTrendingUp /></div>
        <p className="text-sm font-medium">Crunching data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-500 gap-3 p-4 text-center">
        <MdReport size={32} />
        <p className="text-sm font-medium">{error}</p>
      </div>
    );
  }

  const { folderCounts = {}, topSenders = {}, topReceivers = {} } = data || {};

  // Sort Top Senders
  const sortedSenders = Object.entries(topSenders)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
    
  // Sort Top Receivers
  const sortedReceivers = Object.entries(topReceivers)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="flex flex-col h-full overflow-y-auto hidden-scrollbar pb-6 gap-6">
      <div className="flex items-center gap-2 mb-2 px-1">
        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <MdTrendingUp size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-tight">Analytics</h2>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">Mailbox insights & stats</p>
        </div>
      </div>

      {/* Folder Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Mailbox Composition</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(folderCounts).map(([folder, count]) => (
            <div key={folder} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
              <div className="shrink-0">{getFolderIcon(folder)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate">{folder}</p>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Senders */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Top Senders (Inbox)</h3>
        {sortedSenders.length > 0 ? (
          <div className="flex flex-col gap-3">
            {sortedSenders.map(([email, count]) => (
              <div key={email} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                    <MdPerson className="text-indigo-600 dark:text-indigo-400" size={14} />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{email}</span>
                </div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-full shrink-0">
                  {count}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 italic">Not enough data.</p>
        )}
      </div>

      {/* Top Receivers */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Top Receivers (Sent)</h3>
        {sortedReceivers.length > 0 ? (
          <div className="flex flex-col gap-3">
            {sortedReceivers.map(([email, count]) => (
              <div key={email} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                    <MdPerson className="text-emerald-600 dark:text-emerald-400" size={14} />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{email}</span>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full shrink-0">
                  {count}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 italic">Not enough data.</p>
        )}
      </div>
      
    </div>
  );
};

export default AnalyticsApp;
