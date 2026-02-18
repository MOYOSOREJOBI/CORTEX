/**
 * Root layout — wraps all pages in the CORTEX web app.
 * Loads global styles, Font Awesome CDN, and sets metadata.
 */

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CORTEX — Intelligent On-Device Memory',
  description:
    'AI-powered on-device memory system with smart indexing, hybrid search, and privacy-first architecture. Built by Moyosore Jobi.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Font Awesome CDN — enables all fa-* icon classes */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
