export type Department = 'Chemistry' | 'Physics' | 'SOIT';

export type EquipmentStatus =
'Available' |
'Borrowed' |
'Damaged' |
'Maintenance';

export interface Equipment {
  id: string;
  name: string;
  department: Department;
  status: EquipmentStatus;
  quantityAvailable: number;
  totalQuantity: number;
  imageUrl?: string;
}

export interface Transaction {
  id: string;
  equipmentId: string;
  equipmentName: string;
  department: Department;
  date: string;
  type: 'Borrow' | 'Return';
  status: 'Pending' | 'Approved' | 'Completed' | 'Rejected';
  userName: string;
  studentId: string;
  quantity: number;
  expectedReturn?: string;
  purpose?: string;
  approvedAt?: string;
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  department: string;
  equipment: string;
  dateNeeded: string;
  timeNeeded: string;
  purpose: string;
  additionalNotes: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
}

export interface Notification {
  id: string;
  message: string;
  type:
  'borrow_approved' |
  'borrow_rejected' |
  'return_success' |
  'new_borrow_request' |
  'new_reservation' |
  'admin_signup_request' |
  'admin_approved' |
  'admin_rejected';
  timestamp: string;
  read: boolean;
  relatedId?: string;
  forRole: 'student' | 'admin';
  forUserId?: string;
}

export interface User {
  name: string;
  email: string;
  studentId: string;
  role: 'student' | 'admin';
}

export interface RegisteredStudent {
  name: string;
  email: string;
  studentId: string;
  password: string;
  registeredAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  password: string;
  role: 'admin';
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

export type PageState =
'login' |
'admin-login' |
'dashboard' |
'chemistry' |
'physics' |
'soit' |
'borrow-return' |
'reservation' |
'history' |
'policy' |
'admin-dashboard' |
'admin-equipment' |
'admin-requests' |
'admin-reservations' |
'admin-returns' |
'admin-users';