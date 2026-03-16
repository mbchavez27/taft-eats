import type {
  AuthResponse,
  CreateUserDTO,
  LoginDTO,
} from '~/features/users/types/user.types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const AuthService = {
  // Accepts standard DTO or FormData
  register: async (
    userData: CreateUserDTO | FormData,
  ): Promise<AuthResponse> => {
    const isFormData = userData instanceof FormData

    // DO NOT set Content-Type if sending FormData, the browser must set the boundary string
    const headers: HeadersInit = {}
    if (!isFormData) {
      headers['Content-Type'] = 'application/json'
    }

    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: isFormData ? userData : JSON.stringify(userData),
    })

    const data: AuthResponse = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed')
    }

    return data
  },

  login: async (credentials: LoginDTO): Promise<AuthResponse> => {
    // ... rest of your login code remains unchanged
    const response = await fetch(`${API_BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials),
    })
    const data: AuthResponse = await response.json()
    if (!response.ok)
      throw new Error(
        data.error || 'Login failed, please check your credentials',
      )
    return data
  },

  logout: async (): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/api/users/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error: any) {
      console.error('Logout failed: ', error)
    }
  },

  verifySession: async (): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/users/verify`, {
      method: 'GET',
      credentials: 'include',
    })
    if (!response.ok) throw new Error('Not Authenticated')
    return await response.json()
  },
}
