import React, { useState } from 'react';
import { Search, Calendar, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
<<<<<<< HEAD
=======

>>>>>>> 5af6e45 (Solve RFQs)
const SearchBar = ({ searchQuery, onSearchChange }) => (
  <div className="flex-1 relative">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
    <input
      type="search"
      placeholder="Search RFQs..."
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
      className="w-full pl-10 pr-4 py-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);
<<<<<<< HEAD
=======

>>>>>>> 5af6e45 (Solve RFQs)
const TabFilter = ({ activeTab, setActiveTab }) => (
  <div className="inline-flex p-1 space-x-1 bg-white rounded-lg border shadow-sm">
    {["all", "active", "pending", "closed"].map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`
          px-4 py-2 rounded-md capitalize text-sm font-medium transition-all
          ${activeTab === tab
            ? "bg-gray-100 text-gray-900"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }
        `}
      >
        {tab}
      </button>
    ))}
  </div>
);
<<<<<<< HEAD
=======

>>>>>>> 5af6e45 (Solve RFQs)
const DateFilter = ({ dateRange, onDateChange }) => (
  <div className="flex items-center gap-2">
    <div className="relative">
      <input
        type="date"
        value={dateRange.from || ''}
        onChange={(e) => onDateChange('from', e.target.value)}
        className="pl-10 pr-4 py-2 border rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
    </div>
    <span className="text-gray-500">to</span>
    <div className="relative">
      <input
        type="date"
        value={dateRange.to || ''}
        onChange={(e) => onDateChange('to', e.target.value)}
        className="pl-10 pr-4 py-2 border rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
    </div>
  </div>
);
<<<<<<< HEAD
=======

>>>>>>> 5af6e45 (Solve RFQs)
const SearchAndFilters = ({ 
  activeTab, 
  setActiveTab, 
  searchQuery, 
  onSearchChange,
  dateRange,
  onDateChange 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
<<<<<<< HEAD
=======

>>>>>>> 5af6e45 (Solve RFQs)
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Main Search Bar and Filter Toggle */}
      <div className="p-4 flex items-center gap-4">
        <SearchBar searchQuery={searchQuery} onSearchChange={onSearchChange} />
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
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
<<<<<<< HEAD
=======

>>>>>>> 5af6e45 (Solve RFQs)
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
<<<<<<< HEAD
=======

>>>>>>> 5af6e45 (Solve RFQs)
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
<<<<<<< HEAD
=======

>>>>>>> 5af6e45 (Solve RFQs)
export default SearchAndFilters; 