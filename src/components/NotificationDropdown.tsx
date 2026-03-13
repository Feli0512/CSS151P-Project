import React, { useEffect, useState, useRef } from 'react';
import { Notification } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
  PackageIcon,
  CalendarIcon,
  CheckIcon,
  BellRingIcon } from
'lucide-react';
interface NotificationDropdownProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
}
export function NotificationDropdown({
  notifications,
  onMarkRead,
  onClearAll
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node))
      {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'borrow_approved':
      case 'return_success':
        return (
          <CheckCircleIcon className="w-8 h-8 p-1.5 bg-green-100 text-green-600 rounded-full" />);

      case 'borrow_rejected':
        return (
          <XCircleIcon className="w-8 h-8 p-1.5 bg-red-100 text-red-600 rounded-full" />);

      case 'new_borrow_request':
        return (
          <PackageIcon className="w-8 h-8 p-1.5 bg-orange-100 text-orange-600 rounded-full" />);

      case 'new_reservation':
        return (
          <CalendarIcon className="w-8 h-8 p-1.5 bg-blue-100 text-blue-600 rounded-full" />);

      default:
        return (
          <BellIcon className="w-8 h-8 p-1.5 bg-gray-100 text-gray-600 rounded-full" />);

    }
  };
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors rounded-full hover:bg-gray-100"
        aria-label="Notifications">
        
        {unreadCount > 0 ?
        <>
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-[#C8102E] rounded-full ring-2 ring-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
            <BellRingIcon className="h-6 w-6 text-gray-700" />
          </> :

        <BellIcon className="h-6 w-6" />
        }
      </button>

      <AnimatePresence>
        {isOpen &&
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
            scale: 0.95
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1
          }}
          exit={{
            opacity: 0,
            y: 10,
            scale: 0.95
          }}
          transition={{
            duration: 0.2
          }}
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
          
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {notifications.length > 0 &&
            <button
              onClick={onClearAll}
              className="text-xs font-medium text-gray-500 hover:text-[#C8102E] transition-colors">
              
                  Clear All
                </button>
            }
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length > 0 ?
            <div className="divide-y divide-gray-50">
                  {notifications.map((notification) =>
              <div
                key={notification.id}
                className={`p-4 flex gap-3 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50/30' : ''}`}
                onClick={() =>
                !notification.read && onMarkRead(notification.id)
                }>
                
                      <div className="flex-shrink-0 mt-0.5">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                    className={`text-sm ${!notification.read ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                    
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                      {!notification.read &&
                <div className="flex-shrink-0 flex items-center">
                          <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkRead(notification.id);
                    }}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                    title="Mark as read">
                    
                            <CheckIcon className="w-4 h-4" />
                          </button>
                        </div>
                }
                    </div>
              )}
                </div> :

            <div className="px-4 py-8 text-center flex flex-col items-center">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                    <BellIcon className="w-6 h-6 text-gray-300" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    No notifications
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    You're all caught up!
                  </p>
                </div>
            }
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}