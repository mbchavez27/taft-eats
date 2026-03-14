import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { ReviewService } from '../services/reviews.services'
import { useAuthStore } from '~/features/auth/context/auth.store'

export const useEditReview = (restaurantId: number, onSuccess?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const { isAuthenticated, user } = useAuthStore()

  const editReview = async (reviewId: number, body: string) => {
    setServerError(null)
    if (!isAuthenticated) {
      setServerError('You must be logged in to edit a review.')
      return
    }
    if (body.length < 20) {
      setServerError('Review needs to be at least 20 characters.')
      return
    }

    try {
      setIsSubmitting(true)
      await ReviewService.updateBody(reviewId, body)

      // Invalidate both the restaurant reviews and the user's personal reviews
      queryClient.invalidateQueries({ queryKey: ['reviews', restaurantId] })
      queryClient.invalidateQueries({
        queryKey: ['userReviews', user?.user_id],
      })

      if (onSuccess) onSuccess()
    } catch (error: any) {
      setServerError(error.message || 'Failed to edit review.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return { editReview, isSubmitting, serverError }
}
