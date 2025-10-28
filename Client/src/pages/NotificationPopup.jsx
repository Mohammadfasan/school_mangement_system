// src/components/NotificationPopup.jsx

import React, { useState, useEffect } from 'react';
import { X, Bell, Inbox, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationService } from '../services/announcementService';
import { useAuth } from '../Context/AuthContext';

const NotificationPopup = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Safe data access helper functions
  const safeGetNotifications = (response) => {
    if (!response) return [];
    if (Array.isArray(response.data)) return response.data;
    if (Array.isArray(response.data?.data)) return response.data.data;
    if (Array.isArray(response.data?.notifications)) return response.data.notifications;
    if (Array.isArray(response.data?.activeNotifications)) return response.data.activeNotifications;
    return [];
  };

  const safeGetNotificationId = (notification) => {
    return notification?.id || notification?._id || Math.random().toString(36).substr(2, 9);
  };

  const safeGetNotificationTitle = (notification) => {
    return notification?.title || 'Untitled Notification';
  };

  const safeGetNotificationMessage = (notification) => {
    return notification?.message || notification?.content || 'No message provided';
  };

  const safeGetNotificationType = (notification) => {
    return notification?.type || 'info';
  };

  const safeGetNotificationCreatedAt = (notification) => {
    return notification?.createdAt || notification?.created_date || notification?.timestamp || new Date().toISOString();
  };

  // Fetch notifications when popup opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getActiveNotifications();
      console.log('Notification API Response:', response); // Debug log
      
      const notificationsData = safeGetNotifications(response);
      console.log('Processed Notifications:', notificationsData); // Debug log
      
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      // Update local state to remove the read notification
      setNotifications(prev => prev.filter(notif => safeGetNotificationId(notif) !== notificationId));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications([]);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const formatTime = (createdAt) => {
    if (!createdAt) return 'Just now';
    
    try {
      const date = new Date(createdAt);
      if (isNaN(date.getTime())) return 'Just now';
      
      const now = new Date();
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInHours < 24) return `${diffInHours}h ago`;
      if (diffInDays < 7) return `${diffInDays}d ago`;
      
      return date.toLocaleDateString();
    } catch (error) {
      return 'Just now';
    }
  };

  const getNotificationIcon = (type) => {
    const baseClasses = "h-4 w-4 rounded-full";
    
    switch (type) {
      case 'success':
        return <div className={`${baseClasses} bg-green-500`}></div>;
      case 'warning':
        return <div className={`${baseClasses} bg-yellow-500`}></div>;
      case 'error':
        return <div className={`${baseClasses} bg-red-500`}></div>;
      case 'info':
      default:
        return <div className={`${baseClasses} bg-blue-500`}></div>;
    }
  };

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
              <h2 id="notification-heading" className="font-semibold">
                Notifications
                {notifications.length > 0 && (
                  <span className="ml-2 bg-white text-[#059669] text-xs px-1.5 py-0.5 rounded-full">
                    {notifications.length}
                  </span>
                )}
              </h2>
            </div>
            <div className="flex items-center gap-1">
              {notifications.length > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="p-1 rounded-full hover:bg-white/20 transition"
                  aria-label="Mark all as read"
                  title="Mark all as read"
                >
                  <Check size={16} className="text-white" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-white/20 transition"
                aria-label="Close notifications"
              >
                <X size={18} className="text-white" />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              </div>
            ) : notifications.length > 0 ? (
              <ul>
                {notifications.map((notification, index) => {
                  const id = safeGetNotificationId(notification);
                  const title = safeGetNotificationTitle(notification);
                  const message = safeGetNotificationMessage(notification);
                  const type = safeGetNotificationType(notification);
                  const createdAt = safeGetNotificationCreatedAt(notification);

                  return (
                    <li
                      key={id}
                      className={`p-3 transition-colors cursor-pointer group ${
                        index < notifications.length - 1 ? 'border-b border-gray-100' : ''
                      } hover:bg-green-50`}
                      onClick={() => markAsRead(id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-800 truncate">
                            {title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                            {message}
                          </p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-[11px] text-gray-400 capitalize">
                              {type}
                            </span>
                            <span className="text-[11px] text-gray-400">
                              {formatTime(createdAt)}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-green-200 transition-all"
                          aria-label="Mark as read"
                        >
                          <Check size={14} className="text-green-600" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="p-6 text-center text-gray-500 flex flex-col items-center gap-2">
                <Inbox size={30} className="text-gray-400" />
                <p className="text-sm">No new notifications</p>
                <p className="text-xs text-gray-400">You're all caught up!</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-gray-50 border-t border-gray-200 text-center rounded-b-xl">
            <a
              href="/notifications"
              className="text-sm font-medium text-[#059669] hover:underline hover:text-[#047857]"
              onClick={(e) => {
                e.preventDefault();
                onClose();
                // Navigate to notifications page - you might want to use your router here
                console.log('Navigate to notifications page');
              }}
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