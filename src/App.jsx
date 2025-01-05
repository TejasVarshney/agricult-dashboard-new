import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import NavBar from './component/navBar';
import Dashboard from './component/Dashboard';

function App() {
  return (
    <Router>
      <div className="flex">
        <NavBar />
        <Dashboard />
      </div>
    </Router>
  );
}

export default App; 