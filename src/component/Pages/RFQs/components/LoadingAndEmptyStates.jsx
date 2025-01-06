import React from 'react';
import { Package } from 'lucide-react';

export const LoadingState = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-pulse text-gray-400">Loading RFQs...</div>
  </div>
);

export const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
    <Package size={32} className="mb-2" />
    <p>No RFQs found</p>
  </div>
); 