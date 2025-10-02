'use client';

import { SettingsPage } from '@/app/pages/SettingsPage';

/**
 * /profile/[username] route
 * Shows user profile (currently redirects to settings)
 * TODO: Create dedicated ProfilePage component
 */
export default function UserProfile({ params }: { params: { username: string } }) {
  // For now, show settings page
  // In future, create a proper ProfilePage that shows user's ideas, stats, etc.
  return <SettingsPage />;
}
