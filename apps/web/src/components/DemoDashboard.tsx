'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import styles from './DemoDashboard.module.css';
import { useApp } from '@/lib/context';
import { MENU_ITEMS } from '@/lib/constants';
import LockScreen from './LockScreen';
import ToastContainer from './ToastContainer';
import DashboardTab from './tabs/DashboardTab';
import SearchTab from './tabs/SearchTab';
import MemoriesTab from './tabs/MemoriesTab';
import ProcessingTab from './tabs/ProcessingTab';
import PrivacyTab from './tabs/PrivacyTab';
import AnalyticsTab from './tabs/AnalyticsTab';
import AboutTab from './tabs/AboutTab';

function getRouteFromHash(): string {
  if (typeof window === 'undefined') return 'dashboard';
  const hash = window.location.hash.replace('#', '');
  const valid = MENU_ITEMS.map((i) => i.route);
  return valid.includes(hash) ? hash : 'dashboard';
}

function getIndexFromRoute(route: string): number {
  const idx = MENU_ITEMS.findIndex((i) => i.route === route);
  return idx >= 0 ? idx : 0;
}

export default function DemoDashboard() {
  const { locked, ready, settings } = useApp();
  const [activeRoute, setActiveRoute] = useState(getRouteFromHash);
  const [poppedIndex, setPoppedIndex] = useState<number | null>(null);
  const menuItemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const activeIndex = getIndexFromRoute(activeRoute);

  // Sync hash with active route
  useEffect(() => {
    const handleHashChange = () => {
      setActiveRoute(getRouteFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    if (!window.location.hash) {
      window.location.hash = 'dashboard';
    }
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = useCallback((route: string) => {
    setActiveRoute(route);
    window.location.hash = route;
    const idx = getIndexFromRoute(route);
    setPoppedIndex(idx);
    setTimeout(() => setPoppedIndex(null), 200);
  }, []);

  // Keyboard shortcuts (Ctrl+1 through Ctrl+7)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key >= '1' && e.key <= '7') {
        e.preventDefault();
        const idx = parseInt(e.key) - 1;
        if (idx < MENU_ITEMS.length) {
          navigateTo(MENU_ITEMS[idx].route);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateTo]);

  const handleMenuClick = useCallback((index: number) => {
    navigateTo(MENU_ITEMS[index].route);
  }, [navigateTo]);

  const handleMenuKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleMenuClick(index);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = (index + 1) % MENU_ITEMS.length;
        menuItemRefs.current[next]?.querySelector('button')?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = (index - 1 + MENU_ITEMS.length) % MENU_ITEMS.length;
        menuItemRefs.current[prev]?.querySelector('button')?.focus();
      }
    },
    [handleMenuClick]
  );

  const handleMenuMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLLIElement>, index: number) => {
      if (settings.reduceMotion) return;
      const item = menuItemRefs.current[index];
      if (!item) return;

      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const highlight = document.createElement('div');
      highlight.className = styles.hoverHighlight;
      highlight.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.3), transparent 50%)`;
      item.appendChild(highlight);

      setTimeout(() => {
        highlight.classList.add(styles.hoverHighlightFading);
      }, 500);

      setTimeout(() => {
        if (highlight.parentNode) {
          highlight.parentNode.removeChild(highlight);
        }
      }, 800);
    },
    [settings.reduceMotion]
  );

  if (!ready) {
    return (
      <div className={styles.demoBody}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100vh',
          fontSize: 16,
          opacity: 0.6,
        }}>
          Loading Cortex...
        </div>
      </div>
    );
  }

  if (locked) {
    return <LockScreen />;
  }

  const renderTab = () => {
    switch (activeRoute) {
      case 'dashboard': return <DashboardTab onNavigate={navigateTo} />;
      case 'search': return <SearchTab />;
      case 'memories': return <MemoriesTab />;
      case 'processing': return <ProcessingTab />;
      case 'privacy': return <PrivacyTab />;
      case 'analytics': return <AnalyticsTab />;
      case 'about': return <AboutTab />;
      default: return <DashboardTab onNavigate={navigateTo} />;
    }
  };

  return (
    <div className={styles.demoBody}>
      <div className={styles.container}>
        {/* Sidebar */}
        <aside className={styles.sidebar} role="navigation" aria-label="Main navigation">
          <div className={styles.logo}>
            <i className="fas fa-brain" aria-hidden="true" />
            <div className={styles.logoText}>CORTEX</div>
          </div>

          <nav className={styles.menu}>
            <ul role="list">
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
                    aria-label={`${item.label} (${item.shortcut})`}
                    aria-current={activeIndex === index ? 'page' : undefined}
                    title={`${item.description} (${item.shortcut})`}
                  >
                    <i className={item.icon} aria-hidden="true" />
                    <span className={styles.menuLabel}>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Profile */}
          <div className={styles.profile}>
            <div className={styles.avatar}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/profile-avatar.jpg" alt="Profile photo" />
            </div>
            <div className={styles.userInfo}>
              <h3>Moyosore Jobi</h3>
              <p>Software Engineer</p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className={styles.content} role="main">
          {renderTab()}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
