/**
 * Footer — Shared footer for content pages.
 * Includes credit line and subtle glassmorphism border.
 */

export default function Footer() {
  return (
    <footer
      style={{
        textAlign: 'center',
        padding: '24px 40px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '13px',
        fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
        letterSpacing: '0.3px',
      }}
    >
      <p style={{ margin: 0 }}>
        CORTEX — Intelligent On-Device Memory &middot; Built by{' '}
        <a
          href="https://moyosore.dev"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#0066ff',
            textDecoration: 'none',
          }}
        >
          Moyosore Jobi
        </a>
      </p>
    </footer>
  );
}
