import React from 'react';
import { Calendar, CreditCard } from 'lucide-react';
import type { Order } from '../types';
import { StatusBadge } from './statusBadge';
import { useNavigate } from 'react-router-dom';

interface OrderCardProps {
  order: Order;
  onClick: () => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onClick }) => {
  const navigate = useNavigate();
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div 
      onClick={() => {
        onClick();
        navigate(`/order-details`)}}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all duration-300 cursor-pointer group"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              Order {order.id}
            </h3>
            <StatusBadge status={order.status} />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-600 space-y-2 sm:space-y-0 sm:space-x-6 mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(order.date)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span>{order.paymentMethod}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            {order.products.slice(0, 3).map((product, index) => (
              <div key={product.id} className="flex items-center space-x-2">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-8 h-8 rounded object-cover"
                />
                <span className="text-sm text-gray-600 truncate max-w-32">
                  {product.name}
                </span>
                {index < Math.min(order.products.length, 3) - 1 && (
                  <span className="text-gray-400">•</span>
                )}
              </div>
            ))}
            {order.products.length > 3 && (
              <span className="text-sm text-gray-500">
                +{order.products.length - 3} more
              </span>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">
            ${order.total.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">
            {order.products.reduce((sum, p) => sum + p.quantity, 0)} item{order.products.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  );
};