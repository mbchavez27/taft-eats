import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { FormProvider } from 'react-hook-form'

import type { Route } from '../+types/restaurants/index'
import EstablishmentDetails from '~/features/establishments/containers/establishment-details'
import EstablishmentHeader from '~/features/establishments/components/organisms/establishment-header'
import ReviewButton from '~/features/reviews/components/molecules/review-button'
import EstablishmentReviews from '~/features/reviews/containers/establishment-reviews'
import ReviewForms from '~/features/reviews/containers/review-forms'
import { EstablishmentService } from '~/features/establishments/services/establishments.services'

import { useReview } from '~/features/reviews/hooks/use-review'
import { useAuthStore } from '~/features/auth/context/auth.store'

export async function loader({ params }: Route.LoaderArgs) {
  const restaurantId = parseInt(params.restaurant_id as string, 10)

  if (!restaurantId) {
    throw new Response('Not Found', { status: 404 })
  }

  const response = await EstablishmentService.getById(restaurantId)
  return response
}

export function meta({ data }: Route.MetaArgs) {
  const restaurantName = data?.data?.name || 'Restaurant'

  return [
    { title: `Taft Eats - ${restaurantName}` },
    {
      name: 'description',
      content: `View details and reviews for ${restaurantName} on Taft Eats`,
    },
  ]
}

export default function Restaurant() {
  const { restaurant_id } = useParams<{ restaurant_id: string }>()
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const restaurantId = restaurant_id ? parseInt(restaurant_id, 10) : 0

  const handleOpenReview = () => setIsReviewOpen(true)
  const handleCloseReview = () => setIsReviewOpen(false)

  const { data } = useQuery({
    queryKey: ['establishment', restaurantId],
    queryFn: () => EstablishmentService.getById(restaurantId),
    enabled: !!restaurantId,
  })

  const { form, onSubmit, isSubmitting, serverError } = useReview(
    restaurantId,
    () => {
      handleCloseReview()
    },
  )

  return (
    <FormProvider {...form}>
      <main className="flex flex-col lg:flex-row py-12 px-10 lg:gap-8 gap-16">
        {/* Sidebar */}
        <div className="flex lg:w-1/4">
          <EstablishmentDetails isReviewOpen={isReviewOpen} data={data?.data} />
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-3/4 flex flex-col gap-6 md:gap-8">
          <EstablishmentHeader
            name={data?.data.name}
            lat={data?.data.latitude}
            lng={data?.data.longitude}
          />

          {isReviewOpen ? (
            <form onSubmit={onSubmit} className="flex flex-col gap-6">
              {/* Form Area - Now takes up full width! */}
              <div className="w-full">
                <ReviewForms />
              </div>

              {serverError && (
                <p className="text-red-500 font-bold text-right">
                  {serverError}
                </p>
              )}

              <div className="flex justify-end gap-4">
                <ReviewButton type="button" onClick={handleCloseReview}>
                  Cancel
                </ReviewButton>
                <ReviewButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </ReviewButton>
              </div>
            </form>
          ) : (
            <>
              <EstablishmentReviews
                onReply={handleOpenReview}
                restaurantId={restaurantId}
              />
              {isAuthenticated && (
                <div className="flex justify-end">
                  <ReviewButton onClick={handleOpenReview}>
                    Write a Review
                  </ReviewButton>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </FormProvider>
  )
}
