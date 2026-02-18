'use client';

/**
 * Legacy hook. Dashboard now uses AppContext directly.
 * Kept for backward compatibility.
 */

import { DEFAULT_USER } from '@/lib/constants';
import type { DashboardStats, UserProfile } from '@/lib/types';

interface DashboardData {
  stats: DashboardStats | null;
  user: UserProfile;
  loading: boolean;
}

export function useDashboardData(): DashboardData {
  return {
    stats: null,
    user: DEFAULT_USER,
    loading: false,
  };
}
