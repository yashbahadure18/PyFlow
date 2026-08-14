import React, { useState, useEffect } from 'react';

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({ id: '', name: '', price: '', stock: '' });

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products');
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      if (res.ok) {
        setShowAdd(false);
        setNewProduct({ id: '', name: '', price: '', stock: '' });
        fetchProducts();
      }
    } catch (err) {
      console.error("Failed to add product:", err);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Inventory Management</h2>
        <button onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showAdd && (
        <div className="glass glass-panel" style={{ marginBottom: '2rem' }}>
          <h3>Add New Product</h3>
          <form onSubmit={handleAddProduct} style={{ display: 'flex', gap: '1rem', marginTop: '1rem', alignItems: 'flex-end' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>ID</label>
              <input value={newProduct.id} onChange={e => setNewProduct({...newProduct, id: e.target.value})} required />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Name</label>
              <input value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Price</label>
              <input type="number" step="0.01" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Stock</label>
              <input type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} required />
            </div>
            <button className="success" type="submit">Save</button>
          </form>
        </div>
      )}

      <div className="glass glass-panel" style={{ padding: '0 1rem' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.category || '-'}</td>
                <td>${p.price.toFixed(2)}</td>
                <td>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '9999px', 
                    fontSize: '0.75rem', 
                    background: p.stock > 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: p.stock > 0 ? '#34d399' : '#f87171'
                  }}>
                    {p.stock}
                  </span>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
