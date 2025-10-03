import { Idea, SearchFilters, ApiResponse } from '@/app/types';
import { AuthService } from './auth';

export class IdeasService {
  /**
   * Get ideas with optional filters
   */
  static async getIdeas(filters?: Partial<SearchFilters>): Promise<ApiResponse<Idea[]>> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.category && filters.category !== 'all') {
        params.append('category', filters.category);
      }
      if (filters?.language && filters.language !== 'all') {
        params.append('language', filters.language);
      }
      if (filters?.query) {
        params.append('query', filters.query);
      }
      if (filters?.sort) {
        params.append('sort', filters.sort);
      }
      if (filters?.visibility) {
        params.append('visibility', filters.visibility);
      }

      const response = await fetch(`/api/ideas?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch ideas');
      }

      const ideas = await response.json();

      return {
        data: ideas,
        message: 'Ideas retrieved successfully',
        success: true,
      };
    } catch (error) {
      console.error('Error fetching ideas:', error);
      throw error;
    }
  }

  /**
   * Get a single idea by ID
   */
  static async getIdea(id: string): Promise<ApiResponse<Idea>> {
    try {
      const response = await fetch(`/api/ideas/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch idea');
      }

      const idea = await response.json();

      return {
        data: idea,
        message: 'Idea retrieved successfully',
        success: true,
      };
    } catch (error) {
      console.error('Error fetching idea:', error);
      throw error;
    }
  }

  /**
   * Create a new idea
   */
  static async createIdea(ideaData: Partial<Idea>): Promise<ApiResponse<Idea>> {
    try {
      const userId = await AuthService.getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: ideaData.title,
          description: ideaData.description,
          content: ideaData.content || '',
          authorId: userId,
          tags: ideaData.tags || [],
          category: ideaData.category,
          license: ideaData.license || 'MIT',
          visibility: ideaData.visibility || 'PUBLIC',
          language: ideaData.language,
          status: ideaData.status || 'PUBLISHED',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create idea');
      }

      const idea = await response.json();

      return {
        data: idea,
        message: 'Idea created successfully',
        success: true,
      };
    } catch (error) {
      console.error('Error creating idea:', error);
      throw error;
    }
  }

  /**
   * Update an existing idea
   */
  static async updateIdea(id: string, ideaData: Partial<Idea>): Promise<ApiResponse<Idea>> {
    try {
      const response = await fetch(`/api/ideas/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: ideaData.title,
          description: ideaData.description,
          content: ideaData.content,
          tags: ideaData.tags,
          category: ideaData.category,
          license: ideaData.license,
          visibility: ideaData.visibility,
          language: ideaData.language,
          status: ideaData.status,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update idea');
      }

      const idea = await response.json();

      return {
        data: idea,
        message: 'Idea updated successfully',
        success: true,
      };
    } catch (error) {
      console.error('Error updating idea:', error);
      throw error;
    }
  }

  /**
   * Delete an idea
   */
  static async deleteIdea(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`/api/ideas/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete idea');
      }

      return {
        data: undefined,
        message: 'Idea deleted successfully',
        success: true,
      };
    } catch (error) {
      console.error('Error deleting idea:', error);
      throw error;
    }
  }

  /**
   * Star or unstar an idea
   */
  static async starIdea(id: string): Promise<ApiResponse<void>> {
    try {
      const userId = await AuthService.getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const response = await fetch(`/api/ideas/${id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle star');
      }

      const result = await response.json();

      return {
        data: undefined,
        message: result.liked ? 'Idea starred' : 'Idea unstarred',
        success: true,
      };
    } catch (error) {
      console.error('Error starring idea:', error);
      throw error;
    }
  }

  /**
   * Fork an idea
   */
  static async forkIdea(id: string, newTitle?: string, newDescription?: string): Promise<ApiResponse<Idea>> {
    try {
      const userId = await AuthService.getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const response = await fetch(`/api/ideas/${id}/fork`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId,
          title: newTitle,
          description: newDescription,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fork idea');
      }

      const idea = await response.json();

      return {
        data: idea,
        message: 'Idea forked successfully',
        success: true,
      };
    } catch (error) {
      console.error('Error forking idea:', error);
      throw error;
    }
  }

  /**
   * Get collaborators for an idea
   */
  static async getIdeaCollaborators(ideaId: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`/api/ideas/${ideaId}/collaborators`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch collaborators');
      }

      const collaborators = await response.json();

      return {
        data: collaborators,
        message: 'Collaborators retrieved successfully',
        success: true,
      };
    } catch (error) {
      console.error('Error fetching collaborators:', error);
      throw error;
    }
  }

  /**
   * Get popular/trending ideas
   */
  static async getPopularIdeas(): Promise<ApiResponse<Idea[]>> {
    try {
      const response = await fetch('/api/ideas?sort=stars&visibility=PUBLIC');
      
      if (!response.ok) {
        throw new Error('Failed to fetch popular ideas');
      }

      const ideas = await response.json();

      return {
        data: ideas.slice(0, 10),
        message: 'Popular ideas retrieved successfully',
        success: true,
      };
    } catch (error) {
      console.error('Error fetching popular ideas:', error);
      throw error;
    }
  }

  /**
   * Get user's starred ideas
   */
  static async getStarredIdeas(userId: string): Promise<ApiResponse<Idea[]>> {
    try {
      // This would need a dedicated endpoint like /api/users/{userId}/starred
      // For now, we'll fetch all ideas and filter client-side (not optimal)
      const response = await fetch(`/api/ideas?authorId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch starred ideas');
      }

      const ideas = await response.json();

      return {
        data: ideas,
        message: 'Starred ideas retrieved successfully',
        success: true,
      };
    } catch (error) {
      console.error('Error fetching starred ideas:', error);
      throw error;
    }
  }

  /**
   * Get user's forked ideas
   */
  static async getForkedIdeas(userId: string): Promise<ApiResponse<Idea[]>> {
    try {
      const response = await fetch(`/api/ideas?authorId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch forked ideas');
      }

      const allIdeas = await response.json();
      const forkedIdeas = allIdeas.filter((idea: Idea) => idea.isFork);

      return {
        data: forkedIdeas,
        message: 'Forked ideas retrieved successfully',
        success: true,
      };
    } catch (error) {
      console.error('Error fetching forked ideas:', error);
      throw error;
    }
  }

  /**
   * Get ideas created by a specific user
   */
  static async getUserIdeas(userId: string): Promise<ApiResponse<Idea[]>> {
    try {
      const response = await fetch(`/api/ideas?authorId=${userId}&visibility=PUBLIC`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user ideas');
      }

      const ideas = await response.json();

      return {
        data: ideas,
        message: 'User ideas retrieved successfully',
        success: true,
      };
    } catch (error) {
      console.error('Error fetching user ideas:', error);
      throw error;
    }
  }
}
