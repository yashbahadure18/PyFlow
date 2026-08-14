import React, { useState } from 'react';
import Inventory from './Inventory';
import Sales     from './Sales';
import Reports   from './Reports';

const NAV = [
  { id: 'inventory', label: 'Inventory',     icon: '📦' },
  { id: 'sales',     label: 'Point of Sale', icon: '🛒' },
  { id: 'reports',   label: 'Sales Reports', icon: '📊' },
];

export default function Dashboard({ user, onLogout }) {
  const [view, setView] = useState('inventory');

  return (
    <div className="app-root">
      {/* ── Sidebar ─────────────────────────── */}
      <aside className="sidebar">
        <div className="sidebar-brand">PyFlow</div>

        <div className="sidebar-section">Main Menu</div>

        {NAV.map(item => (
          <button
            key={item.id}
            className={`nav-btn ${view === item.id ? 'active' : ''}`}
            onClick={() => setView(item.id)}
          >
            <span className="icon">{item.icon}</span>
            {item.label}
          </button>
        ))}

        <div className="sidebar-spacer" />

        {/* User card */}
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user.username[0].toUpperCase()}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user.username}</div>
            <div className="sidebar-user-role">{user.role}</div>
          </div>
        </div>

        <button
          className="nav-btn"
          style={{ color: 'var(--red)', marginTop: '0.5rem' }}
          onClick={onLogout}
        >
          <span className="icon">🚪</span>
          Log Out
        </button>
      </aside>

      {/* ── Main Content ────────────────────── */}
      <main className="main-content">
        {view === 'inventory' && <Inventory />}
        {view === 'sales'     && <Sales />}
        {view === 'reports'   && <Reports />}
      </main>
    </div>
  );
}
