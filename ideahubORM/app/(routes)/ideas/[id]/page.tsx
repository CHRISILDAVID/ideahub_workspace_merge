'use client';

import { IdeaDetailPage } from '@/app/pages/IdeaDetailPage';

/**
 * /ideas/[id] route
 * Shows detailed view of an idea with workspace
 */
export default function IdeaDetail({ params }: { params: { id: string } }) {
  return <IdeaDetailPage />;
}
