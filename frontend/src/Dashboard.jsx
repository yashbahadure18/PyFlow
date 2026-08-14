import React, { useState } from 'react';
import Inventory from './Inventory';
import Sales from './Sales';
import Reports from './Reports';

export default function Dashboard({ user, onLogout }) {
  const [currentView, setCurrentView] = useState('inventory');

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar glass">
        <div className="sidebar-brand">PyFlow</div>
        
        <div style={{ marginBottom: '2rem', padding: '0 1rem' }}>
          <div style={{ fontWeight: 600, color: '#f8fafc' }}>{user.username}</div>
          <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Role: {user.role}</div>
        </div>
        
        <nav style={{ flex: 1 }}>
          <button 
            className={`nav-link ${currentView === 'inventory' ? 'active' : ''}`}
            onClick={() => setCurrentView('inventory')}
          >
            Inventory
          </button>
          <button 
            className={`nav-link ${currentView === 'sales' ? 'active' : ''}`}
            onClick={() => setCurrentView('sales')}
          >
            Point of Sale
          </button>
          <button 
            className={`nav-link ${currentView === 'reports' ? 'active' : ''}`}
            onClick={() => setCurrentView('reports')}
          >
            Sales Reports
          </button>
        </nav>
        
        <button 
          className="nav-link" 
          style={{ color: '#ef4444' }} 
          onClick={onLogout}
        >
          Log Out
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {currentView === 'inventory' && <Inventory />}
        {currentView === 'sales' && <Sales />}
        {currentView === 'reports' && <Reports />}
      </div>
    </div>
  );
}
