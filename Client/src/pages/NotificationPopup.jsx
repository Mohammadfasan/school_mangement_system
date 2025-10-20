// src/components/NotificationPopup.jsx

import React from 'react';
import { X, Bell, Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const dummyNotifications = [
  { id: 1, title: 'New Sport Added', message: 'Volleyball has been added to the sports list.', time: '2m ago', unread: true },
  { id: 2, title: 'Timetable Updated', message: 'Grade 11 timetable for next week is available.', time: '1h ago', unread: false },
  { id: 3, title: 'Event Reminder', message: 'Annual sports meet is tomorrow at 9 AM.', time: '5h ago', unread: true },
  { id: 4, title: 'Achievement Unlocked', message: 'John Doe won the regional chess tournament.', time: '1d ago', unread: false },
];

const NotificationPopup = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="absolute top-full right-0 mt-3 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="notification-heading"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-[#059669] rounded-t-xl">
            <div className="flex items-center gap-2 text-white">
              <Bell size={18} />
              <h2 id="notification-heading" className="font-semibold">Notifications</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/20 transition"
              aria-label="Close notifications"
            >
              <X size={18} className="text-white" />
            </button>
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {dummyNotifications.length > 0 ? (
              <ul>
                {dummyNotifications.map((notification, index) => (
                  <li
                    key={notification.id}
                    className={`p-3 transition-colors cursor-pointer ${
                      notification.unread ? 'bg-green-50' : 'bg-white'
                    } hover:bg-green-100 ${index < dummyNotifications.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    <p className="font-medium text-sm text-gray-800">{notification.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{notification.message}</p>
                    <p className="text-right text-[11px] text-gray-400 mt-1">{notification.time}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center text-gray-500 flex flex-col items-center gap-2">
                <Inbox size={30} className="text-gray-400" />
                <p className="text-sm">No new notifications</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-gray-50 border-t border-gray-200 text-center rounded-b-xl">
            <a
              href="#"
              className="text-sm font-medium text-[#059669] hover:underline hover:text-[#047857]"
            >
              View all notifications
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationPopup;
