import React from 'react';
import { Package, ArrowLeft } from 'lucide-react';
import type { Order } from '../types';
import { OrderCard } from '../components/orderCard'
interface OrderHistoryProps {
  orders: Order[];
  onOrderSelect: (order: Order) => void;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({ orders, onOrderSelect }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
          </div>
          <p className="text-gray-600">Track and manage all your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500">When you place your first order, it will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={() => onOrderSelect(order)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};