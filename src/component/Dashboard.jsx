import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './SideBar';
import HomePage from './Pages/HomePage/HomePage';
import RFQsPage from './Pages/RFQs/RFQsPage';
import UsersPage from './Pages/Users/UsersPage';
import BidsPage from './Pages/Bids/BidsPage';
import AudioMessagesPage from './Pages/AudioMessages/AudioMessagesPage';

const Dashboard = () => {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/rfqs" element={<RFQsPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/bids" element={<BidsPage />} />
              <Route path="/audio-messages" element={<AudioMessagesPage />} />
              {/* Add more routes as needed */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default Dashboard;
