// src/pages/Admin/NotificationManagement.jsx

import React, { useState, useEffect } from 'react';
import { notificationService } from "../../services/announcementService";
import { Edit, Trash2, Bell, Eye, EyeOff, AlertCircle } from 'lucide-react';

const Announcements = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formState, setFormState] = useState({
    id: null,
    title: '',
    message: '',
    type: 'info',
    isActive: true
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Safe data access helper functions
  const safeGetNotifications = (response) => {
    if (!response) return [];
    if (Array.isArray(response.data)) return response.data;
    if (Array.isArray(response.data?.data)) return response.data.data;
    if (Array.isArray(response.data?.notifications)) return response.data.notifications;
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

  const safeGetNotificationStatus = (notification) => {
    return notification?.isActive !== undefined ? notification.isActive : 
           notification?.active !== undefined ? notification.active : true;
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await notificationService.getAllNotifications();
      console.log('API Response:', response); // Debug log
      
      const notificationsData = safeGetNotifications(response);
      setNotifications(notificationsData);
      
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to fetch notifications. Please try again.');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState(prevState => ({ 
      ...prevState, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const resetForm = () => {
    setIsEditing(false);
    setFormState({ 
      id: null, 
      title: '', 
      message: '', 
      type: 'info',
      isActive: true 
    });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formState.title.trim() || !formState.message.trim()) {
      setError('Please fill in both title and message.');
      return;
    }

    try {
      setError(null);
      if (isEditing) {
        await notificationService.updateNotification(formState.id, formState);
        alert('Notification updated successfully!');
      } else {
        await notificationService.createNotification(formState);
        alert('New notification added successfully!');
      }
      
      resetForm();
      fetchNotifications();
    } catch (error) {
      console.error('Error saving notification:', error);
      setError('Failed to save notification. Please try again.');
    }
  };

  const handleEdit = (notification) => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsEditing(true);
      setFormState({
        id: safeGetNotificationId(notification),
        title: safeGetNotificationTitle(notification),
        message: safeGetNotificationMessage(notification),
        type: safeGetNotificationType(notification),
        isActive: safeGetNotificationStatus(notification)
      });
      setError(null);
    } catch (err) {
      console.error('Error editing notification:', err);
      setError('Error loading notification data.');
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      setError('Invalid notification ID');
      return;
    }

    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        setError(null);
        await notificationService.deleteNotification(id);
        alert('Notification deleted successfully!');
        fetchNotifications();
        if (isEditing && formState.id === id) {
          resetForm();
        }
      } catch (error) {
        console.error('Error deleting notification:', error);
        setError('Failed to delete notification. Please try again.');
      }
    }
  };

  const toggleNotificationStatus = async (id, currentStatus) => {
    if (!id) {
      setError('Invalid notification ID');
      return;
    }

    try {
      setError(null);
      await notificationService.toggleNotificationStatus(id);
      alert(`Notification ${currentStatus ? 'deactivated' : 'activated'} successfully!`);
      fetchNotifications();
    } catch (error) {
      console.error('Error toggling notification status:', error);
      setError('Failed to update notification status. Please try again.');
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      info: 'bg-blue-100 text-blue-800 border-blue-200',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      success: 'bg-green-100 text-green-800 border-green-200',
      error: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[type] || colors.info;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-green-100 rounded-xl">
          <Bell className="text-green-600" size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notification Management</h1>
          <p className="text-gray-600 mt-1">Create and manage system announcements</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">
              {isEditing ? 'Edit Notification' : 'Create New Notification'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formState.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="e.g., System Maintenance"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    name="type"
                    id="type"
                    value={formState.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <option value="info">Information</option>
                    <option value="warning">Warning</option>
                    <option value="success">Success</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows="4"
                    value={formState.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                    placeholder="Detailed notification message..."
                    required
                  ></textarea>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    name="isActive"
                    id="isActive"
                    checked={formState.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-3 block text-sm font-medium text-gray-700">
                    Active Notification
                  </label>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
                >
                  {isEditing ? 'Update Notification' : 'Create Notification'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Notifications List Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  Current Notifications
                </h2>
                <div className="flex items-center gap-2">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {notifications.length} total
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {notifications.filter(n => safeGetNotificationStatus(n)).length} active
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Bell className="text-gray-400" size={24} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    Create your first notification to start communicating with users.
                  </p>
                </div>
              ) : (
                <>
                  {/* Mobile Card View */}
                  <div className="space-y-4 md:hidden">
                    {notifications.map((notification) => {
                      const id = safeGetNotificationId(notification);
                      const title = safeGetNotificationTitle(notification);
                      const message = safeGetNotificationMessage(notification);
                      const type = safeGetNotificationType(notification);
                      const isActive = safeGetNotificationStatus(notification);

                      return (
                        <div 
                          key={id} 
                          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                                {title}
                              </h3>
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-1 text-xs rounded-full border ${getTypeColor(type)}`}>
                                  {type}
                                </span>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  isActive 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {isActive ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {message}
                          </p>
                          
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => toggleNotificationStatus(id, isActive)}
                                className={`p-2 rounded-lg ${
                                  isActive 
                                    ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' 
                                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                                } transition-colors`}
                              >
                                {isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                              <button 
                                onClick={() => handleEdit(notification)} 
                                className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => handleDelete(id)} 
                                className="p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-hidden rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title & Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Message
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {notifications.map((notification) => {
                          const id = safeGetNotificationId(notification);
                          const title = safeGetNotificationTitle(notification);
                          const message = safeGetNotificationMessage(notification);
                          const type = safeGetNotificationType(notification);
                          const isActive = safeGetNotificationStatus(notification);

                          return (
                            <tr key={id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                                  isActive 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {isActive ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium text-gray-900">
                                    {title}
                                  </span>
                                  <span className={`mt-1 px-2 py-1 text-xs rounded-full border w-fit ${getTypeColor(type)}`}>
                                    {type}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-sm text-gray-600 line-clamp-2 max-w-md">
                                  {message}
                                </p>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center justify-center gap-2">
                                  <button 
                                    onClick={() => toggleNotificationStatus(id, isActive)}
                                    className={`p-2 rounded-lg transition-colors ${
                                      isActive 
                                        ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' 
                                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                                    }`}
                                    title={isActive ? 'Deactivate' : 'Activate'}
                                  >
                                    {isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                                  </button>
                                  <button 
                                    onClick={() => handleEdit(notification)} 
                                    className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                                    title="Edit"
                                  >
                                    <Edit size={18} />
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(id)} 
                                    className="p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcements;