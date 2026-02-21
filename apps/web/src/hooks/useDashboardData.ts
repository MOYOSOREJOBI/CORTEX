'use client';

/**
 * Dashboard data hook for CORTEX.
 * Returns computed dashboard metrics from the app context.
 */

import { useApp } from '@/lib/context';
import * as db from '@/lib/db';
import { useEffect, useState } from 'react';

interface DashboardData {
  memoriesCount: number;
  searchCount: number;
  privacyScore: number;
  loading: boolean;
}

export function useDashboardData(): DashboardData {
  const { memories, settings } = useApp();
  const [searchCount, setSearchCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.countSearchHistory()
      .then(setSearchCount)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const privacyScore = (() => {
    let score = 50;
    if (settings.appLockEnabled) score += 20;
    if (settings.noRemoteAssets) score += 15;
    if (!settings.localAnalytics) score += 10;
    if (settings.reduceMotion) score += 5;
    return Math.min(score, 100);
  })();

  return {
    memoriesCount: memories.length,
    searchCount,
    privacyScore,
    loading,
  };
}
