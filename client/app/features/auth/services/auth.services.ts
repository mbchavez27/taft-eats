import type {
  AuthResponse,
  CreateUserDTO,
} from '~/features/users/types/user.types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const AuthService = {
  regiser: async (userData: CreateUserDTO): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    const data: AuthResponse = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed')
    }

    if (data.token) {
      localStorage.setItem('token', data.token)
    }

    return data
  },
}
