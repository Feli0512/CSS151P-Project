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
  loadFromStorage<Equipment[]>(STORAGE_KEYS.equipment, [])
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

  // helper to fetch the latest admin users list from database
  const loadAdminUsers = async () => {
    try {
      const response = await fetch('/api/admin/list.php');
      const data = await response.json();
      if (data.success) {
        setAdminUsers(
          data.adminUsers.map((u: any) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            employeeId: u.employee_id,
            password: u.password || '', // won't be sent ordinarily
            role: 'admin',
            status: u.status,
            requestedAt: u.requested_at,
            approvedAt: u.approved_at,
            approvedBy: u.approved_by
          }))
        );
      }
    } catch (err) {
      console.error('Failed to load admin users:', err);
    }
  };
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

  // when an admin logs in, refresh the list from server
  useEffect(() => {
    if (user && user.role === 'admin') {
      loadAdminUsers();
    }
  }, [user]);
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.registeredStudents, registeredStudents);
  }, [registeredStudents]);

  // Load equipment from database on app start
  useEffect(() => {
    const loadEquipment = async () => {
      try {
        // Clear cached equipment to force fresh load from API
        localStorage.removeItem(STORAGE_KEYS.equipment);

        const response = await fetch('/api/equipment/list.php');
        const data = await response.json();
        if (data.success && data.equipment.length > 0) {
          // Convert database format to frontend format
          const dbEquipment = data.equipment.map((eq: any) => ({
            id: eq.id,
            name: eq.name,
            department: eq.department,
            status: eq.quantity_available > 0 ? 'Available' : 'Out of Stock',
            quantityAvailable: parseInt(eq.quantity_available),
            totalQuantity: parseInt(eq.total_quantity),
            imageUrl: eq.image_url
          }));
          setEquipment(dbEquipment);
        }
      } catch (error) {
        console.error('Failed to load equipment from API:', error);
      }
    };
    loadEquipment();
  }, []);

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
  const handleLogin = async (userData: User) => {
    setUser(userData);
    const landingPage =
    userData.role === 'admin' ? 'admin-dashboard' : 'dashboard';
    setCurrentPage(landingPage);

    // Fetch user's transactions from database
    if (userData.role === 'student') {
      try {
        const response = await fetch(`/api/transactions/list.php?userType=student&studentId=${userData.studentId}`);
        const data = await response.json();
        if (data.success) {
          // Convert database format to frontend format
          const dbTransactions = data.transactions.map((t: any) => ({
            id: t.id,
            equipmentId: t.equipment_id,
            equipmentName: t.equipment_name,
            department: t.department,
            date: t.date,
            type: t.type,
            status: t.status,
            userName: t.user_name,
            studentId: t.student_id,
            quantity: parseInt(t.quantity),
            expectedReturn: t.expected_return,
            purpose: t.purpose,
            returnedAt: t.returned_at
          }));
          setTransactions(dbTransactions);
        }
      } catch (error) {
        console.error('Failed to load transactions:', error);
        // Fallback to empty transactions if API fails
        setTransactions([]);
      }
    }

    // always load reservations (admin & student can view their own in UI)
    try {
      const resResp = await fetch('/api/reservations/list.php');
      const resData = await resResp.json();
      if (resData.success) {
        const dbReservations = resData.reservations.map((r: any) => ({
          id: r.id,
          name: r.name,
          email: r.email,
          department: r.department,
          equipment: r.equipment,
          dateNeeded: r.date_needed,
          timeNeeded: r.time_needed,
          purpose: r.purpose,
          additionalNotes: r.additional_notes,
          status: r.status,
          submittedAt: r.submitted_at
        }));
        setReservations(dbReservations);
      }
    } catch (error) {
      console.error('Failed to load reservations:', error);
      setReservations([]);
    }
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
  const handleBorrowSubmit = async (
  newTransaction: Omit<Transaction, 'id' | 'status'>) =>
  {
    try {
      const payload = {
        equipmentId: newTransaction.equipmentId,
        studentId: newTransaction.studentId,
        quantity: newTransaction.quantity,
        date: newTransaction.date,
        expectedReturn: newTransaction.expectedReturn,
        purpose: newTransaction.purpose,
      };

      // Debug: ensure all required fields are present
      console.log('Borrow payload', payload);

      const response = await fetch('/api/transactions/borrow.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to submit borrow request');
      }

      // Add the transaction to local state with the ID from the database
      const transaction: Transaction = {
        ...newTransaction,
        id: data.transactionId,
        status: 'Pending'
      };
      setTransactions([transaction, ...transactions]);
      addNotification({
        message: `New borrow request from ${user?.name} for ${transaction.equipmentName}`,
        type: 'new_borrow_request',
        forRole: 'admin',
        relatedId: transaction.id
      });
    } catch (error) {
      console.error('Borrow submission failed:', error);
      throw error; // Re-throw so the UI can show the error
    }
  };
  const handleReturnSubmit = async (transactionId: string) => {
    try {
      const response = await fetch('/api/transactions/return.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId: transactionId,
        }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to process return');
      }

      // Update local transaction state
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
        // Update equipment quantity locally (API already updated it in DB)
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
    } catch (error) {
      console.error('Return submission failed:', error);
      throw error; // Re-throw so the UI can show the error
    }
  };
  const handleReservationSubmit = async (
  newReservation: Omit<Reservation, 'id' | 'status' | 'submittedAt'>) =>
  {
    try {
      const response = await fetch('/api/reservations/submit.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReservation)
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to submit reservation');
      }

      const reservation: Reservation = {
        ...newReservation,
        id: data.reservationId,
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
    } catch (error) {
      console.error('Reservation submission failed:', error);
      throw error;
    }
  };
  // --- Admin Actions ---
  const handleApproveReservation = async (id: string) => {
    try {
      const response = await fetch('/api/reservations/approve.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId: id })
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to approve reservation');
      }
      setReservations(
        reservations.map((r) =>
          r.id === id ? { ...r, status: 'Approved' } : r
        )
      );
      addNotification({
        message: `Your reservation ${id} has been approved`,
        type: 'reservation_update',
        forRole: 'student',
        forUserId: user?.email, // using email to identify
        relatedId: id
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleRejectReservation = async (id: string) => {
    try {
      const response = await fetch('/api/reservations/reject.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId: id })
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to reject reservation');
      }
      setReservations(
        reservations.map((r) =>
          r.id === id ? { ...r, status: 'Rejected' } : r
        )
      );
      addNotification({
        message: `Your reservation ${id} has been rejected`,
        type: 'reservation_update',
        forRole: 'student',
        forUserId: user?.email,
        relatedId: id
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleDeleteReservation = async (id: string) => {
    try {
      const response = await fetch('/api/reservations/delete.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId: id })
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to delete reservation');
      }
      setReservations(reservations.filter((r) => r.id !== id));
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleAddEquipment = async (newEq: Equipment) => {
    try {
      const response = await fetch('/api/equipment/add.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: newEq.id,
          name: newEq.name,
          department: newEq.department,
          status: newEq.status,
          quantity_available: newEq.quantityAvailable,
          total_quantity: newEq.totalQuantity,
          image_url: (newEq as any).imageUrl || null
        })
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to add equipment');
      }
      setEquipment([newEq, ...equipment]);
    } catch (error) {
      console.error('Add equipment failed:', error);
      throw error;
    }
  };
  const handleUpdateEquipment = async (updatedEq: Equipment) => {
    try {
      const response = await fetch('/api/equipment/update.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: updatedEq.id,
          name: updatedEq.name,
          department: updatedEq.department,
          status: updatedEq.status,
          quantity_available: updatedEq.quantityAvailable,
          total_quantity: updatedEq.totalQuantity,
          image_url: (updatedEq as any).imageUrl || null
        })
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to update equipment');
      }
      setEquipment(
        equipment.map((eq) => (eq.id === updatedEq.id ? updatedEq : eq))
      );
    } catch (error) {
      console.error('Update equipment failed:', error);
      throw error;
    }
  };
  const handleDeleteEquipment = async (id: string) => {
    try {
      const response = await fetch('/api/equipment/delete.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to delete equipment');
      }
      setEquipment(equipment.filter((eq) => eq.id !== id));
    } catch (error) {
      console.error('Delete equipment failed:', error);
      throw error;
    }
  };
  const handleApproveRequest = async (transactionId: string) => {
    try {
      const response = await fetch('/api/transactions/approve.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId: transactionId,
        }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to approve request');
      }

      // Update local transaction state
      const transaction = transactions.find((t) => t.id === transactionId);
      if (transaction) {
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
        // Update equipment quantity locally (API already updated it)
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
                status: newQty > 0 ? 'Available' : 'Out of Stock'
              };
            }
            return eq;
          })
        );
        addNotification({
          message: `Borrow request approved for ${transaction.userName}`,
          type: 'request_approved',
          forRole: 'student',
          forUserId: transaction.studentId,
          relatedId: transaction.id
        });
      }
    } catch (error) {
      console.error('Approval failed:', error);
      throw error; // Re-throw so the UI can show the error
    }
  };
  const handleRejectRequest = async (transactionId: string) => {
    try {
      const response = await fetch('/api/transactions/reject.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId: transactionId,
        }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to reject request');
      }

      // Update local transaction state
      const transaction = transactions.find((t) => t.id === transactionId);
      if (transaction) {
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
      }
    } catch (error) {
      console.error('Rejection failed:', error);
      throw error; // Re-throw so the UI can show the error
    }
  };
  // --- Admin User Management ---
  const handleAdminSignupRequest = async (
  newAdmin: Omit<AdminUser, 'id' | 'status' | 'requestedAt'>) =>
  {
    try {
      const response = await fetch('/api/admin/signup.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAdmin)
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Admin signup failed');
      }
      // refresh list from server so we have the real id & status
      await loadAdminUsers();
      addNotification({
        message: `New admin access request from ${newAdmin.name}`,
        type: 'admin_signup_request',
        forRole: 'admin'
      });
    } catch (err) {
      console.error('Admin signup error', err);
      throw err;
    }
  };

  const handleApproveAdmin = async (id: string) => {
    try {
      const response = await fetch('/api/admin/approve.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // backend expects "adminId" key
        body: JSON.stringify({ adminId: id })
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to approve admin');
      }
      setAdminUsers(
        adminUsers.map((u) =>
          u.id === id
            ? {
                ...u,
                status: 'approved',
                approvedAt: new Date().toISOString(),
                approvedBy: user?.name
              }
            : u
        )
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleRejectAdmin = async (id: string) => {
    try {
      const response = await fetch('/api/admin/reject.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: id })
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to reject admin');
      }
      setAdminUsers(
        adminUsers.map((u) =>
          u.id === id ? { ...u, status: 'rejected' } : u
        )
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleRevokeAdmin = async (id: string) => {
    try {
      const response = await fetch('/api/admin/revoke.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: id })
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to revoke admin');
      }
      setAdminUsers(adminUsers.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
      throw err;
    }
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