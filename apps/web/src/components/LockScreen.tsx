'use client';

import { useState } from 'react';
import { useApp } from '@/lib/context';
import { verifyPassphrase } from '@/lib/crypto';

export default function LockScreen() {
  const { settings, setLocked } = useApp();
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphrase.trim()) {
      setError('Enter your passphrase.');
      return;
    }
    if (!settings.appLockVerifier || !settings.appLockSalt) {
      setError('Lock configuration is missing. Clear browser data to reset.');
      return;
    }
    setChecking(true);
    setError('');
    const valid = await verifyPassphrase(passphrase, settings.appLockVerifier, settings.appLockSalt);
    if (valid) {
      setLocked(false);
    } else {
      setError('Wrong passphrase. Try again.');
    }
    setChecking(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a4e 0%, #0077ff 74%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
      color: '#fff',
      padding: 40,
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(30px)',
        borderRadius: 24,
        padding: 40,
        maxWidth: 400,
        width: '100%',
        textAlign: 'center',
        border: '1px solid rgba(255,255,255,0.18)',
      }}>
        <i className="fas fa-lock" style={{ fontSize: 48, marginBottom: 16, opacity: 0.8 }} />
        <h1 style={{ fontSize: 24, fontWeight: 600, margin: '0 0 8px' }}>Cortex is Locked</h1>
        <p style={{ opacity: 0.6, fontSize: 14, marginBottom: 24 }}>Enter your passphrase to unlock.</p>
        <form onSubmit={handleUnlock}>
          <input
            type="password"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            placeholder="Passphrase"
            autoFocus
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.08)',
              border: `1px solid ${error ? 'rgba(255,60,60,0.5)' : 'rgba(255,255,255,0.15)'}`,
              borderRadius: 12,
              color: '#fff',
              fontSize: 15,
              outline: 'none',
              fontFamily: 'inherit',
              marginBottom: 12,
              boxSizing: 'border-box',
            }}
            aria-label="Passphrase"
          />
          {error && <p style={{ color: '#ff6666', fontSize: 13, margin: '0 0 12px' }}>{error}</p>}
          <button
            type="submit"
            disabled={checking}
            style={{
              width: '100%',
              padding: '12px',
              background: '#0066ff',
              border: 'none',
              borderRadius: 12,
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              cursor: checking ? 'wait' : 'pointer',
              fontFamily: 'inherit',
              opacity: checking ? 0.6 : 1,
            }}
          >
            {checking ? 'Checking...' : 'Unlock'}
          </button>
        </form>
      </div>
    </div>
  );
}
