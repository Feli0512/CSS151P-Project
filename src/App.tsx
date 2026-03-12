import { useState } from 'react';
import { PageState, Equipment, User } from './types';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { DepartmentPage } from './pages/DepartmentPage';
import { BorrowReturnPage } from './pages/BorrowReturnPage';
import { Layout } from './components/Layout';
export function App() {
  const [currentPage, setCurrentPage] = useState<PageState>('login');
  const [preselectedEquipment, setPreselectedEquipment] =
  useState<Equipment | null>(null);
  // Store the authenticated user
  const [user, setUser] = useState<User | null>(null);
  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };
  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
    setPreselectedEquipment(null);
  };
  const handleNavigate = (page: PageState) => {
    setCurrentPage(page);
    if (page !== 'borrow-return') {
      setPreselectedEquipment(null);
    }
  };
  const handleBorrowEquipment = (equipment: Equipment) => {
    setPreselectedEquipment(equipment);
    setCurrentPage('borrow-return');
  };
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return <DashboardPage onNavigate={handleNavigate} user={user!} />;
      case 'chemistry':
        return (
          <DepartmentPage
            department="Chemistry"
            onBorrow={handleBorrowEquipment} />);


      case 'physics':
        return (
          <DepartmentPage
            department="Physics"
            onBorrow={handleBorrowEquipment} />);


      case 'soit':
        return (
          <DepartmentPage department="SOIT" onBorrow={handleBorrowEquipment} />);

      case 'borrow-return':
        return <BorrowReturnPage preselectedEquipment={preselectedEquipment} user={user} />;
      default:
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return <DashboardPage onNavigate={handleNavigate} user={user!} />;
    }
  };
  // If not logged in, show login page
  if (currentPage === 'login' || !user) {
    return <LoginPage onLogin={handleLogin} />;
  }
  // Otherwise, show the layout with the active page
  return (
    <Layout
      currentPage={currentPage}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
      user={user}>

      {renderPage()}
    </Layout>);

}