
import React from 'react';
import {
  Clock,
  Package,
  Truck,
  CheckCircle,
  XCircle, 
  Box, 
  CheckSquare,
  XSquare, 
  RotateCcw, 
  Info,
} from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending': 
        return 'bg-yellow-100 text-yellow-900 border-yellow-200';
        case 'Confirmed': 
        return 'bg-violet-100 text-yellow-900 border-violet-200';
      case 'Shipped': 
        return 'bg-blue-100 text-blue-900 border-blue-200';
      case 'Out for Delivery': 
        return 'bg-purple-100 text-purple-900 border-purple-200';
      case 'Delivered': 
        return 'bg-indigo-100 text-indigo-900 border-indigo-200';
      case 'Cancelled': 
        return 'bg-red-100 text-red-900 border-red-200';
      case 'Return-Requested': 
        return 'bg-orange-100 text-orange-900 border-orange-200';
      case 'Return-Approved': 
        return 'bg-teal-100 text-teal-900 border-teal-200';
      case 'Return-Rejected': 
        return 'bg-pink-100 text-pink-900 border-pink-200';
      case 'Returned': 
        return 'bg-green-100 text-green-900 border-green-200';
      default: 
        return 'bg-gray-100 text-gray-900 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock size={15} />;
      case 'Shipped': return <Package size={15} />;
      case 'Out for Delivery': return <Truck size={15} />;
      case 'Delivered': return <CheckCircle size={15} />;
      case 'Cancelled': return <XCircle size={15} />;
      case 'Return-Requested': return <Box size={15} />;
      case 'Return-Approved': return <CheckSquare size={15} />;
      case 'Return-Rejected': return <XSquare size={15} />;
      case 'Returned': return <RotateCcw size={15} />;
      default: return <Info size={15} />;
    }
  };

  const formattedStatus = status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <span 
      className={`inline-flex items-center w-40 px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadgeClass(status)}`}
    >
      <span className="mr-1 flex-shrink-0">{getStatusIcon(status)}</span>
      <span className="truncate">{formattedStatus}</span>
    </span>
  );
};

export default StatusBadge;