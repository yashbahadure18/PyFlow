import React, { useState, useEffect } from 'react';

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) setProducts(data.products);
      });
  }, []);

  const addToCart = (product) => {
    if (product.stock <= 0) {
      setErrorMsg(`Not enough stock for ${product.name}`);
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    
    const existing = cart.find(item => item.product_id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) {
        setErrorMsg(`Cannot add more than available stock for ${product.name}`);
        return;
      }
      setCart(cart.map(item => 
        item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { product_id: product.id, name: product.name, price: product.price, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product_id !== productId));
  };

  const checkout = async () => {
    if (cart.length === 0) return;
    
    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart })
      });
      const data = await res.json();
      
      if (data.success) {
        setSuccessMsg(`Order #${data.order_id} placed successfully!`);
        setCart([]);
        // Refresh products to show updated stock
        const pRes = await fetch('http://localhost:5000/api/products');
        const pData = await pRes.json();
        if (pData.success) setProducts(pData.products);
      } else {
        setErrorMsg(data.message);
      }
    } catch (err) {
      setErrorMsg("Failed to place order.");
    }
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div style={{ display: 'flex', gap: '2rem', height: '100%' }}>
      {/* Product List */}
      <div style={{ flex: 2 }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Point of Sale (Products)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {products.map(p => (
            <div key={p.id} className="glass glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{p.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                Stock: {p.stock} | ${p.price.toFixed(2)}
              </div>
              <button 
                onClick={() => addToCart(p)}
                style={{ marginTop: 'auto', opacity: p.stock > 0 ? 1 : 0.5 }}
                disabled={p.stock <= 0}
              >
                {p.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Shopping Cart */}
      <div className="glass glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Current Order</h2>
        
        {errorMsg && <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.875rem' }}>{errorMsg}</div>}
        {successMsg && <div style={{ color: 'var(--success)', marginBottom: '1rem', fontSize: '0.875rem' }}>{successMsg}</div>}
        
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem' }}>
          {cart.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>Cart is empty</div>
          ) : (
            cart.map(item => (
              <div key={item.product_id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 500 }}>{item.name}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    ${item.price.toFixed(2)} x {item.quantity}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</div>
                  <button className="danger" style={{ padding: '0.25rem 0.5rem' }} onClick={() => removeFromCart(item.product_id)}>X</button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div style={{ paddingTop: '1rem', borderTop: '2px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            <span>Total:</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <button className="success" style={{ width: '100%', padding: '1rem' }} onClick={checkout} disabled={cart.length === 0}>
            Complete Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
