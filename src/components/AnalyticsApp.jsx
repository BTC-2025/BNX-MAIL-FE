import React, { useState, useEffect } from 'react';
import { MdTrendingUp, MdEmail, MdInbox, MdSend, MdDelete, MdReport, MdArchive, MdDrafts, MdPerson } from 'react-icons/md';
import { api } from '../services/api';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line 
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

const AnalyticsApp = ({ onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('No token found');
        
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const res = await api.get(`/api/mail/analytics?timezone=${encodeURIComponent(tz)}`);
        
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

  window.__ANALYTICS_DATA__ = data;
  
  const { 
    folderCounts = {}, 
    topSenders = {}, 
    topReceivers = {},
    receivedByDate = {},
    sentByDate = {},
    receivedByMonth = {},
    sentByMonth = {}
  } = data || {};

  // Sort Top Senders
  const sortedSenders = Object.entries(topSenders)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
    
  // Sort Top Receivers
  const sortedReceivers = Object.entries(topReceivers)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Pie Chart Data
  const pieData = Object.entries(folderCounts).map(([name, value]) => ({ name, value }));

  // Date Chart Data - strictly from backend keys
  const allDateKeys = Array.from(new Set([...Object.keys(receivedByDate), ...Object.keys(sentByDate)])).sort();
  const dateData = allDateKeys.map(date => ({
    date,
    Received: Number(receivedByDate[date] || 0),
    Sent: Number(sentByDate[date] || 0)
  }));

  // Month Chart Data - strictly from backend keys
  const allMonthKeys = Array.from(new Set([...Object.keys(receivedByMonth), ...Object.keys(sentByMonth)])).sort();
  const monthData = allMonthKeys.map(month => ({
    month,
    Received: Number(receivedByMonth[month] || 0),
    Sent: Number(sentByMonth[month] || 0)
  }));

  const formatDateTick = (tickItem) => {
    try {
      if (!tickItem || typeof tickItem !== 'string') return tickItem;
      const parts = tickItem.split('-');
      if (parts.length !== 3) return tickItem;
      const [y, m, d] = parts;
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIdx = parseInt(m, 10) - 1;
      if (monthIdx < 0 || monthIdx > 11) return tickItem;
      return `${months[monthIdx]} ${parseInt(d, 10)}`;
    } catch {
      return tickItem;
    }
  };

  const formatMonthTick = (tickItem) => {
    try {
      if (!tickItem || typeof tickItem !== 'string') return tickItem;
      const parts = tickItem.split('-');
      if (parts.length !== 2) return tickItem;
      const [y, m] = parts;
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIdx = parseInt(m, 10) - 1;
      if (monthIdx < 0 || monthIdx > 11) return tickItem;
      return `${months[monthIdx]} ${y}`;
    } catch {
      return tickItem;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto hidden-scrollbar pb-6 gap-6 px-6">
      <div className="flex items-center gap-2 mb-2 mt-6">
        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <MdTrendingUp size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-tight">Analytics Dashboard</h2>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">Mailbox insights, composition & activity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Mailbox Composition Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col h-[350px]">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mailbox Composition</h3>
          <div className="flex-1 w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top People */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col h-[350px] overflow-hidden">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 shrink-0">Top Senders</h3>
            <div className="overflow-y-auto hidden-scrollbar flex-1">
              {sortedSenders.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {sortedSenders.map(([email, count]) => (
                    <div key={email} className="flex items-center justify-between gap-2">
                      <span className="text-sm text-gray-700 dark:text-gray-300 truncate" title={email}>{email}</span>
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-full">{count}</span>
                    </div>
                  ))}
                </div>
              ) : <p className="text-xs text-gray-500 italic">Not enough data.</p>}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col h-[350px] overflow-hidden">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 shrink-0">Top Receivers</h3>
            <div className="overflow-y-auto hidden-scrollbar flex-1">
              {sortedReceivers.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {sortedReceivers.map(([email, count]) => (
                    <div key={email} className="flex items-center justify-between gap-2">
                      <span className="text-sm text-gray-700 dark:text-gray-300 truncate" title={email}>{email}</span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">{count}</span>
                    </div>
                  ))}
                </div>
              ) : <p className="text-xs text-gray-500 italic">Not enough data.</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Daily Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col h-[400px]">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 shrink-0">Daily Activity</h3>
        <div className="flex-1 w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dateData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="date" tick={{fontSize: 12}} tickMargin={10} minTickGap={30} tickFormatter={formatDateTick} />
              <YAxis tick={{fontSize: 12}} />
              <Tooltip labelFormatter={formatDateTick} />
              <Legend verticalAlign="top" height={36} />
              <Line type="monotone" dataKey="Received" stroke="#3b82f6" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}} />
              <Line type="monotone" dataKey="Sent" stroke="#10b981" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col h-[400px]">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 shrink-0">Monthly Activity</h3>
        <div className="flex-1 w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="month" tick={{fontSize: 12}} tickMargin={10} tickFormatter={formatMonthTick} />
              <YAxis tick={{fontSize: 12}} />
              <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} labelFormatter={formatMonthTick} />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="Received" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
              <Bar dataKey="Sent" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
    </div>
  );
};

export default AnalyticsApp;
