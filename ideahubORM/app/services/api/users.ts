import { User, ApiResponse } from '@/app/types';
import { AuthService } from './auth';

export class UsersService {
  /**
   * Get users that the current user is following
   */
  static async getFollowingUsers(userId: string): Promise<ApiResponse<User[]>> {
    try {
      // This would need a dedicated endpoint - placeholder implementation
      const response = await fetch(`/api/users?query=`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch following users');
      }

      const users = await response.json();

      return {
        data: users,
        message: 'Following users retrieved successfully',
        success: true,
      };
    } catch (error) {
      console.error('Error fetching following users:', error);
      throw error;
    }
  }

  /**
   * Get users that are following the specified user
   */
  static async getFollowers(userId: string): Promise<ApiResponse<User[]>> {
    try {
      // This would need a dedicated endpoint - placeholder implementation
      const response = await fetch(`/api/users?query=`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch followers');
      }

      const users = await response.json();

      return {
        data: users,
        message: 'Followers retrieved successfully',
        success: true,
      };
    } catch (error) {
      console.error('Error fetching followers:', error);
      throw error;
    }
  }

  /**
   * Follow or unfollow a user
   */
  static async toggleFollow(targetUserId: string): Promise<ApiResponse<{ isFollowing: boolean }>> {
    try {
      const currentUserId = await AuthService.getCurrentUserId();
      if (!currentUserId) throw new Error('User not authenticated');

      const response = await fetch(`/api/users/${targetUserId}/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followerId: currentUserId }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle follow');
      }

      const result = await response.json();

      return {
        data: { isFollowing: result.following },
        message: result.following ? 'User followed' : 'User unfollowed',
        success: true,
      };
    } catch (error) {
      console.error('Error toggling follow:', error);
      throw error;
    }
  }

  /**
   * Get a user by ID
   */
  static async getUser(userId: string): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`/api/users/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      const user = await response.json();

      return {
        data: user,
        message: 'User retrieved successfully',
        success: true,
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId: string, profileData: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: profileData.username,
          fullName: profileData.fullName,
          bio: profileData.bio,
          location: profileData.location,
          website: profileData.website,
          avatarUrl: profileData.avatar,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update profile');
      }

      const user = await response.json();

      return {
        data: user,
        message: 'Profile updated successfully',
        success: true,
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  /**
   * Search users by username or full name
   */
  static async searchUsers(query: string): Promise<ApiResponse<User[]>> {
    try {
      const response = await fetch(`/api/users?query=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Failed to search users');
      }

      const users = await response.json();

      return {
        data: users,
        message: 'Users retrieved successfully',
        success: true,
      };
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  /**
   * Check if current user is following a target user
   */
  static async isFollowing(targetUserId: string): Promise<ApiResponse<{ isFollowing: boolean }>> {
    try {
      const currentUserId = await AuthService.getCurrentUserId();
      if (!currentUserId) {
        return {
          data: { isFollowing: false },
          message: 'User not authenticated',
          success: true,
        };
      }

      const response = await fetch(`/api/users/${targetUserId}/follow?followerId=${currentUserId}`);
      
      if (!response.ok) {
        throw new Error('Failed to check follow status');
      }

      const result = await response.json();

      return {
        data: { isFollowing: result.following },
        message: 'Follow status retrieved',
        success: true,
      };
    } catch (error) {
      console.error('Error checking follow status:', error);
      throw error;
    }
  }
}
