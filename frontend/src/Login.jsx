import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res  = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        onLogin(data.user);
      } else {
        setError(data.message || 'Invalid credentials. Please try again.');
      }
    } catch {
      setError('Cannot reach the server. Is the Python backend running on port 5000?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-glow-1" />
      <div className="login-glow-2" />

      <div className="login-card">
        <div className="login-brand">PyFlow</div>
        <div className="login-title">Welcome back</div>
        <div className="login-subtitle">Sign in to your ERP dashboard</div>

        {error && <div className="error-msg" style={{ marginBottom: '1rem' }}>⚠ {error}</div>}

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className="input"
              type="text"
              placeholder="e.g. admin"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="btn btn-primary w-full"
            type="submit"
            disabled={loading}
            style={{ marginTop: '0.5rem', padding: '0.8rem', fontSize: '0.95rem', justifyContent: 'center' }}
          >
            {loading ? 'Signing in…' : '→  Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-3)' }}>
          Default — admin / admin123
        </div>
      </div>
    </div>
  );
}
