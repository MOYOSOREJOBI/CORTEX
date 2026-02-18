'use client';

import { useEffect, useState } from 'react';
import { useApp } from '@/lib/context';
import * as db from '@/lib/db';
import styles from '../DemoDashboard.module.css';

interface Props {
  onNavigate: (route: string) => void;
}

export default function DashboardTab({ onNavigate }: Props) {
  const { memories, recentActivity, settings, showToast, addActivity, trackEvent } = useApp();
  const [searchCount, setSearchCount] = useState(0);

  useEffect(() => {
    db.countSearchHistory().then(setSearchCount).catch(() => {});
  }, []);

  const privacyScore = (() => {
    let score = 50;
    if (settings.appLockEnabled) score += 20;
    if (settings.noRemoteAssets) score += 15;
    if (!settings.localAnalytics) score += 10;
    if (settings.reduceMotion) score += 5;
    return Math.min(score, 100);
  })();

  const statValues = {
    memoriesIndexed: memories.length,
    searchQueries: searchCount,
    privacyScore,
  };

  const statCards = [
    { icon: 'fas fa-brain', label: 'Memories Indexed', value: memories.length.toLocaleString() },
    { icon: 'fas fa-bolt', label: 'Search Queries', value: searchCount.toLocaleString() },
    { icon: 'fas fa-shield-halved', label: 'Privacy Score', value: `${privacyScore}%` },
  ];

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (settings.reduceMotion) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = ((x - centerX) / centerX) * 10;
    const tiltY = ((y - centerY) / centerY) * -10;
    card.style.transform = `perspective(1000px) rotateX(${tiltY}deg) rotateY(${tiltX}deg) scale(1.05)`;
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transition = 'transform 0.5s ease';
    card.style.transform = 'none';
    setTimeout(() => {
      card.style.transition = '';
    }, 500);
  };

  const handleAddMemory = () => onNavigate('memories');
  const handleStartIndexing = () => onNavigate('processing');
  const handleExportVault = () => onNavigate('privacy');
  const handleOpenAbout = () => onNavigate('about');

  return (
    <>
      <header className={styles.header}>
        <h1>Welcome to Cortex</h1>
        <p>Your intelligent on device memory, here&apos;s today&apos;s overview.</p>
      </header>

      <div className={styles.cardContainer}>
        {statCards.map((card) => (
          <div
            key={card.label}
            className={styles.card}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
          >
            <div className={styles.cardIcon}>
              <i className={card.icon} />
            </div>
            <div className={styles.cardInfo}>
              <h3>{card.value}</h3>
              <p>{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Recent Activity</h2>
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.08)',
          padding: 20,
          minHeight: 100,
        }}>
          {recentActivity.length === 0 ? (
            <p style={{ opacity: 0.6, fontSize: 14 }}>No recent activity. Add a memory or run a search to get started.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {recentActivity.slice(0, 10).map((entry) => (
                <li key={entry.id} style={{
                  padding: '8px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 14,
                }}>
                  <span>
                    <strong style={{ marginRight: 8 }}>{entry.action}</strong>
                    {entry.detail}
                  </span>
                  <span style={{ opacity: 0.5, fontSize: 12, whiteSpace: 'nowrap', marginLeft: 12 }}>
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { label: 'Add Memory', icon: 'fas fa-plus', action: handleAddMemory },
            { label: 'Start Indexing', icon: 'fas fa-play', action: handleStartIndexing },
            { label: 'Export Vault', icon: 'fas fa-download', action: handleExportVault },
            { label: 'Open About', icon: 'fas fa-circle-info', action: handleOpenAbout },
          ].map((qa) => (
            <button
              key={qa.label}
              onClick={qa.action}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                background: 'rgba(0,102,255,0.2)',
                border: '1px solid rgba(0,102,255,0.3)',
                borderRadius: 12,
                color: '#fff',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
              }}
              aria-label={qa.label}
            >
              <i className={qa.icon} />
              {qa.label}
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
