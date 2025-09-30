import React from 'react';
import { Check, Circle, X } from 'lucide-react';
import type { OrderStatus } from '../types';

interface OrderTimelineProps {
  currentStatus: OrderStatus;
}

const timelineSteps = [
  { key: 'Confirmed', label: 'Order Confirmed' },
  { key: 'Packed', label: 'Packed' },
  { key: 'Shipped', label: 'Shipped' },
  { key: 'Delivered', label: 'Delivered' }
];

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ currentStatus }) => {
  const getStepStatus = (stepKey: string) => {
    if (currentStatus === 'Cancelled') {
      return 'cancelled';
    }
    
    const statusOrder = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepKey);
    
    if (stepIndex <= currentIndex) {
      return 'completed';
    } else if (stepIndex === currentIndex + 1) {
      return 'current';
    } else {
      return 'upcoming';
    }
  };

  const renderStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full">
            <Check className="w-4 h-4 text-white" />
          </div>
        );
      case 'current':
        return (
          <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full animate-pulse">
            <Circle className="w-4 h-4 text-white fill-current" />
          </div>
        );
      case 'cancelled':
        return (
          <div className="flex items-center justify-center w-8 h-8 bg-red-500 rounded-full">
            <X className="w-4 h-4 text-white" />
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full">
            <Circle className="w-4 h-4 text-gray-500" />
          </div>
        );
    }
  };

  if (currentStatus === 'Cancelled') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-red-500 rounded-full">
            <X className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-red-800">Order Cancelled</h3>
            <p className="text-red-600 text-sm">This order has been cancelled.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Order Status</h3>
      <div className="relative">
        {timelineSteps.map((step, index) => {
          const status = getStepStatus(step.key);
          return (
            <div key={step.key} className="relative flex items-center pb-8 last:pb-0">
              {index < timelineSteps.length - 1 && (
                <div 
                  className={`absolute left-4 top-8 w-0.5 h-8 ${
                    status === 'completed' || (status === 'current' && index < timelineSteps.length - 1) 
                      ? 'bg-green-500' 
                      : 'bg-gray-300'
                  }`}
                />
              )}
              <div className="flex items-center space-x-4">
                {renderStepIcon(status)}
                <div>
                  <p className={`font-medium ${
                    status === 'completed' ? 'text-green-700' : 
                    status === 'current' ? 'text-blue-700' : 
                    'text-gray-500'
                  }`}>
                    {step.label}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};