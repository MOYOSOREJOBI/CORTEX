/**
 * DemoDashboard — The glassmorphism dashboard centerpiece.
 * Converted from an Apple-style sidebar HTML/CSS/JS template.
 *
 * Interactive behaviors:
 * 1. Sidebar active state with icon pop animation
 * 2. Radial gradient hover highlight on menu items
 * 3. 3D tilt effect on stat cards following mouse position
 *
 * All styles are scoped via CSS Module (DemoDashboard.module.css).
 */
'use client';

import { useState, useCallback, useRef } from 'react';
import styles from './DemoDashboard.module.css';
import { useDashboardData } from '@/hooks/useDashboardData';
import { MENU_ITEMS, STAT_CARDS } from '@/lib/constants';
import MadeByBadge from './MadeByBadge';

export default function DemoDashboard() {
  const { stats, user } = useDashboardData();
  const [activeIndex, setActiveIndex] = useState(0);
  const [poppedIndex, setPoppedIndex] = useState<number | null>(null);
  const menuItemRefs = useRef<(HTMLLIElement | null)[]>([]);

  /**
   * Handle sidebar item click:
   * - Set active state
   * - Trigger icon pop animation (scale up then reset)
   */
  const handleMenuClick = useCallback((index: number) => {
    setActiveIndex(index);
    setPoppedIndex(index);
    setTimeout(() => setPoppedIndex(null), 200);
  }, []);

  /**
   * Handle keyboard activation (Enter/Space) for accessibility
   */
  const handleMenuKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleMenuClick(index);
      }
    },
    [handleMenuClick]
  );

  /**
   * Hover highlight effect:
   * Creates a radial gradient div at mouse position,
   * fades it out, then removes it.
   */
  const handleMenuMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLLIElement>, index: number) => {
      const item = menuItemRefs.current[index];
      if (!item) return;

      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const highlight = document.createElement('div');
      highlight.className = styles.hoverHighlight;
      highlight.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.3), transparent 50%)`;
      item.appendChild(highlight);

      // Fade out after 500ms
      setTimeout(() => {
        highlight.classList.add(styles.hoverHighlightFading);
      }, 500);

      // Remove from DOM after fade completes
      setTimeout(() => {
        if (highlight.parentNode) {
          highlight.parentNode.removeChild(highlight);
        }
      }, 800);
    },
    []
  );

  /**
   * Card 3D tilt effect:
   * Calculates rotation angles based on mouse position relative to card center.
   * Applies perspective transform for a natural tilt feel.
   */
  const handleCardMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = ((x - centerX) / centerX) * 10;
      const tiltY = ((y - centerY) / centerY) * -10;
      card.style.transform = `perspective(1000px) rotateX(${tiltY}deg) rotateY(${tiltX}deg) scale(1.05)`;
    },
    []
  );

  /**
   * Reset card transform on mouse leave with smooth transition.
   */
  const handleCardMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = e.currentTarget;
      card.style.transition = 'transform 0.5s ease';
      card.style.transform = 'none';
      setTimeout(() => {
        card.style.transition = '';
      }, 500);
    },
    []
  );

  /**
   * Format stat value for display.
   * Numbers get comma formatting, strings (like "98%") pass through.
   */
  const formatStat = (key: string, defaultValue: string): string => {
    if (!stats) return defaultValue;
    const val = stats[key as keyof typeof stats];
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return String(val);
  };

  return (
    <div className={styles.demoBody}>
      <div className={styles.container}>
        {/* ===== SIDEBAR ===== */}
        <aside className={styles.sidebar}>
          {/* Brain logo */}
          <div className={styles.logo}>
            <i className="fas fa-brain" />
            <div className={styles.logoText}>CORTEX</div>
          </div>

          {/* Navigation menu */}
          <nav className={styles.menu}>
            <ul>
              {MENU_ITEMS.map((item, index) => (
                <li
                  key={item.label}
                  ref={(el) => {
                    menuItemRefs.current[index] = el;
                  }}
                  className={`${styles.menuItem} ${
                    activeIndex === index ? styles.active : ''
                  }`}
                  onMouseEnter={(e) => handleMenuMouseEnter(e, index)}
                >
                  <button
                    className={`${styles.menuLink} ${
                      poppedIndex === index ? styles.iconPop : ''
                    }`}
                    onClick={() => handleMenuClick(index)}
                    onKeyDown={(e) => handleMenuKeyDown(e, index)}
                    tabIndex={0}
                    aria-label={item.label}
                    title={item.description}
                  >
                    <i className={item.icon} />
                    <span className={styles.menuLabel}>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* User profile */}
          <div className={styles.profile}>
            <div className={styles.avatar}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={user.avatarUrl} alt={user.name} />
            </div>
            <div className={styles.userInfo}>
              <h3>{user.name}</h3>
              <p>{user.role}</p>
            </div>
          </div>
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <main className={styles.content}>
          <header className={styles.header}>
            <h1>Welcome to Cortex</h1>
            <p>Your intelligent on-device memory — here&apos;s today&apos;s overview</p>
          </header>

          {/* Stat cards */}
          <div className={styles.cardContainer}>
            {STAT_CARDS.map((card) => (
              <div
                key={card.key}
                className={styles.card}
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
              >
                <div className={styles.cardIcon}>
                  <i className={card.icon} />
                </div>
                <div className={styles.cardInfo}>
                  <h3>{formatStat(card.key, card.defaultValue)}</h3>
                  <p>{card.label}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <MadeByBadge />
    </div>
  );
}
