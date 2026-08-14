import React, { useEffect, useState } from 'react';

const StatCard = ({ icon, label, value, color, prefix = '' }) => (
  <div className="stat-card">
    <div className={`stat-icon ${color}`}>{icon}</div>
    <div>
      <div className="stat-value">{prefix}{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  </div>
);

const ActivityRow = ({ icon, text, sub, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
    <div className={`stat-icon ${color}`} style={{ width: 38, height: 38, fontSize: '1.1rem', borderRadius: 8, flexShrink: 0 }}>{icon}</div>
    <div>
      <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{text}</div>
      <div style={{ fontSize: '0.78rem', color: 'var(--text-2)' }}>{sub}</div>
    </div>
  </div>
);

export default function Home({ user }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/dashboard/stats')
      .then(r => r.json())
      .then(d => { if (d.success) setStats(d.stats); });
  }, []);

  const s = stats || {};

  return (
    <>
      {/* Greeting */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="page-title">
            Good {getTimeOfDay()}, {user.username}! 👋
          </div>
          <div className="page-subtitle">Here's what's happening with your business today.</div>
        </div>
        <span className="badge badge-blue" style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}>
          {user.role}
        </span>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard icon="📦" label="Total Products"  value={s.total_products  ?? '—'} color="blue"   />
        <StatCard icon="💵" label="Total Revenue"   value={s.total_revenue   ?? '—'} color="green"  prefix="$" />
        <StatCard icon="🛒" label="Total Orders"    value={s.total_orders    ?? '—'} color="purple" />
        <StatCard icon="👤" label="Customers"       value={s.total_customers ?? '—'} color="blue"   />
        <StatCard icon="⚠️" label="Low Stock Items" value={s.low_stock       ?? '—'} color="red"    />
      </div>

      {/* Quick Actions + Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Quick Actions */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ fontWeight: 600, marginBottom: '1.25rem' }}>⚡ Quick Actions</div>
          {[
            { icon: '📦', label: 'Go to Inventory',     sub: 'Add or view products',     color: 'blue'   },
            { icon: '🛒', label: 'Open Point of Sale',   sub: 'Place a new order',        color: 'green'  },
            { icon: '👥', label: 'Manage Customers',     sub: 'Add or search customers',  color: 'purple' },
            { icon: '📊', label: 'View Sales Reports',   sub: 'Check revenue history',    color: 'blue'   },
          ].map(item => (
            <ActivityRow key={item.label} {...item} />
          ))}
        </div>

        {/* System Status */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ fontWeight: 600, marginBottom: '1.25rem' }}>🟢 System Status</div>
          {[
            { label: 'Flask API Backend', status: 'Online', color: 'var(--green)' },
            { label: 'SQLite Database',   status: 'Connected', color: 'var(--green)' },
            { label: 'React Frontend',    status: 'Running', color: 'var(--green)' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-2)' }}>{item.label}</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: item.color }}>● {item.status}</span>
            </div>
          ))}

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(59,130,246,0.08)', borderRadius: 8, border: '1px solid rgba(59,130,246,0.2)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-2)', marginBottom: '0.25rem' }}>Logged in as</div>
            <div style={{ fontWeight: 600 }}>{user.username} <span style={{ color: 'var(--text-2)', fontWeight: 400 }}>({user.role})</span></div>
          </div>
        </div>
      </div>
    </>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
