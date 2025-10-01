/**
 * API Client for Next.js API routes
 * Replaces Supabase client with fetch calls to our Prisma-based API
 */

const API_BASE = '/api';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  success?: boolean;
  message?: string;
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.error || 'Request failed',
          success: false,
        };
      }

      return {
        data,
        success: true,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      };
    }
  }

  // Ideas API
  async getIdeas(filters?: {
    category?: string;
    language?: string;
    query?: string;
    sort?: string;
    visibility?: string;
  }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    return this.request(`/ideas?${params.toString()}`);
  }

  async getIdea(id: string) {
    return this.request(`/ideas/${id}`);
  }

  async createIdea(data: any) {
    return this.request('/ideas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateIdea(id: string, data: any) {
    return this.request(`/ideas/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteIdea(id: string) {
    return this.request(`/ideas/${id}`, {
      method: 'DELETE',
    });
  }

  // Collaborators API
  async getCollaborators(ideaId: string) {
    return this.request(`/ideas/${ideaId}/collaborators`);
  }

  async addCollaborator(ideaId: string, userId: string, role?: string) {
    return this.request(`/ideas/${ideaId}/collaborators`, {
      method: 'POST',
      body: JSON.stringify({ userId, role }),
    });
  }

  async removeCollaborator(ideaId: string, userId: string) {
    return this.request(`/ideas/${ideaId}/collaborators?userId=${userId}`, {
      method: 'DELETE',
    });
  }

  // Likes API
  async toggleLike(ideaId: string, userId: string) {
    return this.request(`/ideas/${ideaId}/like`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async checkLikeStatus(ideaId: string, userId: string) {
    return this.request(`/ideas/${ideaId}/like?userId=${userId}`);
  }

  // Comments API
  async getComments(ideaId: string) {
    return this.request(`/ideas/${ideaId}/comments`);
  }

  async createComment(ideaId: string, content: string, authorId: string, parentId?: string) {
    return this.request(`/ideas/${ideaId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, authorId, parentId }),
    });
  }

  // Fork API
  async forkIdea(ideaId: string, userId: string) {
    return this.request(`/ideas/${ideaId}/fork`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  // Users API
  async createUser(data: { email: string; username: string; fullName: string; password: string }) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async searchUsers(query?: string) {
    const params = query ? `?query=${encodeURIComponent(query)}` : '';
    return this.request(`/users${params}`);
  }

  async getUser(id: string) {
    return this.request(`/users/${id}`);
  }

  async updateUser(id: string, data: any) {
    return this.request(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Follow API
  async toggleFollow(userId: string, followerId: string) {
    return this.request(`/users/${userId}/follow`, {
      method: 'POST',
      body: JSON.stringify({ followerId }),
    });
  }

  async checkFollowStatus(userId: string, followerId: string) {
    return this.request(`/users/${userId}/follow?followerId=${followerId}`);
  }

  // Workspace API
  async getWorkspace(id: string) {
    return this.request(`/workspace/${id}`);
  }

  async updateWorkspace(id: string, data: any) {
    return this.request(`/workspace/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async createWorkspace(fileName: string) {
    return this.request('/workspace', {
      method: 'POST',
      body: JSON.stringify({ fileName }),
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
