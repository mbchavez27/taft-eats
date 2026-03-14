import { create } from 'zustand'
import type { UserResponseDTO } from '~/features/users/types/user.types'
import { AuthService } from '../services/auth.services'

interface AuthState {
  user: UserResponseDTO | null
  isAuthenticated: boolean
  isLoading: boolean
  userReviewCount: number
  verifySession: () => Promise<void>
  logout: () => Promise<void>
  setSession: (user: UserResponseDTO) => void
  setReviewCount: (count: number) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  userReviewCount: 0,

  setSession: (user) => set({ user, isAuthenticated: true, isLoading: false }),

  verifySession: async () => {
    set({ isLoading: true })
    try {
      const data = await AuthService.verifySession()
      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },

  logout: async () => {
    set({ isLoading: true })
    try {
      await AuthService.logout()
      set({ user: null, isAuthenticated: false, isLoading: false })
    } catch (error) {
      console.error('Logout failed', error)
      set({ isLoading: false })
    }
  },

  setReviewCount: (count) => set({ userReviewCount: count }),
}))
