/**
 * GET /api/dashboard/user
 * Returns the user profile for the CORTEX demo dashboard.
 * In a real app, this would read from device-local user preferences.
 */
import { NextResponse } from 'next/server';
import type { UserProfile } from '@/lib/types';

export async function GET() {
  const user: UserProfile = {
    name: 'Moyosore Jobi',
    role: 'Software Engineer',
    avatarUrl:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
  };

  return NextResponse.json(user);
}
