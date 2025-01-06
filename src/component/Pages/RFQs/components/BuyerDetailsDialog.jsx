import React, { useEffect, useState } from 'react';
import { X, Building2, User, Mail, Phone, MapPin, Receipt } from 'lucide-react';

const backendLink = "http://localhost:1234";

const BuyerDetailsDialog = ({ buyerId, onClose }) => {
  const [buyer, setBuyer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuyerDetails = async () => {
      try {
        const response = await fetch(`${backendLink}/api/buyers/${buyerId}`);
        const data = await response.json();
        setBuyer(data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching buyer details:', error);
        setLoading(false);
      }
    };

    if (buyerId) {
      fetchBuyerDetails();
    }
  }, [buyerId]);

  if (!buyerId) return null;

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div 
        className="bg-white rounded-xl w-full max-w-md shadow-2xl transform transition-all animate-slideIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Buyer Details</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-sm text-gray-500">Loading buyer details...</p>
            </div>
          ) : buyer ? (
            <div className="space-y-3">
              <DetailItem
                icon={Building2}
                label="Business Name"
                value={buyer.business_name}
              />
              <DetailItem
                icon={User}
                label="Contact Person"
                value={buyer.contact_person}
              />
              <DetailItem
                icon={Mail}
                label="Email"
                value={buyer.email}
              />
              <DetailItem
                icon={Phone}
                label="Phone"
                value={buyer.phone}
              />
              <DetailItem
                icon={MapPin}
                label="Address"
                value={buyer.address}
              />
              {buyer.gst_number && (
                <DetailItem
                  icon={Receipt}
                  label="GST Number"
                  value={buyer.gst_number}
                />
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <X className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No Data Found</h3>
              <p className="mt-1 text-sm text-gray-500">Buyer details are not available.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && buyer && (
          <div className="px-6 py-4 bg-gray-50 rounded-b-xl">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Buyer ID: #{buyerId.slice(0, 8)}</span>
              <span>Joined: {new Date(buyer.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Add these animations to your tailwind.config.js
// animation: {
//   fadeIn: 'fadeIn 0.2s ease-in-out',
//   slideIn: 'slideIn 0.3s ease-out'
// },
// keyframes: {
//   fadeIn: {
//     '0%': { opacity: '0' },
//     '100%': { opacity: '1' }
//   },
//   slideIn: {
//     '0%': { transform: 'translateY(-10px)', opacity: '0' },
//     '100%': { transform: 'translateY(0)', opacity: '1' }
//   }
// }

export default BuyerDetailsDialog; 