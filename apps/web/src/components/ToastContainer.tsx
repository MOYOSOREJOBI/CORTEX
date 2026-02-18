'use client';

import { useApp } from '@/lib/context';

export default function ToastContainer() {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        maxWidth: 440,
        width: '90%',
      }}
      role="status"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 16px',
            background: toast.type === 'error'
              ? 'rgba(200,50,50,0.9)'
              : toast.type === 'success'
              ? 'rgba(40,140,40,0.9)'
              : 'rgba(60,60,160,0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: 12,
            color: '#fff',
            fontSize: 14,
            fontFamily: "'SF Pro Display', -apple-system, sans-serif",
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          <span style={{ flex: 1 }}>{toast.message}</span>
          {toast.undoAction && (
            <button
              onClick={() => {
                toast.undoAction?.();
                dismissToast(toast.id);
              }}
              style={{
                padding: '4px 10px',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: 6,
                color: '#fff',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Undo
            </button>
          )}
          <button
            onClick={() => dismissToast(toast.id)}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
              fontSize: 16,
              padding: '0 4px',
            }}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
