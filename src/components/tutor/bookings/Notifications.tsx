"use client";

import { useState, useEffect } from 'react';
import tutorBookingService, { NotificationItem, NotificationType } from '@/services/tutorBooking.service';
import { useRouter } from 'next/navigation';

export default function TutorNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const result = await tutorBookingService.getTutorNotifications();
      
      if (result.success && result.data) {
        setNotifications(result.data);
        setUnreadCount(result.data.filter(n => !n.isRead).length);
      }
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const result = await tutorBookingService.markNotificationAsRead(notificationId);
      if (result.success) {
        setNotifications(prev => prev.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch {
      // Silent fail
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const result = await tutorBookingService.markAllNotificationsAsRead();
      if (result.success) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch {
      // Silent fail
    }
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }

    if (notification.bookingId) {
      router.push(`/dashboard/tutor/bookings?highlight=${notification.bookingId}`);
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.BOOKING: return '📅';
      case NotificationType.REVIEW: return '⭐';
      case NotificationType.PAYMENT: return '💰';
      case NotificationType.SYSTEM: return '⚙️';
      case NotificationType.REMINDER: return '⏰';
      default: return '🔔';
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.BOOKING: return 'bg-blue-100 text-blue-800';
      case NotificationType.REVIEW: return 'bg-yellow-100 text-yellow-800';
      case NotificationType.PAYMENT: return 'bg-green-100 text-green-800';
      case NotificationType.SYSTEM: return 'bg-gray-100 text-gray-800';
      case NotificationType.REMINDER: return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-16 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔕</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Notifications</h3>
        <p className="text-gray-500">You're all caught up!</p>
        <p className="text-sm text-gray-400 mt-2">
          New booking requests and updates will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-gray-600">
            {unreadCount > 0 ? (
              <span className="text-red-600 font-medium">{unreadCount} unread</span>
            ) : (
              "All caught up"
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchNotifications}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => handleNotificationClick(notification)}
            className={`p-4 rounded-lg cursor-pointer transition-all hover:shadow-md ${
              notification.isRead 
                ? 'bg-white border border-gray-200 hover:bg-gray-50' 
                : 'bg-blue-50 border border-blue-200 hover:bg-blue-100'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                <span className="text-xl">{getNotificationIcon(notification.type)}</span>
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className={`font-medium ${
                      notification.isRead ? 'text-gray-700' : 'text-gray-900'
                    }`}>
                      {notification.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatTime(notification.createdAt)}
                    </span>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-3">
                  {!notification.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notification.id);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Mark as read
                    </button>
                  )}
                  {notification.bookingId && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/dashboard/tutor/bookings?bookingId=${notification.bookingId}`);
                      }}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      View Booking →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}