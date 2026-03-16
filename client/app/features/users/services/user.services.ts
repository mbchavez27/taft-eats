import type { UpdateUserDTO, UpdateProfileResponse } from '../types/user.types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const UserService = {
  /**
   * Sends a PATCH request to update the user's profile.
   * @param payload - The partial user data to update (name, username, bio)
   * @returns The updated user profile and success message
   */
  updateUserProfile: async (
    payload: UpdateUserDTO,
  ): Promise<UpdateProfileResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    })

    // Safety check: ensure response is JSON to prevent character at line 1 column 1 error
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      const textError = await response.text()
      console.error('Non-JSON response received:', textError)
      throw new Error(
        'Server error: received unexpected format (check console).',
      )
    }

    const data: UpdateProfileResponse = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update profile')
    }

    return data
  },

  /**
   * Checks if a username is available.
   * @param username - The username to check
   */
  checkUsername: async (username: string): Promise<{ available: boolean }> => {
    const response = await fetch(
      `${API_BASE_URL}/api/users/check-username?username=${encodeURIComponent(username)}`,
      {
        method: 'GET',
        credentials: 'include',
      },
    )

    if (!response.ok) {
      throw new Error('Failed to check username availability')
    }

    return await response.json()
  },

  /**
   * Fetches a paginated list of all users (Admin feature).
   */
  getAllUsers: async ({
    limit = 20,
    lastId,
  }: { limit?: number; lastId?: number } = {}) => {
    let url = `${API_BASE_URL}/api/users?limit=${limit}`
    if (lastId !== undefined) url += `&lastId=${lastId}`

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Failed to fetch users')
    return data
  },

  /**
   * Deletes a user by ID (Admin feature).
   */
  deleteUserAsAdmin: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/users/admin/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Failed to delete user')
    }
  },
}
