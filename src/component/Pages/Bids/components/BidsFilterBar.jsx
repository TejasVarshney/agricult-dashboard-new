import React, { useState } from 'react';
import { SlidersHorizontal, ChevronUp, ChevronDown, Search } from 'lucide-react';

const BidsFilterBar = ({ 
  activeTab, 
  setActiveTab, 
  searchQuery, 
  onSearchChange,
  dateRange,
  onDateChange 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const SearchBar = ({ searchQuery, onSearchChange }) => (
    <div className="relative flex-1">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search bids..."
        className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          placeholder-gray-400 text-sm"
      />
    </div>
  );

  const TabFilter = ({ activeTab, setActiveTab }) => (
    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
      {['all', 'accepted', 'pending', 'rejected'].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors
            ${activeTab === tab 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  );

  const DateFilter = ({ dateRange, onDateChange }) => (
    <div className="flex items-center gap-4">
      <div>
        <label className="block text-sm text-gray-600 mb-1">From</label>
        <input
          type="date"
          value={dateRange.from}
          onChange={(e) => onDateChange({ ...dateRange, from: e.target.value })}
          className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">To</label>
        <input
          type="date"
          value={dateRange.to}
          onChange={(e) => onDateChange({ ...dateRange, to: e.target.value })}
          className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Main Search Bar and Filter Toggle */}
      <div className="p-4 flex items-center gap-4">
        <SearchBar searchQuery={searchQuery} onSearchChange={onSearchChange} />
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 
            bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Expandable Filter Section */}
      <div
        className={`
          border-t border-gray-100 overflow-hidden transition-all duration-200 ease-in-out
          ${isExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="p-4 space-y-4">
          {/* Status Filter */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Status</span>
            <TabFilter activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* Date Filter */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Date Range</span>
            <DateFilter dateRange={dateRange} onDateChange={onDateChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidsFilterBar; 