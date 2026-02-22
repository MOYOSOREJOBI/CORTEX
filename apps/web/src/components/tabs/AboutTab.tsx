'use client';

import { useState } from 'react';
import { useApp } from '@/lib/context';

type Section = 'overview' | 'guide' | 'shortcuts' | 'architecture' | 'troubleshooting';

const SECTIONS: { id: Section; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: 'fas fa-brain' },
  { id: 'guide', label: 'User Guide', icon: 'fas fa-book-open' },
  { id: 'shortcuts', label: 'Shortcuts', icon: 'fas fa-keyboard' },
  { id: 'architecture', label: 'Architecture', icon: 'fas fa-cubes' },
  { id: 'troubleshooting', label: 'Troubleshooting', icon: 'fas fa-wrench' },
];

export default function AboutTab() {
  const { memories } = useApp();
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 24,
    border: '1px solid rgba(255,255,255,0.08)',
    marginBottom: 20,
  };

  const featureCardStyle: React.CSSProperties = {
    ...cardStyle,
    padding: 20,
  };

  const pillStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '8px 16px',
    borderRadius: 20,
    border: 'none',
    background: isActive ? '#0066ff' : 'rgba(255,255,255,0.08)',
    color: '#fff',
    fontSize: 13,
    fontWeight: isActive ? 600 : 400,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  });

  const stepCardStyle: React.CSSProperties = {
    display: 'flex',
    gap: 14,
    padding: 16,
    background: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.06)',
    marginBottom: 10,
  };

  const stepNumberStyle: React.CSSProperties = {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: 'rgba(0,102,255,0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 600,
    flexShrink: 0,
    color: '#6eb4ff',
  };

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const faqStyle = (isOpen: boolean): React.CSSProperties => ({
    padding: '14px 18px',
    background: isOpen ? 'rgba(0,102,255,0.08)' : 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    border: `1px solid ${isOpen ? 'rgba(0,102,255,0.2)' : 'rgba(255,255,255,0.06)'}`,
    marginBottom: 8,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  });

  const renderOverview = () => (
    <>
      {/* Hero */}
      <div style={{
        ...cardStyle,
        background: 'linear-gradient(135deg, rgba(0,102,255,0.15) 0%, rgba(0,50,150,0.1) 100%)',
        borderColor: 'rgba(0,102,255,0.2)',
        textAlign: 'center',
        padding: 40,
      }}>
        <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.9 }}>
          <i className="fas fa-brain" />
        </div>
        <h2 style={{ fontSize: 28, fontWeight: 600, margin: '0 0 12px' }}>CORTEX</h2>
        <p style={{ fontSize: 16, opacity: 0.8, margin: '0 0 6px', lineHeight: 1.6 }}>
          Intelligent on-device memory. Private by design.
        </p>
        <p style={{ fontSize: 13, opacity: 0.5 }}>Version 1.0.0</p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 20,
          marginTop: 24,
          flexWrap: 'wrap',
        }}>
          {[
            { icon: 'fas fa-lock', label: 'Zero Cloud', desc: 'All data stays local' },
            { icon: 'fas fa-bolt', label: 'Fast Search', desc: 'Hybrid keyword + semantic' },
            { icon: 'fas fa-shield-halved', label: 'Encrypted', desc: 'AES-256-GCM exports' },
          ].map((badge) => (
            <div key={badge.label} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 12,
              minWidth: 120,
            }}>
              <i className={badge.icon} style={{ fontSize: 18, color: '#6eb4ff' }} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>{badge.label}</span>
              <span style={{ fontSize: 11, opacity: 0.6 }}>{badge.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features grid */}
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>What Cortex Does</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 24 }}>
        {[
          { icon: 'fas fa-database', title: 'Store Memories', desc: 'Create, edit, tag, and organize personal knowledge in a local IndexedDB database. Your data never leaves your browser.' },
          { icon: 'fas fa-magnifying-glass', title: 'Hybrid Search', desc: 'Find memories using BM25 keyword search combined with semantic similarity. Results are fused with Reciprocal Rank Fusion.' },
          { icon: 'fas fa-file-export', title: 'Encrypted Export', desc: 'Export your entire vault as an AES-256-GCM encrypted JSON file. Import it back with your passphrase on any device.' },
          { icon: 'fas fa-chart-simple', title: 'Local Analytics', desc: 'Track search performance, tag usage, and indexing history. All metrics stay on your device with no third-party analytics.' },
          { icon: 'fas fa-lock', title: 'App Lock', desc: 'Protect access with a passphrase-based lock using PBKDF2 key derivation. Cortex never stores your passphrase.' },
          { icon: 'fas fa-microchip', title: 'Index Pipeline', desc: 'Build and rebuild the keyword search index with a controllable pipeline. Pause, resume, or cancel at any time.' },
        ].map((f) => (
          <div key={f.title} style={featureCardStyle}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'rgba(0,102,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 12,
            }}>
              <i className={f.icon} style={{ fontSize: 16, color: '#6eb4ff' }} />
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 6px' }}>{f.title}</h3>
            <p style={{ fontSize: 13, opacity: 0.7, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Live Stats */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 14 }}>Your Cortex at a Glance</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
          {[
            { label: 'Memories Stored', value: memories.length.toString(), icon: 'fas fa-layer-group' },
            { label: 'Storage', value: 'IndexedDB', icon: 'fas fa-hard-drive' },
            { label: 'Encryption', value: 'AES-256-GCM', icon: 'fas fa-lock' },
            { label: 'Search Engine', value: 'BM25 + Semantic', icon: 'fas fa-magnifying-glass' },
          ].map((stat) => (
            <div key={stat.label} style={{
              padding: '14px 16px',
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <i className={stat.icon} style={{ fontSize: 12, opacity: 0.5 }} />
                <span style={{ fontSize: 11, opacity: 0.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>{stat.label}</span>
              </div>
              <span style={{ fontSize: 16, fontWeight: 600 }}>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderGuide = () => (
    <>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>Getting Started</h2>
      {[
        {
          title: 'Create Your First Memory',
          steps: [
            'Navigate to the Memories tab using the sidebar or press Ctrl+3.',
            'Click the Add button to open the memory editor.',
            'Enter a title and body for your memory. Both fields are required.',
            'Add comma-separated tags to organize your content (e.g., "work, ideas, project").',
            'Set a sensitivity level: Normal, Sensitive, or Restricted.',
            'Click Add Memory. Your data is instantly saved to IndexedDB.',
          ],
        },
        {
          title: 'Search Your Memories',
          steps: [
            'Go to the Search tab (Ctrl+2).',
            'Type a query in the search box. Results appear as you type with debounced search.',
            'Cortex runs two parallel searches: BM25 keyword matching and semantic similarity.',
            'Results are fused using Reciprocal Rank Fusion for the best combined ranking.',
            'Click any result to expand it and see the "Why matched" breakdown.',
            'Use the tag filter field to narrow results to specific tags.',
          ],
        },
        {
          title: 'Build the Search Index',
          steps: [
            'Navigate to Processing (Ctrl+4).',
            'Click Start Indexing to build the keyword index for all stored memories.',
            'Watch the real-time progress bar and time estimate.',
            'Use Pause to temporarily halt or Cancel to stop entirely.',
            'Rebuild Index clears the old index and starts fresh.',
            'Check the logs panel for detailed processing information.',
          ],
        },
        {
          title: 'Secure Your Data',
          steps: [
            'Go to Privacy (Ctrl+5).',
            'Enable App Lock to require a passphrase on each visit.',
            'Export your vault with a strong passphrase for encrypted backup.',
            'Toggle privacy settings: Reduce Motion, No Remote Assets, Local Analytics.',
            'Use Wipe All Data to permanently erase everything. Export first.',
          ],
        },
        {
          title: 'View Analytics',
          steps: [
            'Open the Analytics tab (Ctrl+6).',
            'See search latency percentiles (p50, p95) and indexing durations.',
            'View your most-used tags and recent search queries.',
            'Export metrics as CSV or JSON for external analysis.',
            'Disable analytics in Privacy settings if you prefer not to collect metrics.',
          ],
        },
      ].map((section) => (
        <div key={section.title} style={{ ...cardStyle, padding: 20 }}>
          <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 14 }}>{section.title}</h3>
          {section.steps.map((step, i) => (
            <div key={i} style={stepCardStyle}>
              <div style={stepNumberStyle}>{i + 1}</div>
              <p style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85, margin: 0, paddingTop: 5 }}>{step}</p>
            </div>
          ))}
        </div>
      ))}

      <div style={cardStyle}>
        <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 14 }}>Import and Export</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          <div style={{ padding: 16, background: 'rgba(0,102,255,0.08)', borderRadius: 12, border: '1px solid rgba(0,102,255,0.15)' }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <i className="fas fa-download" style={{ color: '#6eb4ff' }} /> Export
            </h4>
            <p style={{ fontSize: 12, opacity: 0.7, lineHeight: 1.6, margin: 0 }}>
              Go to Privacy. Enter a passphrase. Click Export. A JSON file downloads encrypted with AES-256-GCM via PBKDF2 key derivation (100k iterations).
            </p>
          </div>
          <div style={{ padding: 16, background: 'rgba(0,102,255,0.08)', borderRadius: 12, border: '1px solid rgba(0,102,255,0.15)' }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <i className="fas fa-upload" style={{ color: '#6eb4ff' }} /> Import
            </h4>
            <p style={{ fontSize: 12, opacity: 0.7, lineHeight: 1.6, margin: 0 }}>
              Go to Privacy. Enter the same passphrase used during export. Choose your vault JSON file. Memories restore into your local database.
            </p>
          </div>
        </div>
      </div>
    </>
  );

  const renderShortcuts = () => (
    <>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>Keyboard Shortcuts</h2>
      <div style={cardStyle}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Navigation</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { keys: 'Ctrl + 1', action: 'Dashboard', desc: 'Main overview with stats and activity' },
            { keys: 'Ctrl + 2', action: 'Search', desc: 'Hybrid keyword and semantic search' },
            { keys: 'Ctrl + 3', action: 'Memories', desc: 'Create, edit, and manage memories' },
            { keys: 'Ctrl + 4', action: 'Processing', desc: 'Build and manage the search index' },
            { keys: 'Ctrl + 5', action: 'Privacy', desc: 'Privacy settings, export, and app lock' },
            { keys: 'Ctrl + 6', action: 'Analytics', desc: 'Local performance and usage metrics' },
            { keys: 'Ctrl + 7', action: 'About', desc: 'Documentation and help' },
          ].map((s) => (
            <div key={s.keys} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '10px 14px', background: 'rgba(255,255,255,0.03)',
              borderRadius: 10, border: '1px solid rgba(255,255,255,0.04)',
            }}>
              <code style={{
                padding: '4px 10px', background: 'rgba(255,255,255,0.1)',
                borderRadius: 6, fontSize: 12, fontWeight: 600, fontFamily: 'monospace',
                minWidth: 80, textAlign: 'center', border: '1px solid rgba(255,255,255,0.15)',
              }}>{s.keys}</code>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{s.action}</span>
                <span style={{ fontSize: 12, opacity: 0.5, marginLeft: 8 }}>{s.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={cardStyle}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>General</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { keys: 'Tab', action: 'Focus next element' },
            { keys: 'Shift + Tab', action: 'Focus previous element' },
            { keys: 'Enter / Space', action: 'Activate focused button or link' },
            { keys: 'Arrow Up/Down', action: 'Move between sidebar items' },
            { keys: 'Escape', action: 'Close expanded panels' },
          ].map((s) => (
            <div key={s.keys} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '10px 14px', background: 'rgba(255,255,255,0.03)',
              borderRadius: 10, border: '1px solid rgba(255,255,255,0.04)',
            }}>
              <code style={{
                padding: '4px 10px', background: 'rgba(255,255,255,0.1)',
                borderRadius: 6, fontSize: 12, fontWeight: 600, fontFamily: 'monospace',
                minWidth: 120, textAlign: 'center', border: '1px solid rgba(255,255,255,0.15)',
              }}>{s.keys}</code>
              <span style={{ fontSize: 14 }}>{s.action}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderArchitecture = () => (
    <>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>Technical Architecture</h2>
      <div style={cardStyle}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Tech Stack</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
          {[
            { label: 'Framework', value: 'Next.js 14', icon: 'fas fa-code' },
            { label: 'UI', value: 'React 18', icon: 'fab fa-react' },
            { label: 'Language', value: 'TypeScript', icon: 'fas fa-file-code' },
            { label: 'Styling', value: 'CSS Modules + Tailwind', icon: 'fas fa-palette' },
            { label: 'Database', value: 'IndexedDB', icon: 'fas fa-database' },
            { label: 'Crypto', value: 'Web Crypto API', icon: 'fas fa-key' },
          ].map((t) => (
            <div key={t.label} style={{
              padding: '12px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <i className={t.icon} style={{ fontSize: 14, opacity: 0.6 }} />
              <div>
                <p style={{ fontSize: 11, opacity: 0.5, margin: 0 }}>{t.label}</p>
                <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>{t.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Flow */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Data Flow</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap', padding: '20px 0' }}>
          {[
            { label: 'User Input', icon: 'fas fa-keyboard' },
            { label: 'React State', icon: 'fas fa-atom' },
            { label: 'Context API', icon: 'fas fa-network-wired' },
            { label: 'IndexedDB', icon: 'fas fa-database' },
          ].map((node, i) => (
            <div key={node.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                padding: '10px 16px', background: 'rgba(0,102,255,0.15)', borderRadius: 10,
                border: '1px solid rgba(0,102,255,0.2)', textAlign: 'center',
              }}>
                <i className={node.icon} style={{ display: 'block', fontSize: 16, marginBottom: 4, color: '#6eb4ff' }} />
                <span style={{ fontSize: 11, fontWeight: 500 }}>{node.label}</span>
              </div>
              {i < 3 && <i className="fas fa-arrow-right" style={{ opacity: 0.3, fontSize: 12 }} />}
            </div>
          ))}
        </div>
        <p style={{ fontSize: 13, opacity: 0.6, textAlign: 'center', margin: 0, lineHeight: 1.6 }}>
          All data flows through React Context and persists directly to IndexedDB. No server, no API calls for data storage.
        </p>
      </div>

      {/* Search Pipeline */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Search Pipeline</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { step: 'Tokenization', desc: 'Query is split into lowercase tokens with punctuation removed.' },
            { step: 'Keyword Search (BM25)', desc: 'Inverted index lookup with IDF scoring and phrase matching bonus.' },
            { step: 'Semantic Search', desc: 'Bag-of-words embeddings compared via cosine similarity.' },
            { step: 'Reciprocal Rank Fusion', desc: 'Both ranked lists merged with k=60 for balanced scoring.' },
            { step: 'Boost Layer', desc: 'Recency boost (newer is better) and tag match boost applied.' },
          ].map((item, i) => (
            <div key={item.step} style={{
              display: 'flex', gap: 12, padding: '12px 14px',
              background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,102,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 600, flexShrink: 0, color: '#6eb4ff',
              }}>{i + 1}</div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>{item.step}</p>
                <p style={{ fontSize: 12, opacity: 0.6, margin: '2px 0 0', lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Security Model</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { label: 'Encryption', value: 'AES-256-GCM via Web Crypto API' },
            { label: 'Key Derivation', value: 'PBKDF2 with 100,000 iterations and SHA-256' },
            { label: 'Salt', value: '128-bit random per export' },
            { label: 'IV', value: '96-bit random per encryption, never reused' },
            { label: 'App Lock', value: 'Verifier hash stored, passphrase never persisted' },
            { label: 'Network', value: 'Zero outbound data. No telemetry. No analytics SDK.' },
          ].map((row) => (
            <div key={row.label} style={{
              display: 'flex', justifyContent: 'space-between', padding: '8px 0',
              borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13,
            }}>
              <span style={{ opacity: 0.6 }}>{row.label}</span>
              <span style={{ fontWeight: 500, textAlign: 'right' }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderTroubleshooting = () => {
    const faqs = [
      { id: 'no-results', q: 'Search returns no results', a: 'Make sure you have memories stored. Go to the Processing tab and run Start Indexing to build the keyword index. If you recently added memories, the index may need to be rebuilt.' },
      { id: 'storage-full', q: 'Storage error or quota exceeded', a: 'Your browser storage is nearly full. Export your vault from the Privacy tab for backup, then delete old or unused memories. You can also clear browser data for this site to free space.' },
      { id: 'import-fails', q: 'Vault import fails', a: 'Ensure you are using the exact passphrase from the export. The file must be a valid Cortex vault JSON with version, salt, iv, and ciphertext fields. Corrupted files cannot be recovered.' },
      { id: 'locked-out', q: 'Locked out of app', a: 'Enter the passphrase you set in Privacy settings. If forgotten, clear browser data (site settings) for this site to reset the lock. This removes all local data.' },
      { id: 'blank-screen', q: 'Blank screen or crash', a: 'Click Reset App on the error screen. This reloads the page while keeping your IndexedDB data intact. If the issue persists, export your vault and clear site data.' },
      { id: 'slow-performance', q: 'App feels slow', a: 'Delete old memories you no longer need. Run Rebuild Index from the Processing tab. Close other browser tabs to free memory. Cortex works best with under 10,000 memories.' },
    ];
    return (
      <>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>Troubleshooting</h2>
        <div style={{ ...cardStyle, padding: 16, marginBottom: 24 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px', background: 'rgba(0,102,255,0.08)',
            borderRadius: 10, border: '1px solid rgba(0,102,255,0.15)',
          }}>
            <i className="fas fa-circle-info" style={{ color: '#6eb4ff' }} />
            <p style={{ fontSize: 13, opacity: 0.8, margin: 0, lineHeight: 1.5 }}>
              Click any question below to expand the answer. All solutions are local and do not require internet.
            </p>
          </div>
        </div>
        {faqs.map((faq) => (
          <div
            key={faq.id}
            style={faqStyle(expandedFaq === faq.id)}
            onClick={() => toggleFaq(faq.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleFaq(faq.id); } }}
            aria-expanded={expandedFaq === faq.id}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{faq.q}</span>
              <i className={`fas fa-chevron-${expandedFaq === faq.id ? 'up' : 'down'}`} style={{ fontSize: 12, opacity: 0.5 }} />
            </div>
            {expandedFaq === faq.id && (
              <p style={{
                fontSize: 13, opacity: 0.7, margin: '10px 0 0', lineHeight: 1.6,
                paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)',
              }}>
                {faq.a}
              </p>
            )}
          </div>
        ))}
        <div style={{ ...cardStyle, textAlign: 'center', marginTop: 24 }}>
          <i className="fas fa-envelope" style={{ fontSize: 24, opacity: 0.4, marginBottom: 12, display: 'block' }} />
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Still Need Help?</h3>
          <p style={{ fontSize: 13, opacity: 0.6, lineHeight: 1.6, margin: 0 }}>
            Cortex is a local-first app. All data processing happens in your browser.
            Check the Architecture section for technical details on how each feature works.
          </p>
        </div>
      </>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return renderOverview();
      case 'guide': return renderGuide();
      case 'shortcuts': return renderShortcuts();
      case 'architecture': return renderArchitecture();
      case 'troubleshooting': return renderTroubleshooting();
    }
  };

  return (
    <>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, margin: '0 0 8px' }}>About Cortex</h1>
        <p style={{ opacity: 0.7, fontSize: 14, margin: '0 0 20px' }}>Everything you need to know about Cortex.</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={pillStyle(activeSection === section.id)}
              aria-label={section.label}
              aria-current={activeSection === section.id ? 'true' : undefined}
            >
              <i className={section.icon} style={{ fontSize: 12 }} />
              {section.label}
            </button>
          ))}
        </div>
      </header>
      {renderContent()}
    </>
  );
}
