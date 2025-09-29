import React from 'react';
import type { OrderStatus } from '../types';

interface StatusBadgeProps {
  status: OrderStatus;
}

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  Packed: 'bg-purple-100 text-purple-800 border-purple-200',
  Shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  Delivered: 'bg-green-100 text-green-800 border-green-200',
  Cancelled: 'bg-red-100 text-red-800 border-red-200'
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusColors[status]} transition-colors duration-200`}>
      {status}
    </span>
  );
};