import React, { useEffect, useState } from 'react';
import {
  PageState,
  Equipment,
  User,
  Transaction,
  Reservation,
  Notification,
  AdminUser,
  RegisteredStudent } from
'./types';
import { equipmentData } from './data/mockData';
import { LoginPage } from './pages/LoginPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { DepartmentPage } from './pages/DepartmentPage';
import { BorrowReturnPage } from './pages/BorrowReturnPage';
import { ReservationFormPage } from './pages/ReservationFormPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminEquipmentPage } from './pages/AdminEquipmentPage';
import { AdminRequestsPage } from './pages/AdminRequestsPage';
import { AdminReservationsPage } from './pages/AdminReservationsPage';
import { AdminReturnsPage } from './pages/AdminReturnsPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { HistoryPage } from './pages/HistoryPage';
import { PolicyPage } from './pages/PolicyPage';
import { Layout } from './components/Layout';
// --- localStorage helpers ---
const STORAGE_KEYS = {
  user: 'labbird_user',
  page: 'labbird_page',
  transactions: 'labbird_transactions',
  equipment: 'labbird_equipment',
  reservations: 'labbird_reservations',
  notifications: 'labbird_notifications',
  adminUsers: 'labbird_admin_users',
  registeredStudents: 'labbird_registered_students'
};
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored !== null) {
      return JSON.parse(stored) as T;
    }
  } catch {

    // Corrupted data — ignore and use fallback
  }return fallback;
}
function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {

    // Storage full or unavailable — silently fail
  }}
function clearAllStorage(): void {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  } catch {

    // Silently fail
  }}
// Default super admin for initial setup
const defaultAdminUsers: AdminUser[] = [
{
  id: 'ADMIN-001',
  name: 'Super Administrator',
  email: 'admin@gmail.com',
  employeeId: 'SYS-001',
  password: 'admin123',
  role: 'admin',
  status: 'approved',
  requestedAt: new Date().toISOString()
}];

