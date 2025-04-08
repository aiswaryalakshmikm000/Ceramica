import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Out for Delivery': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-violet-100 text-violet-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Return-Requested': return 'bg-orange-100 text-orange-800';
      case 'Return-Approved': return 'bg-teal-100 text-teal-800';
      case 'Return-Rejected': return 'bg-red-100 text-red-800';
      case 'Returned': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formattedStatus = status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(status)}`}>
      {formattedStatus}
    </span>
  );
};

export default StatusBadge;