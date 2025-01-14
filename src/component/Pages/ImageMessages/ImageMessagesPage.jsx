import React, { useState, useEffect } from 'react';
import { Check, X, SlidersHorizontal, Search } from 'lucide-react';
import StatusBadge from '../RFQs/components/StatusBadge';
import { backendLink } from '../../../config/constants';



const ImageMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  useEffect(() => {
    fetchImageMessages();
  }, []);

  const fetchImageMessages = async () => {
    try {
      const response = await fetch(`${backendLink}/api/chat/images`);
      const data = await response.json();
      setMessages(data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching image messages:', error);
      setLoading(false);
    }
  };

  const handleAction = async (messageId, action) => {
    try {
      const response = await fetch(`${backendLink}/api/chat/images/${messageId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: action }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update message status');
      }
      
      await fetchImageMessages();
    } catch (error) {
      console.error(`Error updating message status:`, error);
      alert(`Error: ${error.message}`);
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

  const filteredMessages = messages.filter(message => {
    if (statusFilter !== 'all' && message.status !== statusFilter) return false;
    if (dateRange.from && new Date(message.created_at) < new Date(dateRange.from)) return false;
    if (dateRange.to && new Date(message.created_at) > new Date(dateRange.to)) return false;
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        message.sender?.name?.toLowerCase().includes(searchLower) ||
        message.id.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const getSenderType = (message) => {
    if (message.buyer_id) return 'Buyer';
    if (message.seller_id) return 'Seller';
    return 'Unknown';
  };

  const getDisplayId = (message) => {
    return message.quote_id ? `Quote #${message.quote_id.slice(0, 8)}` : `Message #${message.id.slice(0, 8)}`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Image Messages</h1>
        <span className="text-sm text-gray-500">
          {filteredMessages.length} messages
        </span>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="search"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>

          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredMessages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filteredMessages.map((message) => (
              <div key={message.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  {/* Image Preview */}
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={message.message}
                      alt="Message content"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Message Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {getDisplayId(message)}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({getSenderType(message)})
                      </span>
                      <StatusBadge status={message.status} />
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {formatDate(message.created_at)}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {message.status === 'pending' && (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleAction(message.id, 'rejected')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Reject"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleAction(message.id, 'approved')}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Approve"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <SlidersHorizontal className="w-8 h-8 mb-2" />
            <p>No image messages found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageMessagesPage;
