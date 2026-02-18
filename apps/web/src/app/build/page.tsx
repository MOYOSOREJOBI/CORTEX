/**
 * Build/Tech Stack page — "/build"
 * Lists all technologies used across the web and iOS apps.
 */

import PageWrapper from '@/components/PageWrapper';

export const metadata = {
  title: 'Tech Stack — CORTEX',
  description: 'Technologies powering the CORTEX memory system.',
};

/** Technology categories with their items */
const techStack = [
  {
    category: 'Web App',
    color: '#0066ff',
    items: [
      { name: 'Next.js 14', desc: 'App Router, React Server Components' },
      { name: 'TypeScript', desc: 'Strict mode, full type safety' },
      { name: 'Tailwind CSS', desc: 'Utility-first CSS framework' },
      { name: 'CSS Modules', desc: 'Scoped glassmorphism styles' },
      { name: 'Vercel', desc: 'Edge deployment, instant rollbacks' },
      { name: 'pnpm', desc: 'Fast, disk-efficient package manager' },
    ],
  },
  {
    category: 'iOS App',
    color: '#00aaff',
    items: [
      { name: 'SwiftUI', desc: 'Declarative UI, iOS 17+ target' },
      { name: 'Swift Actors', desc: 'Safe concurrency for services' },
      { name: 'Core ML', desc: 'On-device ML inference, embeddings' },
      { name: 'Vision', desc: 'OCR for photos and documents' },
      { name: 'NaturalLanguage', desc: 'Named entity recognition' },
      { name: 'SQLite FTS5', desc: 'Full-text search engine' },
    ],
  },
  {
    category: 'Security & Privacy',
    color: '#00cc88',
    items: [
      { name: 'CryptoKit', desc: 'AES-GCM encryption at rest' },
      { name: 'Keychain', desc: 'Secure key storage, biometric access' },
      { name: 'On-Device Only', desc: 'Zero cloud dependencies' },
      { name: 'Zero Telemetry', desc: 'No analytics, no tracking' },
    ],
  },
  {
    category: 'Development & CI',
    color: '#ff6600',
    items: [
      { name: 'GitHub Actions', desc: 'Automated lint + build pipeline' },
      { name: 'ESLint', desc: 'Next.js recommended rules' },
      { name: 'XcodeGen', desc: 'Generate Xcode project from YAML' },
      { name: 'pnpm Workspaces', desc: 'Monorepo package management' },
    ],
  },
];

export default function BuildPage() {
  return (
    <PageWrapper>
      <h1
        style={{
          fontSize: '32px',
          fontWeight: 600,
          marginBottom: '8px',
          background: 'linear-gradient(135deg, #fff, #0066ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Tech Stack &amp; Build
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '32px', fontSize: '15px' }}>
        The technologies powering CORTEX across web and iOS platforms.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {techStack.map((section) => (
          <div key={section.category}>
            <h2
              style={{
                fontSize: '18px',
                fontWeight: 600,
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: section.color,
                  display: 'inline-block',
                }}
              />
              {section.category}
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
              }}
            >
              {section.items.map((item) => (
                <div
                  key={item.name}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: '10px',
                    padding: '14px 16px',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '2px' }}>
                    {item.name}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.5)',
                      lineHeight: 1.4,
                    }}
                  >
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
