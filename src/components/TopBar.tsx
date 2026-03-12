import { PageState, User } from '../types';
import { BellIcon, SearchIcon } from 'lucide-react';
interface TopBarProps {
  currentPage: PageState;
  user: User;
}
export function TopBar({ currentPage, user }: TopBarProps) {
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
      default:
        return 'Lab Bird';
    }
  };
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
      <h2 className="text-xl font-semibold text-gray-800">{getPageTitle()}</h2>

      <div className="flex items-center space-x-6">
        {/* Search Bar (Visual only) */}
        <div className="relative hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#C8102E] focus:border-[#C8102E] sm:text-sm transition duration-150 ease-in-out"
            placeholder="Search equipment..." />

        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none transition-colors">
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-[#C8102E] ring-2 ring-white"></span>
          <BellIcon className="h-6 w-6" />
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-3 border-l border-gray-200 pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-700">{user.name}</p>
            <p className="text-xs text-gray-500">Student</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#1B2A4A] flex items-center justify-center text-white font-medium text-sm">
            {user.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>);

}