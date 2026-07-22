export const normalizeSubject = (subject) => {
  if (!subject) return "(No Subject)";
  let s = subject;
  let prev = "";
  while (s !== prev) {
    prev = s;
    s = s.replace(/^(Re|Fwd|Fw|Reply):\s*/gi, '').trim();
  }
  return s.toLowerCase();
};

export const groupEmailsIntoThreads = (emails) => {
  if (!emails || !Array.isArray(emails)) return [];

  const threadMap = new Map();

  // Sort oldest first so that the last one processed is the newest
  const sortedEmails = [...emails].sort((a, b) => {
    const dateA = new Date(a.date || a.sentDate || a.receivedDate || 0);
    const dateB = new Date(b.date || b.sentDate || b.receivedDate || 0);
    return dateA - dateB;
  });

  sortedEmails.forEach(email => {
    const normSubj = normalizeSubject(email.subject);
    
    if (!threadMap.has(normSubj)) {
      threadMap.set(normSubj, {
        uid: email.uid, // base thread ID on the first email's uid
        subject: email.subject, // Original subject of the first email
        messages: [email],
        latestMessage: email,
        isRead: email.isRead,
        isStarred: email.isStarred || email.starred,
        folderName: email.folderName,
        date: email.date || email.sentDate || email.receivedDate,
        from: email.from,
        to: email.to,
        body: email.body,
        category: email.category,
        isThread: true
      });
    } else {
      const thread = threadMap.get(normSubj);
      thread.messages.push(email);
      thread.latestMessage = email;
      
      // Update thread properties based on the latest message
      thread.date = email.date || email.sentDate || email.receivedDate;
      thread.subject = email.subject; // Usually we keep the latest subject
      thread.isRead = thread.isRead && email.isRead; // Thread is unread if ANY message is unread
      thread.isStarred = thread.isStarred || email.isStarred || email.starred; // Thread is starred if ANY message is starred
      thread.from = email.from;
      thread.to = email.to;
      thread.body = email.body;
      thread.folderName = email.folderName || thread.folderName;
      thread.category = email.category || thread.category;
    }
  });

  // Convert map to array and sort newest first
  return Array.from(threadMap.values()).sort((a, b) => {
    const dateA = new Date(a.date || 0);
    const dateB = new Date(b.date || 0);
    return dateB - dateA;
  });
};
