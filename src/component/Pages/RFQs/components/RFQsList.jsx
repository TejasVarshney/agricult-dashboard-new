import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import BuyerDetailsDialog from './BuyerDetailsDialog';
import { Calendar, Package, MapPin, Truck, User, Scale, Building2 } from 'lucide-react';

const RFQsList = ({ rfqs, selectedRfq, setSelectedRfq, formatDate, buyerDetails }) => {
  const [selectedBuyerId, setSelectedBuyerId] = useState(null);

  const handleBuyerClick = (e, buyerId) => {
    e.stopPropagation();
    setSelectedBuyerId(buyerId);
  };

  return (
    <>
      <div className="divide-y divide-gray-200">
        {rfqs.map((rfq, index) => {
          const buyer = buyerDetails[rfq.buyer_id];
          
          return (
            <div
              key={rfq.id}
              onClick={() => setSelectedRfq(rfq)}
              className={`
                p-6 cursor-pointer transition-all border-l-4
                ${selectedRfq?.id === rfq.id 
                  ? 'bg-blue-50 border-l-blue-500 shadow-sm' 
                  : 'hover:bg-gray-50 border-l-transparent hover:border-l-gray-300'
                }
              `}
            >
              <div className="space-y-4 w-full">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Building2 
                        className={`w-5 h-5 ${
                          selectedRfq?.id === rfq.id 
                            ? 'text-blue-500' 
                            : 'text-gray-400 group-hover:text-gray-600'
                        }`} 
                      />
                      <div>
                        <h4 className="text-base font-semibold text-gray-900">
                          {buyer?.business_name || 'Loading...'}
                        </h4>
                        <p className="text-xs text-gray-500">
                          RFQ #{rfq.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={rfq.status} />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {formatDate(rfq.created_at)}
                  </div>
                </div>

                {/* Details Section */}
                <div className="flex justify-between items-start bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                  {/* Quantity on the left */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                      <Package className="w-4 h-4" />
                      <span>Quantity</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 ml-6">
                      {rfq.quantity} tons
                    </p>
                  </div>

                  {/* Grade on the right */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                      <Scale className="w-4 h-4" />
                      <span>Grade</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 ml-6">
                      {rfq.grade}
                    </p>
                  </div>
                </div>

                {/* Notes Section - if exists */}
                {rfq.notes && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="text-sm font-medium text-gray-500 mb-2">Notes</p>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {rfq.notes}
                    </p>
                  </div>
                )}

                {/* Footer Section */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-4">
                    {rfq.region && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="bg-gray-100 px-3 py-1 rounded-full">
                          {rfq.region}
                        </span>
                      </div>
                    )}
                    {rfq.delivery_timeline && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Truck className="w-4 h-4 text-gray-400" />
                        <span>Delivery: {rfq.delivery_timeline}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => handleBuyerClick(e, rfq.buyer_id)}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 
                      px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    View Buyer
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Buyer Details Dialog */}
      {selectedBuyerId && (
        <BuyerDetailsDialog
          buyerId={selectedBuyerId}
          onClose={() => setSelectedBuyerId(null)}
        />
      )}
    </>
  );
};

export default RFQsList; 