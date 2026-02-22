'use client';

import { useEffect, useState } from 'react';
import { useApp } from '@/lib/context';
import * as db from '@/lib/db';
import styles from '../DemoDashboard.module.css';

interface Props {
  onNavigate: (route: string) => void;
}

export default function DashboardTab({ onNavigate }: Props) {
  const { memories, recentActivity, settings } = useApp();
  const [searchCount, setSearchCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);

  useEffect(() => {
    Promise.all([
      db.countSearchHistory(),
      db.getAnalyticsEvents().then((e) => e.length),
    ]).then(([sc, ec]) => {
      setSearchCount(sc);
      setEventCount(ec);
    }).catch(() => {});
  }, []);

  const privacyScore = (() => {
    let score = 50;
    if (settings.appLockEnabled) score += 20;
    if (settings.noRemoteAssets) score += 15;
    if (!settings.localAnalytics) score += 10;
    if (settings.reduceMotion) score += 5;
    return Math.min(score, 100);
  })();

  const pinnedCount = memories.filter((m) => m.pinned).length;
  const tagSet = new Set(memories.flatMap((m) => m.tags));

  const statCards = [
    { icon: 'fas fa-brain', label: 'Memories', value: memories.length.toLocaleString(), color: '#0066ff' },
    { icon: 'fas fa-bolt', label: 'Searches', value: searchCount.toLocaleString(), color: '#00cc88' },
    { icon: 'fas fa-shield-halved', label: 'Privacy', value: `${privacyScore}%`, color: privacyScore >= 80 ? '#00cc88' : privacyScore >= 50 ? '#cc8800' : '#cc3333' },
  ];

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (settings.reduceMotion) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = ((x - centerX) / centerX) * 8;
    const tiltY = ((y - centerY) / centerY) * -8;
    card.style.transform = `perspective(1000px) rotateX(${tiltY}deg) rotateY(${tiltX}deg) scale(1.03)`;
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transition = 'transform 0.4s ease';
    card.style.transform = 'none';
    setTimeout(() => { card.style.transition = ''; }, 400);
  };

  return (
    <>
      <header className={styles.header}>
        <h1>Welcome to Cortex</h1>
        <p>Your intelligent on-device memory. Here&apos;s today&apos;s overview.</p>
      </header>

      {/* Stat Cards */}
      <div className={styles.cardContainer}>
        {statCards.map((card) => (
          <div
            key={card.label}
            className={styles.card}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
          >
            <div className={styles.cardIcon} style={{ background: card.color }}>
              <i className={card.icon} />
            </div>
            <div className={styles.cardInfo}>
              <h3>{card.value}</h3>
              <p>{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Privacy Score Bar */}
      <section style={{ marginTop: 28 }}>
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.08)',
          padding: 20,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Privacy Score</h2>
            <span style={{ fontSize: 24, fontWeight: 700, color: privacyScore >= 80 ? '#00cc88' : privacyScore >= 50 ? '#cc8800' : '#cc3333' }}>
              {privacyScore}%
            </span>
          </div>
          <div style={{
            height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${privacyScore}%`,
              background: privacyScore >= 80 ? '#00cc88' : privacyScore >= 50 ? '#cc8800' : '#cc3333',
              borderRadius: 4,
              transition: 'width 0.6s ease',
            }} />
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
            {[
              { label: 'App Lock', active: settings.appLockEnabled },
              { label: 'No Remote Assets', active: settings.noRemoteAssets },
              { label: 'Analytics Off', active: !settings.localAnalytics },
              { label: 'Reduce Motion', active: settings.reduceMotion },
            ].map((item) => (
              <span key={item.label} style={{
                padding: '3px 10px',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 500,
                background: item.active ? 'rgba(0,204,136,0.15)' : 'rgba(255,255,255,0.06)',
                color: item.active ? '#00cc88' : 'rgba(255,255,255,0.4)',
                border: `1px solid ${item.active ? 'rgba(0,204,136,0.25)' : 'rgba(255,255,255,0.06)'}`,
              }}>
                <i className={`fas fa-${item.active ? 'check' : 'minus'}`} style={{ marginRight: 4, fontSize: 9 }} />
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats Row */}
      <section style={{ marginTop: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          {[
            { label: 'Pinned', value: pinnedCount.toString(), icon: 'fas fa-thumbtack' },
            { label: 'Tags Used', value: tagSet.size.toString(), icon: 'fas fa-tags' },
            { label: 'Events Logged', value: eventCount.toLocaleString(), icon: 'fas fa-chart-bar' },
          ].map((s) => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <i className={s.icon} style={{ fontSize: 12, opacity: 0.5 }} />
                <span style={{ fontSize: 11, opacity: 0.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</span>
              </div>
              <span style={{ fontSize: 20, fontWeight: 600 }}>{s.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 14 }}>Recent Activity</h2>
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.08)',
          padding: 20,
          minHeight: 80,
        }}>
          {recentActivity.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <i className="fas fa-clock-rotate-left" style={{ fontSize: 28, opacity: 0.3, marginBottom: 10, display: 'block' }} />
              <p style={{ opacity: 0.5, fontSize: 14, margin: 0 }}>No recent activity yet.</p>
              <p style={{ opacity: 0.35, fontSize: 12, margin: '4px 0 0' }}>Add a memory or run a search to get started.</p>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {recentActivity.slice(0, 10).map((entry, i) => (
                <li key={entry.id} style={{
                  padding: '10px 0',
                  borderBottom: i < Math.min(recentActivity.length, 10) - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 14,
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: '#0066ff', flexShrink: 0,
                    }} />
                    <strong style={{ marginRight: 6, fontWeight: 500 }}>{entry.action}</strong>
                    <span style={{ opacity: 0.7 }}>{entry.detail}</span>
                  </span>
                  <span style={{ opacity: 0.4, fontSize: 11, whiteSpace: 'nowrap', marginLeft: 12 }}>
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
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 14 }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[
            { label: 'Add Memory', icon: 'fas fa-plus', route: 'memories', color: '#0066ff' },
            { label: 'Search', icon: 'fas fa-search', route: 'search', color: '#00cc88' },
            { label: 'Start Indexing', icon: 'fas fa-play', route: 'processing', color: '#cc8800' },
            { label: 'Export Vault', icon: 'fas fa-download', route: 'privacy', color: '#8855cc' },
          ].map((qa) => (
            <button
              key={qa.label}
              onClick={() => onNavigate(qa.route)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                background: `${qa.color}22`,
                border: `1px solid ${qa.color}44`,
                borderRadius: 12,
                color: '#fff',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
              }}
              aria-label={qa.label}
            >
              <i className={qa.icon} style={{ color: qa.color }} />
              {qa.label}
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
