import { create } from 'zustand'
import type { UserResponseDTO } from '~/features/users/types/user.types'
import type { RestaurantDto } from '~/features/establishments/types/establishments.types'
import { AuthService } from '../services/auth.services'
import { EstablishmentService } from '~/features/establishments/services/establishments.services'

interface AuthState {
  user: UserResponseDTO | null
  restaurant: RestaurantDto | null
  isAuthenticated: boolean
  isLoading: boolean
  userReviewCount: number
  bookmarkCount: number
  verifySession: () => Promise<void>
  logout: () => Promise<void>
  setSession: (user: UserResponseDTO, restaurant?: RestaurantDto | null) => void // <-- Update signature
  setRestaurant: (restaurant: RestaurantDto | null) => void
  setReviewCount: (count: number) => void
  SetBookmarkCount: (count: number) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  restaurant: null,
  isAuthenticated: false,
  isLoading: true,
  userReviewCount: 0,
  bookmarkCount: 0,

  setSession: (user, restaurant = null) =>
    set({ user, restaurant, isAuthenticated: true, isLoading: false }),

  setRestaurant: (restaurant) => set({ restaurant }),

  verifySession: async () => {
    set({ isLoading: true })
    try {
      const data = await AuthService.verifySession()
      let ownerRestaurant = null

      // If the user is an owner, fetch their restaurant details immediately
      // Adjust 'owner' check based on exactly how your UserResponseDTO handles roles
      if (
        data.user &&
        (data.user.role === 'owner' || data.user.role === 'OWNER')
      ) {
        try {
          const res = await EstablishmentService.getByOwnerId(
            data.user.userId || data.user.id,
          )
          ownerRestaurant = res.data
        } catch (err) {
          console.warn(
            'Owner does not have a restaurant setup yet or fetch failed.',
          )
        }
      }

      set({
        user: data.user,
        restaurant: ownerRestaurant, // <-- Save it to state
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      set({
        user: null,
        restaurant: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  },

  logout: async () => {
    set({ isLoading: true })
    try {
      await AuthService.logout()
      set({
        user: null,
        restaurant: null,
        isAuthenticated: false,
        isLoading: false,
      })
    } catch (error) {
      console.error('Logout failed', error)
      set({ isLoading: false })
    }
  },

  setReviewCount: (count) => set({ userReviewCount: count }),

  SetBookmarkCount: (count) => set({ bookmarkCount: count }),
}))
