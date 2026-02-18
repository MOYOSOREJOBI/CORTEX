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
    avatarUrl: '/profile-avatar.jpg',
  };

  return NextResponse.json(user);
}
