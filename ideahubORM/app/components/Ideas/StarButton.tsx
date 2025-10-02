import React, { useState } from 'react';
import { apiClient } from '@/app/lib/api-client';
import { useAuth } from '@/app/contexts/AuthContext';

interface StarButtonProps {
  ideaId: string;
  initialStarCount: number;
  isInitiallyStarred: boolean;
  className?: string;
}

export const StarButton: React.FC<StarButtonProps> = ({
  ideaId,
  initialStarCount,
  isInitiallyStarred,
  className = '',
}) => {
  const [isStarred, setIsStarred] = useState(isInitiallyStarred);
  const [starCount, setStarCount] = useState(initialStarCount);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleToggleStar = async () => {
    if (!user) {
      console.error('User must be logged in to star ideas');
      return;
    }

    try {
      setIsLoading(true);
      
      // Use the API client to toggle star
      const { data, error } = await apiClient.toggleLike(ideaId, user.id);

      if (error) {
        console.error('Error toggling star:', error);
        return;
      }

      // Update local state based on the response
      // Toggle the star state
      const newIsStarred = !isStarred;
      setIsStarred(newIsStarred);
      setStarCount(prev => newIsStarred ? prev + 1 : prev - 1);
    } catch (error) {
      console.error('Failed to toggle star:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleStar}
      disabled={isLoading}
      className={`flex items-center gap-1 transition-colors ${className}`}
      aria-label={isStarred ? "Unstar this idea" : "Star this idea"}
      title={isStarred ? "Unstar this idea" : "Star this idea"}
    >
      <span className={`text-lg ${isStarred ? 'text-yellow-500' : 'text-gray-400'}`}>
        {isStarred ? '★' : '☆'}
      </span>
      <span>{starCount}</span>
    </button>
  );
};
