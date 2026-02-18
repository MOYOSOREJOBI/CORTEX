/**
 * Custom hook to fetch dashboard stats and user profile.
 * Falls back to default values if the API requests fail.
 */
'use client';

import { useState, useEffect } from 'react';
import type { DashboardStats, UserProfile } from '@/lib/types';
import { DEFAULT_USER } from '@/lib/constants';

interface DashboardData {
  stats: DashboardStats | null;
  user: UserProfile;
  loading: boolean;
}

export function useDashboardData(): DashboardData {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, userRes] = await Promise.all([
          fetch('/api/dashboard/stats'),
          fetch('/api/dashboard/user'),
        ]);

        if (statsRes.ok) {
          const statsData: DashboardStats = await statsRes.json();
          setStats(statsData);
        }

        if (userRes.ok) {
          const userData: UserProfile = await userRes.json();
          setUser(userData);
        }
      } catch {
        // Silently fall back to defaults — this is a demo app
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { stats, user, loading };
}
