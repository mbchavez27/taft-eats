import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { ReviewService } from '../services/reviews.services'
import { useAuthStore } from '~/features/auth/context/auth.store'

export const useDeleteReview = (
  restaurantId: number,
  onSuccess?: () => void,
) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  const deleteReview = async (reviewId: number) => {
    setServerError(null)
    try {
      setIsDeleting(true)
      await ReviewService.delete(reviewId)

      queryClient.invalidateQueries({ queryKey: ['reviews', restaurantId] })
      queryClient.invalidateQueries({
        queryKey: ['userReviews', user?.user_id],
      })

      if (onSuccess) onSuccess()
    } catch (error: any) {
      setServerError(error.message || 'Failed to delete review.')
    } finally {
      setIsDeleting(false)
    }
  }

  return { deleteReview, isDeleting, serverError }
}
