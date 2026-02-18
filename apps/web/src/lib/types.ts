/**
 * TypeScript interfaces for CORTEX web app.
 * Shared types used across components and API routes.
 */

/** Dashboard statistics returned by /api/dashboard/stats */
export interface DashboardStats {
  memoriesIndexed: number;
  searchQueries: number;
  privacyScore: string;
}

/** User profile returned by /api/dashboard/user */
export interface UserProfile {
  name: string;
  role: string;
  avatarUrl: string;
}

/** Sidebar menu item configuration */
export interface MenuItem {
  icon: string;
  label: string;
  description: string;
}

/** Stat card configuration for the dashboard */
export interface StatCard {
  icon: string;
  key: keyof DashboardStats;
  label: string;
  defaultValue: string;
}
