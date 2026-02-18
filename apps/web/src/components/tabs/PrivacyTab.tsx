'use client';

import { useState, useCallback } from 'react';
import { useApp } from '@/lib/context';
import { encryptData, decryptData, createVerifier } from '@/lib/crypto';
import * as db from '@/lib/db';
import type { VaultExport, Memory } from '@/lib/types';

export default function PrivacyTab() {
  const { settings, saveSettings, memories, loadMemories, showToast, addActivity, trackEvent } = useApp();

  const [exportPassphrase, setExportPassphrase] = useState('');
  const [importPassphrase, setImportPassphrase] = useState('');
  const [lockPassphrase, setLockPassphrase] = useState('');
  const [wipeConfirmation, setWipeConfirmation] = useState('');
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);

  // Privacy toggles
  const handleToggle = async (key: 'reduceMotion' | 'noRemoteAssets' | 'localAnalytics') => {
    const updated = { ...settings, [key]: !settings[key] };
    await saveSettings(updated);
    showToast('success', `${key === 'reduceMotion' ? 'Reduce motion' : key === 'noRemoteAssets' ? 'No remote assets' : 'Local analytics'} ${updated[key] ? 'enabled' : 'disabled'}.`);
  };

  // Export
  const handleExport = async () => {
    if (!exportPassphrase.trim()) {
      showToast('error', 'Enter a passphrase to encrypt the export.');
      return;
    }
    setExporting(true);
    try {
      const allMemories = await db.getAllMemories();
      const data = JSON.stringify({ memories: allMemories, exportedAt: Date.now(), version: 1 });
      const vault = await encryptData(data, exportPassphrase);
      const blob = new Blob([JSON.stringify(vault)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cortex-vault-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setExportPassphrase('');
      addActivity('Export', `${allMemories.length} memories`);
      trackEvent({ type: 'export', detail: `${allMemories.length} memories` });
      showToast('success', 'Vault exported and encrypted.');
    } catch (err) {
      showToast('error', 'Export failed. ' + (err instanceof Error ? err.message : 'Unknown error.'));
    } finally {
      setExporting(false);
    }
  };

  // Import
  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!importPassphrase.trim()) {
      showToast('error', 'Enter the passphrase used during export.');
      return;
    }
    setImporting(true);
    try {
      const text = await file.text();
      const vault: VaultExport = JSON.parse(text);

      // Validate vault shape
      if (!vault.version || !vault.salt || !vault.iv || !vault.ciphertext) {
        showToast('error', 'Invalid vault file. Missing required fields.');
        return;
      }

      const decrypted = await decryptData(vault, importPassphrase);
      const parsed = JSON.parse(decrypted);

      if (!parsed.memories || !Array.isArray(parsed.memories)) {
        showToast('error', 'Invalid vault data. No memories found.');
        return;
      }

      let imported = 0;
      for (const mem of parsed.memories as Memory[]) {
        if (mem.id && mem.title && mem.body) {
          await db.putMemory(mem);
          imported++;
        }
      }
      await loadMemories();
      setImportPassphrase('');
      addActivity('Import', `${imported} memories from vault`);
      trackEvent({ type: 'import', detail: `${imported} memories` });
      showToast('success', `${imported} memories imported from vault.`);
    } catch (err) {
      showToast('error', 'Import failed. Check your passphrase and file.');
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  // App Lock
  const handleEnableLock = async () => {
    if (!lockPassphrase.trim() || lockPassphrase.length < 4) {
      showToast('error', 'Passphrase must be at least 4 characters.');
      return;
    }
    const { verifier, salt } = await createVerifier(lockPassphrase);
    await saveSettings({
      ...settings,
      appLockEnabled: true,
      appLockVerifier: verifier,
      appLockSalt: salt,
    });
    setLockPassphrase('');
    addActivity('App Lock', 'Enabled');
    trackEvent({ type: 'app_lock', detail: 'enabled' });
    showToast('success', 'App lock enabled. You will need the passphrase to open Cortex.');
  };

  const handleDisableLock = async () => {
    await saveSettings({
      ...settings,
      appLockEnabled: false,
      appLockVerifier: null,
      appLockSalt: null,
    });
    addActivity('App Lock', 'Disabled');
    showToast('success', 'App lock disabled.');
  };

  // Wipe
  const handleWipe = async () => {
    if (wipeConfirmation !== 'WIPE') {
      showToast('error', 'Type WIPE to confirm.');
      return;
    }
    await db.wipeAllData();
    await loadMemories();
    setWipeConfirmation('');
    addActivity('Wipe', 'All data cleared');
    trackEvent({ type: 'wipe', detail: 'all' });
    showToast('info', 'All data has been wiped.');
  };

  const inputStyle: React.CSSProperties = {
    padding: '10px 14px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 10,
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    fontFamily: 'inherit',
    width: '100%',
  };

  const btnStyle: React.CSSProperties = {
    padding: '10px 18px',
    border: 'none',
    borderRadius: 10,
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  };

  const sectionStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: 20,
    border: '1px solid rgba(255,255,255,0.08)',
    marginBottom: 20,
  };

  return (
    <>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, margin: '0 0 8px' }}>Privacy</h1>
        <p style={{ opacity: 0.7, fontSize: 14, margin: 0 }}>Control your privacy settings. All data stays on this device.</p>
      </header>

      {/* Privacy toggles */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Privacy Controls</h2>
        {[
          { key: 'reduceMotion' as const, label: 'Reduce Motion', desc: 'Disable animations and transitions.' },
          { key: 'noRemoteAssets' as const, label: 'No Remote Assets', desc: 'Block external images and resources.' },
          { key: 'localAnalytics' as const, label: 'Local Analytics', desc: 'Store usage metrics locally. Turn off to stop collecting analytics.' },
        ].map((toggle) => (
          <div key={toggle.key} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div>
              <p style={{ margin: 0, fontWeight: 500, fontSize: 14 }}>{toggle.label}</p>
              <p style={{ margin: '2px 0 0', opacity: 0.5, fontSize: 12 }}>{toggle.desc}</p>
            </div>
            <button
              onClick={() => handleToggle(toggle.key)}
              style={{
                width: 48,
                height: 26,
                borderRadius: 13,
                border: 'none',
                background: settings[toggle.key] ? '#0066ff' : 'rgba(255,255,255,0.2)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.2s',
              }}
              role="switch"
              aria-checked={settings[toggle.key]}
              aria-label={toggle.label}
            >
              <span style={{
                position: 'absolute',
                top: 3,
                left: settings[toggle.key] ? 24 : 3,
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: '#fff',
                transition: 'left 0.2s',
              }} />
            </button>
          </div>
        ))}
        <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(0,102,255,0.1)', borderRadius: 10, fontSize: 13 }}>
          <i className="fas fa-shield-halved" style={{ marginRight: 6 }} />
          No telemetry. No third party tracking scripts. No analytics SDK.
        </div>
      </div>

      {/* Export */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Export Vault</h2>
        <p style={{ opacity: 0.6, fontSize: 13, marginBottom: 12 }}>Export all memories as an encrypted JSON file.</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="password"
            value={exportPassphrase}
            onChange={(e) => setExportPassphrase(e.target.value)}
            placeholder="Encryption passphrase"
            style={{ ...inputStyle, flex: 1 }}
            aria-label="Export passphrase"
          />
          <button
            onClick={handleExport}
            disabled={exporting}
            style={{ ...btnStyle, background: '#0066ff', opacity: exporting ? 0.5 : 1 }}
          >
            {exporting ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>

      {/* Import */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Import Vault</h2>
        <p style={{ opacity: 0.6, fontSize: 13, marginBottom: 12 }}>Import an encrypted vault file.</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            type="password"
            value={importPassphrase}
            onChange={(e) => setImportPassphrase(e.target.value)}
            placeholder="Decryption passphrase"
            style={{ ...inputStyle, flex: 1 }}
            aria-label="Import passphrase"
          />
          <label style={{ ...btnStyle, background: '#0066ff', display: 'flex', alignItems: 'center', gap: 6, opacity: importing ? 0.5 : 1 }}>
            {importing ? 'Importing...' : 'Choose File'}
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              disabled={importing}
              style={{ display: 'none' }}
              aria-label="Select vault file"
            />
          </label>
        </div>
      </div>

      {/* App Lock */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>App Lock</h2>
        <p style={{ opacity: 0.6, fontSize: 13, marginBottom: 12 }}>
          {settings.appLockEnabled
            ? 'App lock is enabled. A passphrase is required on each visit.'
            : 'Set a passphrase to lock the app.'}
        </p>
        {settings.appLockEnabled ? (
          <button onClick={handleDisableLock} style={{ ...btnStyle, background: '#cc3333' }}>
            Disable App Lock
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="password"
              value={lockPassphrase}
              onChange={(e) => setLockPassphrase(e.target.value)}
              placeholder="Set passphrase (4+ characters)"
              style={{ ...inputStyle, flex: 1 }}
              aria-label="App lock passphrase"
            />
            <button onClick={handleEnableLock} style={{ ...btnStyle, background: '#0066ff' }}>
              Enable Lock
            </button>
          </div>
        )}
      </div>

      {/* Wipe */}
      <div style={{ ...sectionStyle, borderColor: 'rgba(255,60,60,0.2)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: '#ff6666' }}>Wipe All Data</h2>
        <p style={{ opacity: 0.6, fontSize: 13, marginBottom: 12 }}>This removes all IndexedDB data and cached assets. This action cannot be undone.</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={wipeConfirmation}
            onChange={(e) => setWipeConfirmation(e.target.value)}
            placeholder='Type WIPE to confirm'
            style={{ ...inputStyle, flex: 1, borderColor: wipeConfirmation === 'WIPE' ? 'rgba(255,60,60,0.5)' : undefined }}
            aria-label="Wipe confirmation"
          />
          <button
            onClick={handleWipe}
            disabled={wipeConfirmation !== 'WIPE'}
            style={{ ...btnStyle, background: '#cc3333', opacity: wipeConfirmation !== 'WIPE' ? 0.5 : 1 }}
          >
            Wipe
          </button>
        </div>
      </div>
    </>
  );
}
