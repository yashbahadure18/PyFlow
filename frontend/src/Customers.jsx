import React, { useState, useEffect } from 'react';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [showAdd, setShowAdd]     = useState(false);
  const [form, setForm]           = useState({ id: '', name: '', contact: '', email: '' });
  const [alert, setAlert]         = useState(null);
  const [search, setSearch]       = useState('');

  const load = () =>
    fetch('http://localhost:5000/api/customers')
      .then(r => r.json())
      .then(d => { if (d.success) setCustomers(d.customers.filter(c => c.id !== 1)); });

  useEffect(() => { load(); }, []);

  const flash = (type, msg) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 3500);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const res  = await fetch('http://localhost:5000/api/customers', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      flash('success', `Customer "${form.name}" added successfully.`);
      setShowAdd(false);
      setForm({ id: '', name: '', contact: '', email: '' });
      load();
    } else {
      flash('error', data.message);
    }
  };

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Customer Management</div>
          <div className="page-subtitle">Manage your customer records</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(v => !v)}>
          {showAdd ? '✕  Cancel' : '＋  Add Customer'}
        </button>
      </div>

      {/* Stat */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        <div className="stat-card">
          <div className="stat-icon purple">👥</div>
          <div>
            <div className="stat-value">{customers.length}</div>
            <div className="stat-label">Total Customers</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">🔍</div>
          <div>
            <div className="stat-value">{filtered.length}</div>
            <div className="stat-label">Showing</div>
          </div>
        </div>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.type === 'success' ? '✓' : '✕'} {alert.msg}
        </div>
      )}

      {/* Add Form */}
      {showAdd && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ fontWeight: 600, marginBottom: '1rem' }}>New Customer Details</div>
          <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
            {[['Customer ID', 'id'], ['Full Name', 'name'], ['Phone', 'contact'], ['Email', 'email']].map(([label, key]) => (
              <div className="form-group" key={key}>
                <label className="form-label">{label}</label>
                <input
                  className="input"
                  placeholder={label}
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  required={key === 'id' || key === 'name'}
                />
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button className="btn btn-success w-full" type="submit">Save Customer</button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <input
            className="input"
            placeholder="🔍  Search customers…"
            style={{ maxWidth: 280 }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <span className="text-muted">{filtered.length} records</span>
          <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={load}>↻ Refresh</button>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td><span className="badge badge-purple" style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa' }}>{c.id}</span></td>
                  <td style={{ fontWeight: 500 }}>{c.name}</td>
                  <td className="text-muted">{c.contact || '—'}</td>
                  <td className="text-muted">{c.email || '—'}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4}>
                    <div className="empty-state">
                      <div className="empty-icon">👤</div>
                      <div className="empty-text">No customers yet. Add your first customer above!</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
