import React, { useState } from 'react';
import { PageState, User, Notification } from '../types';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
interface LayoutProps {
  children: React.ReactNode;
  currentPage: PageState;
  onNavigate: (page: PageState) => void;
  onLogout: () => void;
  user: User;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  notifications: Notification[];
  onMarkNotificationRead: (id: string) => void;
  onClearAllNotifications: () => void;
}
export function Layout({
  children,
  currentPage,
  onNavigate,
  onLogout,
  user,
  searchQuery,
  onSearchChange,
  notifications,
  onMarkNotificationRead,
  onClearAllNotifications
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleNavigate = (page: PageState) => {
    onNavigate(page);
    setSidebarOpen(false); // Close sidebar on mobile after navigation
  };
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen &&
      <div
        className="fixed inset-0 bg-black/50 z-20 lg:hidden"
        onClick={() => setSidebarOpen(false)} />

      }
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={onLogout}
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen w-full">
        <TopBar
          currentPage={currentPage}
          user={user}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          notifications={notifications}
          onMarkNotificationRead={onMarkNotificationRead}
          onClearAllNotifications={onClearAllNotifications}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full max-w-[100vw] lg:max-w-none">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>);

}