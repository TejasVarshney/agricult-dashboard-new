import React, { useState, useEffect } from 'react';
import StatusBadge from './StatusBadge';
import SellerDetailsDialog from './SellerDetailsDialog';
import { User, Check, X } from 'lucide-react';

const backendLink = "https://agricult-dashboard-new.onrender.com";

const QuotesSection = ({ selectedRfq, quotes, formatDate, formatCurrency, onQuoteUpdate }) => {
  const [selectedSellerId, setSelectedSellerId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sellerDetails, setSellerDetails] = useState({});

  // Fetch seller details for all quotes
  useEffect(() => {
    const fetchSellerDetails = async () => {
      if (!quotes?.length) return;

      try {
        // Get unique seller IDs from quotes
        const sellerIds = [...new Set(quotes.map(quote => quote.seller_id))];
        
        // Fetch details for each seller
        const details = {};
        await Promise.all(
          sellerIds.map(async (sellerId) => {
            const response = await fetch(`${backendLink}/api/sellers/${sellerId}`);
            const data = await response.json();
            details[sellerId] = data.data;
          })
        );
        
        setSellerDetails(details);
      } catch (error) {
        console.error('Error fetching seller details:', error);
      }
    };

    fetchSellerDetails();
  }, [quotes]);

  const handleQuoteAction = async (quoteId, action) => {
    setIsProcessing(true);
    try {
      const response = await fetch(`${backendLink}/api/quotes/${quoteId}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${action} quote`);
      }

      // Refresh quotes list after successful action
      onQuoteUpdate();
    } catch (error) {
      console.error(`Error ${action}ing quote:`, error);
      // Handle error (show toast notification, etc.)
    } finally {
      setIsProcessing(false);
    }
  };

  if (!selectedRfq) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <p className="text-lg font-medium">Select an RFQ to view quotes</p>
        <p className="text-sm mt-2">Choose from the list on the left</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* RFQ Details */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            RFQ #{selectedRfq.id.slice(0, 8)}
          </h3>
          <StatusBadge status={selectedRfq.status} />
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Quantity</span>
            <p className="font-medium text-gray-900">{selectedRfq.quantity} tons</p>
          </div>
          <div>
            <span className="text-gray-500">Grade</span>
            <p className="font-medium text-gray-900">{selectedRfq.grade}</p>
          </div>
          {selectedRfq.notes && (
            <div className="col-span-2">
              <span className="text-gray-500">Notes</span>
              <p className="font-medium text-gray-900">{selectedRfq.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Quotes List */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Quotes</h3>
          <span className="text-sm text-gray-500">
            {quotes?.length || 0} total
          </span>
        </div>
        
        {quotes?.length > 0 ? (
          <div className="space-y-4">
            {quotes.map((quote) => {
              const seller = sellerDetails[quote.seller_id];
              
              return (
                <div key={quote.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        Quote #{quote.id.slice(0, 8)}
                      </span>
                      <StatusBadge status={quote.status} />
                    </div>
                    <button
                      onClick={() => setSelectedSellerId(quote.seller_id)}
                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 
                        px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      {seller ? seller.business_name : 'View Seller'}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <span className="text-xs text-gray-500">Price per ton</span>
                      <p className="font-medium text-gray-900">
                        {formatCurrency(quote.price_per_ton)}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Total value</span>
                      <p className="font-medium text-gray-900">
                        {formatCurrency(quote.price_per_ton * selectedRfq.quantity)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Submitted: {formatDate(quote.created_at)}
                  </div>

                  {/* Action Buttons - Only show for pending RFQs */}
                  {selectedRfq.status === 'pending' && quote.status === 'pending' && (
                    <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => handleQuoteAction(quote.id, 'reject')}
                        disabled={isProcessing}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 
                          hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                      <button
                        onClick={() => handleQuoteAction(quote.id, 'approve')}
                        disabled={isProcessing}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white 
                          bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Approve
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            No quotes received yet
          </div>
        )}
      </div>

      {/* Seller Details Dialog */}
      {selectedSellerId && (
        <SellerDetailsDialog
          sellerId={selectedSellerId}
          onClose={() => setSelectedSellerId(null)}
        />
      )}
    </div>
  );
};

export default QuotesSection; 

