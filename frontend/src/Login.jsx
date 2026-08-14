import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      
      if (data.success) {
        onLogin(data.user);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Cannot connect to server. Is the Python backend running?');
    }
  };

  return (
    <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, #1e293b, #0f172a)' }}>
      <div className="glass glass-panel" style={{ width: '400px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#fff' }}>PyFlow ERP</h1>
        
        {error && <div style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Username</label>
            <input 
              type="text" 
              placeholder="e.g. admin" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required
            />
          </div>
          
          <div className="input-group" style={{ marginBottom: '2rem' }}>
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" style={{ width: '100%' }}>Sign In</button>
        </form>
      </div>
    </div>
  );
}
