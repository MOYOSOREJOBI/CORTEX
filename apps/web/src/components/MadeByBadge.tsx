/**
 * MadeByBadge — Fixed bottom-right credit badge.
 * Appears on every page as a subtle glassmorphism element.
 * Links to Moyosore Jobi's portfolio site.
 */
'use client';

export default function MadeByBadge() {
  return (
    <a
      href="https://moyosore.dev"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 14px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '12px',
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: '12px',
        fontWeight: 500,
        textDecoration: 'none',
        letterSpacing: '0.3px',
        transition: 'all 0.3s ease',
        fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)';
        e.currentTarget.style.color = '#fff';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
      }}
    >
      <span style={{ fontSize: '14px' }}>⚡</span>
      Built by Moyosore Jobi
    </a>
  );
}
