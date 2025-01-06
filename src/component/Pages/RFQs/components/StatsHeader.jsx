import React from 'react';

const StatsHeader = ({ filteredRfqs, rfqs }) => (
  <header className="flex items-center justify-between mb-8">
    <div>
      <h1 className="text-2xl font-bold text-gray-900">RFQs Overview</h1>
      <p className="mt-1 text-sm text-gray-500">
        {filteredRfqs.length} RFQs total
      </p>
    </div>
    
    <div className="flex gap-4">
      {['active', 'pending', 'closed'].map(status => (
        <div 
          key={status} 
          className="bg-white rounded-lg shadow-sm px-6 py-4 border border-gray-100 w-32 flex flex-col"
        >
          <p className="text-sm text-gray-500 capitalize mb-1">{status}</p>
          <p className="text-2xl font-semibold text-gray-900">
            {rfqs.filter(rfq => rfq.status === status).length}
          </p>
        </div>
      ))}
    </div>
  </header>
);

export default StatsHeader; 