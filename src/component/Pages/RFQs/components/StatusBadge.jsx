import React from 'react';

const StatusBadge = ({ status }) => {
  const styles = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    closed: 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-full ${styles[status] || styles.closed}`}>
      {status}
    </span>
  );
};

export default StatusBadge; 