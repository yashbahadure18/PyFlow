import React, { useState, useEffect } from 'react';

export default function Reports() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/reports/sales')
      .then(res => res.json())
      .then(data => {
        if (data.success) setSales(data.sales);
      });
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Sales Report History</h2>
      
      <div className="glass glass-panel" style={{ padding: '0 1rem' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Processed By</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(s => (
              <tr key={s.id}>
                <td>#{s.id}</td>
                <td>{new Date(s.date).toLocaleString()}</td>
                <td>{s.customer}</td>
                <td>{s.processed_by}</td>
                <td style={{ fontWeight: 600, color: 'var(--success)' }}>${s.amount.toFixed(2)}</td>
              </tr>
            ))}
            {sales.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No sales recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
