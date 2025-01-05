import React, { useState, useEffect } from 'react';
import { Users as UsersIcon, MapPin, Mail, Phone, Building2 } from 'lucide-react';

const backendLink = "http://localhost:1234";

const UserCard = ({ user, type }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all">
    <div className="flex items-center space-x-4">
      {/* Avatar */}
      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
        <span className="text-blue-600 text-xl font-bold">
          {(user.business_name || user.name || 'NA').charAt(0).toUpperCase()}
        </span>
      </div>

      {/* Basic Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {user.business_name || user.name || 'N/A'}
        </h3>
        <div className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium
          ${type === 'sellers' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}
        >
          {type === 'sellers' ? 'Seller' : 'Buyer'}
        </div>
      </div>
    </div>

    {/* Contact Details */}
    <div className="mt-4 space-y-2">
      <div className="flex items-center text-sm text-gray-500">
        <Mail className="w-4 h-4 mr-2" />
        <span className="truncate">{user.email}</span>
      </div>
      {user.phone && (
        <div className="flex items-center text-sm text-gray-500">
          <Phone className="w-4 h-4 mr-2" />
          <span>{user.phone}</span>
        </div>
      )}
      {user.region && (
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{user.region}</span>
        </div>
      )}
      {user.business_name && (
        <div className="flex items-center text-sm text-gray-500">
          <Building2 className="w-4 h-4 mr-2" />
          <span>{user.business_name}</span>
        </div>
      )}
    </div>

    {/* Status Indicator */}
    <div className="mt-4 flex items-center justify-between text-sm">
      <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full mr-2 ${user.status === 'inactive' ? 'bg-gray-300' : 'bg-green-500'}`} />
        <span className="text-gray-500">
          {user.status === 'inactive' ? 'Inactive' : 'Active'}
        </span>
      </div>
      <span className="text-gray-400 text-xs">
        ID: #{user.id?.slice(0, 8)}
      </span>
    </div>
  </div>
);

const UsersPage = () => {
  const [activeTab, setActiveTab] = useState('buyers');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${backendLink}/api/${activeTab}`);
        const data = await response.json();
        setUsers(data.data || []);
      } catch (err) {
        setError('Failed to load users');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [activeTab]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('buyers')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${activeTab === 'buyers'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            Buyers
          </button>
          <button
            onClick={() => setActiveTab('sellers')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${activeTab === 'sellers'
                ? 'bg-green-100 text-green-700'
                : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            Sellers
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[calc(100vh-12rem)]">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading users...</div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <UsersIcon className="w-8 h-8 mb-2 text-gray-400" />
            <p>{error}</p>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <UsersIcon className="w-8 h-8 mb-2 text-gray-400" />
            <p>No {activeTab} found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map(user => (
              <UserCard 
                key={user.id} 
                user={user} 
                type={activeTab}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage; 