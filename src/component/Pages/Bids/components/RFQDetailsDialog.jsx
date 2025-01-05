import React, { useState, useEffect } from 'react';
import { 
  X, Package, Calendar, User, FileText, Building2, 
  Mail, Phone, MapPin, Receipt, Truck, Factory 
} from 'lucide-react';
import StatusBadge from '../../RFQs/components/StatusBadge';

const backendLink = "http://localhost:1234";

const RFQDetailsDialog = ({ rfqId, onClose }) => {
  const [rfq, setRfq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buyerDetails, setBuyerDetails] = useState(null);
  const [sellerDetails, setSellerDetails] = useState(null);

  useEffect(() => {
    const fetchRFQDetails = async () => {
      try {
        // Fetch RFQ details
        const rfqResponse = await fetch(`${backendLink}/api/rfqs/${rfqId}`);
        const rfqData = await rfqResponse.json();
        setRfq(rfqData.data);

        // Fetch buyer details
        const buyerResponse = await fetch(`${backendLink}/api/buyers/${rfqData.data.buyer_id}`);
        const buyerData = await buyerResponse.json();
        setBuyerDetails(buyerData.data);

        // Fetch seller details if available
        if (rfqData.data.seller_id) {
          const sellerResponse = await fetch(`${backendLink}/api/sellers/${rfqData.data.seller_id}`);
          const sellerData = await sellerResponse.json();
          setSellerDetails(sellerData.data);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching RFQ details:', error);
        setLoading(false);
      }
    };

    if (rfqId) {
      fetchRFQDetails();
    }
  }, [rfqId]);

  const DetailItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg transition-all hover:bg-gray-100">
      <div className="flex-shrink-0">
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="mt-1 text-sm text-gray-900">{value || 'N/A'}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-xl w-full max-w-7xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-900">RFQ #{rfq?.id.slice(0, 8)}</h2>
              {rfq && <StatusBadge status={rfq.status} />}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-sm text-gray-500">Loading RFQ details...</p>
            </div>
          ) : rfq ? (
            <div className="grid grid-cols-3 gap-6">
              {/* Left Column - RFQ Details */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">RFQ Information</h3>
                  <div className="space-y-3">
                    <DetailItem
                      icon={Package}
                      label="Quantity"
                      value={`${rfq.quantity} tons`}
                    />
                    <DetailItem
                      icon={Package}
                      label="Grade"
                      value={rfq.grade}
                    />
                    <DetailItem
                      icon={Calendar}
                      label="Created At"
                      value={new Date(rfq.created_at).toLocaleDateString()}
                    />
                    {rfq.notes && (
                      <DetailItem
                        icon={FileText}
                        label="Notes"
                        value={rfq.notes}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Middle Column - Buyer Details */}
              {buyerDetails && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Buyer Information</h3>
                    <div className="space-y-3">
                      <DetailItem
                        icon={Building2}
                        label="Business Name"
                        value={buyerDetails.business_name}
                      />
                      <DetailItem
                        icon={User}
                        label="Contact Person"
                        value={buyerDetails.contact_person}
                      />
                      <DetailItem
                        icon={Mail}
                        label="Email"
                        value={buyerDetails.email}
                      />
                      <DetailItem
                        icon={Phone}
                        label="Phone"
                        value={buyerDetails.phone}
                      />
                      <DetailItem
                        icon={MapPin}
                        label="Address"
                        value={buyerDetails.address}
                      />
                      {buyerDetails.gst_number && (
                        <DetailItem
                          icon={Receipt}
                          label="GST Number"
                          value={buyerDetails.gst_number}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Right Column - Seller Details */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Seller Information</h3>
                  {sellerDetails ? (
                    <div className="space-y-3">
                      <DetailItem
                        icon={Factory}
                        label="Business Name"
                        value={sellerDetails.business_name}
                      />
                      <DetailItem
                        icon={User}
                        label="Contact Person"
                        value={sellerDetails.contact_person}
                      />
                      <DetailItem
                        icon={Mail}
                        label="Email"
                        value={sellerDetails.email}
                      />
                      <DetailItem
                        icon={Phone}
                        label="Phone"
                        value={sellerDetails.phone}
                      />
                      <DetailItem
                        icon={MapPin}
                        label="Address"
                        value={sellerDetails.address}
                      />
                      {sellerDetails.gst_number && (
                        <DetailItem
                          icon={Receipt}
                          label="GST Number"
                          value={sellerDetails.gst_number}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <Truck className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>No seller assigned yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <X className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No Data Found</h3>
              <p className="mt-1 text-sm text-gray-500">RFQ details are not available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RFQDetailsDialog; 