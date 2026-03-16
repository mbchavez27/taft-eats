import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQueryClient } from '@tanstack/react-query'
import { ReviewService } from '../services/reviews.services'

export const replySchema = z.object({
  body: z
    .string()
    .min(20, 'Reply must be at least 20 characters.')
    .max(255, 'Reply is too long.'),
})

export type ReplyFormValues = z.infer<typeof replySchema>

export const useReply = (
  reviewId: number,
  restaurantId: number,
  onSuccess?: () => void,
) => {
  const [serverError, setServerError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const form = useForm<ReplyFormValues>({
    resolver: zodResolver(replySchema),
    mode: 'onChange',
    defaultValues: { body: '' },
  })

  useEffect(() => {
    form.reset({ body: '' })
    setServerError(null)
  }, [reviewId, form])

  const submitHandler = async (data: ReplyFormValues) => {
    // 1. Guard clause: Ensure we have a valid reviewId
    if (!reviewId || reviewId <= 0) {
      setServerError('Invalid review selection. Please try again.')
      return
    }

    setServerError(null)
    try {
      await ReviewService.createReply(reviewId, data.body)
      queryClient.invalidateQueries({ queryKey: ['reviews', restaurantId] })
      if (onSuccess) onSuccess()
      form.reset()
    } catch (error: any) {
      setServerError(error.message || 'Failed to submit reply.')
    }
  }

  return {
    form,
    serverError,
    isSubmitting: form.formState.isSubmitting,
    onSubmit: form.handleSubmit(submitHandler),
  }
}
