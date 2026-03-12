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
  equipmentName: string;
  equipmentId?: string;
  department: Department;
  date: string;
  expectedReturn?: string;
  type: 'Borrow' | 'Return';
  status: 'Pending' | 'Approved' | 'Completed' | 'Rejected';
  quantity?: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  studentId: string;
}

export type PageState =
'login' |
'dashboard' |
'chemistry' |
'physics' |
'soit' |
'borrow-return';