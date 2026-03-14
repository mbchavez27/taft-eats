import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { EstablishmentService } from '../services/establishments.services'
import { useAuthStore } from '~/features/auth/context/auth.store'

/**
 * Hook to manage the bookmark state of a restaurant.
 * Handles optimistic updates and synchronization with backend data.
 */
export const useBookmark = (
  restaurantId?: number,
  initialBookmarked?: boolean | number,
) => {
  // Convert initialBookmarked to a strict boolean (handles 1/0 or true/false)
  const [isBookmarked, setIsBookmarked] = useState(!!initialBookmarked)
  const [isLoading, setIsLoading] = useState(false)

  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuthStore()

  // Sync state whenever the data from the API changes (crucial for page refreshes)
  useEffect(() => {
    // Explicitly check for truthy values to handle SQL TinyInt (1) or Boolean (true)
    const bookmarkedStatus = !!initialBookmarked
    setIsBookmarked(bookmarkedStatus)

    // Debugging log - check your browser console on refresh to see what the API sent
    console.log(`Bookmark Sync [ID: ${restaurantId}]:`, bookmarkedStatus)
  }, [initialBookmarked, restaurantId])

  const toggleBookmark = async () => {
    // Prevent action if not logged in, no ID provided, or already processing
    if (!isAuthenticated || !restaurantId || isLoading) return

    // 1. Optimistic UI update: Toggle immediately for better UX
    const previousState = isBookmarked
    setIsBookmarked((prev) => !prev)
    setIsLoading(true)

    try {
      if (previousState) {
        // If it was already bookmarked, we remove it
        await EstablishmentService.unbookmark(restaurantId)
      } else {
        // If it wasn't bookmarked, we add it
        await EstablishmentService.bookmark(restaurantId)
      }

      // 2. Invalidate relevant queries to fetch fresh data in the background
      // This ensures all components (like a "Saved" list) are in sync
      queryClient.invalidateQueries({ queryKey: ['establishments'] })
      queryClient.invalidateQueries({ queryKey: ['userBookmarks'] })
      queryClient.invalidateQueries({
        queryKey: ['establishment', restaurantId],
      })
    } catch (error) {
      // 3. Revert UI state if the API call fails
      setIsBookmarked(previousState)
      console.error('Failed to toggle bookmark:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isBookmarked,
    toggleBookmark,
    isLoading,
    // Helper to check if the button should be disabled
    isDisabled: !isAuthenticated || isLoading,
  }
}
