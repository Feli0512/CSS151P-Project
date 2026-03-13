
import { PageState, User } from '../types';
import {
  BirdIcon,
  LayoutDashboardIcon,
  FlaskConicalIcon,
  AtomIcon,
  MonitorIcon,
  ArrowLeftRightIcon,
  CalendarIcon,
  LogOutIcon,
  ClipboardListIcon,
  PackageIcon,
  HistoryIcon,
  XIcon,
  UsersIcon,
  ShieldAlertIcon } from
'lucide-react';
import { motion } from 'framer-motion';
interface SidebarProps {
  currentPage: PageState;
  onNavigate: (page: PageState) => void;
  onLogout: () => void;
  user: User;
  isOpen?: boolean;
  onClose?: () => void;
}
export function Sidebar({
  currentPage,
  onNavigate,
  onLogout,
  user,
  isOpen = false,
  onClose
}: SidebarProps) {
  const studentNavItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboardIcon
  },
  {
    id: 'chemistry',
    label: 'Chemistry Lab',
    icon: FlaskConicalIcon
  },
  {
    id: 'physics',
    label: 'Physics Lab',
    icon: AtomIcon
  },
  {
    id: 'soit',
    label: 'SOIT Equipment',
    icon: MonitorIcon
  },
  {
    id: 'borrow-return',
    label: 'Borrow / Return',
    icon: ArrowLeftRightIcon
  },
  {
    id: 'history',
    label: 'View History',
    icon: HistoryIcon
  },
  {
    id: 'policy',
    label: 'Policy & Pricing',
    icon: ShieldAlertIcon
  }];

  const adminNavItems = [
  {
    id: 'admin-dashboard',
    label: 'Overview',
    icon: LayoutDashboardIcon
  },
  {
    id: 'admin-requests',
    label: 'Borrow Requests',
    icon: ClipboardListIcon
  },
  {
    id: 'admin-returns',
    label: 'Return History',
    icon: HistoryIcon
  },
  {
    id: 'admin-reservations',
    label: 'Reservations',
    icon: CalendarIcon
  },
  {
    id: 'admin-equipment',
    label: 'Manage Equipment',
    icon: PackageIcon
  },
  {
    id: 'admin-users',
    label: 'Manage Users',
    icon: UsersIcon
  }];

  const studentSecondaryItems = [
  {
    id: 'reservation',
    label: 'Make Reservation',
    icon: CalendarIcon
  },
  {
    id: 'policy',
    label: 'Equipment Policy',
    icon: ShieldAlertIcon
  }];

  const navItems = user.role === 'admin' ? adminNavItems : studentNavItems;
  return (
    <div
      className={`w-64 bg-[#1B2A4A] text-white h-screen flex flex-col fixed left-0 top-0 z-30 shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      
      {/* Logo Area */}
      <div className="p-6 flex items-center justify-between border-b border-[#2A3B5E]">
        <div className="flex items-center space-x-3">
          <div className="bg-[#C8102E] p-2 rounded-lg">
            <BirdIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Lab Bird</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">
              {user.role === 'admin' ? 'Admin Portal' : 'Mapúa University'}
            </p>
          </div>
        </div>
        {onClose &&
        <button
          onClick={onClose}
          className="lg:hidden text-gray-400 hover:text-white">
          
            <XIcon className="w-6 h-6" />
          </button>
        }
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 overflow-y-auto">
        <div className="px-4 mb-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
            Main Menu
          </p>
        </div>
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id as PageState)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative ${isActive ? 'bg-[#2A3B5E] text-white font-medium' : 'text-gray-300 hover:bg-[#2A3B5E]/50 hover:text-white'}`}>
                  
                  {isActive &&
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#C8102E] rounded-r-full"
                    initial={false}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 30
                    }} />

                  }
                  <Icon
                    className={`w-5 h-5 ${isActive ? 'text-[#C8102E]' : 'text-gray-400'}`} />
                  
                  <span>{item.label}</span>
                </button>
              </li>);

          })}

          {user.role === 'student' &&
          <>
              <li className="pt-4 mt-4 border-t border-[#2A3B5E]/50">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
                  More
                </p>
              </li>
              {studentSecondaryItems.map((item) => {
              const isActive = currentPage === item.id;
              const Icon = item.icon;
              return (
                <li key={item.id}>
                    <button
                    onClick={() => onNavigate(item.id as PageState)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative ${isActive ? 'bg-[#2A3B5E] text-white font-medium' : 'text-gray-300 hover:bg-[#2A3B5E]/50 hover:text-white'}`}>
                    
                      {isActive &&
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#C8102E] rounded-r-full"
                      initial={false}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30
                      }} />

                    }
                      <Icon
                      className={`w-5 h-5 ${isActive ? 'text-[#C8102E]' : 'text-gray-400'}`} />
                    
                      <span>{item.label}</span>
                    </button>
                  </li>);

            })}
            </>
          }
        </ul>
      </nav>

      {/* User Area */}
      <div className="p-4 border-t border-[#2A3B5E] bg-[#15223E]">
        <div className="flex items-center space-x-3 mb-4 px-2">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${user.role === 'admin' ? 'bg-blue-600' : 'bg-[#C8102E]'}`}>
            
            {user.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user.role === 'admin' ? 'Administrator' : user.studentId}
            </p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm">
          
          <LogOutIcon className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>);

}