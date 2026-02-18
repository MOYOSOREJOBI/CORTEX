/**
 * PageWrapper — Shared layout wrapper for content pages.
 * Provides dark themed background, navbar, footer, and centered glassmorphism card.
 */

import Navbar from './Navbar';
import Footer from './Footer';
import MadeByBadge from './MadeByBadge';

interface PageWrapperProps {
  children: React.ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a4e 50%, #0a0a1a 100%)',
        color: '#fff',
        fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar />

      {/* Main content area — centered with glassmorphism card */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '100px 40px 40px',
        }}
      >
        <div
          style={{
            maxWidth: '800px',
            width: '100%',
            background: 'rgba(255, 255, 255, 0.06)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            padding: '48px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}
        >
          {children}
        </div>
      </main>

      <Footer />
      <MadeByBadge />
    </div>
  );
}
