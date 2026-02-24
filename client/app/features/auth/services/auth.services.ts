import type {
  AuthResponse,
  CreateUserDTO,
  LoginDTO,
} from '~/features/users/types/user.types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const AuthService = {
  register: async (userData: CreateUserDTO): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(userData),
    })

    const data: AuthResponse = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed')
    }

    return data
  },

  login: async (credentials: LoginDTO): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    })
    const data: AuthResponse = await response.json()

    if (!response.ok) {
      throw new Error(
        data.error || 'Login failed, please check your credentials',
      )
    }

    return data
  },

  logout: async (): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error: any) {
      console.error('Logout failed: ', error)
    }
  },

  getToken: () => {
    return localStorage.getItem('token')
  },
}