export function App() {
  // Restore state from localStorage on mount
  const [user, setUser] = useState<User | null>(() =>
  loadFromStorage<User | null>(STORAGE_KEYS.user, null)
  );
  const [currentPage, setCurrentPage] = useState<PageState>(() => {
    const savedUser = loadFromStorage<User | null>(STORAGE_KEYS.user, null);
    if (!savedUser) return 'login';
    return loadFromStorage<PageState>(
      STORAGE_KEYS.page,
      savedUser.role === 'admin' ? 'admin-dashboard' : 'dashboard'
    );
  });
  const [preselectedEquipment, setPreselectedEquipment] =
  useState<Equipment | null>(null);
  const [equipment, setEquipment] = useState<Equipment[]>(() =>
  loadFromStorage<Equipment[]>(STORAGE_KEYS.equipment, equipmentData)
  );
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
  loadFromStorage<Transaction[]>(STORAGE_KEYS.transactions, [])
  );
  const [reservations, setReservations] = useState<Reservation[]>(() =>
  loadFromStorage<Reservation[]>(STORAGE_KEYS.reservations, [])
  );
  const [notifications, setNotifications] = useState<Notification[]>(() =>
  loadFromStorage<Notification[]>(STORAGE_KEYS.notifications, [])
  );
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() =>
  loadFromStorage<AdminUser[]>(STORAGE_KEYS.adminUsers, defaultAdminUsers)
  );
  const [registeredStudents, setRegisteredStudents] = useState<
    RegisteredStudent[]>(
    () =>
    loadFromStorage<RegisteredStudent[]>(STORAGE_KEYS.registeredStudents, [])
  );
  const [searchQuery, setSearchQuery] = useState('');
  // Persist state to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      saveToStorage(STORAGE_KEYS.user, user);
    }
  }, [user]);
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.page, currentPage);
  }, [currentPage]);
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.transactions, transactions);
  }, [transactions]);
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.equipment, equipment);
  }, [equipment]);
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.reservations, reservations);
  }, [reservations]);
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.notifications, notifications);
  }, [notifications]);
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.adminUsers, adminUsers);
  }, [adminUsers]);
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.registeredStudents, registeredStudents);
  }, [registeredStudents]);
  const handleStudentSignup = (student: RegisteredStudent) => {
    setRegisteredStudents((prev) => [...prev, student]);
  };
  const addNotification = (
  notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) =>
  {
    const newNotification: Notification = {
      ...notification,
      id: `NOTIF-${Math.floor(Math.random() * 10000)}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };
  const handleMarkNotificationRead = (id: string) => {
    setNotifications(
      notifications.map((n) =>
      n.id === id ?
      {
        ...n,
        read: true
      } :
      n
      )
    );
  };
  const handleClearAllNotifications = () => {
    setNotifications(
      notifications.filter((n) => {
        if (n.forRole !== user?.role) return true;
        if (n.forUserId && n.forUserId !== user?.studentId) return true;
        return false;
      })
    );
  };
  const handleLogin = (userData: User) => {
    setUser(userData);
    const landingPage =
    userData.role === 'admin' ? 'admin-dashboard' : 'dashboard';
    setCurrentPage(landingPage);
  };
  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
    setPreselectedEquipment(null);
    setSearchQuery('');
    clearAllStorage();
  };
  const handleNavigate = (page: PageState) => {
    setCurrentPage(page);
    setSearchQuery('');
    if (page !== 'borrow-return') {
      setPreselectedEquipment(null);
    }
  };
  const handleBorrowEquipment = (eq: Equipment) => {
    setPreselectedEquipment(eq);
    setCurrentPage('borrow-return');
  };
  // --- Student Actions ---
  const handleBorrowSubmit = (
  newTransaction: Omit<Transaction, 'id' | 'status'>) =>
  {
    const transaction: Transaction = {
      ...newTransaction,
      id: `TRX-${Math.floor(Math.random() * 10000)}`,
      status: 'Pending'
    };
    setTransactions([transaction, ...transactions]);
    addNotification({
      message: `New borrow request from ${user?.name} for ${transaction.equipmentName}`,
      type: 'new_borrow_request',
      forRole: 'admin',
      relatedId: transaction.id
    });
  };
  const handleReturnSubmit = (transactionId: string) => {
    setTransactions(
      transactions.map((t) =>
      t.id === transactionId ?
      {
        ...t,
        status: 'Completed',
        returnedAt: new Date().toISOString()
      } :
      t
      )
    );
    const transaction = transactions.find((t) => t.id === transactionId);
    if (transaction) {
      setEquipment(
        equipment.map((eq) => {
          if (eq.id === transaction.equipmentId) {
            const newQty = eq.quantityAvailable + transaction.quantity;
            return {
              ...eq,
              quantityAvailable: newQty,
              status: newQty > 0 ? 'Available' : eq.status
            };
          }
          return eq;
        })
      );
      addNotification({
        message: `Successfully returned ${transaction.equipmentName}`,
        type: 'return_success',
        forRole: 'student',
        forUserId: transaction.studentId,
        relatedId: transaction.id
      });
    }
  };
  const handleReservationSubmit = (
  newReservation: Omit<Reservation, 'id' | 'status' | 'submittedAt'>) =>
  {
    const reservation: Reservation = {
      ...newReservation,
      id: `RES-${Math.floor(Math.random() * 10000)}`,
      status: 'Pending',
      submittedAt: new Date().toISOString()
    };
    setReservations([reservation, ...reservations]);
    addNotification({
      message: `New reservation request from ${reservation.name} for ${reservation.equipment}`,
      type: 'new_reservation',
      forRole: 'admin',
      relatedId: reservation.id
    });
  };
  // --- Admin Actions ---
  const handleAddEquipment = (newEq: Equipment) => {
    setEquipment([newEq, ...equipment]);
  };
  const handleUpdateEquipment = (updatedEq: Equipment) => {
    setEquipment(
      equipment.map((eq) => eq.id === updatedEq.id ? updatedEq : eq)
    );
  };
  const handleDeleteEquipment = (id: string) => {
    setEquipment(equipment.filter((eq) => eq.id !== id));
  };
  const handleApproveRequest = (transactionId: string) => {
    const transaction = transactions.find((t) => t.id === transactionId);
    if (!transaction) return;
    setTransactions(
      transactions.map((t) =>
      t.id === transactionId ?
      {
        ...t,
        status: 'Approved',
        approvedAt: new Date().toISOString()
      } :
      t
      )
    );
    setEquipment(
      equipment.map((eq) => {
        if (eq.id === transaction.equipmentId) {
          const newQty = Math.max(
            0,
            eq.quantityAvailable - transaction.quantity
          );
          return {
            ...eq,
            quantityAvailable: newQty,
            status: newQty === 0 ? 'Borrowed' : eq.status
          };
        }
        return eq;
      })
    );
    addNotification({
      message: `Your borrow request for ${transaction.equipmentName} was approved`,
      type: 'borrow_approved',
      forRole: 'student',
      forUserId: transaction.studentId,
      relatedId: transaction.id
    });
  };
  const handleRejectRequest = (transactionId: string) => {
    const transaction = transactions.find((t) => t.id === transactionId);
    if (!transaction) return;
    setTransactions(
      transactions.map((t) =>
      t.id === transactionId ?
      {
        ...t,
        status: 'Rejected'
      } :
      t
      )
    );
    addNotification({
      message: `Your borrow request for ${transaction.equipmentName} was rejected`,
      type: 'borrow_rejected',
      forRole: 'student',
      forUserId: transaction.studentId,
      relatedId: transaction.id
    });
  };
  const handleApproveReservation = (id: string) => {
    setReservations(
      reservations.map((r) =>
      r.id === id ?
      {
        ...r,
        status: 'Approved'
      } :
      r
      )
    );
  };
  const handleRejectReservation = (id: string) => {
    setReservations(
      reservations.map((r) =>
      r.id === id ?
      {
        ...r,
        status: 'Rejected'
      } :
      r
      )
    );
  };
  const handleDeleteReservation = (id: string) => {
    setReservations(reservations.filter((r) => r.id !== id));
  };
  // --- Admin User Management ---
  const handleAdminSignupRequest = (
  newAdmin: Omit<AdminUser, 'id' | 'status' | 'requestedAt'>) =>
  {
    const adminUser: AdminUser = {
      ...newAdmin,
      id: `ADM-${Math.floor(Math.random() * 10000)}`,
      status: 'pending',
      requestedAt: new Date().toISOString()
    };
    setAdminUsers([...adminUsers, adminUser]);
    addNotification({
      message: `New admin access request from ${adminUser.name}`,
      type: 'admin_signup_request',
      forRole: 'admin',
      relatedId: adminUser.id
    });
  };
  const handleApproveAdmin = (id: string) => {
    setAdminUsers(
      adminUsers.map((u) =>
      u.id === id ?
      {
        ...u,
        status: 'approved',
        approvedAt: new Date().toISOString(),
        approvedBy: user?.name
      } :
      u
      )
    );
  };
  const handleRejectAdmin = (id: string) => {
    setAdminUsers(
      adminUsers.map((u) =>
      u.id === id ?
      {
        ...u,
        status: 'rejected'
      } :
      u
      )
    );
  };
  const handleRevokeAdmin = (id: string) => {
    setAdminUsers(adminUsers.filter((u) => u.id !== id));
  };
  const renderPage = () => {
    // Admin Routes
    if (user?.role === 'admin') {
      switch (currentPage) {
        case 'admin-dashboard':
          return (
            <AdminDashboardPage
              onNavigate={handleNavigate}
              user={user}
              equipment={equipment}
              transactions={transactions}
              searchQuery={searchQuery} />);


        case 'admin-equipment':
          return (
            <AdminEquipmentPage
              equipment={equipment}
              onAdd={handleAddEquipment}
              onUpdate={handleUpdateEquipment}
              onDelete={handleDeleteEquipment} />);


        case 'admin-requests':
          return (
            <AdminRequestsPage
              transactions={transactions}
              onApprove={handleApproveRequest}
              onReject={handleRejectRequest}
              searchQuery={searchQuery} />);


        case 'admin-reservations':
          return (
            <AdminReservationsPage
              reservations={reservations}
              onApprove={handleApproveReservation}
              onReject={handleRejectReservation}
              onDelete={handleDeleteReservation}
              searchQuery={searchQuery} />);


        case 'admin-returns':
          return (
            <AdminReturnsPage
              transactions={transactions}
              searchQuery={searchQuery} />);


        case 'admin-users':
          return (
            <AdminUsersPage
              adminUsers={adminUsers}
              currentUser={user}
              onApprove={handleApproveAdmin}
              onReject={handleRejectAdmin}
              onRevoke={handleRevokeAdmin} />);


        default:
          return (
            <AdminDashboardPage
              onNavigate={handleNavigate}
              user={user}
              equipment={equipment}
              transactions={transactions}
              searchQuery={searchQuery} />);


      }
    }
    // Student Routes
    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardPage
            onNavigate={handleNavigate}
            user={user!}
            equipment={equipment}
            transactions={transactions}
            searchQuery={searchQuery} />);


      case 'chemistry':
        return (
          <DepartmentPage
            department="Chemistry"
            equipment={equipment.filter((e) =>
            e.name.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            onBorrow={handleBorrowEquipment} />);


      case 'physics':
        return (
          <DepartmentPage
            department="Physics"
            equipment={equipment.filter((e) =>
            e.name.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            onBorrow={handleBorrowEquipment} />);


      case 'soit':
        return (
          <DepartmentPage
            department="SOIT"
            equipment={equipment.filter((e) =>
            e.name.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            onBorrow={handleBorrowEquipment} />);


      case 'borrow-return':
        return (
          <BorrowReturnPage
            preselectedEquipment={preselectedEquipment}
            equipment={equipment}
            transactions={transactions}
            user={user!}
            onBorrowSubmit={handleBorrowSubmit}
            onReturnSubmit={handleReturnSubmit} />);


      case 'reservation':
        return (
          <ReservationFormPage
            user={user!}
            onSubmit={handleReservationSubmit} />);


      case 'history':
        return (
          <HistoryPage
            transactions={transactions}
            user={user!}
            searchQuery={searchQuery} />);


      case 'policy':
        return <PolicyPage equipment={equipment} />;
      default:
        return (
          <DashboardPage
            onNavigate={handleNavigate}
            user={user!}
            equipment={equipment}
            transactions={transactions}
            searchQuery={searchQuery} />);


    }
  };
  if (!user) {
    if (currentPage === 'admin-login') {
      return (
        <AdminLoginPage
          onLogin={handleLogin}
          onNavigateToStudent={() => setCurrentPage('login')}
          onSignupRequest={handleAdminSignupRequest}
          adminUsers={adminUsers} />);


    }
    return (
      <LoginPage
        onLogin={handleLogin}
        onNavigateToAdmin={() => setCurrentPage('admin-login')}
        registeredStudents={registeredStudents}
        onStudentSignup={handleStudentSignup} />);


  }
  // Filter notifications for current user
  const userNotifications = notifications.
  filter((n) => {
    if (n.forRole !== user.role) return false;
    if (n.forUserId && n.forUserId !== user.studentId) return false;
    return true;
  }).
  sort(
    (a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  return (
    <Layout
      currentPage={currentPage}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
      user={user}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      notifications={userNotifications}
      onMarkNotificationRead={handleMarkNotificationRead}
      onClearAllNotifications={handleClearAllNotifications}>
      
      {renderPage()}
    </Layout>);

}