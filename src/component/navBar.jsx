import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <div className="w-64 h-screen bg-white shadow-lg">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
        
        <nav className="space-y-4">
          <Link to="/" className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded">
            <span className="material-icons">home</span>
            <span>Home</span>
          </Link>
          
          <Link to="/users" className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded">
            <span className="material-icons">people</span>
            <span>Users</span>
          </Link>
          
          <Link to="/orders" className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded">
            <span className="material-icons">shopping_cart</span>
            <span>Orders</span>
          </Link>
          
          <Link to="/bids" className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded">
            <span className="material-icons">gavel</span>
            <span>Bids</span>
          </Link>
          
          <Link to="/help" className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded">
            <span className="material-icons">help</span>
            <span>Help</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
