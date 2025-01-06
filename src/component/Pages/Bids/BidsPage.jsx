import React, { useState, useEffect } from 'react';
import StatusBadge from '../RFQs/components/StatusBadge';
import BidDetailsDialog from './components/BidDetailsDialog';
import { User, Check, X, FileText } from 'lucide-react';
import BidsFilterBar from './components/BidsFilterBar';
import RFQDetailsDialog from './components/RFQDetailsDialog';

const backendLink = "http://localhost:1234";

const BidsPage = () => {
  const [bids, setBids] = useState([]);
  const [selectedBid, setSelectedBid] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedSellerId, setSelectedSellerId] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [selectedRfqId, setSelectedRfqId] = useState(null);

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    try {
      const response = await fetch(`${backendLink}/api/quotes`);
      const data = await response.json();
      setBids(data.data || []);
    } catch (error) {
      console.error('Error fetching bids:', error);
    }
  };

  const handleBidAction = async (bidId, action) => {
    setIsProcessing(true);
    try {
      const response = await fetch(`${backendLink}/api/quotes/${bidId}/${action}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${action} bid`);
      }

      // Refresh bids list after successful action
      fetchBids();
    } catch (error) {
      console.error(`Error ${action}ing bid:`, error);
      // Handle error (show toast notification, etc.)
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getFilteredBids = () => {
    return bids.filter(bid => {
      // Filter by status
      if (activeTab !== "all" && bid.status !== activeTab) {
        return false;
      }

      // Filter by search query
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        if (!bid.id.toLowerCase().includes(searchLower) &&
            !bid.rfq_id.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Filter by date range
      if (dateRange.from && new Date(bid.created_at) < new Date(dateRange.from)) {
        return false;
      }
      if (dateRange.to && new Date(bid.created_at) > new Date(dateRange.to)) {
        return false;
      }

      return true;
    });
  };

  const filteredBids = getFilteredBids();

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bids Overview</h1>
        <span className="text-sm text-gray-500">
          {filteredBids.length} of {bids.length} bids
        </span>
      </div>

      <BidsFilterBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        dateRange={dateRange}
        onDateChange={setDateRange}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredBids.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredBids.map((bid) => (
              <div key={bid.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  {/* Left side - Bid info */}
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          #{bid.id.slice(0, 8)}
                        </span>
                        <button
                          onClick={() => setSelectedRfqId(bid.rfq_id)}
                          className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 
                            px-2 py-1 rounded-md transition-colors flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3" />
                          View Details
                        </button>
                        <StatusBadge status={bid.status} />
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {formatDate(bid.created_at)}
                      </div>
                    </div>
                  </div>

                  {/* Middle - Price info */}
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(bid.price_per_ton)}
                      </div>
                      <div className="text-xs text-gray-500">per ton</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(bid.total_price)}
                      </div>
                      <div className="text-xs text-gray-500">total value</div>
                    </div>
                  </div>

                  {/* Right side - Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedSellerId(bid.seller_id)}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 
                        hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                    >
                      <User className="w-3 h-3" />
                      Seller
                    </button>
                    
                    <button
                      onClick={() => handleBidAction(bid.id, 'rejected')}
                      disabled={isProcessing || bid.status !== 'pending'}
                      className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors
                        ${bid.status === 'pending'
                          ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
                          : 'text-gray-400 bg-gray-50 cursor-not-allowed'
                        }`}
                    >
                      <X className="w-3 h-3" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleBidAction(bid.id, 'approved')}
                      disabled={isProcessing || bid.status !== 'pending'}
                      className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors
                        ${bid.status === 'pending'
                          ? 'text-white bg-green-600 hover:bg-green-700'
                          : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                        }`}
                    >
                      <Check className="w-3 h-3" />
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            No bids match your filters
          </div>
        )}
      </div>

      {/* Dialogs */}
      {selectedSellerId && (
        <BidDetailsDialog
          sellerId={selectedSellerId}
          onClose={() => setSelectedSellerId(null)}
        />
      )}
      {selectedRfqId && (
        <RFQDetailsDialog
          rfqId={selectedRfqId}
          onClose={() => setSelectedRfqId(null)}
        />
      )}
    </div>
  );
};

export default BidsPage; 