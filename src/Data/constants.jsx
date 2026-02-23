import React from 'react';
import {
  MdInbox,
  MdStarBorder,
  MdSend,
  MdDrafts,
  MdArchive,
  MdReport,
  MdDelete,
  MdMail
} from 'react-icons/md';

export const SIDEBAR_ITEMS = [
  {
    name: 'Inbox',
    icon: <MdInbox size={22} />,
    path: '/inbox',
    count: 0
  },
  {
    name: 'Starred',
    icon: <MdStarBorder size={22} />,
    path: '/starred',
    count: 0
  },
  {
    name: 'Sent',
    icon: <MdSend size={20} />,
    path: '/sent',
    count: 0
  },
  {
    name: 'Draft',
    icon: <MdDrafts size={22} />,
    path: '/draft',
    count: 0
  },
  {
    name: 'Archive',
    icon: <MdArchive size={22} />,
    path: '/archive',
    count: 0
  },
  {
    name: 'Spam',
    icon: <MdReport size={22} />,
    path: '/spam',
    count: 0
  },
  {
    name: 'Trash',
    icon: <MdDelete size={22} />,
    path: '/trash',
    count: 0
  },
  {
    name: 'All Mail',
    icon: <MdMail size={22} />,
    path: '/allmail',
    count: 0
  }
];

export const EMAIL_CATEGORIES = {
  PRIMARY: 'primary',
  SOCIAL: 'social',
  PROMOTIONS: 'promotions',
  UPDATES: 'updates'
};

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login'
  },
  MAIL: {
    SEND: '/api/mail/send',
    INBOX: '/api/mail/inbox',
    EMAIL: '/api/mail/email'
  },
  EMAILS: {
    CREATE: '/api/emails/create',
    LIST: '/api/emails/list',
    SET_PRIMARY: '/api/emails/:id/set-primary'
  },
  BUSINESS: {
    REGISTER: '/api/business/register',
    DOMAINS: '/api/business/domains',
    VERIFY: '/api/business/domain/:id/verify'
  }
};