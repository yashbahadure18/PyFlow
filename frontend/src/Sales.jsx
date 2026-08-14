import React, { useState, useEffect } from 'react';

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [cart, setCart]         = useState([]);
  const [alert, setAlert]       = useState(null);

  const load = () =>
    fetch('http://localhost:5000/api/products')
      .then(r => r.json())
      .then(d => { if (d.success) setProducts(d.products); });

  useEffect(() => { load(); }, []);

  const flash = (type, msg) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 4000);
  };

  const addToCart = (product) => {
    if (product.stock <= 0) return flash('error', `"${product.name}" is out of stock.`);
    const existing = cart.find(i => i.product_id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) return flash('error', `Max available stock reached for "${product.name}".`);
      setCart(cart.map(i => i.product_id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { product_id: product.id, name: product.name, price: product.price, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => setCart(cart.filter(i => i.product_id !== id));

  const checkout = async () => {
    if (cart.length === 0) return;
    try {
      const res  = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart }),
      });
      const data = await res.json();
      if (data.success) {
        flash('success', `Order #${data.order_id} placed successfully! Stock updated.`);
        setCart([]);
        load();
      } else {
        flash('error', data.message);
      }
    } catch { flash('error', 'Failed to reach the server.'); }
  };

  const cartTotal = cart.reduce((t, i) => t + i.price * i.quantity, 0);

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Point of Sale</div>
          <div className="page-subtitle">Select products and complete a sale</div>
        </div>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.type === 'success' ? '✓' : '✕'} {alert.msg}</div>}

      <div className="pos-grid">
        {/* Product Grid */}
        <div>
          <div style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-2)', fontSize: '0.875rem' }}>
            AVAILABLE PRODUCTS — click to add
          </div>
          <div className="product-grid">
            {products.map(p => (
              <div
                key={p.id}
                className={`product-card ${p.stock <= 0 ? 'disabled' : ''}`}
                onClick={() => addToCart(p)}
              >
                <div className="product-name">{p.name}</div>
                <div className="product-meta">{p.category || 'General'}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  <div className="product-price">${p.price.toFixed(2)}</div>
                  <span className={`badge ${p.stock > 10 ? 'badge-green' : p.stock > 0 ? 'badge-amber' : 'badge-red'}`}>
                    {p.stock > 0 ? `${p.stock} left` : 'Out'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart */}
        <div className="cart-card">
          <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>🛒 Current Order</div>

          <div style={{ flex: 1, maxHeight: '380px', overflowY: 'auto' }}>
            {cart.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem 0' }}>
                <div className="empty-icon">🛍️</div>
                <div className="empty-text">Your cart is empty</div>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.product_id} className="cart-item">
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{item.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>
                      ${item.price.toFixed(2)} × {item.quantity}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span>
                    <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.product_id)}>✕</button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="cart-total-row">
            <span>Total</span>
            <span style={{ color: 'var(--green)' }}>${cartTotal.toFixed(2)}</span>
          </div>

          <button
            className="btn btn-success w-full"
            style={{ justifyContent: 'center', padding: '0.9rem', fontSize: '1rem' }}
            onClick={checkout}
            disabled={cart.length === 0}
          >
            ✓  Complete Checkout
          </button>
        </div>
      </div>
    </>
  );
}
