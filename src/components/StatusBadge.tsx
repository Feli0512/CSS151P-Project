import React from 'react';
import { EquipmentStatus } from '../types';
interface StatusBadgeProps {
  status: EquipmentStatus | 'Pending' | 'Approved' | 'Completed' | 'Rejected';
  className?: string;
}
export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'Available':
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Borrowed':
      case 'Pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Damaged':
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Maintenance':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Approved':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  const getDotColor = () => {
    switch (status) {
      case 'Available':
      case 'Completed':
        return 'bg-green-500';
      case 'Borrowed':
      case 'Pending':
        return 'bg-orange-500';
      case 'Damaged':
      case 'Rejected':
        return 'bg-red-500';
      case 'Maintenance':
        return 'bg-gray-500';
      case 'Approved':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles()} ${className}`}>
      
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getDotColor()}`}>
      </span>
      {status}
    </span>);

}