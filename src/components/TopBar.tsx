import React from 'react';
import { PageState, User, Notification } from '../types';
import { BellIcon, SearchIcon, XIcon, MenuIcon } from 'lucide-react';
import { NotificationDropdown } from './NotificationDropdown';
interface TopBarProps {
  currentPage: PageState;
  user: User;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  notifications: Notification[];
  onMarkNotificationRead: (id: string) => void;
  onClearAllNotifications: () => void;
  onToggleSidebar?: () => void;
}
export function TopBar({
  currentPage,
  user,
  searchQuery,
  onSearchChange,
  notifications,
  onMarkNotificationRead,
  onClearAllNotifications,
  onToggleSidebar
}: TopBarProps) {
  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard':
        return 'Dashboard';
      case 'chemistry':
        return 'Chemistry Laboratory';
      case 'physics':
        return 'Physics Laboratory';
      case 'soit':
        return 'SOIT Equipment';
      case 'borrow-return':
        return 'Borrow & Return';
      case 'reservation':
        return 'Equipment Reservation';
      case 'history':
        return 'Transaction History';
      case 'policy':
        return 'Equipment Policy & Pricing';
      case 'admin-dashboard':
        return 'Admin Overview';
      case 'admin-equipment':
        return 'Equipment Management';
      case 'admin-requests':
        return 'Borrow Requests';
      case 'admin-reservations':
        return 'Reservations';
      default:
        return 'Lab Bird';
    }
  };
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10 w-full">
      <div className="flex items-center">
        {onToggleSidebar &&
        <button
          onClick={onToggleSidebar}
          className="mr-4 lg:hidden text-gray-500 hover:text-gray-900 focus:outline-none">
          
            <MenuIcon className="h-6 w-6" />
          </button>
        }
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 truncate max-w-[150px] sm:max-w-none">
          {getPageTitle()}
        </h2>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-6">
        <div className="relative hidden md:block group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-4 w-4 text-gray-400 group-focus-within:text-[#C8102E] transition-colors" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-48 lg:w-64 pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#C8102E] focus:border-[#C8102E] sm:text-sm transition duration-150 ease-in-out"
            placeholder="Search..." />
          
          {searchQuery &&
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none">
            
              <XIcon className="h-4 w-4" />
            </button>
          }
        </div>

        <NotificationDropdown
          notifications={notifications}
          onMarkRead={onMarkNotificationRead}
          onClearAll={onClearAllNotifications} />
        

        <div className="flex items-center space-x-3 border-l border-gray-200 pl-4 sm:pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-700 truncate max-w-[120px]">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
          </div>
          <div
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0 ${user.role === 'admin' ? 'bg-blue-600' : 'bg-[#1B2A4A]'}`}>
            
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>);

}