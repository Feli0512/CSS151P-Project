import React from 'react';
import { PageState, User } from '../types';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
interface LayoutProps {
  children: React.ReactNode;
  currentPage: PageState;
  onNavigate: (page: PageState) => void;
  onLogout: () => void;
  user: User;
}
export function Layout({
  children,
  currentPage,
  onNavigate,
  onLogout,
  user
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
        onLogout={onLogout}
        user={user} />


      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <TopBar currentPage={currentPage} user={user} />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>);

}