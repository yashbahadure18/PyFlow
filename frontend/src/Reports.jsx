import React, { useState, useEffect } from 'react';

export default function Reports() {
  const [sales, setSales]   = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/reports/sales')
      .then(r => r.json())
      .then(d => { if (d.success) setSales(d.sales); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const totalRevenue = sales.reduce((s, o) => s + o.amount, 0);
  const totalOrders  = sales.length;
  const avgOrder     = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Sales Reports</div>
          <div className="page-subtitle">Transaction history and revenue overview</div>
        </div>
        <button className="btn btn-ghost" onClick={load}>↻ Refresh</button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple">📋</div>
          <div>
            <div className="stat-value">{totalOrders}</div>
            <div className="stat-label">Total Orders</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">💵</div>
          <div>
            <div className="stat-value">${totalRevenue.toFixed(2)}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">📈</div>
          <div>
            <div className="stat-value">${avgOrder.toFixed(2)}</div>
            <div className="stat-label">Avg Order Value</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>
          Transaction History
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date & Time</th>
                <th>Customer</th>
                <th>Processed By</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-3)' }}>Loading…</td></tr>
              ) : sales.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">
                      <div className="empty-icon">🧾</div>
                      <div className="empty-text">No sales recorded yet. Complete a sale from the Point of Sale module!</div>
                    </div>
                  </td>
                </tr>
              ) : (
                sales.map(s => (
                  <tr key={s.id}>
                    <td><span className="badge badge-blue">#{s.id}</span></td>
                    <td className="text-muted">{new Date(s.date).toLocaleString()}</td>
                    <td>{s.customer}</td>
                    <td><span className="badge badge-green">{s.processed_by}</span></td>
                    <td style={{ fontWeight: 700, color: 'var(--green)' }}>${s.amount.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
