'use client';

export default function AboutTab() {
  const sectionStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: 24,
    border: '1px solid rgba(255,255,255,0.08)',
    marginBottom: 20,
  };

  const h2Style: React.CSSProperties = { fontSize: 20, fontWeight: 600, marginBottom: 16, marginTop: 0 };
  const h3Style: React.CSSProperties = { fontSize: 16, fontWeight: 600, marginBottom: 10, marginTop: 0 };
  const pStyle: React.CSSProperties = { fontSize: 14, lineHeight: 1.7, opacity: 0.85, margin: '0 0 10px' };
  const stepStyle: React.CSSProperties = { fontSize: 13, lineHeight: 1.7, opacity: 0.8, margin: '0 0 6px', paddingLeft: 16 };

  return (
    <>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, margin: '0 0 8px' }}>About Cortex</h1>
        <p style={{ opacity: 0.7, fontSize: 14, margin: 0 }}>What Cortex does and how to use it.</p>
      </header>

      {/* Section 1: What Cortex Does */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>What Cortex Does</h2>
        <p style={pStyle}>Cortex is a personal memory system that runs in your browser. It stores your notes, ideas, and knowledge in a local database. Nothing leaves your device.</p>
        <p style={pStyle}><strong>Local first storage.</strong> All data lives in IndexedDB inside your browser. There is no server. There is no cloud sync. You own your data.</p>
        <p style={pStyle}><strong>Search.</strong> Cortex uses hybrid search. Keyword search finds exact matches. Semantic search finds related content. Results merge using Reciprocal Rank Fusion. Every result shows why it matched.</p>
        <p style={pStyle}><strong>Privacy.</strong> No telemetry. No tracking scripts. No analytics SDK. Exports use AES GCM encryption. App lock protects access with a passphrase. Wipe deletes everything.</p>
      </div>

      {/* Section 2: Tutorials */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>Full Tutorial</h2>

        {/* Dashboard */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={h3Style}>Dashboard</h3>
          <p style={stepStyle}>1. Open Cortex. The dashboard loads first.</p>
          <p style={stepStyle}>2. See three stat cards: Memories Indexed, Search Queries, Privacy Score.</p>
          <p style={stepStyle}>3. The Recent Activity section shows your last 10 actions.</p>
          <p style={stepStyle}>4. Click Quick Actions to jump to common tasks.</p>
          <p style={stepStyle}>5. Click Add Memory to create a new memory.</p>
          <p style={stepStyle}>6. Click Start Indexing to build the search index.</p>
        </div>

        {/* Search */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={h3Style}>Search</h3>
          <p style={stepStyle}>1. Click Search in the sidebar or press Ctrl+2.</p>
          <p style={stepStyle}>2. Type a query in the search box. Results appear as you type.</p>
          <p style={stepStyle}>3. Use the tag filter field to narrow results by tag.</p>
          <p style={stepStyle}>4. Click a result to expand it.</p>
          <p style={stepStyle}>5. The Why matched panel shows keyword hits, semantic score, recency boost, and tag boost.</p>
          <p style={stepStyle}>6. Click Copy Body to copy the memory text.</p>
        </div>

        {/* Memories */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={h3Style}>Memories</h3>
          <p style={stepStyle}>1. Click Memories in the sidebar or press Ctrl+3.</p>
          <p style={stepStyle}>2. Click Add to create a new memory. Title and body are required.</p>
          <p style={stepStyle}>3. Add tags separated by commas. Tags help with search and filtering.</p>
          <p style={stepStyle}>4. Click Edit (pen icon) on any memory to modify it. Changes autosave.</p>
          <p style={stepStyle}>5. Click Delete (trash icon) to remove a memory. An undo toast appears for 5 seconds.</p>
          <p style={stepStyle}>6. Click the checkmark icon to enable bulk selection. Select memories, then delete or tag them.</p>
          <p style={stepStyle}>7. Click Import to load .txt or .md files as new memories.</p>
          <p style={stepStyle}>8. Use the tag filter to show only memories with a specific tag.</p>
        </div>

        {/* Processing */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={h3Style}>Processing</h3>
          <p style={stepStyle}>1. Click Processing in the sidebar or press Ctrl+4.</p>
          <p style={stepStyle}>2. Click Start Indexing to build the search index.</p>
          <p style={stepStyle}>3. Watch the progress bar. It shows documents processed and estimated time.</p>
          <p style={stepStyle}>4. Click Pause to stop temporarily. Click Resume to continue.</p>
          <p style={stepStyle}>5. Click Cancel to stop indexing. The index stays consistent up to the last processed document.</p>
          <p style={stepStyle}>6. Click Rebuild Index to clear and rebuild from scratch.</p>
          <p style={stepStyle}>7. Check the logs for errors. Errors show a next action suggestion.</p>
        </div>

        {/* Privacy */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={h3Style}>Privacy</h3>
          <p style={stepStyle}>1. Click Privacy in the sidebar or press Ctrl+5.</p>
          <p style={stepStyle}>2. Toggle Reduce Motion to disable animations.</p>
          <p style={stepStyle}>3. Toggle No Remote Assets to block external resources.</p>
          <p style={stepStyle}>4. Toggle Local Analytics to control event tracking.</p>
          <p style={stepStyle}>5. All toggles apply instantly. No reload needed.</p>
        </div>

        {/* Analytics */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={h3Style}>Analytics</h3>
          <p style={stepStyle}>1. Click Analytics in the sidebar or press Ctrl+6.</p>
          <p style={stepStyle}>2. View search latency (p50 and p95), index run durations, and memory count.</p>
          <p style={stepStyle}>3. See your top tags and recent queries.</p>
          <p style={stepStyle}>4. Click CSV or JSON to export analytics data.</p>
          <p style={stepStyle}>5. Disable local analytics in Privacy to stop collecting events.</p>
        </div>

        {/* Export and Import */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={h3Style}>Export and Import</h3>
          <p style={stepStyle}>1. Go to Privacy. Scroll to Export Vault.</p>
          <p style={stepStyle}>2. Enter a passphrase. Click Export.</p>
          <p style={stepStyle}>3. A JSON file downloads. It is encrypted with AES GCM.</p>
          <p style={stepStyle}>4. To import, scroll to Import Vault. Enter the same passphrase.</p>
          <p style={stepStyle}>5. Choose the vault file. Memories restore into the database.</p>
          <p style={stepStyle}>6. The import validates the file shape and schema version before restoring.</p>
        </div>

        {/* App Lock */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={h3Style}>App Lock</h3>
          <p style={stepStyle}>1. Go to Privacy. Scroll to App Lock.</p>
          <p style={stepStyle}>2. Enter a passphrase of 4 or more characters. Click Enable Lock.</p>
          <p style={stepStyle}>3. Cortex stores a verifier hash. It does not store your passphrase.</p>
          <p style={stepStyle}>4. On next visit, a lock screen appears. Enter your passphrase to unlock.</p>
          <p style={stepStyle}>5. To remove the lock, click Disable App Lock.</p>
        </div>

        {/* Wipe and Reset */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={h3Style}>Wipe and Reset</h3>
          <p style={stepStyle}>1. Go to Privacy. Scroll to Wipe All Data.</p>
          <p style={stepStyle}>2. Type WIPE in the confirmation field.</p>
          <p style={stepStyle}>3. Click Wipe. All IndexedDB data and cached assets are removed.</p>
          <p style={stepStyle}>4. This action cannot be undone. Export your vault first if you want a backup.</p>
        </div>

        {/* Keyboard Shortcuts */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={h3Style}>Keyboard Shortcuts</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '4px 16px', fontSize: 13, opacity: 0.8 }}>
            <span style={{ fontFamily: 'monospace' }}>Ctrl+1</span><span>Dashboard</span>
            <span style={{ fontFamily: 'monospace' }}>Ctrl+2</span><span>Search</span>
            <span style={{ fontFamily: 'monospace' }}>Ctrl+3</span><span>Memories</span>
            <span style={{ fontFamily: 'monospace' }}>Ctrl+4</span><span>Processing</span>
            <span style={{ fontFamily: 'monospace' }}>Ctrl+5</span><span>Privacy</span>
            <span style={{ fontFamily: 'monospace' }}>Ctrl+6</span><span>Analytics</span>
            <span style={{ fontFamily: 'monospace' }}>Ctrl+7</span><span>About</span>
            <span style={{ fontFamily: 'monospace' }}>Tab</span><span>Move focus to next element</span>
            <span style={{ fontFamily: 'monospace' }}>Enter</span><span>Activate focused element</span>
            <span style={{ fontFamily: 'monospace' }}>Arrow keys</span><span>Move between sidebar items</span>
          </div>
        </div>

        {/* Troubleshooting */}
        <div>
          <h3 style={h3Style}>Troubleshooting</h3>
          <p style={stepStyle}><strong>Search returns no results.</strong> Make sure you have memories. Run indexing from the Processing tab.</p>
          <p style={stepStyle}><strong>Storage error.</strong> Your browser storage may be full. Export your vault. Clear old data or unused memories.</p>
          <p style={stepStyle}><strong>Import fails.</strong> Check that you use the same passphrase from the export. Verify the file is a valid Cortex vault JSON.</p>
          <p style={stepStyle}><strong>App lock blocks you.</strong> Enter the passphrase you set. If forgotten, clear browser data for this site to reset.</p>
          <p style={stepStyle}><strong>Crash or blank screen.</strong> Click Reset App on the error screen. This clears cached state but keeps IndexedDB data.</p>
          <p style={stepStyle}><strong>Performance is slow.</strong> Delete old memories. Run Rebuild Index. Close other browser tabs.</p>
        </div>
      </div>
    </>
  );
}
