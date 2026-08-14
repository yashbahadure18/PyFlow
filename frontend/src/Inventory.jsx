import React, { useState, useEffect } from 'react';

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [showAdd, setShowAdd]   = useState(false);
  const [form, setForm]         = useState({ id: '', name: '', category: '', price: '', stock: '', min_stock: '0' });
  const [alert, setAlert]       = useState(null);
  const [search, setSearch]     = useState('');

  const load = () =>
    fetch('http://localhost:5000/api/products')
      .then(r => r.json())
      .then(d => { if (d.success) setProducts(d.products); });

  useEffect(() => { load(); }, []);

  const flash = (type, msg) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 3500);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const res  = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      flash('success', 'Product added successfully');
      setShowAdd(false);
      setForm({ id: '', name: '', category: '', price: '', stock: '', min_stock: '0' });
      load();
    } else {
      flash('error', data.message);
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalProducts = products.length;
  const totalValue    = products.reduce((s, p) => s + p.price * p.stock, 0);
  const lowStock      = products.filter(p => p.stock < 10).length;

  return (
    <>
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title">Inventory Management</div>
          <div className="page-subtitle">Track and manage your product stock levels</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(v => !v)}>
          {showAdd ? '✕  Cancel' : '＋  Add Product'}
        </button>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">📦</div>
          <div>
            <div className="stat-value">{totalProducts}</div>
            <div className="stat-label">Total Products</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">💰</div>
          <div>
            <div className="stat-value">${totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
            <div className="stat-label">Inventory Value</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">⚠️</div>
          <div>
            <div className="stat-value">{lowStock}</div>
            <div className="stat-label">Low Stock Items</div>
          </div>
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.type === 'success' ? '✓' : '✕'} {alert.msg}
        </div>
      )}

      {/* Add Form */}
      {showAdd && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ fontWeight: 600, marginBottom: '1rem' }}>New Product Details</div>
          <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
            {[['Product ID', 'id'], ['Name', 'name'], ['Category', 'category'], ['Price ($)', 'price'], ['Stock', 'stock'], ['Min Stock', 'min_stock']].map(([label, key]) => (
              <div className="form-group" key={key}>
                <label className="form-label">{label}</label>
                <input
                  className="input"
                  placeholder={label}
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  required={key !== 'min_stock' && key !== 'category'}
                />
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button className="btn btn-success w-full" type="submit">Save Product</button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <input
            className="input"
            placeholder="🔍  Search products…"
            style={{ maxWidth: 280 }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <span className="text-muted">{filtered.length} items</span>
          <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={load}>↻ Refresh</button>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td><span className="badge badge-blue">{p.id}</span></td>
                  <td style={{ fontWeight: 500 }}>{p.name}</td>
                  <td className="text-muted">{p.category || '—'}</td>
                  <td style={{ fontWeight: 600 }}>${p.price.toFixed(2)}</td>
                  <td>{p.stock}</td>
                  <td>
                    <span className={`badge ${p.stock > 20 ? 'badge-green' : p.stock > 5 ? 'badge-amber' : 'badge-red'}`}>
                      {p.stock > 20 ? 'In Stock' : p.stock > 5 ? 'Low Stock' : 'Critical'}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state">
                      <div className="empty-icon">📭</div>
                      <div className="empty-text">No products found. Add one above!</div>
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
