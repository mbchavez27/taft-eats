import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQueryClient } from '@tanstack/react-query'

import { ReviewService } from '../services/reviews.services'
import { useAuthStore } from '~/features/auth/context/auth.store'
import type { CreateReviewDTO } from '../types/reviews.types'

export const reviewSchema = z.object({
  restaurant_id: z.number(),
  rating: z.number().min(1, 'Please provide a rating').max(5),
  body: z.string().min(20, 'Reviews need to be at least 20 characters.'),
  price_range: z.enum(['$', '$$', '$$$']).optional(),
  tags: z
    .array(
      z.object({
        id: z.union([z.string(), z.number(), z.bigint()]),
        label: z.string(),
      }),
    )
    .optional(),
})

export type ReviewFormValues = z.infer<typeof reviewSchema>

export const useReview = (restaurantId: number, onSuccess?: () => void) => {
  const [serverError, setServerError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { isAuthenticated } = useAuthStore()

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    mode: 'onChange',
    defaultValues: {
      restaurant_id: restaurantId,
      rating: 0,
      body: '',
      price_range: '$',
      tags: [],
    },
  })

  const submitHandler = async (data: ReviewFormValues) => {
    setServerError(null)

    if (!isAuthenticated) {
      setServerError('You must be logged in to leave a review.')
      return
    }

    try {
      const finalPayload: CreateReviewDTO = {
        ...data,
        // Safely convert all tag IDs (especially negative BigInts) to strings for JSON
        tags: data.tags?.map((tag) => ({
          ...tag,
          id: tag.id.toString(),
        })) as CreateReviewDTO['tags'],
        // Fallback to '$' if price_range is somehow missing
        price_range: (data.price_range ||
          '$') as CreateReviewDTO['price_range'],
      }

      await ReviewService.create(finalPayload)

      queryClient.invalidateQueries({ queryKey: ['reviews', restaurantId] })

      if (onSuccess) onSuccess()
      form.reset()
    } catch (error: any) {
      setServerError(
        error.message || 'Failed to submit review. Please try again.',
      )
    }
  }

  return {
    form,
    serverError,
    isSubmitting: form.formState.isSubmitting,
    onSubmit: form.handleSubmit(submitHandler),
  }
}
