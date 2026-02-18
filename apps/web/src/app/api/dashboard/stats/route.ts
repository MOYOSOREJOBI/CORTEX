/**
 * GET /api/dashboard/stats
 * Returns mock dashboard statistics for the CORTEX demo.
 * In a real app, this would query an on-device database.
 */
import { NextResponse } from 'next/server';
import type { DashboardStats } from '@/lib/types';

export async function GET() {
  const stats: DashboardStats = {
    memoriesIndexed: 2847,
    searchQueries: 156,
    privacyScore: '98%',
  };

  return NextResponse.json(stats);
}
