import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home,
  Package,
  Users,
  Gavel,
  Mic,
  Image
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Home', icon: <Home size={20} />, path: '/' },
    { name: 'Users', icon: <Users size={20} />, path: '/users' },
    { name: 'RFQs', icon: <Package size={20} />, path: '/rfqs' },
    { name: 'Bids', icon: <Gavel size={20} />, path: '/bids' },
    { name: 'Audio Messages', icon: <Mic size={20} />, path: '/audio-messages' },
    { name: 'Image Messages', icon: <Image size={20} />, path: '/image-messages' },
    
    // Add more navigation items as needed
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-4">
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
      </div>
      <nav className="mt-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-800
              ${location.pathname === item.path ? 'bg-gray-100 text-gray-800' : ''}`}
          >
            {item.icon}
            <span className="ml-3">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;