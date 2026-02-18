/**
 * Navbar — Shared navigation bar for non-demo content pages.
 * Uses glassmorphism styling consistent with the CORTEX design system.
 */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CortexLogo from './CortexLogo';
import { NAV_LINKS } from '@/lib/constants';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 40px',
        background: 'rgba(10, 10, 26, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Logo + brand */}
      <Link
        href="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none',
          color: '#fff',
        }}
      >
        <CortexLogo size={28} />
        <span
          style={{
            fontSize: '16px',
            fontWeight: 600,
            letterSpacing: '2px',
            textTransform: 'uppercase' as const,
          }}
        >
          CORTEX
        </span>
      </Link>

      {/* Navigation links */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                background: isActive ? 'rgba(0, 102, 255, 0.3)' : 'transparent',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'all 0.2s ease',
                border: isActive
                  ? '1px solid rgba(0, 102, 255, 0.4)'
                  : '1px solid transparent',
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
